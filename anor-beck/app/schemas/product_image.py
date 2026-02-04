from pydantic import BaseModel

# ----------------------------------- Response
class ProductImageResponse(BaseModel):
    id: int
    image_url: str
    product_id: int
    
    class Config:
        from_attributes = True

