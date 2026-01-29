import spacy #type: ignore
from collections import Counter
import re
import pyphen #type: ignore
import json
from typing import List, Dict, Any
import unicodedata

class NLPService:
    def __init__(self):
        self.nlp = spacy.load("pt_core_news_sm")
        self.lexico_positivo = {
            "bom", "boa", "excelente", "ótimo", "ótima", "maravilhoso", "fantástico",
            "incrível", "rápido", "eficiente", "eficaz", "funciona", "funcionou",
            "fácil", "simples", "intuitivo", "útil", "prático", "recomendo", "gosto",
            "ótimo", "perfeito", "estável", "confiável", "satisfeito", "agilidade",
            "qualidade", "positivo", "sucesso", "solucionou", "resolvido", "melhor",
            "melhorou", "ótimo", "excepcional", "nota", "nota 10", "dez"
        }
        
        self.lexico_negativo = {
            "ruim", "péssimo", "horrível", "terrível", "lento", "lenta", "devagar",
            "instável", "erro", "problema", "defeito", "falha", "bug", "crasha",
            "travando", "travou", "congela", "pior", "piorou", "difícil", "complicado",
            "complexo", "confuso", "inútil", "inutil", "inúteis", "inútil", "inútil",
            "frustrante", "frustração", "insatisfeito", "decepcionante", "decepção",
            "negativo", "fracasso", "falhou", "não funciona", "não recomendo",
            "detesto", "odeio", "horrível", "desastre", "catastrófico"
        }
        
        self.intensificadores = {
            "muito": 1.5, "muita": 1.5, "extremamente": 2.0, "totalmente": 1.8,
            "completamente": 1.8, "absolutamente": 2.0, "realmente": 1.3,
            "verdadeiramente": 1.4, "incrivelmente": 1.7, "fantasticamente": 1.7,
            "horrivelmente": 2.0, "péssimamente": 2.0, "terrivelmente": 2.0,
            "bastante": 1.4, "demais": 1.6, "super": 1.5, "ultra": 1.7,
            "extraordinariamente": 1.9, "excepcionalmente": 1.8
        }
        
        self.negacoes = {"não", "nem", "nunca", "jamais", "tampouco"}

    def analisar_texto(self, texto: str) -> dict:
        texto = texto.strip()

        if not texto:
            raise ValueError("Texto vazio.")
        
        if len(texto) < 10:
            raise ValueError("Texto muito curto.")

        if len(texto) > 20000:
            raise ValueError("Texto muito longo.")
        
        doc = self.nlp(texto)

        sentimento = self.analisar_sentimento_portugues(texto, doc)
        palavra_mais_frequente = self.palavra_mais_frequente(doc)
        entidades = self.extrair_entidades(doc)
        lvl_legibilidade = self.lvl_legibilidade_adaptado(doc)
        cont_palavras = self.cont_palavras(texto)
        cont_caracteres = self.cont_caracteres(texto)
        cont_frases = self.cont_frases(doc)
            
        resultado = {
            "sentimento": sentimento,
            "palavra_mais_frequente": palavra_mais_frequente,
            "entidades": entidades,
            "lvl_legibilidade": lvl_legibilidade,
            "cont_palavras": cont_palavras,
            "cont_caracteres": cont_caracteres,
            "cont_frases": cont_frases
        }
        
        return resultado

    def analisar_sentimento_portugues(self, texto: str, doc) -> str:
        texto_limpo = self.preprocessar_texto(texto)
        tokens = [token.text.lower() for token in doc if token.is_alpha]
        
        if not tokens:
            return "Neutro"
        
        pontuacao = 0
        total_tokens = len(tokens)
        
        for i, token in enumerate(tokens):
            token_lower = token.lower()
            
            is_negacao = token_lower in self.negacoes
            
            intensificador = self.intensificadores.get(token_lower, 1.0)
            
            proximo_positivo = False
            proximo_negativo = False
            
            if i + 1 < len(tokens):
                proximo_token = tokens[i + 1]
                if proximo_token in self.lexico_positivo:
                    proximo_positivo = True
                elif proximo_token in self.lexico_negativo:
                    proximo_negativo = True
            
            if token_lower in self.lexico_positivo:
                if is_negacao:
                    pontuacao -= 1.0 * intensificador
                else:
                    pontuacao += 1.0 * intensificador
                    
                if i > 0 and tokens[i-1] in ["muito", "bastante"]:
                    pontuacao += 0.5
            
            elif token_lower in self.lexico_negativo:
                if is_negacao:
                    pontuacao += 1.0 * intensificador
                else:
                    pontuacao -= 1.0 * intensificador
                    
                if i > 0 and tokens[i-1] in ["muito", "bastante"]:
                    pontuacao -= 0.5
            
            if i + 1 < len(tokens):
                bigrama = f"{token_lower} {tokens[i+1]}"
                if any(expr in bigrama for expr in ["muito bom", "muito boa", "muito útil"]):
                    pontuacao += 2.0
                elif any(expr in bigrama for expr in ["muito ruim", "muito lento", "não funciona"]):
                    pontuacao -= 2.0
        
        pontuacao_normalizada = pontuacao / max(total_tokens, 1)
        
        if pontuacao_normalizada > 0.1:
            return "Positivo"
        elif pontuacao_normalizada < -0.1:
            return "Negativo"
        else:
            return "Neutro"

    def preprocessar_texto(self, texto: str) -> str:
        texto = texto.lower()
        texto = ''.join(c for c in unicodedata.normalize('NFD', texto) 
                       if unicodedata.category(c) != 'Mn')
        return texto

    def palavra_mais_frequente(self, doc) -> str:     
        palavras = [
            token.text for token in doc
            if token.is_alpha
            and not token.is_stop
            and len(token.text) > 2
        ]
        
        if not palavras:
            return "Nenhuma palavra significativa encontrada."
        
        cont = Counter(palavras)
        return cont.most_common(1)[0][0]
    
    def extrair_entidades(self, doc) -> list:
        entidades = []

        for ent in doc.ents:
            if ent.label_ not in {"PER", "ORG", "LOC"}:
                continue

            if ent.label_ == "PER" and len(ent.text.split()) < 2:
                continue

            entidades.append({
                "texto": ent.text,
                "tipo": ent.label_,
            })

        return entidades

    def cont_silabas(self, palavra: str) -> int:
        palavra = ''.join(c for c in palavra if c.isalpha()).lower()
        
        if not palavra:
            return 0
            
        vogais = 'aeiouáéíóúâêîôûàèìòùãõ'
        ditongos = ['ai', 'au', 'ei', 'eu', 'oi', 'ou', 'ui',
                   'ãe', 'ão', 'õe', 'ae', 'ao', 'ia', 'ie',
                   'io', 'iu', 'ua', 'ue', 'uo', 'uã', 'uõ']
        tritongos = ['uai', 'uei', 'uão', 'uãe', 'uõe']
        
        palavra_simplificada = palavra
        for vogal_acentuada in 'áéíóúâêîôûàèìòùãõ':
            if vogal_acentuada in palavra_simplificada:
                palavra_simplificada = palavra_simplificada.replace(vogal_acentuada, vogal_acentuada[0])
        
        silabas = 0
        i = 0
        while i < len(palavra_simplificada):
            if i <= len(palavra_simplificada) - 3:
                tri = palavra_simplificada[i:i+3]
                if tri in tritongos:
                    silabas += 1
                    i += 3
                    continue
            
            if i <= len(palavra_simplificada) - 2:
                di = palavra_simplificada[i:i+2]
                if di in ditongos:
                    silabas += 1
                    i += 2
                    continue
            
            if palavra_simplificada[i] in vogais:
                silabas += 1
            
            i += 1
        
        if silabas == 0 and any(c in vogais for c in palavra_simplificada):
            silabas = 1
            
        return max(silabas, 1)

    def lvl_legibilidade_adaptado(self, doc) -> str:
        
        frases = self.cont_frases(doc)
        palavras = [token.text for token in doc if token.is_alpha]
        
        if frases < 1 or len(palavras) < 10:
            return "Curto demais para avaliar."
        
        palavras_por_frase = len(palavras) / frases
        
        total_silabas = sum(self.cont_silabas(p) for p in palavras)
        silabas_por_palavra = total_silabas / len(palavras)
        
        indice = 180 - palavras_por_frase - (58.5 * silabas_por_palavra)
        
        if indice >= 80:
            return "Muito fácil (Educação fundamental)"
        elif indice >= 60:
            return "Fácil (Ensino médio)"
        elif indice >= 40:
            return "Médio (Ensino superior)"
        elif indice >= 20:
            return "Difícil (Graduação)"
        else:
            return "Muito difícil (Pós-graduação)"

    def cont_palavras(self, texto: str) -> int:
        palavras = re.findall(r'\b\w+\b', texto)
        return len(palavras)

    def cont_caracteres(self, texto: str) -> int:
        return len(texto)

    def cont_frases(self, doc) -> int:
        return len(list(doc.sents))


if __name__ == "__main__":
    nlp = NLPService()
    
    # Testes com exemplos
    testes = [
        "O aplicativo está lento e trava constantemente.",
        "Este software é excelente e muito fácil de usar!",
        "A interface do sistema é clara e organizada.",
        "Não recomendo este produto, pois apresenta muitos erros.",
        "O sistema oferece diversas funcionalidades que facilitam a análise de dados, mantendo uma interface clara e organizada para o usuário."
    ]
    
    for i, texto in enumerate(testes, 1):
        print(f"\nTeste {i}:")
        print(f"Texto: {texto}")
        resultado = nlp.analisar_texto(texto)
        print(f"Resultado: {resultado}")