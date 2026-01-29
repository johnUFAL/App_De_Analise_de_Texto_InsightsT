from fastapi import APIRouter, Depends, HTTPException, Header # type: ignore
from fastapi.security import OAuth2PasswordRequestForm # type: ignore
from app.models.analysis import Usuario, TokenRevogado
from typing import Optional # type: ignore
from app.models.db import pegar_usuario, pegar_session
from app.core.security import bcrypt_context, oauth2_scheme
from app.core.config import ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM, SECRET_KEY
from app.schemas import UsuarioSchema, LoginSchema, UsuarioMeSchema
from sqlalchemy.orm import Session # type: ignore
from jose import jwt, JWTError # type: ignore
from datetime import datetime, timedelta, timezone # type: ignore

auth_router = APIRouter(prefix="/auth", tags=['auth'])

def criar_token(id_usuario: int, duracao_token=timedelta(minutes=int(ACCESS_TOKEN_EXPIRE_MINUTES))):
    data_expiracao = datetime.now(timezone.utc) + duracao_token
    dic_info = {"sub": str(id_usuario), "exp": data_expiracao}
    jwt_encoded = jwt.encode(dic_info, SECRET_KEY, algorithm=ALGORITHM)
    return jwt_encoded

def autenticar_usuario(email, senha, session):
    usuario = session.query(Usuario).filter(Usuario.email == email).first()
    if not usuario:
        return False
    elif not bcrypt_context.verify(senha, usuario.senha):
        return False
    return usuario

@auth_router.get("/auth")
async def rota_basica_auth():
    return {"message": "Rota básica de autenticação."}

@auth_router.post("/criar_conta")
async def criar_conta(usuario_schema: UsuarioSchema, session: Session = Depends(pegar_session)):
    usuario = session.query(Usuario).filter(Usuario.email == usuario_schema.email).first()
    
    if usuario:
        raise HTTPException(status_code=400, detail="Email já cadastrado.")

    total_usuarios = session.query(Usuario).count()
    usuario_final_admin = (total_usuarios == 0)

    senha_criptografada = bcrypt_context.hash(usuario_schema.senha)
    novo_usuario = Usuario(
        nome=usuario_schema.nome, 
        email=usuario_schema.email, 
        senha=senha_criptografada,
        admin=usuario_final_admin
    )

    session.add(novo_usuario)
    session.commit()
    
    return {
        "message": "Usuário criado com sucesso.",
        "id": novo_usuario.id,
        "email": novo_usuario.email,
        "admin": novo_usuario.admin
    }

@auth_router.post("/login")
async def login(login_schema: LoginSchema, session: Session = Depends(pegar_session)):
    usuario = autenticar_usuario(login_schema.email, login_schema.senha, session)
    if not usuario:
        raise HTTPException(status_code=401, detail="Email ou senha inválidos.")
    access_token = criar_token(usuario.id)
    refresh_token = criar_token(usuario.id, duracao_token=timedelta(days=7))
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@auth_router.post("/login-form")
async def login_form(dados_form: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(pegar_session)):
    usuario = autenticar_usuario(dados_form.username, dados_form.password, session)
    if not usuario:
        raise HTTPException(status_code=401, detail="Email ou senha inválidos.")
    access_token = criar_token(usuario.id)
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@auth_router.get("/refresh_token")
async def use_refresh_token(usuario: Usuario = Depends(pegar_usuario)):
    access_token = criar_token(usuario.id)
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@auth_router.post("/logout")
async def logout(token: str = Depends(oauth2_scheme), session: Session = Depends(pegar_session)):
    session.add(TokenRevogado(token=token))
    session.commit()
    return {"message": "Logout realizado com sucesso."}

@auth_router.get("/me", response_model=UsuarioMeSchema)
async def ler_usuario_atual(usuario: Usuario = Depends(pegar_usuario)):
    return {
        "nome": usuario.nome,
        "email": usuario.email,
        "admin": usuario.admin,
    }