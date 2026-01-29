from fastapi import Depends, HTTPException # type: ignore
from app.core.config import SECRET_KEY, ALGORITHM
from app.core.security import oauth2_scheme
from .analysis import Base, Usuario, TokenRevogado
from sqlalchemy import create_engine # type: ignore
from sqlalchemy.orm import sessionmaker, Session # type: ignore
from jose import JWTError, jwt # type: ignore

DATABASE_URL = 'sqlite:///analyses.db'
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def pegar_session():
    try:
        Session = sessionmaker(bind=engine)
        session = Session()
        yield session

    finally:
        session.close()

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
