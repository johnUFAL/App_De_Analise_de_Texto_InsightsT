#Modelos e configuração do banco de dados
from fastapi import Depends, HTTPException # type: ignore
from app.core.config import SECRET_KEY, ALGORITHM
from app.core.security import oauth2_scheme
from .analysis import Base, Usuario, TokenRevogado
from sqlalchemy import create_engine # type: ignore
from sqlalchemy.orm import sessionmaker, Session # type: ignore
from jose import JWTError, jwt # type: ignore
import os 

#Detecta ambiente
if os.getenv("ENVIRONMENT") == "production":
    DATABASE_URL = os.getenv("DATABASE_URL")
    #PostgreSQL
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)
else:
    #SQLite
    DATABASE_URL = "sqlite:///./analises.db"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

#Criação da sessão do banco de dados
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Criação das tabelas no banco de dados
if os.getenv("ENVIRONMENT") != "production":
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        import sys
        print(f"Aviso: falha ao executar create_all: {e}", file=sys.stderr)


#Dependência para pegar a sessão do banco de dados
def pegar_session():
    try:
        Session = sessionmaker(bind=engine)
        session = Session()
        yield session

    finally:
        session.close()
        
#Dependência para pegar o usuário autenticado
def pegar_usuario(token: str = Depends(oauth2_scheme), session: Session = Depends(pegar_session)):
    try: 
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id_usuario = int(payload.get("sub"))
    except JWTError:
        raise HTTPException(status_code=401, detail="Não autorizado")

    if session.query(TokenRevogado).filter_by(token=token).first():
        raise HTTPException(status_code=401, detail="Token revogado")

    usuario = session.query(Usuario).filter(Usuario.id == id_usuario).first()
    if not usuario:
        raise HTTPException(status_code=401, detail="Não autorizado")
    
    return usuario
