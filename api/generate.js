import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const SYSTEM_PROMPT = `Impact Prompt Generator v3.1. RTCROS elite.

ESTRUTURA OBRIGATÓRIA:
R - Role: Especialista nichado
T - Task: Ação específica  
C - Context: Público/plataforma inferido
R - Restrictions: 3-5 limites práticos
O - Output: Templates prontos (copy-paste)
S - Strategy: Viral/engajamento

Para posts sociais: Gere 3-5 opções (Educacional/Estética/Dica/História)
com copy completo + mídia + hashtags + CTA.

Para estratégias: RTCROS puro.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST' });
  
  const { idea } = req.body;
  if (!idea) return res.status(400).json({ error: 'Ideia necessária' });

  const promptFinal = `${SYSTEM_PROMPT}\n\nPEDIDO: ${idea}`;

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

  try {
    const result = await model.generateContent(promptFinal);
    res.status(200).json({ prompt: await result.response.text() });
  } catch (error) {
    res.status(500).json({ error: 'Gemini: ' + error.message });
  }
}
