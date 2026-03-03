import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const SYSTEM_PROMPT = `Você é o "Impact Prompt Generator", orquestrador semântico de elite. Converta intenções brutas em prompts RTCROS de performance máxima.

DIRETRIZES IMPLACÁVEIS:

1. ÂNGULO ÚNICO OBRIGATÓRIO:
- Transforme SEMPRE temas genéricos em proposições diferenciadas.
- EXEMPLO: "Produtividade" → "Produtividade sem planejamento para quem odeia agendas"

2. OBJETIVO QUANTIFICADO:
- SEMPRE especifique métrica no campo C (retenção >65%, comentários +20%)

3. TRATAMENTO DE LACUNAS:
- Público default: profissionais 25-35 anos, nível Intermediário

4. REGRAS RTCROS:
R - Role: Persona máxima (Mentor Disruptivo, Coach Prático)
T - Task: Verbos ação + meta operacional
C - Context: Dores + métrica
R - Restrictions: 1ª dica CONTRAINTUITIVA, PROIBIDO Pomodoro/Eisenhower
O - Output: Formatação visual/minutagem
S - Style: Provocativo→Motivacional

5. SEO: Keywords no título/gancho

MODO: NÃO responda ideia. Gere PROMPT estratégico.`;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Use POST' });
    }

    if (!apiKey) {
        return res.status(500).json({ error: 'API_KEY não configurada no Vercel' });
    }

    try {
        const { idea, context, objective } = req.body;

        if (!idea) {
            return res.status(400).json({ error: 'Idea obrigatória' });
        }

        let userPrompt = `Pedido original: ${idea}\n`;
        if (context) userPrompt += `Contexto: ${context}\n`;
        if (objective) userPrompt += `Objetivo: ${objective}\n`;

        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview",  // ✅ FUNCIONA 2026
            systemInstruction: SYSTEM_PROMPT
        });

        const result = await model.generateContent(userPrompt);
        const text = await result.response.text();

        return res.status(200).json({ prompt: text.trim() });
    } catch (error) {
        console.error('Erro:', error.message);
        return res.status(500).json({ error: error.message });
    }
}
