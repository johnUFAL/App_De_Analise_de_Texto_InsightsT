from sklearn.feature_extraction.text import TfidfVectorizer # type: ignore
from sklearn.naive_bayes import MultinomialNB # type: ignore
from sklearn.pipeline import Pipeline # type: ignore
import numpy as np # type: ignore
import joblib # type: ignore
import os

class TopicClassifier:
    def __init__(self):
        self.pipeline = None
        self.topics = ["política", "esportes", "tecnologia", "economia", "entretenimento"]
        self.load_or_train_model()

    def load_or_train_model(self):
        model_path = "topic_model.pkl"
        
        #remove modelos antigos 
        if os.path.exists(model_path):
            os.remove(model_path)
        
        #novo modelo 
        self.train_basic_model()
        
        #salva modelo
        if self.pipeline:
            joblib.dump(self.pipeline, model_path)

    def train_basic_model(self):        
        textos_treino = [
            #política 0
            "governo medidas econômicas inflação presidente",
            "presidente líderes internacionais acordos comerciais",
            "congresso lei reforma tributária impostos",
            "ministro justiça criminalidade segurança pública",
            "eleições municipais votos candidatos",
            "partido oposição políticas sociais",
            "lei ambiental meio ambiente senado",
            "prefeitos infraestrutura obras cidade",
            "candidatos educação escolas públicas",
            "reforma previdência aposentadoria",
            
            #esporte 1
            "time jogo campeonato futebol esporte",
            "atleta medalha ouro olimpíadas competição",
            "jogador futebol transferência contrato",
            "seleção copa mundo futebol nacional",
            "estádio torcida jogo público",
            "campeonato basquete equipes jogadores",
            "atleta recorde mundial esporte",
            "time vôlei feminino esporte",
            "jogador lesão recuperação tratamento",
            "clube técnico treinador esportes",
            
            #tecnologia 2
            "tecnologia smartphone aplicativo digital",
            "empresa inteligência artificial software",
            "startup aplicativo pagamentos digital",
            "conferência tecnologia inovações",
            "cibersegurança segurança digital hackers",
            "sistema operacional computador software",
            "robótica robôs automação indústria",
            "realidade virtual jogos simulação",
            "plataforma streaming vídeo online",
            "carros autônomos inteligentes direção",
            
            #economia 3
            "bolsa valores ações mercado financeiro",
            "banco central juros inflação",
            "inflação preços aumento custo vida",
            "empresas exportadoras comércio exterior",
            "moeda dólar câmbio cambio",
            "mercado imobiliário imóveis casas",
            "setor industrial fábricas produção",
            "desemprego emprego trabalho vagas",
            "comércio eletrônico loja online",
            "investimentos infraestrutura obras",
            
            #entretenimento 4
            "filme cinema diretor atores",
            "série TV episódios streaming",
            "cantor música álbum show",
            "festival música bandas público",
            "ator atriz papel personagem",
            "novela televisão capítulo história",
            "youtuber vídeo internet canal",
            "show comédia humor risos",
            "livro leitura autor editora",
            "influenciadores redes sociais internet"
        ]
        
        labels_treino = (
            [0] * 10 +  
            [1] * 10 + 
            [2] * 10 +  
            [3] * 10 +  
            [4] * 10   
        ) #10 exemplos por topico

        #pipeline
        self.pipeline = Pipeline([
            ('tfidf', TfidfVectorizer(
                max_features=200,
                min_df=1,
                max_df=0.95,
                ngram_range=(1, 2),
                stop_words=None
            )),
            ('clf', MultinomialNB(alpha=0.01))
        ])
        
        #treino
        self.pipeline.fit(textos_treino, labels_treino)
        
        #acuracia no treino
        train_preds = self.pipeline.predict(textos_treino)
        accuracy = np.mean(train_preds == labels_treino)
        
        #teste interno
        test_texts = [
            ("smartphone tecnologia", "tecnologia"),
            ("time jogo futebol", "esportes"),
            ("governo ministro", "política"),
            ("inflação economia", "economia"),
            ("filme cinema", "entretenimento")
        ]
        
        for text, expected in test_texts:
            try:
                proba = self.pipeline.predict_proba([text])[0]
                pred_idx = self.pipeline.predict([text])[0]
                pred_topic = self.topics[pred_idx]
            except:
                print(f"  '{text}' -> erro na predição")

    def predict(self, texto):
        if self.pipeline is None:
            print("AVISO: Usando fallback porque pipeline não foi treinado")
            return self.fallback_predict(texto)
        
        try:
            texto_simplificado = ' '.join([
                palavra for palavra in texto.lower().split()
                if len(palavra) > 2  #filtrar palavras muito curtas
            ])
            
            probas = self.pipeline.predict_proba([texto_simplificado])[0]
            
            results = []
            for idx, prob in enumerate(probas):
                results.append({
                    "topico": self.topics[idx],
                    "confianca": float(prob)
                })
            
            #ordem por confianca
            results.sort(key=lambda x: x["confianca"], reverse=True)
            
            #top 2 de confianca
            top_results = results[:2]
            for res in top_results:
                res["confianca"] = round(res["confianca"], 3)
            
            return top_results
            
        except Exception as e:
            return self.fallback_predict(texto)
    
    def fallback_predict(self, texto):
        texto_lower = texto.lower()
        
        keywords = {
            "política": ["governo", "presidente", "ministro", "eleições", "congresso", 
                        "lei", "política", "partido", "senado", "prefeito", "voto"],
            "esportes": ["time", "jogo", "campeonato", "atleta", "futebol", "esporte", 
                        "jogador", "gol", "estádio", "torcida", "competição"],
            "tecnologia": ["tecnologia", "smartphone", "app", "digital", "software", 
                          "computador", "internet", "dados", "aplicativo", "celular"],
            "economia": ["economia", "inflação", "dólar", "bolsa", "mercado", 
                        "finanças", "investimento", "preços", "dinheiro", "banco"],
            "entretenimento": ["filme", "série", "música", "show", "ator", "cinema", 
                              "artista", "livro", "festival", "música", "espetáculo"]
        }
        
        #scores
        scores = {}
        for topic, words in keywords.items():
            score = 0
            for word in words:
                if word in texto_lower:
                    score += 1
            scores[topic] = score / len(words)
        
        #ordenar por score
        sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        
        results = []
        for topic, score in sorted_scores[:2]:
            if score > 0:
                results.append({
                    "topico": topic,
                    "confianca": round(score * 0.7, 3) #reduz, mais conservador
                })
        
        if not results:
            results = [
                {"topico": "tecnologia", "confianca": 0.2},
                {"topico": "economia", "confianca": 0.15}
            ]
        
        return results