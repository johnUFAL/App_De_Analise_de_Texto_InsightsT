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
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "https://insightstextanalysis.vercel.app")
    
    class Config:
        env_file = ".env"

#instancia de configurações lidas do ambiente
settings = Settings()

if not getattr(settings, 'DATABASE_URL', None):
    if settings.ENVIRONMENT != 'production':
        #fallback para dev/local
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