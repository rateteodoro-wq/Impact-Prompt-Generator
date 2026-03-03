import React, { useState } from 'react';
import { Copy, Check, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `Você é um Arquiteto de Prompts Sênior do Método IMPACT. Sua única função é transformar o pedido do usuário em um prompt de altíssima performance usando o framework RTCROS. Você NÃO executa a tarefa; você escreve o prompt para outra IA executar. Retorne APENAS o prompt gerado, sem introduções.
Estrutura obrigatória:
R - Role: [Papel específico].
T - Task: [Ação verbo no infinitivo].
C - Context: [Expanda o cenário. REGRA: Se o usuário não fornecer público-alvo ou objetivo mensurável, você DEVE inferir a opção mais plausível e explicitá-la aqui para manter a transparência].
R - Restrictions: [REGRA OBRIGATÓRIA: Defina limites de tamanho, proíba generalidades e exija foco em aplicabilidade prática].
O - Output: [Formatação exata da saída].
S - Style & Instruções Extras: [Tom de voz. REGRA DINÂMICA: Adicione instruções táticas como 'Pense passo a passo' (CoT) APENAS quando aumentarem a precisão da resposta].
O prompt final deve ser claro o suficiente para eliminar qualquer ambiguidade ou necessidade de perguntas adicionais pela IA executora.`;

function App() {
    const [idea, setIdea] = useState('');
    const [context, setContext] = useState('');
    const [objective, setObjective] = useState('');
    const [generatedPrompt, setGeneratedPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!idea.trim()) return;

        setLoading(true);
        setError('');

        try {
            const apiKey = import.meta.env.VITE_API_KEY;
            if (!apiKey) {
                throw new Error("Chave de API não configurada.");
            }

            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-pro-preview-12-17", 
                systemInstruction: SYSTEM_PROMPT
            });

            let userPrompt = `Pedido original: ${idea}\n`;
            if (context) userPrompt += `Contexto/Público-alvo: ${context}\n`;
            if (objective) userPrompt += `Objetivo: ${objective}\n`;

            const result = await model.generateContent(userPrompt);
            const response = await result.response;
            const text = response.text();

            setGeneratedPrompt(text.trim());
        } catch (err) {
            setError(err.message || 'Falha ao comunicar com a IA');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (!generatedPrompt) return;
        navigator.clipboard.writeText(generatedPrompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
            <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-10 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                        <Sparkles size={18} />
                    </div>
                    <h1 className="text-lg font-bold tracking-tight text-slate-900">
                        IMPACT <span className="text-indigo-600">Prompt Generator</span>
                    </h1>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mt-4">
                <div className="space-y-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Sintetize sua estratégia.</h2>
                        <p className="text-slate-600 text-base leading-relaxed">
                            O motor <span className="font-semibold text-slate-900">RTCROS</span> transforma pedidos vagos em comandos de elite.
                        </p>
                    </div>

                    <form onSubmit={handleGenerate} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-xs font-bold tracking-wider text-slate-500 uppercase">Ideia Crua *</label>
                            <textarea
                                value={idea}
                                onChange={(e) => setIdea(e.target.value)}
                                required
                                rows={5}
                                className="w-full bg-white border border-slate-300 rounded-xl p-4 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
                                placeholder="Ex: Post sobre marcenaria..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                value={context}
                                onChange={(e) => setContext(e.target.value)}
                                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm shadow-sm"
                                placeholder="Contexto (Opcional)"
                            />
                            <input
                                type="text"
                                value={objective}
                                onChange={(e) => setObjective(e.target.value)}
                                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm shadow-sm"
                                placeholder="Objetivo (Opcional)"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !idea.trim()}
                            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-all font-bold py-4 px-4 rounded-xl text-sm shadow-lg shadow-indigo-200"
                        >
                            {loading ? <Loader2 size={20} className="animate-spin" /> : <Wand2 size={20} />}
                            {loading ? 'Arquitetando...' : 'Gerar Prompt IMPACT'}
                        </button>
                    </form>
                </div>

                <div className="relative h-full min-h-[500px] flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase">Output</h3>
                        {generatedPrompt && (
                            <button
                                onClick={copyToClipboard}
                                className={`flex items-center gap-2 text-xs font-bold transition-all px-4 py-2 rounded-full shadow-sm ${
                                    copied ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-white text-slate-700 border border-slate-200'
                                }`}
                            >
                                {copied ? <Check size={14} /> : <Copy size={14} />}
                                {copied ? 'Copiado!' : 'Copiar'}
                            </button>
                        )}
                    </div>

                    <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col">
                        <div className="flex-1 p-6 overflow-y-auto font-mono text-sm text-slate-700 bg-slate-50/30">
                            {loading ? (
                                <div className="h-full flex items-center justify-center animate-pulse text-slate-400">Gerando...</div>
                            ) : (
                                <div className="whitespace-pre-wrap">{generatedPrompt || "O prompt aparecerá aqui."}</div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;
