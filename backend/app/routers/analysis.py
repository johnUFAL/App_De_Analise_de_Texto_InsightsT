#Rotas de análise de texto
from fastapi import APIRouter, Depends, HTTPException # type: ignore
from sqlalchemy.orm import Session # type: ignore
from typing import List # type: ignore
from app.services.ml_service import TopicClassifier
from app.services.nlp_service import NLPService 
from app.models.analysis import Analysis, AnalysisHistorico, Usuario
from app.models.db import pegar_session, pegar_usuario
from app.schemas import AnalysisResponseSchema, AnalysisRequestSchema, TopicResponse

#instância do classificador de tópicos 
from functools import lru_cache

@lru_cache()
def get_topic_classifier():
    return TopicClassifier()

#Definição do roteador de análise
analysis_router = APIRouter(prefix='/analysis', tags=['analysis'])

@analysis_router.get("/analyze")
async def rota_basica_analise():
    return {"message": "Rota básica de análise."}

# Rota para criar uma nova análise de texto
@analysis_router.post("/analysis", response_model=AnalysisResponseSchema)
async def criar_analise(analysis_request: AnalysisRequestSchema, db: Session = Depends(pegar_session), usuario: Usuario = Depends(pegar_usuario)):
    #Instância do serviço de NLP
    nlp_service = NLPService()
    
    #Realiza a análise de texto usando o serviço de NLP
    try:
        resultado = nlp_service.analisar_texto(
            analysis_request.texto_original
        )
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    
    #Cria uma nova entrada de análise no banco de dados
    novo_historico = AnalysisHistorico(
        analysis_id=None,
        usuario_id=usuario.id
    )

    #Cria uma nova análise com os resultados obtidos
    novo_analysis = Analysis(
        usuario_id=usuario.id,
        texto_original=analysis_request.texto_original,
        sentimento=resultado["sentimento"],
        palavra_mais_frequente=resultado["palavra_mais_frequente"],
        entidades=resultado["entidades"],
        lvl_legibilidade=resultado["lvl_legibilidade"],
        cont_palavras=resultado["cont_palavras"],
        cont_caracteres=resultado["cont_caracteres"],
        cont_frases=resultado["cont_frases"]
    )

    #Adiciona e confirma as novas entradas no banco de dados
    db.add(novo_analysis)
    db.add(novo_historico)
    db.commit()
    db.refresh(novo_analysis)
    db.refresh(novo_historico)
    return {
        "id": novo_analysis.id,
        "texto_original": novo_analysis.texto_original,
        "sentimento": novo_analysis.sentimento,
        "palavra_mais_frequente": novo_analysis.palavra_mais_frequente,
        "entidades": novo_analysis.entidades,
        "lvl_legibilidade": novo_analysis.lvl_legibilidade,
        "cont_palavras": novo_analysis.cont_palavras,
        "cont_caracteres": novo_analysis.cont_caracteres,
        "cont_frases": novo_analysis.cont_frases,
        "criado_em": novo_analysis.criado_em
    }

#Rota para obter estatísticas de análises do usuário
@analysis_router.get("/stats")
async def status_analise(usuario: Usuario = Depends(pegar_usuario), session: Session = Depends(pegar_session)):
    total_analises = session.query(Analysis).filter(Analysis.usuario_id == usuario.id).count()
    
    return {"total_analises": total_analises}

#Rota para ler o histórico de análises do usuário
@analysis_router.get("/history", response_model=List[AnalysisResponseSchema])
async def ler_historico_analise(usuario: Usuario = Depends(pegar_usuario), session: Session = Depends(pegar_session), skip: int = 0, limit: int = 10):    
    analises = session.query(Analysis).filter(Analysis.usuario_id == usuario.id).order_by(Analysis.criado_em.desc()).offset(skip).limit(limit).all()
    
    resultado = []
    for analise in analises:
        resultado.append({
            "id": analise.id,
            "texto_original": analise.texto_original,
            "sentimento": analise.sentimento,
            "palavra_mais_frequente": analise.palavra_mais_frequente,
            "entidades": analise.entidades,
            "lvl_legibilidade": analise.lvl_legibilidade,
            "cont_palavras": analise.cont_palavras,
            "cont_caracteres": analise.cont_caracteres,
            "cont_frases": analise.cont_frases,
            "criado_em": analise.criado_em
        })
        
    return resultado

#Rota para ler uma análise específica por ID
@analysis_router.get("/{analysis_id}", response_model=AnalysisResponseSchema)
async def ler_analise_por_id(analysis_id: int, usuario: Usuario = Depends(pegar_usuario), session: Session = Depends(pegar_session)):
    analise = session.query(Analysis).filter(Analysis.id == analysis_id, Analysis.usuario_id == usuario.id).first()
    
    if not analise:
        raise HTTPException(status_code=404, detail="Análise não encontrada.")
    
    return analise

#Rota para deletar uma análise específica por ID
@analysis_router.delete("/{analysis_id}")
async def deletar_analise(analysis_id: int, usuario: Usuario = Depends(pegar_usuario), session: Session = Depends(pegar_session)):
    analise = session.query(Analysis).filter(Analysis.id == analysis_id, Analysis.usuario_id == usuario.id).first()
    
    if not analise:
        raise HTTPException(status_code=404, detail="Análise não encontrada.")
    
    session.delete(analise)
    session.commit()
    
    return {"message": "Análise deletada com sucesso."}

#Rota para deletar todas as análises do usuário
@analysis_router.delete("")
async def deletar_todas_analises(usuario: Usuario = Depends(pegar_usuario), session: Session = Depends(pegar_session)):
    session.query(Analysis).filter(Analysis.usuario_id == usuario.id).delete()
    session.commit()
    
    return {"message": "Todas as análises foram deletadas com sucesso."}

#Rota para classificar o tópico do texto
@analysis_router.post("/topic", response_model=TopicResponse)
def classify_topic(request: AnalysisRequestSchema, usuario: Usuario = Depends(pegar_usuario)):
    classifier = get_topic_classifier()
    resultados = classifier.predict(request.texto_original)

    return {
        "texto": request.texto_original,
        "topicos": resultados,
        "topico_principal": resultados[0]["topico"]
    }