import sys
import os
from pathlib import Path

# Force absolute path resolution
current_dir = Path(__file__).parent.absolute()
parent_dir = current_dir.parent.absolute()

# Add both current and parent to sys.path for maximum compatibility
if str(current_dir) not in sys.path:
    sys.path.insert(0, str(current_dir))
if str(parent_dir) not in sys.path:
    sys.path.insert(0, str(parent_dir))

print(f"DEBUG: sys.path is {sys.path}")
print(f"DEBUG: Current dir is {current_dir}")
print(f"DEBUG: Parent dir is {parent_dir}")

try:
    import services
    from services import CityService
except ImportError:
    from backend import services
    from backend.services import CityService

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve frontend static files
# Since we run from backend/, go up one level to find frontend/
frontend_dist = Path(__file__).parent.parent / "frontend" / "dist"
if frontend_dist.exists():
    app.mount("/assets", StaticFiles(directory=frontend_dist / "assets"), name="assets")

class CityInfoRequest(BaseModel):
    city_name: str

class CityInfoResponse(BaseModel):
    city_name: str
    description: str
    images: List[str]
    rent_estimate: dict
    quality_of_life: dict
    areas: List[dict]
    listings: List[dict]

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Rental Guide Platform API is running"}

@app.get("/city-info/{city_name}", response_model=CityInfoResponse)
async def get_city_info(city_name: str):
    # Fetch data
    description = await CityService.get_city_description(city_name)
    images = CityService.get_mock_images(city_name)
    rent_est = CityService.get_mock_rent_estimate(city_name)
    qol = CityService.get_quality_of_life(city_name)
    areas = CityService.get_areas(city_name)
    listings = CityService.get_listings(city_name)
    
    return {
        "city_name": city_name.title(),
        "description": description,
        "images": images,
        "rent_estimate": rent_est,
        "quality_of_life": qol,
        "areas": areas,
        "listings": listings
    }

# Deprecated/Legacy endpoint kept for backward compatibility if needed, 
# or repurposed for simple estimate checks.
class EstimateRequest(BaseModel):
    city: str
    bedrooms: int
    bathrooms: int

@app.post("/estimate")
def estimate_rent(data: EstimateRequest):
    # Re-use logic for specific apartment sizing
    base_data = CityService.get_mock_rent_estimate(data.city)
    base_avg = base_data["average_rent"]
    
    # Adjust for rooms
    # Base assume 1 bed. Add cost for extra.
    room_adjustment = ((data.bedrooms - 1) * 400) + ((data.bathrooms - 1) * 200)
    
    final_avg = base_avg + room_adjustment
    
    return {
        "estimated_rent": int(final_avg),
        "range_low": int(final_avg * 0.9),
        "range_high": int(final_avg * 1.1),
        "currency": "₹"
    }

# --- Community/Review Endpoints ---
try:
    from database import get_session, create_db_and_tables
    from models import RentReview, Question, Answer, PropertyListing
except ImportError:
    from backend.database import get_session, create_db_and_tables
    from backend.models import RentReview, Question, Answer, PropertyListing

from sqlmodel import Session, select
from fastapi import Depends, HTTPException

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Reviews
@app.post("/reviews")
def create_review(review: RentReview, session: Session = Depends(get_session)):
    session.add(review)
    session.commit()
    session.refresh(review)
    return review

@app.get("/reviews/{city}")
def get_city_reviews(city: str, session: Session = Depends(get_session)):
    statement = select(RentReview).where(RentReview.city.contains(city)).order_by(RentReview.likes.desc())
    reviews = session.exec(statement).all()
    return reviews

@app.post("/reviews/{review_id}/like")
def like_review(review_id: int, session: Session = Depends(get_session)):
    review = session.get(RentReview, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    review.likes += 1
    session.add(review)
    session.commit()
    session.refresh(review)
    return {"likes": review.likes}

# Q&A
@app.get("/questions")
def get_questions(session: Session = Depends(get_session)):
    # Get recent questions with their answers
    statement = select(Question).order_by(Question.timestamp.desc())
    questions = session.exec(statement).all()
    # SQLModel relationships loading strategy: 
    # By default, lazy. We might need to explicitely return a model with nested data.
    return questions

@app.get("/questions/{question_id}/answers")
def get_answers(question_id: int, session: Session = Depends(get_session)):
    statement = select(Answer).where(Answer.question_id == question_id).order_by(Answer.timestamp.asc())
    return session.exec(statement).all()

@app.post("/questions")
def create_question(question: Question, session: Session = Depends(get_session)):
    session.add(question)
    session.commit()
    session.refresh(question)
    return question

@app.post("/questions/{question_id}/answers")
def create_answer(question_id: int, answer: Answer, session: Session = Depends(get_session)):
    # Verify question exists
    q = session.get(Question, question_id)
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
    
    answer.question_id = question_id
    session.add(answer)
    session.commit()
    session.refresh(answer)
    return answer

# Listings
@app.post("/listings")
def create_listing(listing: PropertyListing, session: Session = Depends(get_session)):
    session.add(listing)
    session.commit()
    session.refresh(listing)
    return {"status": "success", "message": "Listing submitted for approval", "id": listing.id}


# Catch-all route: Serve index.html for all non-API routes (SPA routing)
@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    """Serve the frontend for all routes that aren't API endpoints"""
    frontend_dist = Path(__file__).parent.parent / "frontend" / "dist"
    index_file = frontend_dist / "index.html"
    
    if index_file.exists():
        return FileResponse(index_file)
    else:
        return {"error": "Frontend not built. Run 'npm run build' in frontend directory."}
