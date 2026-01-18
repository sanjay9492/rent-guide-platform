from typing import Optional, List
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime

class RentReview(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    city: str
    review_text: str
    rating: int  # 1-5
    likes: int = 0
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class Question(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    text: str
    user_name: str = "Anonymous"
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    upvotes: int = 0
    
    answers: List["Answer"] = Relationship(back_populates="question")

class Answer(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    question_id: int = Field(foreign_key="question.id")
    text: str
    user_name: str = "Community Member"
    is_verified: bool = False
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    question: Optional[Question] = Relationship(back_populates="answers")

class PropertyListing(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    owner_name: str
    contact: str
    type: str  # Flat, PG, House
    city: str
    area: str
    description: Optional[str] = None
    status: str = "Pending"  # Pending, Approved
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class SavedListing(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    listing_id: str = Field(index=True)
    name: str = Field(default="Unknown Property") # Default to handle legacy data if any
    price: int = Field(default=0)
    area: str = Field(default="Unknown Area")
    city: str = Field(default="Unknown City")
    image: str = Field(default="")
    type: str = Field(default="Flat")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
