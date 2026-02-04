from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    location = Column(String, nullable=True)
    role = Column(String, default="user", nullable=False)
    # relationship
    products = relationship("Product", back_populates="user")
    avatar = relationship("AvatarImage", back_populates="user", uselist=False, lazy="joined")
    
    # lazy avatar uchun