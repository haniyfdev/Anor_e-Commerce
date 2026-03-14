from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_DAYS: int
    SUPABASE_URL: str
    SUPABASE_SERVICE_KEY: str

    class Config:
        env_file = ".env"

settings = Settings()

        