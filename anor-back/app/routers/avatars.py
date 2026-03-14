import os
import shutil
from supabase import create_client
from fastapi import APIRouter, HTTPException, status, Depends, Query, UploadFile, File
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.utils.security import get_current_user
from app.models.user import User
from app.models.product import Product
from app.models.product_image import ProductImage
from app.models.avatar import AvatarImage
from app.config import settings
from uuid import uuid4

supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)


router = APIRouter()


# --------------------- endpoint 5 create avatar for profile
@router.post("/{user_id}/upload", status_code=status.HTTP_201_CREATED)
async def create_avatar(user_id: int, 
                        current_user: User = Depends(get_current_user), 
                        image: UploadFile = File(...), 
                        db: Session = Depends(get_db)):
    
    upload_dir = "static/avatars"
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Bunday user topilmadi")
    
    if user.id != current_user.id:
        raise HTTPException(status_code=403, detail="Profile sizniki emas")
    
    existing_avatar = db.query(AvatarImage).filter(AvatarImage.user_id == user_id).first()
    if existing_avatar:
        try:
            path = existing_avatar.image_url.split("/public/avatars/")[1]
            supabase.storage.from_("avatars").remove([path])
        except Exception as e:
            print(f"delete error {str(e)}")
        
        db.delete(existing_avatar)
        db.commit()

    file_bytes = image.file.read()
    filename = f"{uuid4()}_{image.filename}"
    path = f"users/{filename}"

    supabase.storage.from_("avatars").upload(
        path, file_bytes, {"content-type": image.content_type}
    )

    img_url = f"{settings.SUPABASE_URL}/storage/v1/object/public/avatars/{path}"
        
    new_file = AvatarImage(user_id=user_id, image_url=img_url)

    db.add(new_file)
    db.commit()
    db.refresh(new_file)

    return new_file


# --------------------- endpoint 6 delete avatar for profile
@router.delete("/{avatar_id}", status_code=status.HTTP_204_NO_CONTENT)
async def del_avatar(avatar_id: int, 
                     current_user: User = Depends(get_current_user), 
                     db: Session = Depends(get_db)):
    
    avatar = db.query(AvatarImage).options(joinedload(
        AvatarImage.user)).filter(AvatarImage.id == avatar_id).first() 
                                                        
    if not avatar:
        raise HTTPException(status_code=404, detail="Bunday avatar topilmadi")
    
    if avatar.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Bu avatar sizniki emas")
    
    try:
        path = avatar.image_url.split("/public/avatars/")[1]
        supabase.storage.from_("avatars").remove([path])
    except Exception as e:
        print(f"delete error: {str(e)}")

    db.delete(avatar)
    db.commit()
    
    return None

