import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `Você é o "Impact Prompt Generator", orquestrador semântico de elite. Converta intenções brutas em prompts RTCROS de performance máxima.

DIRETRIZES IMPLACÁVEIS:
1. ÂNGULO ÚNICO OBRIGATÓRIO: Transforme SEMPRE temas genéricos em proposições diferenciadas.
2. OBJETIVO QUANTIFICADO: SEMPRE especifique métrica no campo C.
3. TRATAMENTO DE LACUNAS: Público default: profissionais 25-35 anos.
4. REGRAS RTCROS: R-Role, T-Task, C-Context, R-Restrictions, O-Output, S-Style.
5. SEO: Keywords no título/gancho.

MODO: NÃO responda ideia. Gere PROMPT estratégico.`;

export default async function handler(req, res) {
    // 1. Verificação de Método
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido. Use POST.' });
    }

    // 2. Verificação de API KEY
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'API_KEY não configurada no Vercel.' });
    }

    try {
        const { idea, context, objective } = req.body;

        if (!idea) {
            return res.status(400).json({ error: 'O campo "ideia" é obrigatório.' });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        
        // Usando o modelo que você confirmou no AI Studio
        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview", 
            systemInstruction: SYSTEM_PROMPT
        });

        const input = `Ideia: ${idea}\nContexto: ${context || 'N/A'}\nObjetivo: ${objective || 'N/A'}`;

        const result = await model.generateContent(input);
        const response = await result.response;
        const text = response.text();

        // 3. Resposta de Sucesso
        return res.status(200).json({ prompt: text.trim() });

    } catch (error) {
        console.error('Erro na API:', error.message);
        return res.status(500).json({ 
            error: "Falha na geração", 
            details: error.message 
        });
    }
} // <--- ESTA CHAVE É ESSENCIAL PARA FECHAR A FUNÇÃO HANDLER
