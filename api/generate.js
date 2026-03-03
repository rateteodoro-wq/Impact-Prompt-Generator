import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `Você é o "Impact Prompt Generator", orquestrador semântico de elite. Converta intenções brutas em prompts RTCROS de performance máxima.`; // (Mantenha seu prompt original completo aqui)

export default async function handler(req, res) {
    // Garante que o Vercel não tente processar requisições que não sejam POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const apiKey = process.env.API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Erro: Variável API_KEY não configurada no painel do Vercel.' });
    }

    try {
        const { idea, context, objective } = req.body;
        
        // Inicializa o SDK dentro do handler
        const genAI = new GoogleGenerativeAI(apiKey);

        // Configuração do Modelo Gemini 3
        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview", 
            systemInstruction: SYSTEM_PROMPT
        });

        const input = `Ideia: ${idea}\nContexto: ${context || 'N/A'}\nObjetivo: ${objective || 'N/A'}`;

        const result = await model.generateContent(input);
        const response = await result.response;
        const text = response.text();

        // Retorno de Sucesso sempre como JSON
        return res.status(200).json({ prompt: text.trim() });

    } catch (error) {
        console.error('Erro na API Gemini:', error);
        
        // O segredo está aqui: sempre retornar um JSON, mesmo no erro
        // Isso evita o erro de "Unexpected token A" no navegador
        return res.status(500).json({ 
            error: "Falha na geração do prompt",
            message: error.message 
        });
    }
}
