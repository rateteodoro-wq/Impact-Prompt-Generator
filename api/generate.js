import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `Você é o "Impact Prompt Generator", orquestrador semântico de elite. Converta intenções brutas em prompts RTCROS de performance máxima.`;

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido.' });

    const apiKey = process.env.API_KEY; 
    if (!apiKey) return res.status(500).json({ error: 'API_KEY não configurada na Vercel.' });

    try {
        const { idea, context, objective } = req.body;
        const genAI = new GoogleGenerativeAI(apiKey);
        
        // ✅ VERSÃO MODERNA E ESTÁVEL (2.0 Flash)
        // Se quiser testar o Pro, use "gemini-2.0-pro-exp-02-05"
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash", 
        });

        const userPrompt = `Ideia: ${idea}\nContexto: ${context}\nObjetivo: ${objective}`;

        // No SDK mais novo, o envio é preferencialmente assim:
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: `${SYSTEM_PROMPT}\n\n${userPrompt}` }] }],
        });

        const response = await result.response;
        return res.status(200).json({ prompt: response.text().trim() });

    } catch (error) {
        console.error('ERRO GOOGLE:', error);
        return res.status(500).json({ 
            error: 'Erro no motor Gemini: ' + error.message 
        });
    }
}
