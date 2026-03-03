import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `Você é o "Impact Prompt Generator" v3.1. Orquestrador semântico de elite. Converta intenções brutas em prompts RTCROS de performance máxima para modelos de Fronteira (Gemini 3).`;

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido.' });

    const apiKey = process.env.API_KEY; 
    if (!apiKey) return res.status(500).json({ error: 'Erro: API_KEY não configurada na Vercel.' });

    try {
        const { idea, context, objective } = req.body;
        const genAI = new GoogleGenerativeAI(apiKey);
       // Mude para o Flash Lite 3.1 (O modelo mais rápido e disponível hoje)
const model = genAI.getGenerativeModel({
    model: "gemini-3.1-flash-lite-preview" 
});    

        const promptFinal = `${SYSTEM_PROMPT}\n\nUSER REQUEST:\nIdeia: ${idea}\nContexto: ${context}\nObjetivo: ${objective}`;

        // Chamada compatível com o SDK 0.21.0 que você tem
        const result = await model.generateContent(promptFinal);
        const response = await result.response;
        
        return res.status(200).json({ prompt: response.text().trim() });

    } catch (error) {
        console.error('ERRO GOOGLE 2026:', error);
        return res.status(500).json({ 
            error: 'Erro no motor Gemini 3: ' + error.message 
        });
    }
}     
