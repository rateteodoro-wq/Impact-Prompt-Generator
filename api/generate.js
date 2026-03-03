import OpenAI from 'openai';

export default async function handler(req, res) {
    const apiKey = process.env.OPENAI_API_KEY; // Nome que você salvou no Vercel
    const openai = new OpenAI({ apiKey });

    if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });
    if (!apiKey) return res.status(500).json({ error: 'Chave não encontrada no Vercel' });

    try {
        const { idea, context, objective } = req.body;
        
        const completion = await openai.chat.completions.create({
            model: "gpt-4o", // Ou gpt-3.5-turbo
            messages: [
                { role: "system", content: "Você é o Impact Prompt Generator..." },
                { role: "user", content: `Ideia: ${idea}, Contexto: ${context}, Objetivo: ${objective}` }
            ],
        });

        return res.status(200).json({ prompt: completion.choices[0].message.content });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
