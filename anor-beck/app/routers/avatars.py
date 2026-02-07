import os
import shutil
from fastapi import APIRouter, HTTPException, status, Depends, Query, UploadFile, File
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.utils.security import get_current_user
from app.models.user import User
from app.models.product import Product
from app.models.product_image import ProductImage
from app.models.avatar import AvatarImage
from uuid import uuid4

router = APIRouter()


# --------------------- endpoint 5 create avatar for profile
@router.post("/{user_id}/upload", status_code=status.HTTP_201_CREATED)
async def create_avatar(user_id: int, current_user: User = Depends(get_current_user), 
                        image: UploadFile = File(...), db: Session = Depends(get_db)):
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
        old_file = existing_avatar.image_url.lstrip('/')
        if os.path.exists(old_file):
            try:
                os.remove(old_file)
                print(f"Old file deleted {old_file}")
            except Exception as e:
                print(f"Not deleted old file {str(e)}")

        db.delete(existing_avatar)
        db.commit()

    filename = f"{uuid4()}_{image.filename}"
    file_location = f"static/avatars/{filename}"

    try:
        with open(file_location, "wb+") as buffer:
            shutil.copyfileobj(image.file, buffer)
    finally:
        image.file.close()

    new_file = AvatarImage(user_id=user_id, image_url=f"/{file_location}")

    db.add(new_file)
    db.commit()
    db.refresh(new_file)

    return new_file


# --------------------- endpoint 6 delete avatar for profile
@router.delete("/{avatar_id}", status_code=status.HTTP_204_NO_CONTENT)
async def del_avatar(avatar_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    avatar = db.query(AvatarImage).options(joinedload(AvatarImage.user)).filter(AvatarImage.id == avatar_id).first()

    if not avatar:
        raise HTTPException(status_code=404, detail="Bunday avatar topilmadi")
    
    if avatar.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Bu avatar sizniki emas")
    
    file_path = avatar.image_url.lstrip('/')
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
            print(f"File deleted {file_path}")
        except Exception as e:
            print(f"File not deleted {str(e)}")
    else:
        print("File not found !")

    db.delete(avatar)
    db.commit()

    return None






