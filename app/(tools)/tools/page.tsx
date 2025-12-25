"use client";

import { useState } from "react";
import { Copy, Trash2, Check, Code2, Hash, Wand2, Shrink, Zap } from "lucide-react";
import * as prettier from "prettier/standalone";
import estree from "prettier/plugins/estree";
import babel from "prettier/plugins/babel";
import html from "prettier/plugins/html";
import postcss from "prettier/plugins/postcss";
import { minify as terserMinify } from "terser";

export default function PerfectToolsPage() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleBeautify = async (lang: string) => {
        if (!input.trim()) return;
        setLoading(true);
        try {
            // Map common names to Prettier's specific parser names
            const parserMap: Record<string, string> = {
                'js': 'babel',
                'babel': 'babel',
                'css': 'css',
                'html': 'html',
                'json': 'json'
            };

            const formatted = await prettier.format(input, {
                parser: parserMap[lang] || lang,
                plugins: [babel, estree, html, postcss],
                printWidth: 80,
                semi: true,
                singleQuote: true,
            });
            setOutput(formatted);
        } catch (e: any) {
            setOutput(`Beautify Error: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleUglify = async () => {
        if (!input.trim()) return;
        setLoading(true);
        try {
            const result = await terserMinify(input, {
                mangle: { toplevel: true },
                compress: { dead_code: true, drop_console: true },
            });
            setOutput(result.code || "");
        } catch (e: any) {
            setOutput(`Uglify Error: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleMinify = (lang: 'json' | 'html' | 'js' | 'css') => {
        if (!input.trim()) return;
        try {
            let processed = input;

            // Strip JS/CSS comments using the constructor to avoid editor errors
            processed = processed.replace(new RegExp('\\/\\*[\\s\\S]*?\\*\\/|([^\\\\:]|^)\\/\\/.*$', 'gm'), '$1');

            // Strip HTML comments using the constructor
            processed = processed.replace(new RegExp('', 'g'), '');

            if (lang === 'json') {
                setOutput(JSON.stringify(JSON.parse(processed)));
            } else {
                const minified = processed
                    .replace(/\n/g, ' ')
                    .replace(/\s+/g, ' ')
                    .replace(/\s?([+\-*/%!=<>|&{}[\];:,])\s?/g, '$1')
                    .trim();

                setOutput(lang === 'html' ? minified.replace(/>\s+</g, '><') : minified);
            }
        } catch (e) {
            setOutput("Error: Invalid Syntax");
        }
    };

    const handleBase64 = (mode: 'to' | 'from') => {
        try {
            setOutput(mode === 'to' ? btoa(input) : atob(input));
        } catch (e) { setOutput("Error: Invalid Base64/String"); }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Accuracy: Calculating Bytes instead of Characters
    const getByteSize = (str: string) => new Blob([str]).size;

    const stats = input && output ? {
        saved: getByteSize(input) - getByteSize(output),
        percentage: (((getByteSize(input) - getByteSize(output)) / getByteSize(input)) * 100).toFixed(1)
    } : null;

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 p-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">DevBox Studio</h1>
                    <p className="text-zinc-500 text-sm font-medium tracking-tight">Professional Code Transformation</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => { setInput(""); setOutput(""); }} className="p-2.5 hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors">
                        <Trash2 size={20} />
                    </button>
                    <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl font-bold hover:bg-zinc-200 transition-all active:scale-95 shadow-lg shadow-white/5"
                    >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                        {copied ? "Copied" : "Copy Result"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[55vh]">
                <div className="flex flex-col border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950/50">
                    <div className="bg-zinc-900/50 px-4 py-2 text-[10px] font-bold text-zinc-500 tracking-widest border-b border-zinc-800">SOURCE</div>
                    <textarea
                        value={input} onChange={(e) => setInput(e.target.value)}
                        className="flex-1 p-5 bg-transparent outline-none font-mono text-sm resize-none placeholder:text-zinc-800"
                        placeholder="Paste code..."
                    />
                </div>

                <div className="flex flex-col border border-zinc-800 rounded-2xl overflow-hidden bg-black/40 relative">
    {/* Header with Integrated Stats */}
    <div className="bg-zinc-900/50 px-4 py-2 border-b border-zinc-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">Result</span>
            
            {/* Inline Stats Badge */}
            {stats && Number(stats.saved) > 0 && (
                <div className="flex gap-1.5 animate-in fade-in zoom-in duration-300">
                    <span className="bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded text-[9px] font-black border border-emerald-500/20">
                        -{stats.saved} B
                    </span>
                    <span className="bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded text-[9px] font-black border border-blue-500/20">
                        {stats.percentage}%
                    </span>
                </div>
            )}
        </div>
        
        {loading && <div className="text-blue-400 text-[9px] font-bold animate-pulse tracking-tighter">PROCESSING...</div>}
    </div>

    <pre className="flex-1 p-5 font-mono text-sm overflow-auto whitespace-pre-wrap text-blue-300">
        {output || "// Awaiting transformation..."}
    </pre>
</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-zinc-900/20 p-6 rounded-3xl border border-zinc-800">
                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2"><Shrink size={14} /> Minify & Uglify</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {['json', 'html', 'js', 'css'].map((l) => (
                            <button key={l} onClick={() => handleMinify(l as any)} className="bg-zinc-800 hover:bg-zinc-700 py-2 rounded-lg text-xs font-bold uppercase">{l}</button>
                        ))}
                        <button onClick={handleUglify} className="col-span-2 bg-orange-600/10 text-orange-400 border border-orange-600/20 hover:bg-orange-600/30 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                            <Zap size={12} fill="currentColor" /> Terser Uglify
                        </button>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2"><Wand2 size={14} /> Beautify</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {['json', 'html', 'js', 'css'].map((l) => (
                            <button key={l} onClick={() => handleBeautify(l)} className="bg-blue-600/10 text-blue-400 border border-blue-600/20 hover:bg-blue-600/20 py-2 rounded-lg text-xs font-bold uppercase">{l}</button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2"><Hash size={14} /> Encoding</h3>
                    <div className="flex flex-col gap-2">
                        <button onClick={() => handleBase64('to')} className="w-full bg-emerald-600/10 text-emerald-400 border border-emerald-600/20 hover:bg-emerald-600/20 py-2.5 rounded-lg text-xs font-bold uppercase">To Base64</button>
                        <button onClick={() => handleBase64('from')} className="w-full bg-emerald-600/10 text-emerald-400 border border-emerald-600/20 hover:bg-emerald-600/20 py-2.5 rounded-lg text-xs font-bold uppercase">From Base64</button>
                    </div>
                </div>
            </div>
        </div>
    );
}