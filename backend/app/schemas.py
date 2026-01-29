from datetime import datetime
from pydantic import BaseModel, Field # type: ignore
from typing import Optional, List

class UsuarioSchema(BaseModel):
    nome: str
    email: str
    senha: str = Field(min_length=8, max_length=64)
    admin: Optional[bool] = False

    class Config:
        from_attributes = True

class UsuarioMeSchema(BaseModel):
    nome: str
    email: str
    admin: Optional[bool] = False

    class Config:
        from_attributes = True

class entidades(BaseModel):
    texto: str
    tipo: str

    class Config:
        from_attributes = True

class AnalysisResponseSchema(BaseModel):
    id: Optional[int] = None
    texto_original: str
    sentimento: str
    palavra_mais_frequente: str
    entidades: List[entidades]
    lvl_legibilidade: str
    cont_palavras: int
    cont_caracteres: int
    cont_frases: int
    criado_em: Optional[datetime] = None

    class Config:
        from_attributes = True

class AnalysisRequestSchema(BaseModel):
    texto_original: str
    salvar_historico: bool = True

    class Config:
        from_attributes = True

class LoginSchema(BaseModel):
    email: str
    senha: str

    class Config:
        from_attributes = True

class TopicPrediction(BaseModel):
    topico: str
    confianca: float

class TopicResponse(BaseModel):
    texto: str
    topicos: List[TopicPrediction]
    topico_principal: str
