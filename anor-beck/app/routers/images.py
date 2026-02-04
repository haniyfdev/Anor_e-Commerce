import os
import shutil
from fastapi import APIRouter, HTTPException, status, Depends, Query, UploadFile, File
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.utils.security import get_current_user
from app.models.user import User
from app.models.product import Product
from app.models.product_image import ProductImage
from uuid import uuid4


router = APIRouter(tags=["Images"])

# --------------------- endpoint 11 create image for product
@router.post("/product/{product_id}/images", status_code=status.HTTP_201_CREATED)
async def create_image(product_id: int, photo: UploadFile = File(...),
                       current_user: User = Depends(get_current_user),db: Session = Depends(get_db)):
    
    upload_dir = "static/images"
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)

    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Bunday mahsulot mavjud emas")
    
    if product.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Bu mahsulot sizniki emas")
    
    image_count = db.query(ProductImage).filter(ProductImage.product_id == product_id).count()
    if image_count >= 5:
        raise HTTPException(status_code=400, detail="5tagacha rasm yuklash mumkin")
    
    filename = f"{uuid4()}_{photo.filename}"
    file_location = f"static/images/{filename}"

    try:
        with open(file_location, "wb+") as file_object:
            file_object.write(photo.file.read())
    finally:
        photo.file.close()

    new_image = ProductImage(product_id=product_id, image_url=file_location)

    db.add(new_image)
    db.commit()
    db.refresh(new_image)

    return {
        "message": "Rasm yuklandi", 
        "image": new_image.image_url
    }

# --------------------- endpoint 12 delete image product
@router.delete("/images/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
async def del_image(image_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    img = db.query(ProductImage).options(joinedload(ProductImage.product)).filter(ProductImage.id == image_id).first()

    if not img:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bunday rasm topilmadi")

    if img.product.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Mahsulot sizniki emas")

    if os.path.exists(img.image_url):
        os.remove(img.image_url)
    
    db.delete(img)
    db.commit()

    return None









