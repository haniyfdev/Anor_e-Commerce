
from fastapi import HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from datetime import datetime, timedelta
from typing import Optional
from passlib.context import CryptContext # parollarni hash qiladi
from app.database import get_db
from app.config import settings
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# - - - - - - - - - - - - - - - 
def hash_password(password: str) -> str:
    return pwd_context.hash(password.encode('utf-8'[:71]))

# - - - - - - - - - - - - - - - 
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password.encode('utf-8')[:71], hashed_password)

# - - - - - - - - - - - - - - - 
def create_access_token(data: dict, expires_delta: Optional[int] = None):
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + timedelta(minutes=expires_delta)
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )

    return encoded_jwt

# - - - - - - - - - - - - - - - 
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, 
        detail="Tokenni tasdiqlab bo'lmadi", headers={"WWW-Authenticate": "Bearer"})
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])

        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    
    return user 


# - - - - - - - - - - - - - - - 
def admin_required(current_user = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=401, detail="Siz admin emassiz !")
    
    return current_user





"""
=========================================================================================================
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")
OAuth2PasswordBearer bu fastapi.security library'sidan import qilingan bo'lib, Bu agar user request jo'natsa 
uni Authorization headerini tekshir degan kodlar jamlanmasi bolgan class, yani shuning uchun ham bu orqali biz 
headerdagi tokenni olamiz. (tokenUrl="auth/login") - bu esa swagger ui(docs) uchun kerek yani u yerda auth nomli 
knopkaga tokeni qoyganimizda avtomatik u loginga borishini ta'minlaydi

=========================================================================================================
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
- - - - - - - - - - - - - - - - - - - - - - - - - - - - -
pwd_context - variable, CryptoContext - bu passlib'dan import qilingan class vazifasi plain.txt parolni
hash qilish, schemas=["bcrypt"] - parollar bcrypt nomli algoritmda hash qilinadi, depreceted="auto" - bu
kelajakda bcrypt'dan boshqa algoritmlarda, hash qilinadigan bolsa ana shuni avtomatik qo'llab quvvatlaydi va 
default qilib beradi. masalan kelajakda:
pwd_context = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto") mana bunday holatda default=argon2
bo'ladi, lekin bcryptda hash qilingan parollar ham ishlaydi.

=========================================================================================================
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
- - - - - - - - - - - - - - - - - - - - - - - - - - - - -
verify_password shunchaki 2ta argument qabul qiladi asl plain parol (user kiritgan) va db'dagi hashed qilingan parol.
va ikkita parolni solishtirib bool qaytaradi tamom.  yani user login qilganida u email va parol kiritadi. va funksiya db'ga 
osha email'ga mos email va parolga mos hashed izlaydi. togri chiqsa true bolmasa false.

=========================================================================================================
encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
- - - - - - - - - - - - - - - - - - - - - - - - - - - - -
jwt.encode() bu jwt yasaydigan stankok, jwtni ozi 3ga bolinadi biz algorithm=hs256 deb yozarkanmiz tamom jwtni ozi 
headerni ozi avtomatik yasaydi u shunchaki mana shu hs256 formatda shifrlandi degani halos. payload qismi esa biz 
kiritgan to_encode ichida bor u ham avtomatik chiqariladi. unda userni ma'lumotlari boladi. eng asosiysi signature (!) 
bu esa to_encode+algorithm+secret_key kombinatsiyasidan generatsiya qiladi. 
bu generatsiyadagi secret_keyni hacker bilmagani uchun signatureni topolmaydi va tokenni buzolmaydi.

=========================================================================================================
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
endi funksiyaga yuqoridan nazar solamiz !  keyin bu funksiyani vazifasi:
user register qilib keyinchalik login qilib kirib oldi masalan(instagram'ga) 
endi qandaydur get request jonatayapti shunda bu funksiya avvalambor
 http header'dan tokenni oladi (Depends(oauth2_schema)) bilan, if not token errror!
payload bolsa ana shu olgna tokendan payloadni su'g'urib oladi. 
(chunki token 3qismdan iborat header, payload, signature). endi haligi tokendan 
sug'urib olgan payloadimizda ham 2juft key value bor "sub" va "exp" (biz uni yuqorida yasagandik).
 uni ichidan email degan variable'ga payload.get("sub") ni o'zini olib beramiz chunki
"sub"ni value'sida userni email'i bor. keyin db.query bilan biz ichma-ich'dan chiqarib 
olgan email bilan db'dagi emailni solishtiramiz. if not email error 401 else return user(yani requestga ruhsat bor)


"""







