from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_teacher = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Student specific fields
    learning_style = Column(String, nullable=True)
    proficiency_level = Column(String, nullable=True)
    learning_history = Column(JSON, nullable=True)
    
    # Relationships
    progress = relationship("LearningProgress", back_populates="user")
    assessments = relationship("Assessment", back_populates="user")

class LearningProgress(Base):
    __tablename__ = "learning_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    content_id = Column(Integer, ForeignKey("learning_content.id"))
    completion_status = Column(String)
    score = Column(Integer, nullable=True)
    time_spent = Column(Integer)  # in seconds
    last_accessed = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="progress")
    content = relationship("LearningContent", back_populates="progress")

class LearningContent(Base):
    __tablename__ = "learning_content"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content_type = Column(String)  # video, text, quiz, etc.
    difficulty_level = Column(String)
    subject = Column(String)
    content_data = Column(JSON)
    metadata = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    progress = relationship("LearningProgress", back_populates="content")

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    content_id = Column(Integer, ForeignKey("learning_content.id"))
    score = Column(Integer)
    feedback = Column(String, nullable=True)
    completed_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="assessments")
    content = relationship("LearningContent") 