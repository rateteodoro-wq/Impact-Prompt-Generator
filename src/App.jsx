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
            // Corrigi para o modelo estável mais atual (Gemini 1.5 Pro ou Flash conforme sua cota)
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash", 
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
            {/* Header Minimalista Light */}
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

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mt-4">

                {/* Lado Esquerdo: Formulário */}
                <div className="space-y-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Sintetize sua estratégia.</h2>
                        <p className="text-slate-600 text-base leading-relaxed">
                            O motor <span className="font-semibold text-slate-900">RTCROS</span> transforma pedidos vagos em comandos de elite para qualquer IA.
                        </p>
                    </div>

                    <form onSubmit={handleGenerate} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="idea" className="block text-xs font-bold tracking-wider text-slate-500 uppercase">
                                Ideia Crua / Pedido Principal *
                            </label>
                            <textarea
                                id="idea"
                                value={idea}
                                onChange={(e) => setIdea(e.target.value)}
                                required
                                rows={5}
                                className="w-full bg-white border border-slate-300 rounded-xl p-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none shadow-sm placeholder-slate-400"
                                placeholder="Ex: Quero um post de instagram sobre IA para advogados..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="context" className="block text-xs font-bold tracking-wider text-slate-500 uppercase">
                                    Contexto / Público
                                </label>
                                <input
                                    type="text"
                                    id="context"
                                    value={context}
                                    onChange={(e) => setContext(e.target.value)}
                                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                                    placeholder="Ex: Advogados seniores"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="objective" className="block text-xs font-bold tracking-wider text-slate-500 uppercase">
                                    Objetivo Mensurável
                                </label>
                                <input
                                    type="text"
                                    id="objective"
                                    value={objective}
                                    onChange={(e) => setObjective(e.target.value)}
                                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                                    placeholder="Ex: 50 salvamentos"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !idea.trim()}
                            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold py-4 px-4 rounded-xl text-sm shadow-lg shadow-indigo-200"
                        >
                            {loading ? <Loader2 size={20} className="animate-spin" /> : <Wand2 size={20} />}
                            {loading ? 'Arquitetando Prompt...' : 'Gerar Prompt IMPACT'}
                        </button>
                    </form>
                </div>

                {/* Lado Direito: Resultado (Estilo Card) */}
                <div className="relative h-full min-h-[500px] flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase">Output Estruturado</h3>

                        {generatedPrompt && (
                            <button
