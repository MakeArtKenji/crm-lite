from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

# --- USER MODELS ---
class UserBase(SQLModel):
    id: str = Field(primary_key=True)
    email: str = Field(index=True, unique=True)
    full_name: Optional[str] = None

class User(UserBase, table=True):
    created_at: datetime = Field(default_factory=datetime.utcnow)
    opportunities: List["Opportunity"] = Relationship(back_populates="user")

class UserCreate(UserBase):
    pass 

# --- SALES STRATEGY MODEL ---
class SalesStrategy(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    summary: str
    sentiment: str 
    next_step: str
    tactical_advice: str
    
    opportunity_id: int = Field(foreign_key="opportunity.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    opportunity: Optional["Opportunity"] = Relationship(back_populates="strategies")

# --- OPPORTUNITY MODELS ---
class OpportunityBase(SQLModel):
    name: str
    email: str = Field(index=True)
    status: str  # "New" | "Contacted" | "Follow-Up" | "Won" | "Lost"
    value: float
    user_id: str = Field(foreign_key="user.id", index=True)

class Opportunity(OpportunityBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    user: Optional[User] = Relationship(back_populates="opportunities")
    interactions: List["Interaction"] = Relationship(
        back_populates="opportunity", 
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
    # ADDED THIS RELATIONSHIP HERE
    strategies: List["SalesStrategy"] = Relationship(back_populates="opportunity")

class OpportunityCreate(OpportunityBase):
    pass 

class OpportunityUpdate(SQLModel):
    name: Optional[str] = None
    email: Optional[str] = None
    status: Optional[str] = None
    value: Optional[float] = None

# --- INTERACTION MODELS ---
class InteractionBase(SQLModel):
    type: str 
    notes: str
    opportunity_id: int = Field(foreign_key="opportunity.id")

class Interaction(InteractionBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    opportunity: Optional[Opportunity] = Relationship(back_populates="interactions")

class InteractionCreate(InteractionBase):
    pass 

class InteractionUpdate(SQLModel):
    type: Optional[str] = None
    notes: Optional[str] = None

# --- CHAT UTILS ---
class ChatRequest(SQLModel):
    message: str

class ChatResponse(SQLModel):
    response: str