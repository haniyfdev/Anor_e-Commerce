from fastapi import APIRouter, FastAPI, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from app.schemas.user import *
from app.schemas.auth import *
from app.models.user import User
from app.utils.security import *

router = APIRouter()

# --------------------- endpoint 1 register user
@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def registration(uc: UserCreate, db: Session = Depends(get_db)):
    existing_email = db.query(User).filter(
        (User.email == uc.email) | (User.phone == uc.phone)).first()
    if existing_email:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Boshqa email kiriting:")
    hashed = hash_password(uc.password)

    new_user = User(
        email = uc.email,
        hashed_password = hashed,   
        name = uc.name,
        phone = uc.phone,
        location = uc.location
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# --------------------- endpoint 2 login user
@router.post("/login", response_model=TokenResponse, status_code=status.HTTP_200_OK)
def login(ul: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == ul.username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bunday email topilmadi")
    
    is_verifed = verify_password(ul.password, user.hashed_password) # -> bool
    if not is_verifed:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="parol noto'g'ri")
    
    access_token = create_access_token({"sub": user.email})

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
    
    
# --------------------- endpoint 3 view profile
@router.get("/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
def read_me(current_user: User = Depends(get_current_user)):
    return current_user

# --------------------- endpoint 4 update profile
@router.put("/update", response_model=UserResponse, status_code=status.HTTP_200_OK)
def update_profile(uu: UserUpdate, 
                   current_user: User = Depends(get_current_user), 
                   db: Session = Depends(get_db)):

    update_data = uu.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        if key == "password":
            setattr(current_user, "hashed_password", hash_password(value))
        else:
            setattr(current_user, key, value)

    db.commit()
    db.refresh(current_user)
    return current_user




