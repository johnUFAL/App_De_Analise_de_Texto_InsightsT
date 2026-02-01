import os
from pydantic_settings import BaseSettings # type: ignore

class Settings(BaseSettings):
    #Ambiente
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    #Banco de dados
    if ENVIRONMENT == "production":
        DATABASE_URL: str = os.getenv("DATABASE_URL")
    else:
        DATABASE_URL: str = "sqlite:///./analises.db"
    
    #Segurança
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    #Frontend URL
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    
    class Config:
        env_file = ".env"