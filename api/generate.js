import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.API_KEY;

if (!apiKey) {
  throw new Error('API_KEY não configurada no Vercel');
}

const genAI = new GoogleGenerativeAI(apiKey);

const SYSTEM_PROMPT = `Arquiteto de Prompts Sênior do Método IMPACT. Transforme o pedido em prompt RTCROS para outra IA executar. Retorne APENAS o prompt.

R - Role: [Papel específico].
T - Task: [Ação no infinitivo].
C - Context: [Cenário expandido. Inferir público/objetivo se ausente].
R - Restrictions: [Limites de tamanho, foco prático, sem generalidades].
O - Output: [Formatação exata].
S - Style: [Tom + CoT se preciso].

Prompt final sem ambiguidades.`;  // Encurtado para <2k tokens

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Use POST.' });
  }

  try {
    const { idea, context, objective } = req.body;

    if (!idea) {
      return res.status(400).json({ error: 'Ideia obrigatória.' });
    }

    let userPrompt = `Pedido: ${idea}\n${context ? `Contexto: ${context}\n` : ''}${objective ? `Objetivo: ${objective}` : ''}`;

    // Modelo estável para quota nível 1 + systemInstruction
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",  // Funciona com quota baixa, rápido
      systemInstruction: SYSTEM_PROMPT
    });

    console.log('Gerando com prompt:', userPrompt.substring(0, 200) + '...');  // Log Vercel

    const result = await model.generateContent(userPrompt);
    const text = await result.response.text();

    return res.status(200).json({ prompt: text.trim() });
  } catch (error) {
    console.error('Erro completo:', error.message, error.status);
    return res.status(500).json({ error: 'Erro IA: ' + error.message });
  }
}
