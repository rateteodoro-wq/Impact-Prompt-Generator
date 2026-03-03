import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `Você é o "Impact Prompt Generator", orquestrador semântico de elite. Converta intenções brutas em prompts RTCROS de performance máxima.`;

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido.' });

    const apiKey = process.env.API_KEY; // <--- Verifique se na Vercel está exatamente assim
    if (!apiKey) return res.status(500).json({ error: 'API_KEY não configurada na Vercel.' });

    try {
        const { idea, context, objective } = req.body;
        const genAI = new GoogleGenerativeAI(apiKey);
        
        // Trocando para o modelo mais estável para testar a conexão
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash", 
        });

        const userPrompt = `Ideia: ${idea}\nContexto: ${context}\nObjetivo: ${objective}`;

        const result = await model.generateContent([
            { text: SYSTEM_PROMPT },
            { text: userPrompt }
        ]);

        const response = await result.response;
        return res.status(200).json({ prompt: response.text().trim() });

    } catch (error) {
        // Isso vai nos dizer o erro REAL do Google no console da Vercel
        console.error('ERRO GOOGLE:', error);
        return res.status(500).json({ 
            error: 'Erro no Google AI: ' + error.message 
        });
    }
}
