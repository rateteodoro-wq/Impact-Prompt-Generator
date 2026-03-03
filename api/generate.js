import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `Impact Prompt Generator v3.1. RTCROS prompts para Gemini 3.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST' });

  const apiKey = process.env.API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Falta API_KEY' });

  const { idea, context, objective } = req.body;
  if (!idea) return res.status(400).json({ error: 'Ideia necessária' });

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // ✅ Corrigido para const (sem o duplo c) e usando o 2.5 Flash
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash" 
    });

    const promptFinal = `${SYSTEM_PROMPT}\n\nIdeia: ${idea}\n${context ? `Contexto: ${context}` : ''}\n${objective ? `Objetivo: ${objective}` : ''}`;

    const result = await model.generateContent(promptFinal);
    const response = await result.response;
    
    res.status(200).json({ prompt: response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
