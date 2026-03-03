import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `Você é o "Impact Prompt Generator"...`; // (Mantenha seu prompt)

export default async function handler(req, res) {
    const apiKey = process.env.API_KEY;

    if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });
    if (!apiKey) return res.status(500).json({ error: 'API_KEY ausente no ambiente do servidor.' });

    try {
        const { idea, context, objective } = req.body;
        const genAI = new GoogleGenerativeAI(apiKey);

        // ATUALIZADO PARA O MODELO 2026
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash", // Nome oficial atualizado
            systemInstruction: SYSTEM_PROMPT
        });

        // Montando a query de forma mais limpa para o modelo
        const input = `Gerar prompt para: ${idea}. Contexto: ${context || 'N/A'}. Objetivo: ${objective || 'N/A'}.`;

        const result = await model.generateContent(input);
        
        // Em 2026, a resposta é acessada diretamente assim:
        const text = result.response.text();

        return res.status(200).json({ prompt: text.trim() });

    } catch (error) {
        console.error('ERRO NA API:', error.message);
        
        // Isso impede o erro de "Unexpected token A" no navegador
        return res.status(500).json({ 
            error: "Falha na geração", 
            details: error.message 
        });
    }
}
