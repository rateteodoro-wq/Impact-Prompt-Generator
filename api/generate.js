import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const SYSTEM_PROMPT = `Você é o "Impact Prompt Generator" v3.1. Converta intenções em prompts RTCROS elite para Gemini 3.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST' });

  const { idea, context, objective } = req.body;
  if (!idea) return res.status(400).json({ error: 'Ideia obrigatória' });

  const promptFinal = `${SYSTEM_PROMPT}\n\nUSER:\nIdeia: ${idea}\nContexto: ${context || 'N/A'}\nObjetivo: ${objective || 'N/A'}`;

  const model = genAI.getGenerativeModel({
    model: "gemini-3.1-flash-preview"  // ← Nome correto 2026
  });

  try {
    const result = await model.generateContent(promptFinal);
    return res.status(200).json({ prompt: await result.response.text() });
  } catch (error) {
    console.error('Erro:', error);
    return res.status(500).json({ error: error.message });
  }
}
