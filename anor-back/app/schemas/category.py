from pydantic import BaseModel
from typing import Optional

class CategoryCreate(BaseModel):
    name: str

class CategoryUpdate(BaseModel):
    name: Optional[str]

class CategoryResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True
        