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

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idea, context, objective })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Erro ${response.status}`);
            }

            const data = await response.json();
            setGeneratedPrompt(data.prompt);
        } catch (err) {
            setError(err.message || 'Falha ao gerar prompt');
            console.error('Erro:', err);
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
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>

                <div className="lg:sticky lg:top-24 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase">Prompt Gerado</h3>
                        {generatedPrompt && (
                            <button 
                                onClick={copyToClipboard}
                                className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                            >
                                {copied ? <Check size={14} /> : <Copy size={14} />}
                                {copied ? 'Copiado!' : 'Copiar'}
                            </button>
                        )}
                    </div>
                    
                    <div className="min-h-[300px] w-full bg-slate-900 rounded-2xl p-6 text-slate-300 text-sm font-mono leading-relaxed shadow-xl border border-slate-800 relative overflow-hidden">
                        {generatedPrompt ? (
                            <div className="whitespace-pre-wrap">{generatedPrompt}</div>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 p-8 text-center space-y-3">
                                <Sparkles size={32} className="opacity-20" />
                                <p>Preencha os dados e gere seu prompt de alto impacto.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;
