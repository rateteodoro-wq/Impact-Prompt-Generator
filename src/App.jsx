import React, { useState } from 'react';
import { Copy, Check, Loader2, Sparkles, Wand2 } from 'lucide-react';

const gold = '#FFD700';
const goldDim = '#B8960C';
const goldFaint = 'rgba(255, 215, 0, 0.15)';
const goldBorder = 'rgba(255, 215, 0, 0.25)';

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
        <div className="min-h-screen flex flex-col font-sans" style={{ backgroundColor: '#0a0a0a', color: gold }}>
            <header className="backdrop-blur-md sticky top-0 z-10 px-6 py-4" style={{ borderBottom: `1px solid ${goldBorder}`, backgroundColor: 'rgba(0,0,0,0.4)' }}>
                <div className="max-w-7xl mx-auto flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: goldFaint, color: gold }}>
                        <Sparkles size={18} />
                    </div>
                    <h1 className="font-medium tracking-tight" style={{ color: gold, fontSize: '28px' }}>
    IMPACT <span style={{ color: goldDim }}>Prompt Generator</span>
                    </h1>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mt-4">
                <div className="space-y-8">
                    <div>
                        <h2 className="text-2xl font-semibold mb-2" style={{ color: gold }}>Transforme ideias cruas.</h2>
                        <p className="text-sm leading-relaxed" style={{ color: goldDim }}>
                            O motor RTCROS cuidará de construir um prompt de altíssima performance.
                        </p>
                    </div>

                    <form onSubmit={handleGenerate} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-xs font-semibold tracking-wider uppercase" style={{ color: goldDim }}>
                                Ideia Crua / Pedido Principal *
                            </label>
                            <textarea
                                value={idea}
                                onChange={(e) => setIdea(e.target.value)}
                                required
                                rows={5}
                                className="w-full rounded-lg p-4 text-sm transition-all resize-none focus:outline-none"
                                style={{
                                    backgroundColor: '#111',
                                    border: `1px solid ${goldBorder}`,
                                    color: gold,
                                }}
                                placeholder="Ex: Quero um post de instagram sobre IA para advogados..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                value={context}
                                onChange={(e) => setContext(e.target.value)}
                                className="w-full rounded-lg px-4 py-3 text-sm outline-none"
                                style={{
                                    backgroundColor: '#111',
                                    border: `1px solid ${goldBorder}`,
                                    color: gold,
                                }}
                                placeholder="Contexto (Opcional)"
                            />
                            <input
                                type="text"
                                value={objective}
                                onChange={(e) => setObjective(e.target.value)}
                                className="w-full rounded-lg px-4 py-3 text-sm outline-none"
                                style={{
                                    backgroundColor: '#111',
                                    border: `1px solid ${goldBorder}`,
                                    color: gold,
                                }}
                                placeholder="Objetivo (Opcional)"
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-md text-sm" style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !idea.trim()}
                            className="w-full flex items-center justify-center gap-2 font-medium py-3 px-4 rounded-lg text-sm transition-all disabled:opacity-50"
                            style={{ backgroundColor: gold, color: '#000' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e6c200'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = gold}
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
                            {loading ? 'Sintetizando...' : 'Gerar Prompt IMPACT'}
                        </button>
                    </form>
                </div>

                <div className="relative h-full min-h-[500px] flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-semibold tracking-wider uppercase" style={{ color: goldDim }}>Output Gerado</h3>
                        {generatedPrompt && (
                            <button
                                onClick={copyToClipboard}
                                className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
                                style={{ color: goldDim }}
                                onMouseEnter={e => { e.currentTarget.style.color = gold; e.currentTarget.style.backgroundColor = goldFaint; }}
                                onMouseLeave={e => { e.currentTarget.style.color = goldDim; e.currentTarget.style.backgroundColor = 'transparent'; }}
                            >
                                {copied ? <Check size={14} style={{ color: '#4ade80' }} /> : <Copy size={14} />}
                                {copied ? 'Copiado!' : 'Copiar'}
                            </button>
                        )}
                    </div>

                    <div className="flex-1 backdrop-blur-md rounded-xl p-1 overflow-hidden" style={{ backgroundColor: 'rgba(17,17,17,0.8)', border: `1px solid ${goldBorder}` }}>
                        <div className="h-full rounded-lg p-5 overflow-y-auto font-mono text-sm leading-relaxed" style={{ backgroundColor: '#000', color: gold }}>
                            {!generatedPrompt && !loading && (
                                <div className="h-full flex flex-col items-center justify-center text-center" style={{ color: 'rgba(184,150,12,0.4)' }}>
                                    <Wand2 size={24} className="mb-3 opacity-20" />
                                    <p>O prompt RTCROS aparecerá aqui.</p>
                                </div>
                            )}
                            {loading && (
                                <div className="h-full flex items-center justify-center animate-pulse" style={{ color: 'rgba(255,215,0,0.5)' }}>
                                    Gerando...
                                </div>
                            )}
                            {generatedPrompt && !loading && (
                                <div className="whitespace-pre-wrap">{generatedPrompt}</div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;
