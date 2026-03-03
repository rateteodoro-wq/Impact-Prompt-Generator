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
        const genAI = new GoogleGenerativeAI(apiKey);

        // 1. Tente usar o alias mais estável
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash", // Teste com esse primeiro!
            systemInstruction: SYSTEM_PROMPT
        });

        const input = `Ideia: ${idea}\nContexto: ${context || ''}\nObjetivo: ${objective || ''}`;

        // 2. Em 2026, algumas versões do SDK pedem o await direto no response
        const result = await model.generateContent(input);
        const text = result.response.text(); 

        return res.status(200).json({ prompt: text });

    } catch (error) {
        // ESSA LINHA É A CHAVE: Ela vai cuspir o erro real no console do Vercel
        console.error('ERRO REAL DO GOOGLE:', error.message);
        
        return res.status(500).json({ 
            error: "Falha na comunicação com a IA",
            details: error.message 
        });
    }
