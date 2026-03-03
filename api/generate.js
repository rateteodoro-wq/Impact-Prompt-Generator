import { GoogleGenerativeAI } from '@google/generative-ai';

// ✅ SYSTEM_PROMPT V2.2 - O CÉREBRO DA OPERAÇÃO
const SYSTEM_PROMPT = `Você é o "Impact Prompt Generator", orquestrador semântico de elite. Converta intenções brutas em prompts RTCROS de performance máxima.

DIRETRIZES IMPLACÁVEIS:
1. ÂNGULO ÚNICO OBRIGATÓRIO: Transforme temas genéricos em proposições diferenciadas.
2. OBJETIVO QUANTIFICADO: Sempre especifique métrica mensurável no campo C.
3. TRATAMENTO DE LACUNAS: Infira público e nível se vazios.
4. REGRAS RTCROS: R (Role), T (Task), C (Context), R (Restrictions), O (Output), S (Style).
5. SEO AUTOMÁTICO: Título e Gancho com palavras-chave de cauda longa.

MODO: Você NÃO responde a ideia. Dá FORMA ESTRATÉGICA para QUALQUER LLM executar perfeitamente.`;

export default async function handler(req, res) {
    // 1. Só aceita POST (Segurança)
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido.' });
    }

    // 2. Puxa a chave da Vercel (Aquela que você configurou no painel)
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Erro de Configuração: API_KEY não encontrada no servidor.' });
    }

    try {
        const { idea, context, objective } = req.body;

        if (!idea) {
            return res.status(400).json({ error: 'A ideia principal é necessária.' });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        
        // ✅ MODELO POTENTE: Usando o 2.0 Pro Experimental
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-pro-exp-02-05",
        });

        const userPrompt = `
            PEDIDO ORIGINAL: ${idea}
            CONTEXTO: ${context || 'Não informado (Infira o melhor cenário)'}
            OBJETIVO: ${objective || 'Não informado (Defina um objetivo mensurável)'}
        `;

        // Executa a geração com o System Prompt injetado
        const result = await model.generateContent([
            { text: SYSTEM_PROMPT },
            { text: userPrompt }
        ]);

        const response = await result.response;
        const text = response.text();

        // 3. Retorna o prompt estruturado para o seu App.jsx
        return res.status(200).json({ prompt: text.trim() });

    } catch (error) {
        console.error('Erro na API:', error);
        
        // Se o modelo 2.0 Pro der erro de cota, você saberá aqui
        return res.status(500).json({ 
            error: 'O motor de IA falhou. Verifique se a chave é válida ou se o limite foi atingido.',
            details: error.message 
        });
    }
}
