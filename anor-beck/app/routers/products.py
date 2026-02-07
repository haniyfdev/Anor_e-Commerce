from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from app.models.user import User
from app.models.product import *
from app.models.category import Category
from app.schemas.products import *
from app.database import get_db
from app.utils.security import get_current_user
from app.models.product_image import ProductImage

router = APIRouter()

# --------------------- endpoint 13 create product
@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_prod(pc: ProductCreate, current_user: User = Depends(get_current_user),
                db: Session = Depends(get_db)):
    existing_category = db.query(Category).filter(Category.id == pc.category_id).first()
    if not existing_category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bunday kategoriya yo'q")

    if pc.price <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Narx qo'shing")
    
    data = pc.model_dump(exclude={'category_id'})
    new_product = Product(
        **data,
        category_id = existing_category.id,
        user_id = current_user.id
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    
    return new_product


# --------------------- endpoint 14 show all products
@router.get("/", response_model=ProductListResponse, status_code=status.HTTP_200_OK)
def view_all_products(
    search: str | None = None,
    category_id: int | None = None,
    min_price: int | None = None,
    max_price: int | None = None,
    location: RegionEnum | None = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db) 
):
    query = db.query(Product)

    if search:
        query = query.filter(Product.title.ilike(f"%{search}%"))
    if category_id:
        query = query.filter(Product.category_id == category_id)
    if min_price:
        query = query.filter(Product.price >= min_price)
    if max_price:
        query = query.filter(Product.price <= max_price)
    if location:
        query = query.filter(Product.location == location.value)

    query = query.order_by(Product.created_at.desc()) # avvalida yangi elonlar chiqishi uchun

    total_products = query.count()
    offset = (page - 1) * limit
    products = query.offset(offset).limit(limit).all()

    return ProductListResponse(
        total=total_products,
        page=page,
        limit=limit,
        total_pages=(total_products + limit - 1) // limit,
        data=products
)

# --------------------- endpoint 15 view my product
@router.get("/my", response_model=List[ProductResponse], status_code=status.HTTP_200_OK)
def view_my_products(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    my_products = db.query(Product).options(
        joinedload(Product.category),
        joinedload(Product.user),
        joinedload(Product.images)
    ).filter(Product.user_id == current_user.id).all()
    
    return my_products

# --------------------- endpoint 16 show product
@router.get("/{product_id}", response_model=ProductResponse, status_code=status.HTTP_200_OK)
def view_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).options(
        joinedload(Product.category),
        joinedload(Product.user),
        joinedload(Product.images)
    ).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bunday mahsulot topilmadi")
    
    return product

# --------------------- endpoint 17 show similar product
@router.get("/{product_id}/similar", status_code=status.HTTP_200_OK)
def view_similar_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Bunday mahsulot yo'q")
    
    min_price = product.price * 0.7
    max_price = product.price * 1.2

    similar_product = (
        db.query(Product)
        .filter(Product.category_id == product.category_id)
        .filter(Product.id != product.id)
        .filter(Product.location == product.location)
        .filter(Product.price.between(min_price, max_price))
        .order_by(func.random())
        .limit(4)
        .all()
    )

    return similar_product



# --------------------- endpoint 18 update product
@router.patch("/{product_id}", response_model=ProductResponse, status_code=status.HTTP_200_OK)
def update_product(product_id: int, pu: ProductUpdate, current_user: User = Depends(get_current_user),
                   db: Session = Depends(get_db)):
    query = db.query(Product).filter(Product.id == product_id)
    product = query.first()
    if not product:
        raise HTTPException(status_code=404, detail="Bunday mahsulot topilmadi")
    
    if product.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Bu mahsulotni egasi emassiz")
    
    update_data = pu.model_dump(exclude_unset=True) 
    for field, value in update_data.items():
        setattr(product, field, value)

    # query.update(update_data, synchronize_session=False)

    db.commit()
    db.refresh(product)

    return product


# --------------------- endpoint 19 delete product
@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def del_product(product_id: int, current_user: User = Depends(get_current_user), 
                db: Session = Depends(get_db)):
    query = db.query(Product).filter(Product.id == product_id)
    product = query.first()

    if not product:
        raise HTTPException(status_code=404, detail="Bu mahsulot topilmadi")
    
    if product.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Bu mahsulot sizniki emas")
    
    db.query(ProductImage).filter(ProductImage.product_id == product_id).delete(synchronize_session=False)
    db.delete(product)
    db.commit()

    return None 




