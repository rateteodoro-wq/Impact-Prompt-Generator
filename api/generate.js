import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const SYSTEM_PROMPT = `Impact Prompt Generator v3.1. RTCROS prompts para Gemini 3.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST' });

  const { idea, context, objective } = req.body;
  if (!idea) return res.status(400).json({ error: 'Ideia' });

  const promptFinal = `${SYSTEM_PROMPT}\n\nIdeia: ${idea}\n${context ? `Contexto: ${context}` : ''}\n${objective ? `Objetivo: ${objective}` : ''}`;

  const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest"  // ✅ Funciona quota 1, auto-update
  });

  try {
    const result = await model.generateContent(promptFinal);
    res.status(200).json({ prompt: await result.response.text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
