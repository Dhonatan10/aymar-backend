from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import openai
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# Carrega variáveis do .env
load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise Exception("Variável OPENAI_API_KEY não encontrada!")

openai.api_key = OPENAI_API_KEY

app = FastAPI(title="Aymar Tech Backend com IA")

# CORS liberado para todos os domínios (não recomendado para produção)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # libera todos os domínios
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models (Schemas) ---

class AulaRequest(BaseModel):
    tema: str
    publico_alvo: Optional[str] = "Alunos"
    duracao: Optional[str] = "45 minutos"
    detalhes: Optional[str] = None

class ProvaRequest(BaseModel):
    disciplina: str
    nivel: Optional[str] = "Médio"
    quantidade_questoes: Optional[int] = 10

class AssistenteRequest(BaseModel):
    pergunta: str
    contexto: Optional[str] = None

class QuizRequest(BaseModel):
    tema: str
    numero_perguntas: Optional[int] = 5

# --- Endpoints ---

@app.post("/aulas")
async def criar_aula(req: AulaRequest):
    prompt = (
        f"Crie um plano de aula para o tema '{req.tema}', "
        f"público-alvo '{req.publico_alvo}', com duração de {req.duracao}. "
    )
    if req.detalhes:
        prompt += f"Detalhes adicionais: {req.detalhes}."
    prompt += "\nPor favor, escreva o plano de forma clara e organizada."

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=700,
            temperature=0.7,
        )
        texto = response.choices[0].message.content.strip()
        return {"plano_de_aula": texto}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/provas")
async def gerar_prova(req: ProvaRequest):
    prompt = (
        f"Crie uma prova de {req.quantidade_questoes} questões para a disciplina "
        f"'{req.disciplina}' de nível {req.nivel}. "
        "Inclua perguntas variadas e claras."
    )
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=900,
            temperature=0.7,
        )
        texto = response.choices[0].message.content.strip()
        return {"prova_gerada": texto}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/assistente")
async def assistente_educacional(req: AssistenteRequest):
    prompt = f"Responda a pergunta de forma clara e objetiva:\nPergunta: {req.pergunta}"
    if req.contexto:
        prompt = f"Contexto: {req.contexto}\n" + prompt

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
            temperature=0.6,
        )
        resposta = response.choices[0].message.content.strip()
        print(f"\n🔍 RESPOSTA DO OPENAI: {resposta}\n")  # <-- Adicione isso
        return {"resposta": resposta}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/quizzes")
async def criar_quiz(req: QuizRequest):
    prompt = (
        f"Crie um quiz educativo e divertido com {req.numero_perguntas} perguntas sobre o tema '{req.tema}'. "
        "Forneça as perguntas com opções de múltipla escolha e destaque a resposta correta."
    )
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=900,
            temperature=0.7,
        )
        quiz_texto = response.choices[0].message.content.strip()
        return {"quiz": quiz_texto}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/cursos")
async def listar_cursos():
    cursos_mock = [
        {"id": 1, "titulo": "Técnicas de Ensino Modernas", "descricao": "Curso online para inovar suas aulas."},
        {"id": 2, "titulo": "Uso da IA na Educação", "descricao": "Aprenda a integrar inteligência artificial nas aulas."},
        {"id": 3, "titulo": "Psicologia Educacional Básica", "descricao": "Compreenda o comportamento dos alunos."},
        {"id": 4, "titulo": "Didática para Professores Iniciantes", "descricao": "Fundamentos para planejar aulas eficazes."},
    ]
    return {"cursos": cursos_mock}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000)
