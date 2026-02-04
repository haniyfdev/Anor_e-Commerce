from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from sqlalchemy.sql import func
import datetime as dt


class AvatarImage(Base):
    __tablename__ = "avatar_images"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    image_url = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    # relationship
    user = relationship("User", back_populates="avatar")
