from fastapi import FastAPI, Depends
from sqlmodel import SQLModel, Field, create_engine, Session, select
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

# Use standard create_engine (Sync)
engine = create_engine(DATABASE_URL)

app = FastAPI()

# Your FastAPI route using a standard function
@app.get("/hello")
def read_root():
    return {"status": "FastAPI is working perfectly!"}

# Database session dependency
def get_session():
    with Session(engine) as session:
        yield session