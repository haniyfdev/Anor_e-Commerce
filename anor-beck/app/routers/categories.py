from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.category import *
from app.models.user import User
from app.models.product import Product
from app.models.category import Category
from sqlalchemy.orm import Session
from app.database import get_db
from typing import List
from app.utils.security import admin_required


router = APIRouter()

# --------------------- endpoint 7 show all categories
@router.get("/", response_model=List[CategoryResponse], status_code=status.HTTP_200_OK)
def view_all_category(db: Session = Depends(get_db)):
    return db.query(Category).all()

# --------------------- endpoint 8 create category
@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(cc: CategoryCreate, current_user: User = Depends(admin_required),
                    db: Session = Depends(get_db)):
    existing = db.query(Category).filter(Category.name == cc.name).first()
    if existing:
        raise HTTPException(status_code=409, detail="Bu kategoriya mavjud")
    
    new_category = Category(name = cc.name)
    db.add(new_category)
    db.commit()
    db.refresh(new_category)

    return new_category

# categories.py ichiga qo'shish kerak:
@router.get("/{category_id}", response_model=CategoryResponse)
def get_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Kategoriya topilmadi")
    return category

# --------------------- endpoint 9 update category
@router.put("/{category_id}", response_model=CategoryResponse, status_code=status.HTTP_200_OK)
def update_category(category_id: int, cu: CategoryUpdate, current_user: User = Depends(admin_required),
                    db: Session = Depends(get_db)):
    existing_category = db.query(Category).filter(Category.id == category_id).first()
    if not existing_category:
        raise HTTPException(status_code=404, detail="Bunday mahsulot mavjud emas")
    
    existing_name = db.query(Category).filter(Category.name == cu.name).first()
    if existing_name and existing_name.id != category_id:
        raise HTTPException(status_code=409, detail="Bu nom bilan ataladigan kategoriya bor")
    
    existing_category.name = cu.name
    
    db.commit()
    db.refresh(existing_category)

    return existing_category


# --------------------- endpoint 10 delete category
@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(category_id: int, current_user: User = Depends(admin_required),
                    db: Session = Depends(get_db)):
    existing_category = db.query(Category).filter(Category.id == category_id).first()
    if not existing_category:
        raise HTTPException(status_code=404, detail="Bunday mahsulot topilmadi")
    
    product_count = db.query(Product).filter(Product.category_id == category_id).count()
    if product_count > 0:
        raise HTTPException(status_code=400, detail=f"Bu kategoriyada {product_count}ta mahsulot bor")
    
    db.delete(existing_category)
    db.commit()

    return None



