from fastapi.security import OAuth2PasswordBearer  # type: ignore
from passlib.context import CryptContext  # type: ignore

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login-form")

bcrypt_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)
