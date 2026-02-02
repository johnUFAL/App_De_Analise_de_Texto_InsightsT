# configurações de segurança da aplicação
from fastapi.security import OAuth2PasswordBearer  # type: ignore
from passlib.context import CryptContext  # type: ignore

#configuração do esquema OAuth2 para autenticação
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login-form")

bcrypt_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)
