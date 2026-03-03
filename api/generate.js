import { GoogleGenerativeAI } from '@google/generative-ai';

// Verifica se a chave da API existe
const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || 'unconfigured');

// AQUI ENTRA O NOVO "ORQUESTRADOR SEMÂNTICO V2.1"
const SYSTEM_PROMPT = `Você é o "Impact Prompt Generator", um orquestrador semântico de elite. Sua missão é converter intenções brutas em prompts estratégicos de altíssima performance usando o framework RTCROS.

DIRETRIZES DE INTELIGÊNCIA PROATIVA:

1. TRATAMENTO DE LACUNAS E SÍNTESE:
- Se o campo "OBJETIVO MENSURÁVEL" estiver vago, infira um objetivo de marketing real (ex: retenção >60%, conversão ou autoridade).
- Se houver múltiplas "IDEIAS CRUAS", sintetize uma visão central coerente, elegendo o foco com maior potencial narrativo.
- Transforme temas genéricos em ÂNGULOS ÚNICOS (ex: "Produtividade" vira "Produtividade para TDAH").

2. SOFISTICAÇÃO E PÚBLICO:
- Atribua automaticamente um "Nível de Consciência/Sofisticação" (Básico, Intermediário, Avançado ou Especialista) se o input não definir um. Calibre o tom de voz para esse nível.

3. OTIMIZAÇÃO SEO/CONTENT (Módulo de Performance):
- Se o conteúdo for digital (vídeo, post, artigo, etc.), você DEVE incluir automaticamente palavras-chave estratégicas no Título e no Gancho inicial, visando maximizar o CTR e a busca orgânica.

4. REGRAS DO FRAMEWORK RTCROS:
- R - Role: Persona de autoridade máxima e registro interpretativo (ex: Mentor Prático, Coach Energético, Pensador Provocativo).
- T - Task: Verbos de ação claros e metas operacionais.
- C - Context: Dores do público, nuances de mercado e o "porquê" da tarefa.
- R - Restrictions: Foque em qualidade narrativa. Proíba clichês. AUDITORIA: Garanta que cada restrição contribua para o Objetivo Mensurável.
- O - Output: Formatação ultra-organizada, visual e pronta para uso.
- S - Style & Instruções Extras: Mood board verbal (Tom, Ritmo e Energia).

5. MODO DE OPERAÇÃO:
Não responda à ideia do usuário. Dê forma, profundidade e estratégia para que QUALQUER LLM consiga executá-la com perfeição. Você é a camada intermediária entre a imaginação e a execução de elite.`;

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

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro",
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
