from fastapi import FastAPI, Depends
from sqlmodel import select
from typing import List
from database import create_db_and_tables, get_session
from models import Opportunity, Interaction

app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
def read_root():
    return {"status": "CRM Lite API is Online", "database": "Modular Structure Active"}

@app.get("/opportunities", response_model=List[Opportunity])
def get_opps(session=Depends(get_session)):
    # session.exec returns a results object; .all() turns it into a list
    return session.exec(select(Opportunity)).all()