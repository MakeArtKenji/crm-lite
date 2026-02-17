from fastapi import FastAPI, Depends, HTTPException
from sqlmodel import select, Session
from typing import List
from database import create_db_and_tables, get_session
# Import the new 'Create' models
from models import (
    Opportunity, OpportunityCreate, OpportunityUpdate,
    User, UserCreate, 
    Interaction, InteractionCreate, InteractionUpdate
)

app = FastAPI()

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
def get_opps(session: Session = Depends(get_session)):
    return session.exec(select(Opportunity)).all()

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

@app.patch("/opportunities/{opportunity_id}", response_model=Opportunity)
def update_opportunity(
    opportunity_id: int, 
    opp_data: OpportunityUpdate, 
    session: Session = Depends(get_session)
):
    db_opp = session.get(Opportunity, opportunity_id)
    if not db_opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    
    # Extract only the data provided in the request
    update_dict = opp_data.model_dump(exclude_unset=True)
    
    for key, value in update_dict.items():
        setattr(db_opp, key, value)
    
    session.add(db_opp)
    session.commit()
    session.refresh(db_opp)
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