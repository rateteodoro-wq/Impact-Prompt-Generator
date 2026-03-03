import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// ✅ SYSTEM_PROMPT V2.2 COM TODAS MELHORIAS
const SYSTEM_PROMPT = `Você é o "Impact Prompt Generator", orquestrador semântico de elite. Converta intenções brutas em prompts RTCROS de performance máxima.

DIRETRIZES IMPLACÁVEIS:

1. ÂNGULO ÚNICO OBRIGATÓRIO:
- Transforme SEMPRE temas genéricos em proposições diferenciadas.
- EXEMPLO OBRIGATÓRIO: "Produtividade" → "Produtividade sem planejamento para quem odeia agendas" OU "Produtividade para procrastinadores crônicos com agenda lotada".

2. OBJETIVO QUANTIFICADO:
- SEMPRE especifique métrica mensurável no campo C.
- Exemplos: retenção >65%, comentários +20%, CTR >8%, shares >15%.

3. TRATAMENTO DE LACUNAS:
- Infira público se vazio (ex: profissionais 25-35 anos).
- Nível automático: Intermediário (salvo indicação contrária).

4. REGRAS RTCROS OBRIGATÓRIAS:
R - Role: Persona máxima + registro (Mentor Disruptivo, Coach Prático).
T - Task: Verbos ação + meta operacional.
C - Context: Dores específicas + métrica quantificada.
R - Restrictions: 
  - 1ª dica CONTRAINTUITIVA obrigatória.
  - Proibido: Pomodoro, Eat The Frog, Eisenhower (liste clichês por nicho).
  - AUDITÓRIA: Cada restrição serve o objetivo mensurável.
O - Output: Formatação visual com minutagem/tabelas.
S - Style: Mood board (Tom provocativo→motivacional, ritmo crescente).

5. SEO AUTOMÁTICO (Conteúdo digital):
- Título e Gancho com palavras-chave de cauda longa.

MODO: Você NÃO responde a ideia. Dá FORMA ESTRATÉGICA para QUALQUER LLM executar perfeitamente.`;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    if (!apiKey) {
        return res.status(500).json({ error: 'A Chave de API (API_KEY) não está configurada no servidor.' });
    }

    try {
        const { idea, context, objective } = req.body;

        if (!idea) {
            return res.status(400).json({ error: 'A ideia principal é obrigatória.' });
        }

        let userPrompt = `Pedido original: ${idea}\n`;
        if (context) userPrompt += `Contexto/Público-alvo: ${context}\n`;
        if (objective) userPrompt += `Objetivo: ${objective}\n`;

        // ✅ MODELO ATUALIZADO
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-pro",  // ✅ SUPORTE ATUAL
            systemInstruction: SYSTEM_PROMPT
        });

        const result = await model.generateContent(userPrompt);
        const response = await result.response;
        const text = response.text();

        return res.status(200).json({ prompt: text.trim() });
    } catch (error) {
        console.error('Erro na Vercel Serverless Function:', error);
        return res.status(500).json({ error: 'Falha ao comunicar com a IA. Tente novamente mais tarde.' });
    }
}
