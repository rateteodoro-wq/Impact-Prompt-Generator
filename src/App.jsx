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
                throw new Error("A chave de API (VITE_API_KEY) não está configurada no arquivo .env");
            }

            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash",
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
        <div className="min-h-screen bg-[#0a0a0a] text-gray-100 flex flex-col font-sans">
            {/* Header Minimalista */}
            <header className="border-b border-gray-800/60 bg-black/40 backdrop-blur-md sticky top-0 z-10 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                        <Sparkles size={18} />
                    </div>
                    <h1 className="text-lg font-medium tracking-tight text-gray-100">
                        IMPACT <span className="text-gray-400">Prompt Generator</span>
                    </h1>
                </div>
            </header>

            {/* Main Content: Layout Responsivo (Mobile: Coluna única, Desktop: Duas colunas) */}
            <main className="flex-1 max-w-7xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mt-4">

                {/* Lado Esquerdo: Formulário */}
                <div className="space-y-8">
                    <div>
                        <h2 className="text-2xl font-semibold mb-2">Transforme ideias cruas.</h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Descreva sua necessidade de forma vaga. O motor RTCROS cuidará de construir
                            um prompt de altíssima performance para LLMs.
                        </p>
                    </div>

                    <form onSubmit={handleGenerate} className="space-y-6">
                        {/* Input Principal */}
                        <div className="space-y-2">
                            <label htmlFor="idea" className="block text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                Ideia Crua / Pedido Principal *
                            </label>
                            <textarea
                                id="idea"
                                value={idea}
                                onChange={(e) => setIdea(e.target.value)}
                                required
                                rows={5}
                                className="w-full bg-[#111] border border-gray-800 rounded-lg p-4 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-none placeholder-gray-600"
                                placeholder="Ex: Quero um post de instagram sobre IA para advogados..."
                            />
                        </div>

                        {/* Configurações Opcionais - Grid Compacto */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="context" className="block text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                    Contexto / Público (Opcional)
                                </label>
                                <input
                                    type="text"
                                    id="context"
                                    value={context}
                                    onChange={(e) => setContext(e.target.value)}
                                    className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder-gray-600"
                                    placeholder="Ex: Advogados conservadores"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="objective" className="block text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                    Objetivo Mensurável (Opcional)
                                </label>
                                <input
                                    type="text"
                                    id="objective"
                                    value={objective}
                                    onChange={(e) => setObjective(e.target.value)}
                                    className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder-gray-600"
                                    placeholder="Ex: Gerar 10 leads no link da bio"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !idea.trim()}
                            className="w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white transition-all font-medium py-3 px-4 rounded-lg text-sm"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
                            {loading ? 'Sintetizando Prompt...' : 'Gerar Prompt IMPACT'}
                        </button>
                    </form>
                </div>

                {/* Lado Direito: Resultado */}
                <div className="relative h-full min-h-[500px] flex flex-col">
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent blur-3xl -z-10 rounded-full"></div>

                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Output Gerado</h3>

                        {generatedPrompt && (
                            <button
                                onClick={copyToClipboard}
                                className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-md hover:bg-gray-800"
                            >
                                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                                {copied ? 'Copiado!' : 'Copiar Prompt'}
                            </button>
                        )}
                    </div>

                    <div className="flex-1 bg-[#111]/80 backdrop-blur-md border border-gray-800 rounded-xl p-1 overflow-hidden group">
                        <div className="h-full bg-black rounded-lg p-5 overflow-y-auto max-h-[600px] font-mono text-sm leading-relaxed text-gray-300 relative">
                            {!generatedPrompt && !loading && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 p-6 text-center">
                                    <Wand2 size={24} className="mb-3 opacity-20" />
                                    <p>O prompt estruturado RTCROS aparecerá aqui.</p>
                                </div>
                            )}

                            {loading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Loader2 size={24} className="animate-spin text-indigo-500/50" />
                                </div>
                            )}

                            {generatedPrompt && !loading && (
                                <div className="whitespace-pre-wrap">
                                    {generatedPrompt}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}

export default App;
