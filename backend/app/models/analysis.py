import datetime
from sqlalchemy import Integer, String, Boolean, ForeignKey, Column, Text, DateTime, JSON # type: ignore
from sqlalchemy.orm import relationship, declarative_base # type: ignore

Base = declarative_base()

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, autoincrement=True)
    texto_original = Column(Text)
    sentimento = Column(String)
    palavra_mais_frequente = Column(String)
    entidades = Column(JSON)
    lvl_legibilidade = Column(String)
    cont_palavras = Column(Integer)
    cont_caracteres = Column(Integer)
    cont_frases = Column(Integer)
    criado_em = Column(DateTime, default=datetime.datetime.utcnow)
    usuario_id = Column(Integer, ForeignKey('usuarios.id'), nullable=False)

    usuario = relationship("Usuario", backref="analyses")

    def __init__(self, usuario_id: int, texto_original: str, sentimento: str, palavra_mais_frequente: str, entidades: dict | list,
                 lvl_legibilidade: str, cont_palavras: int,
                 cont_caracteres: int, cont_frases: int) -> None:

        self.usuario_id = usuario_id
        self.texto_original = texto_original
        self.sentimento = sentimento
        self.palavra_mais_frequente = palavra_mais_frequente
        self.entidades = entidades
        self.lvl_legibilidade = lvl_legibilidade
        self.cont_palavras = cont_palavras
        self.cont_caracteres = cont_caracteres
        self.cont_frases = cont_frases

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column('nome', String, nullable=False)
    email = Column('email', String, unique=True, nullable=False)
    senha = Column('senha', String, nullable=False)
    admin = Column('admin', Boolean, default=False)

    def __init__(self, nome: str, email: str, senha: str, admin: bool = False) -> None:
        self.nome = nome
        self.email = email
        self.senha = senha
        self.admin = admin

class AnalysisHistorico(Base):
    __tablename__ = "analyses_historico"

    id = Column(Integer, primary_key=True, autoincrement=True)
    analysis_id = Column('analysis_id', Integer, ForeignKey('analyses.id'))
    usuario_id = Column('usuario_id', Integer, ForeignKey('usuarios.id'))
    consultado_em = Column(DateTime, default=datetime.datetime.utcnow)

    analysis = relationship("Analysis", backref="historicos")
    usuario = relationship("Usuario", backref="historicos")

class TokenRevogado(Base):
    __tablename__ = "tokens_revogados"

    id = Column(Integer, primary_key=True, autoincrement=True)
    token = Column(String, unique=True, index=True)