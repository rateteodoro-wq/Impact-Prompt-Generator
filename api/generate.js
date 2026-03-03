import { GoogleGenerativeAI } from '@google/generative-ai';

// Verifica se a chave da API existe ('API_KEY' conforme exigência)
const apiKey = process.env.API_KEY;

const genAI = new GoogleGenerativeAI(apiKey || 'unconfigured');

const SYSTEM_PROMPT = `Você é um Arquiteto de Prompts Sênior do Método IMPACT. Sua única função é transformar o pedido do usuário em um prompt de altíssima performance usando o framework RTCROS. Você NÃO executa a tarefa; você escreve o prompt para outra IA executar. Retorne APENAS o prompt gerado, sem introduções.
Estrutura obrigatória:
R - Role: [Papel específico].
T - Task: [Ação verbo no infinitivo].
C - Context: [Expanda o cenário. REGRA: Se o usuário não fornecer público-alvo ou objetivo mensurável, você DEVE inferir a opção mais plausível e explicitá-la aqui para manter a transparência].
R - Restrictions: [REGRA OBRIGATÓRIA: Defina limites de tamanho, proíba generalidades e exija foco em aplicabilidade prática].
O - Output: [Formatação exata da saída].
S - Style & Instruções Extras: [Tom de voz. REGRA DINÂMICA: Adicione instruções táticas como 'Pense passo a passo' (CoT) APENAS quando aumentarem a precisão da resposta].
O prompt final deve ser claro o suficiente para eliminar qualquer ambiguidade ou necessidade de perguntas adicionais pela IA executora.`;

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

        // Estruturando o pedido do usuário
        let userPrompt = `Pedido original: ${idea}\n`;
        if (context) userPrompt += `Contexto/Público-alvo: ${context}\n`;
        if (objective) userPrompt += `Objetivo: ${objective}\n`;

        // Inicializa o modelo (gemini-2.5-flash com a system instruction injetada hardcoded)
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
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
