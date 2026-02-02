# Análise Inteligente - InsightsT 

**Uma aplicação full-stack para análise de texto com autenticação, histórico e análise de tópicos utilizando IA.**

> 🌐 **URL da aplicação em produção:** [https://insightstextanalysis.vercel.app](https://insightstextanalysis.vercel.app)
>
> Este projeto é composto por um **backend em FastAPI (Python)** e um **frontend em React + Vite**. O deploy está disponível na Vercel (frontend) e pode ser escalado no Render.com (backend).

---

## Recursos principais

- **Autenticação segura** – Registro e login de usuários com JWT (JSON Web Tokens)
- **Análise de texto inteligente** – Processamento de Linguagem Natural (NLP) para extração de insights
- **Análise de tópicos** – Identificação automática de temas e categorias no texto
- **Histórico personalizado** – Cada usuário tem seu próprio histórico de análises
- **API RESTful** – Desenvolvida com FastAPI para alta performance e documentação automática
- **Interface moderna** – Frontend responsivo com React, Vite e Tailwind CSS

---

## Stack Tecnológica

### **Backend**
- **Framework:** FastAPI (Python)
- **ORM:** SQLAlchemy + Alembic (migrations)
- **Banco de dados:** SQLite (desenvolvimento) / PostgreSQL (produção)
- **NLP:** spaCy com modelo `pt_core_news_sm`
- **Autenticação:** JWT (JSON Web Tokens)
- **Documentação automática:** Swagger UI em `/docs`

### **Frontend**
- **Framework:** React 18
- **Build tool:** Vite
- **Estilização:** Tailwind CSS
- **Roteamento:** React Router
- **Requisições HTTP:** Axios
- **Gerenciamento de estado:** React Hooks

---

## Pré-requisitos

- Python 3.10 ou superior
- Node.js 16 ou superior
- npm ou yarn
- Git

---

## Executando localmente

### **Backend**

1. **Acesse a pasta do backend:**
```bash
cd backend
```

2. **Crie e ative um ambiente virtual:**
```bash
python -m venv .venv
```
- **Windows:**
```bash
.\.venv\Scripts\activate
```
- **macOS/Linux:**
```bash
source .venv/bin/activate
```

3. **Instale as dependências:**
```bash
pip install -r requeriments.txt
```

4. **Configure as variáveis de ambiente:**
   - Crie um arquivo `.env` na pasta `backend/`
   - Adicione as seguintes variáveis:
```env
SECRET_KEY=sua_chave_secreta_aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite:///./analyses.db
```

5. **Inicie o servidor de desenvolvimento:**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

A API estará disponível em `http://localhost:8000`
- **Documentação interativa:** `http://localhost:8000/docs`

### **Frontend**

1. **Acesse a pasta do frontend:**
```bash
cd frontend
```

2. **Instale as dependências:**
```bash
npm install
# ou
yarn install
```

3. **Configure a URL da API (se necessário):**
   - Crie um arquivo `.env` na pasta `frontend/`
   - Adicione:
```env
VITE_API_BASE_URL=http://localhost:8000
```

4. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
# ou
yarn dev
```

A aplicação estará disponível em `http://localhost:5173`

---

## Testes

Para executar os testes do backend:

```bash
cd backend
pytest
```

---

## Migrações do Banco de Dados

As migrações estão localizadas em `backend/alembic/`.

- **Criar uma nova migração:**
```bash
alembic revision --autogenerate -m "Descrição da migração"
```

- **Aplicar migrações pendentes:**
```bash
alembic upgrade head
```

- **Reverter a última migração:**
```bash
alembic downgrade -1
```

---

## Estrutura do Projeto

```
Analise_Inteligente/
├── backend/                  # API FastAPI
│   ├── app/                  # Código da aplicação
│   │   ├── api/              # Endpoints da API
│   │   ├── core/             # Configurações e utilitários
│   │   ├── models/           # Modelos de dados
│   │   └── services/         # Lógica de negócio
│   ├── alembic/              # Migrações do banco de dados
│   ├── requirements.txt      # Dependências Python
│   └── .env                  # Variáveis de ambiente
├── frontend/                 # Aplicação React
│   ├── public/               # Arquivos estáticos
│   ├── src/                  # Código fonte
│   │   ├── components/       # Componentes React
│   │   ├── pages/            # Páginas da aplicação
│   │   ├── services/         # Comunicação com API
│   │   └── styles/           # Estilos CSS
│   └── .env                  # Variáveis de ambiente
├── docker-entrypoint.sh      # Script de inicialização Docker
├── Dockerfile                # Configuração Docker
├── render.yaml               # Configuração Render.com
├── LICENSE                   # Licença do projeto
└── README.md               
```

---

## Deploy

### **Frontend (Vercel)**
A aplicação frontend já está disponível em:  
[https://insightstextanalysis.vercel.app](https://insightstextanalysis.vercel.app)

### **Backend (Render.com)**
1. Conecte seu repositório ao Render.com
2. Selecione "Web Service"
3. Configure conforme `render.yaml`
4. Adicione as variáveis de ambiente necessárias
5. Faça o deploy

---

## Contribuições

Contribuições são bem-vindas! Siga estes passos:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## Licença

Este projeto está licenciado sob os termos da licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---