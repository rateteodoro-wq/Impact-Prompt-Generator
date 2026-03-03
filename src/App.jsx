import React, { useState } from 'react';
import { Copy, Check, Loader2, Sparkles, Wand2 } from 'lucide-react';

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
        setGeneratedPrompt('');

        try {
            // ✅ CONEXÃO COM A VERCEL: Chama sua função em api/generate.js
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idea, context, objective }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro na geração');
            }

            setGeneratedPrompt(data.prompt);
        } catch (err) {
            setError("Falha: " + err.message);
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
            {/* Header Minimalista Dark */}
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

            <main className="flex-1 max-w-7xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mt-4">

                {/* Lado Esquerdo: Formulário */}
                <div className="space-y-8">
                    <div>
                        <h2 className="text-2xl font-semibold mb-2 text-white">Transforme ideias cruas.</h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            O motor RTCROS cuidará de construir um prompt de altíssima performance.
                        </p>
                    </div>

                    <form onSubmit={handleGenerate} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                Ideia Crua / Pedido Principal *
                            </label>
                            <textarea
                                value={idea}
                                onChange={(e) => setIdea(e.target.value)}
                                required
                                rows={5}
                                className="w-full bg-[#111] border border-gray-800 rounded-lg p-4 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-none placeholder-gray-600"
                                placeholder="Ex: Quero um post de instagram sobre IA para advogados..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                value={context}
                                onChange={(e) => setContext(e.target.value)}
                                className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-3 text-sm text-gray-200 outline-none focus:border-indigo-500/50"
                                placeholder="Contexto (Opcional)"
                            />
                            <input
                                type="text"
                                value={objective}
                                onChange={(e) => setObjective(e.target.value)}
                                className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-3 text-sm text-gray-200 outline-none focus:border-indigo-500/50"
                                placeholder="Objetivo (Opcional)"
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !idea.trim()}
                            className="w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-100 disabled:opacity-50 transition-all font-medium py-3 px-4 rounded-lg text-sm"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
                            {loading ? 'Sintetizando...' : 'Gerar Prompt IMPACT'}
                        </button>
                    </form>
                </div>

                {/* Lado Direito: Resultado */}
                <div className="relative h-full min-h-[500px] flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Output Gerado</h3>
                        {generatedPrompt && (
                            <button
                                onClick={copyToClipboard}
                                className="flex items-center gap-2 text-xs font-medium
