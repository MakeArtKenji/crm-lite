from fastapi import FastAPI, Depends, HTTPException
from sqlmodel import select, Session
from typing import List
from database import create_db_and_tables, get_session
# Import the new 'Create' models
from models import (
    Opportunity, OpportunityCreate, 
    User, UserCreate, 
    Interaction, InteractionCreate
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