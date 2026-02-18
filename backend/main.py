from fastapi import FastAPI, Depends, HTTPException
from sqlmodel import select, Session
from typing import List, Optional
import json
from google import genai  # Use the new unified SDK
from database import create_db_and_tables, get_session
import os  # Essential for API keys
from models import (
    Opportunity, OpportunityCreate, OpportunityUpdate,
    User, UserCreate, 
    Interaction, InteractionCreate, InteractionUpdate, 
    ChatRequest, ChatResponse, SalesStrategy
)

app = FastAPI()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
def read_root():
    return {"status": "CRM Lite API is Online", "database": "Modular Structure Active"}

# --- USER ROUTES ---
@app.get("/users", response_model=List[User])
def get_users(session: Session = Depends(get_session)):
    return session.exec(select(User)).all()

@app.post("/users", response_model=User)
def create_user(user_data: UserCreate, session: Session = Depends(get_session)):
    db_user = session.get(User, user_data.id)
    if db_user:
        return db_user
    
    # Use model_validate to convert Create schema to Table model
    new_user = User.model_validate(user_data)
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user

# --- OPPORTUNITY ROUTES ---
@app.get("/opportunities", response_model=List[Opportunity])
def get_opps(
    user_id: Optional[str] = None, # Accept the user_id from the query param
    session: Session = Depends(get_session)
):
    statement = select(Opportunity)
    
    # If a user_id is provided, filter the results
    if user_id:
        statement = statement.where(Opportunity.user_id == user_id)
        
    return session.exec(statement).all()
    

