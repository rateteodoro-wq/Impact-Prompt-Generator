import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `Você é o "Impact Prompt Generator", orquestrador semântico de elite. Converta intenções brutas em prompts RTCROS de performance máxima.`;

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido.' });

    const apiKey = process.env.API_KEY; 
    if (!apiKey) return res.status(500).json({ error: 'API_KEY não configurada na Vercel.' });

    try {
        const { idea, context, objective } = req.body;
        const genAI = new GoogleGenerativeAI(apiKey);
        
        // ✅ O ID EXATO PARA O 2.0 PRO EM 2026
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-pro-exp-02-05" 
        });

        // Montagem direta do conteúdo
        const promptFinal = `${SYSTEM_PROMPT}\n\nUSER REQUEST:\nIdeia: ${idea}\nContexto: ${context}\nObjetivo: ${objective}`;

        const result = await model.generateContent(promptFinal);
        const response = await result.response;
        const text = response.text();

        if (!text) throw new Error("Resposta vazia da IA.");

        return res.status(200).json({ prompt: text.trim() });

    } catch (error) {
        console.error('ERRO DETALHADO:', error);
        
        // Tratamento amigável do erro
        return res.status(500).json({ 
            error: 'Erro no motor Gemini 2.0 Pro: ' + error.message 
        });
    }
}
