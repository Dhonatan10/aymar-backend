console.log(" Servidor rodando - versão ES Modules com import");
console.log("🚀 Teste visível de push no index.js");


import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

// Carrega variáveis do .env oi teste
dotenv.config();

const app = express();

// Configuração CORS para aceitar apenas do seu frontend
const corsOptions = {
  origin: [
    "https://aymar-tech.web.app",
    "https://www.aymarmultiloja.com.br",
    "https://api.aymarmultiloja.com.br"
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Rota: Gerar plano de aula
app.post("/aulas", async (req, res) => {
  const { tema, publico_alvo = "Alunos", duracao = "45 minutos", detalhes } = req.body;

  if (!tema) {
    return res.status(400).json({ error: "O campo 'tema' é obrigatório." });
  }

  let prompt = `Crie um plano de aula para o tema '${tema}', público-alvo '${publico_alvo}', com duração de ${duracao}.`;
  if (detalhes) prompt += ` Detalhes adicionais: ${detalhes}.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
      temperature: 0.6,
    });

    res.json({ plano_de_aula: completion.choices[0].message.content.trim() });
  } catch (error) {
    console.error("Erro ao gerar plano de aula:", error);
    res.status(500).json({ error: "Erro interno ao gerar o plano de aula." });
  }
});

// Rota: Gerar prova
app.post("/provas", async (req, res) => {
  const { disciplina, nivel = "Médio", quantidade_questoes = 10 } = req.body;

  if (!disciplina) {
    return res.status(400).json({ error: "O campo 'disciplina' é obrigatório." });
  }

  const prompt = `Crie uma prova de ${quantidade_questoes} questões para a disciplina '${disciplina}' de nível ${nivel}.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
      temperature: 0.6,
    });

    res.json({ prova_gerada: completion.choices[0].message.content.trim() });
  } catch (error) {
    console.error("Erro ao gerar prova:", error);
    res.status(500).json({ error: "Erro interno ao gerar a prova." });
  }
});

// Rota: Assistente IA
app.post("/assistente", async (req, res) => {
  const { pergunta, contexto } = req.body;

  if (!pergunta) {
    return res.status(400).json({ error: "O campo 'pergunta' é obrigatório." });
  }

  let prompt = `Responda a pergunta de forma clara e objetiva:\nPergunta: ${pergunta}`;
  if (contexto) prompt = `Contexto: ${contexto}\n` + prompt;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
      temperature: 0.6,
    });

    res.json({ resposta: completion.choices[0].message.content.trim() });
  } catch (error) {
    console.error("Erro no assistente IA:", error);
    res.status(500).json({ error: "Erro interno ao processar a pergunta." });
  }
});

// Rota: Criar quiz
app.post("/quizzes", async (req, res) => {
  const { tema, nivel = "Médio", numero_perguntas = 5 } = req.body;

  if (!tema) {
    return res.status(400).json({ error: "O campo 'tema' é obrigatório." });
  }

  const prompt = `Crie um quiz divertido e desafiador com ${numero_perguntas} perguntas de múltipla escolha sobre '${tema}', nível ${nivel}. Informe as perguntas com as opções e destaque a correta explicitamente.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 700,
      temperature: 0.8,
    });

    res.json({ quiz: completion.choices[0].message.content.trim() });
  } catch (err) {
    console.error("Erro ao gerar quiz:", err);
    res.status(500).json({ error: "Erro interno ao gerar o quiz." });
  }
});

// Rota: Listar cursos (exemplo)
app.get("/cursos", (req, res) => {
  res.json({
    cursos: [
      { id: 1, titulo: "Técnicas de Ensino Modernas", descricao: "Curso online para inovar suas aulas." },
      { id: 2, titulo: "Uso da IA na Educação", descricao: "Aprenda a integrar inteligência artificial nas aulas." },
      { id: 3, titulo: "Psicologia Educacional Básica", descricao: "Compreenda o comportamento dos alunos." },
      { id: 4, titulo: "Didática para Professores Iniciantes", descricao: "Fundamentos para planejar aulas eficazes." },
    ],
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
