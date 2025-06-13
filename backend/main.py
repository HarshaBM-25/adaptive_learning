from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import os
from dotenv import load_dotenv

from models import Base, User, LearningContent, LearningProgress, Assessment
from rag.retriever import ContentRetriever
from agents.agentic_ai import AdaptiveLearningAgent
from granite.compliance_middleware import GraniteComplianceMiddleware
from database import SessionLocal, engine
from config import get_settings

# Load environment variables
load_dotenv()

# Get settings
settings = get_settings()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Adaptive Learning System")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components with API keys from settings
content_retriever = ContentRetriever(settings.openai_api_key)
learning_agent = AdaptiveLearningAgent(settings.openai_api_key)
compliance_middleware = GraniteComplianceMiddleware()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/api/learning-path")
async def get_learning_path(
    student_id: str,
    current_context: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """Get personalized learning path for a student"""
    # Check compliance
    if not compliance_middleware.check_data_access(student_id, "learning_path"):
        raise HTTPException(status_code=403, detail="Access denied")

    # Get student profile
    student = db.query(User).filter(User.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Adapt learning path
    learning_path = learning_agent.adapt_learning_path(student_id, current_context)
    
    # Log access
    compliance_middleware.audit_data_access(
        student_id,
        "get_learning_path",
        {"context": current_context}
    )

    return learning_path

@app.post("/api/content")
async def get_learning_content(
    query: str,
    student_id: str,
    db: Session = Depends(get_db)
):
    """Get relevant learning content"""
    # Check compliance
    if not compliance_middleware.check_data_access(student_id, "content"):
        raise HTTPException(status_code=403, detail="Access denied")

    # Get content
    content = content_retriever.retrieve_relevant_content(query)
    
    # Log access
    compliance_middleware.audit_data_access(
        student_id,
        "get_content",
        {"query": query}
    )

    return content

@app.post("/api/progress")
async def update_progress(
    student_id: str,
    progress_data: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """Update student's learning progress"""
    # Validate data usage
    if not compliance_middleware.validate_data_usage(progress_data, "progress_update"):
        raise HTTPException(status_code=400, detail="Invalid data usage")

    # Update progress
    progress = LearningProgress(
        user_id=student_id,
        content_id=progress_data["content_id"],
        completion_status=progress_data["status"],
        score=progress_data.get("score"),
        time_spent=progress_data.get("time_spent", 0)
    )
    
    db.add(progress)
    db.commit()
    
    # Log access
    compliance_middleware.audit_data_access(
        student_id,
        "update_progress",
        progress_data
    )

    return {"status": "success"}

@app.get("/api/privacy-policy")
async def get_privacy_policy():
    """Get current privacy policy"""
    return compliance_middleware.get_privacy_policy()

@app.post("/api/assessment")
async def generate_assessment(
    content_id: str,
    student_id: str,
    db: Session = Depends(get_db)
):
    """Generate assessment for learning content"""
    # Check compliance
    if not compliance_middleware.check_data_access(student_id, "assessment"):
        raise HTTPException(status_code=403, detail="Access denied")

    # Generate assessment
    assessment = learning_agent._generate_assessment(content_id)
    
    # Log access
    compliance_middleware.audit_data_access(
        student_id,
        "generate_assessment",
        {"content_id": content_id}
    )

    return assessment

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug
    )