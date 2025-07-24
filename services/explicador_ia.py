from fastapi import APIRouter

router = APIRouter()

@router.post("/")
async def gerar_conteudo(dados: dict):
    # Aqui entraria a integração com a IA (ChatGPT, etc.)
    return {"resposta": "Resultado gerado com IA para o serviço 'explicador ia'"}
