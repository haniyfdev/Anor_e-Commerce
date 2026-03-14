from pydantic import EmailStr, BaseModel, Field
from typing import Optional, Literal
from enum import Enum

# ---------------------------- Region enum (literal)
class RegionEnum(str, Enum):
    toshkent = "Toshkent"
    toshkentcity = "Toshkent city"
    andijon = "Andijon"
    fargona = "Farg'ona"
    namangan = "Namangan"
    sirdaryo = "Sirdaryo"
    jizzax = "Jizzax"
    samarqand = "Samarqand"
    buxoro = "Buxoro"
    navoiy = "Navoiy"
    qashqadaryo = "Qashqadaryo"
    surxondaryo = "Surxondaryo"
    xorazm = "Xorazm"
    qoraqalpogiston = "Qoraqalpog'iston"

# ---------------------------- Request
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    phone: str
    location: Optional[RegionEnum] = None

# ---------------------------- Update Request
class UserUpdate(BaseModel):
    name: Optional[str] = Field(None)
    email: Optional[EmailStr] = Field(None)
    phone: Optional[str] = Field(None)
    password: Optional[str] = Field(None)
    location: Optional[RegionEnum] = None
    

# ---------------------------- Request
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# ----------------------------------- Response
class AvatarImageResponse(BaseModel):
    id: int
    image_url: str

    class Config:
        from_attributes = True
        
# ---------------------------- Response
class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    location: RegionEnum
    avatar: Optional[AvatarImageResponse] = None

    class Config:
        from_attributes = True 

