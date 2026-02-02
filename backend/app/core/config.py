import os
from pydantic_settings import BaseSettings # type: ignore

from typing import Optional

class Settings(BaseSettings):
    #Ambiente
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    #Banco de dados
    DATABASE_URL: Optional[str] = None

    #Segurança
    SECRET_KEY: Optional[str] = os.getenv("SECRET_KEY", "dev-secret-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    #Frontend URL
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "https://insightstextanalysis.vercel.app")

    class Config:
        env_file = ".env"

settings = Settings()

#Configuração do banco de dados para desenvolvimento
if not settings.DATABASE_URL:
    if settings.ENVIRONMENT != 'production':
        settings.DATABASE_URL = 'sqlite:///./analises.db'

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES
DATABASE_URL = settings.DATABASE_URL
ENVIRONMENT = settings.ENVIRONMENT
FRONTEND_URL = settings.FRONTEND_URL

if ENVIRONMENT == "production":
    if not SECRET_KEY or not DATABASE_URL:
        raise RuntimeError("SECRET_KEY e DATABASE_URL devem estar definidas em produção.")