@app.post("/opportunities", response_model=Opportunity)
def create_opportunity(opp_data: OpportunityCreate, session: Session = Depends(get_session)):
    # Check if user exists
    db_user = session.get(User, opp_data.user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found.")
    
    # Convert OpportunityCreate to Opportunity
    new_opp = Opportunity.model_validate(opp_data)
    session.add(new_opp)
    session.commit()
    session.refresh(new_opp)
    return new_opp


# --- SECURE INDIVIDUAL FETCH ---
@app.get("/opportunities/{opportunity_id}", response_model=Opportunity)
def get_opportunity(
    opportunity_id: int, 
    user_id: str, # Force passing user_id for security
    session: Session = Depends(get_session)
):
    statement = select(Opportunity).where(
        Opportunity.id == opportunity_id,
        Opportunity.user_id == user_id
    )
    db_opp = session.exec(statement).first()
    
    if not db_opp:
        raise HTTPException(status_code=404, detail="Opportunity not found or access denied")
        
    return db_opp


@app.get("/opportunities", response_model=List[Opportunity])
def get_opps(user_id: str, session: Session = Depends(get_session)):
    # Strictly filtered by user_id
    statement = select(Opportunity).where(Opportunity.user_id == user_id)
    return session.exec(statement).all()

@app.get("/opportunities/{opportunity_id}", response_model=Opportunity)
def get_opportunity(opportunity_id: int, user_id: str, session: Session = Depends(get_session)):
    # SECURE: Checks both ID and ownership
    statement = select(Opportunity).where(
        Opportunity.id == opportunity_id, 
        Opportunity.user_id == user_id
    )
    db_opp = session.exec(statement).first()
    if not db_opp:
        raise HTTPException(status_code=404, detail="Opportunity not found or access denied")
    return db_opp

# --- DELETE OPPORTUNITY ---
@app.delete("/opportunities/{opportunity_id}")
def delete_opportunity(opportunity_id: int, session: Session = Depends(get_session)):
    """Deletes an opportunity and all associated interactions via cascade."""
    db_opp = session.get(Opportunity, opportunity_id)
    if not db_opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    
    session.delete(db_opp)
    session.commit()
    return {"ok": True, "message": f"Opportunity {opportunity_id} and its interactions deleted"}


@app.get("/opportunities/{opportunity_id}/strategy", response_model=SalesStrategy)
async def get_sales_strategy(
    opportunity_id: int, 
    session: Session = Depends(get_session)
):
    """
    Analyzes history, saves a new strategy record to the DB, and returns it.
    """
    # 1. Fetch the opportunity
    db_opp = session.get(Opportunity, opportunity_id)
    if not db_opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    # 2. Build history context
    history_logs = ""
    if not db_opp.interactions:
        history_logs = "No interactions logged yet."
    else:
        for i in db_opp.interactions:
            history_logs += f"- [{i.timestamp.strftime('%Y-%m-%d')}] {i.type}: {i.notes}\n"

    # 3. Construct Strategy Prompt with JSON instructions
    prompt = f"""
    You are an elite Sales Strategist. Analyze the client history and provide a JSON response.

    CLIENT INFO:
    - Name: {db_opp.name}
    - Status: {db_opp.status}
    - Value: ${db_opp.value}

    INTERACTION HISTORY:
    {history_logs}

    Return ONLY a JSON object with these keys:
    - summary: 2-3 sentence overview of health.
    - sentiment: One word (HOT, WARM, or COLD) + reasoning.
    - next_step: The specific aggressive next move to close.
    - tactical_advice: Handle the next conversation based on history.
    """

    try:
        # 4. Generate Content (Using your preferred Gemini 3 Flash model)
        response = client.models.generate_content(
            model="gemini-2.5-flash", 
            contents=prompt,
            config={
                "response_mime_type": "application/json"
            }
        )
        
        if not response.text:
            raise HTTPException(status_code=500, detail="AI strategy generation failed.")

        # 5. Parse and Save to Database
        ai_data = json.loads(response.text)
        
        new_strategy = SalesStrategy(
            summary=ai_data["summary"],
            sentiment=ai_data["sentiment"],
            next_step=ai_data["next_step"],
            tactical_advice=ai_data["tactical_advice"],
            opportunity_id=opportunity_id
        )
        
        session.add(new_strategy)
        session.commit()
        session.refresh(new_strategy)
        
        return new_strategy

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI/DB Error: {str(e)}")


@app.get("/opportunities/{opportunity_id}/strategy/latest", response_model=SalesStrategy)
def get_latest_sales_strategy(
    opportunity_id: int, 
    session: Session = Depends(get_session)
):
    """
    Fetches the single most recent AI strategy for a given opportunity.
    """
    # 1. Verify opportunity exists first
    db_opp = session.get(Opportunity, opportunity_id)
    if not db_opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    # 2. Query for the latest strategy based on created_at
    statement = (
        select(SalesStrategy)
        .where(SalesStrategy.opportunity_id == opportunity_id)
        .order_by(SalesStrategy.created_at.desc())
    )
    
    latest_strategy = session.exec(statement).first()

    if not latest_strategy:
        raise HTTPException(
            status_code=404, 
            detail="No strategy has been generated for this opportunity yet."
        )

    return latest_strategy

# --- INTERACTION ROUTES ---
@app.get("/interactions", response_model=List[Interaction])
def get_interactions(session: Session = Depends(get_session)):
    return session.exec(select(Interaction)).all()

@app.post("/interactions", response_model=Interaction)
def create_interaction(int_data: InteractionCreate, session: Session = Depends(get_session)):
    # Check if opportunity exists
    db_opp = session.get(Opportunity, int_data.opportunity_id)
    if not db_opp:
        raise HTTPException(status_code=404, detail="Opportunity not found.")
    
    # Convert InteractionCreate to Interaction
    new_int = Interaction.model_validate(int_data)
    session.add(new_int)
    session.commit()
    session.refresh(new_int)
    return new_int

@app.patch("/interactions/{interaction_id}", response_model=Interaction)
def update_interaction(
    interaction_id: int, 
    int_data: InteractionUpdate, 
    session: Session = Depends(get_session)
):
    db_int = session.get(Interaction, interaction_id)
    if not db_int:
        raise HTTPException(status_code=404, detail="Interaction not found")
    
    update_dict = int_data.model_dump(exclude_unset=True)
    
    for key, value in update_dict.items():
        setattr(db_int, key, value)
        
    session.add(db_int)
    session.commit()
    session.refresh(db_int)
    return db_int

# --- DELETE INTERACTION ---
@app.delete("/interactions/{interaction_id}")
def delete_interaction(interaction_id: int, session: Session = Depends(get_session)):
    """Deletes a single interaction note."""
    db_int = session.get(Interaction, interaction_id)
    if not db_int:
        raise HTTPException(status_code=404, detail="Interaction not found")
    
    session.delete(db_int)
    session.commit()
    return {"ok": True, "message": f"Interaction {interaction_id} deleted"}

@app.post("/chat", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest):
    """
    AI Chat using the latest Gemini 3 Flash model.
    """
    try:
        # Note the updated syntax for the unified SDK
        response = client.models.generate_content(
            model="gemini-3-flash-preview", 
            contents=request.message
        )
        
        if not response.text:
            raise HTTPException(status_code=500, detail="AI failed to generate a response.")
            
        return ChatResponse(response=response.text)
    except Exception as e:
        # Helpful for debugging API key or connection issues
        raise HTTPException(status_code=500, detail=str(e))