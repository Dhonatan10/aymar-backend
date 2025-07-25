console.log("🚀 Servidor rodando - versão ES Modules com import");

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

// Carrega variáveis do .env
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Inicializa OpenAI com a chave da variável de ambiente
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Rota: Gerar plano de aula
app.post("/aulas", async (req, res) => {
  const { tema, publico_alvo = "Alunos", duracao = "45 minutos", detalhes } = req.body;
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota: Gerar prova
app.post("/provas", async (req, res) => {
  const { disciplina, nivel = "Médio", quantidade_questoes = 10 } = req.body;
  const prompt = `Crie uma prova de ${quantidade_questoes} questões para a disciplina '${disciplina}' de nível ${nivel}.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
      temperature: 0.6,
    });
    res.json({ prova_gerada: completion.choices[0].message.content.trim() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota: Assistente IA
app.post("/assistente", async (req, res) => {
  const { pergunta, contexto } = req.body;
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota: Gerar quiz
app.post("/quizzes", async (req, res) => {
  const { tema, numero_perguntas = 5 } = req.body;
  const prompt = `Crie um quiz com ${numero_perguntas} perguntas sobre '${tema}' com múltipla escolha e destaque a correta.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
      temperature: 0.6,
    });
    res.json({ quiz: completion.choices[0].message.content.trim() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota: Listar cursos (exemplo)
app.get("/cursos", (req, res) => {
  res.json({
    cursos: [
      { id: 1, titulo: "Técnicas de Ensino Modernas", descricao: "Curso online para inovar suas aulas." },
      { id: 2, titulo: "Uso da IA na Educação", descricao: "Aprenda a integrar inteligência artificial nas aulas." },
      { id: 3, titulo: "Psicologia Educacional Básica", descricao: "Compreenda o comportamento dos alunos." },
      { id: 4, titulo: "Didática para Professores Iniciantes", descricao: "Fundamentos para planejar aulas eficazes." }
    ]
  });
});

// Inicia o servidor
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
