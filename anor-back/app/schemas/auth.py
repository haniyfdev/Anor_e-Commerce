from pydantic import BaseModel
from typing import Optional

# ----------------------------------- Request
class TokenData(BaseModel):
    email: Optional[str] = None

# ----------------------------------- Response
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"





