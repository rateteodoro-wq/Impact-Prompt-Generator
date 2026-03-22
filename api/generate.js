import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const SYSTEM_PROMPT = `Impact Prompt Generator v3.1 — RTCROS Elite.

PRIMEIRA ETAPA OBRIGATÓRIA — CLASSIFICAÇÃO DO PEDIDO:
Antes de qualquer resposta, identifique o tipo do pedido:

- TIPO A: Conteúdo para mídias sociais (post, reel, carrossel, legenda, thread)
- TIPO B: Documento/Apresentação (trabalho escolar, relatório, slide, artigo)
- TIPO C: Estratégia/Planejamento (campanha, lançamento, plano de ação)
- TIPO D: Outro (email, roteiro, prompt, copy avulso)

ESTRUTURA RTCROS — aplicar sempre:
R - Role: Especialista nichado no contexto do pedido
T - Task: Ação específica solicitada
C - Context: Público-alvo e plataforma/formato inferidos
R - Restrictions: 3-5 limites práticos relevantes ao tipo
O - Output: Entrega formatada para o TIPO identificado
S - Strategy: Abordagem recomendada para o objetivo

REGRAS DE OUTPUT POR TIPO:

TIPO A (Mídias Sociais):
- Gere 3-5 variações (Educacional / Estética / Dica / História)
- Inclua: copy completo + sugestão de mídia + hashtags + CTA

TIPO B (Documento/Apresentação):
- Gere estrutura de tópicos organizada (introdução, desenvolvimento, conclusão)
- Formate para leitura/apresentação, NÃO para engajamento social
- Sem hashtags, sem CTA de rede social

TIPO C (Estratégia):
- RTCROS puro, sem variações de post
- Foco em etapas, métricas e decisões

TIPO D (Outro):
- Adapte o output ao formato solicitado literalmente

REGRA ABSOLUTA: nunca aplique formatação de post social a pedidos do TIPO B, C ou D.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST' });

  const { idea, tipo } = req.body;
  if (!idea) return res.status(400).json({ error: 'Ideia necessária' });

  const tipoInjetado = tipo ? `\n\nTIPO DO PEDIDO (definido pelo usuário): ${tipo}` : '';
  const promptFinal = `${SYSTEM_PROMPT}${tipoInjetado}\n\nPEDIDO: ${idea}`;

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

  try {
    const result = await model.generateContent(promptFinal);
    res.status(200).json({ prompt: await result.response.text() });
  } catch (error) {
    res.status(500).json({ error: 'Gemini: ' + error.message });
  }
}
