from pydantic import BaseModel
from typing import Optional, List
from app.schemas.user import RegionEnum, UserResponse  
from app.schemas.product_image import ProductImageResponse
from enum import Enum
from .category import CategoryResponse



# ----------------------------------- Request
class ProductCreate(BaseModel):
    title: str
    price: int
    description: str
    location: RegionEnum
    category_id: int

# ----------------------------------- Update Request
class ProductUpdate(BaseModel):
    title: Optional[str] = None
    price: Optional[int] = None
    description: Optional[str] = None
    location: Optional[RegionEnum] = None
    category_id: Optional[int] = None

# ----------------------------------- Response
class ProductResponse(BaseModel):
    id: int
    title: str
    price: int
    description: str
    location: str
    user_id: int
    user: UserResponse
    category: CategoryResponse
    images: list[ProductImageResponse]
    
    class Config: 
        from_attributes = True

# ----------------------------------- Response
class ProductFilter(BaseModel):
    search: Optional[str]
    category_id: Optional[int]
    min_price: Optional[int]
    max_price: Optional[int]
    location: Optional[RegionEnum]
    page: int = 1
    limit: int = 10

# ----------------------------------- Response for pagination
class ProductListResponse(BaseModel):
    total: int
    page: int
    limit: int
    total_pages: int
    data: List[ProductResponse]
    
    class Config:
        from_attributes = True





