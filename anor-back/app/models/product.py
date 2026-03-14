from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import datetime as dt

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True)
    title = Column(String(200), nullable=False)
    price = Column(Integer, nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False) # FK
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # FK
    created_at = Column(DateTime(timezone=True), server_default=func.now()) # bu psql level
    # created_at = Column(DateTime, dt.now())  bu python level
    # relationship
    category = relationship("Category", back_populates="products") 
    user = relationship("User", back_populates="products")
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan")







