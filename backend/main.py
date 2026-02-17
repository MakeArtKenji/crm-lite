from fastapi import FastAPI, Depends
from sqlmodel import select
from typing import List
from database import create_db_and_tables, get_session
from models import Opportunity, User, Interaction

app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
def read_root():
    return {"status": "CRM Lite API is Online", "database": "Modular Structure Active"}

# --- USER ROUTES ---
@app.get("/users", response_model=List[User])
def get_users(session=Depends(get_session)):
    return session.exec(select(User)).all()

# --- OPPORTUNITY ROUTES ---
@app.get("/opportunities", response_model=List[Opportunity])
def get_opps(session=Depends(get_session)):
    return session.exec(select(Opportunity)).all()

# --- INTERACTION ROUTES ---
@app.get("/interactions", response_model=List[Interaction])
def get_interactions(session=Depends(get_session)):
    return session.exec(select(Interaction)).all()