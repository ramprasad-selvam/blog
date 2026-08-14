"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Copy, Trash2, Check, Code2, Hash, Wand2, Shrink, Zap, ArrowRight, ArrowRightLeft, Calculator, Clock3, Coins, GitCompare, Image as ImageIcon, Share2, TableProperties, FileCode2, ChevronDown } from "lucide-react";
import * as prettier from "prettier/standalone";
import estree from "prettier/plugins/estree";
import babel from "prettier/plugins/babel";
import html from "prettier/plugins/html";
import postcss from "prettier/plugins/postcss";
import { minify as terserMinify } from "terser";

const toolCards = [
    { name: "Code Studio", description: "Format, compress, and encode source.", href: "/tools/code", icon: Code2, accent: "text-blue-300", surface: "from-blue-400/15" },
    { name: "Metal Terminal", description: "Track live bullion rates and trends.", href: "/tools/metal", icon: Coins, accent: "text-amber-300", surface: "from-amber-400/15" },
    { name: "Unit Forge", description: "Convert everyday and technical units.", href: "/tools/converter", icon: ArrowRightLeft, accent: "text-cyan-300", surface: "from-cyan-400/15" },
    { name: "Diff Checker", description: "Compare two versions of any code.", href: "/tools/diff", icon: GitCompare, accent: "text-violet-300", surface: "from-violet-400/15" },
    { name: "World Clock", description: "Keep multiple time zones in view.", href: "/tools/clock", icon: Clock3, accent: "text-blue-300", surface: "from-blue-400/15" },
    { name: "JSON Inspector", description: "Filter, sort, and export data.", href: "/tools/json-table", icon: TableProperties, accent: "text-emerald-300", surface: "from-emerald-400/15" },
    { name: "Loan Solver", description: "Solve EMI and interest rate scenarios.", href: "/tools/calc", icon: Calculator, accent: "text-rose-300", surface: "from-rose-400/15" },
    { name: "Asset Creator", description: "Generate gradients and image assets.", href: "/tools/image", icon: ImageIcon, accent: "text-fuchsia-300", surface: "from-fuchsia-400/15" },
    { name: "QR Share", description: "Turn text or links into a QR code.", href: "/tools/share", icon: Share2, accent: "text-lime-300", surface: "from-lime-400/15" },
];

export default function PerfectToolsPage() {
    const pathname = usePathname();
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState<'json' | 'html' | 'js' | 'css'>('json');
    const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

    const languageOptions = [
        { value: 'json' as const, label: 'JSON' },
        { value: 'html' as const, label: 'HTML' },
        { value: 'js' as const, label: 'JavaScript' },
        { value: 'css' as const, label: 'CSS' },
    ];

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
            processed = processed.replace(/<!--[\s\S]*?-->/g, '');

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
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 px-1 py-2 sm:px-2 lg:py-4">
            {pathname === "/tools" && <>
            <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-blue-500/15 via-zinc-950 to-zinc-950 p-5 sm:p-8 lg:p-10">
                <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
                <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <div className="mb-4 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-blue-300">
                            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                            9 focused utilities
                        </div>
                        <h1 className="text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">A sharper workspace for everyday engineering.</h1>
                        <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">Transform code, inspect data, calculate decisions, and create assets without leaving the browser.</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3 text-xs font-bold text-zinc-400">
                        <span className="rounded-full border border-white/10 bg-black/30 px-3 py-2">Local-first</span>
                        <span className="rounded-full border border-white/10 bg-black/30 px-3 py-2">No account</span>
                    </div>
                </div>
            </section>

            <section>
                <div className="mb-4 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-600">Toolbox</p>
                        <h2 className="mt-1 text-xl font-bold tracking-tight text-white">Pick a starting point</h2>
                    </div>
                    <span className="hidden text-xs text-zinc-600 sm:block">Built for quick, repeatable tasks</span>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {toolCards.map((tool) => (
                        <Link key={tool.href} href={tool.href} className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${tool.surface} via-zinc-950/90 to-zinc-950 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-white/20`}>
                            <div className="flex items-start justify-between gap-3">
                                <tool.icon size={19} className={tool.accent} />
                                <ArrowRight size={15} className="text-zinc-700 transition group-hover:translate-x-1 group-hover:text-white" />
                            </div>
                            <h3 className="mt-7 text-sm font-bold text-white">{tool.name}</h3>
                            <p className="mt-1 text-xs leading-5 text-zinc-500">{tool.description}</p>
                        </Link>
                    ))}
                </div>
            </section>
            </>}

            {pathname === "/tools/code" && <section className="space-y-6">
                <header className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Code utility</p>
                        <h1 className="flex items-center gap-3 text-3xl font-black tracking-tight text-white sm:text-4xl"><FileCode2 className="text-blue-500" /> Code Studio</h1>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">Format, compress, encode, and copy source code in a focused browser workspace.</p>
                    </div>
                    <div className="relative flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-bold text-zinc-400">
                        <span className="text-[9px] uppercase tracking-widest text-zinc-600">Format as</span>
                        <button type="button" onClick={() => setIsLanguageMenuOpen(prev => !prev)} aria-haspopup="listbox" aria-expanded={isLanguageMenuOpen} className="flex min-w-28 items-center justify-between gap-3 rounded-lg px-2 py-1 text-left font-bold text-zinc-200 hover:bg-white/10">
                            {languageOptions.find(option => option.value === language)?.label}
                            <ChevronDown size={14} className={`transition-transform ${isLanguageMenuOpen ? "rotate-180" : ""}`} />
                        </button>
                        {isLanguageMenuOpen && <div role="listbox" aria-label="Format language" className="absolute right-3 top-[calc(100%+0.5rem)] z-50 min-w-36 overflow-hidden rounded-xl border border-white/10 bg-zinc-900 p-1 shadow-2xl">
                            {languageOptions.map(option => <button key={option.value} type="button" role="option" aria-selected={language === option.value} onClick={() => { setLanguage(option.value); setIsLanguageMenuOpen(false); }} className={`block w-full rounded-lg px-3 py-2 text-left text-xs font-bold ${language === option.value ? "bg-blue-600 text-white" : "text-zinc-300 hover:bg-white/10"}`}>{option.label}</button>)}
                        </div>}
                    </div>
                </header>
                <section className="rounded-[2rem] border border-white/10 bg-zinc-950/70 p-4 sm:p-6">
                <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-blue-300"><Code2 size={16} /><span className="text-[10px] font-black uppercase tracking-[0.25em]">Code Studio</span></div>
                        <p className="mt-1 text-sm text-zinc-500">Format, compress, encode, and copy source code.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                    <button onClick={() => { setInput(""); setOutput(""); }} aria-label="Clear code editor" className="p-2.5 hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors">
                        <Trash2 size={20} />
                    </button>
                    <button
                        onClick={copyToClipboard}
                        disabled={!output}
                        className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 font-bold text-black transition-all hover:bg-zinc-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                        {copied ? "Copied" : "Copy Result"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-5 md:grid-cols-2 md:min-h-[440px] lg:min-h-[520px]">
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

            <div className="grid grid-cols-1 gap-4 border-t border-white/10 pt-6 md:grid-cols-3">
                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2"><Shrink size={14} /> Minify & Uglify</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {['json', 'html', 'js', 'css'].map((l) => (
                                            <button key={l} onClick={() => handleMinify(l as any)} disabled={loading} className="min-h-10 rounded-lg bg-zinc-800 px-2 py-2 text-xs font-bold uppercase hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40">{l}</button>
                        ))}
                        <button onClick={handleUglify} disabled={loading} className="col-span-2 flex min-h-10 items-center justify-center gap-2 rounded-lg border border-orange-600/20 bg-orange-600/10 py-2.5 text-[10px] font-black uppercase tracking-widest text-orange-400 hover:bg-orange-600/30 disabled:cursor-not-allowed disabled:opacity-40">
                            <Zap size={12} fill="currentColor" /> Terser Uglify
                        </button>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2"><Wand2 size={14} /> Beautify</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {['json', 'html', 'js', 'css'].map((l) => (
                            <button key={l} onClick={() => { setLanguage(l as typeof language); handleBeautify(l); }} disabled={loading} className={`min-h-10 rounded-lg border py-2 text-xs font-bold uppercase transition disabled:cursor-not-allowed disabled:opacity-40 ${language === l ? "border-blue-400/50 bg-blue-600/20 text-blue-300" : "border-blue-600/20 bg-blue-600/10 text-blue-400 hover:bg-blue-600/20"}`}>{l}</button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2"><Hash size={14} /> Encoding</h3>
                    <div className="flex flex-col gap-2">
                        <button onClick={() => handleBase64('to')} disabled={loading} className="min-h-10 w-full rounded-lg border border-emerald-600/20 bg-emerald-600/10 py-2.5 text-xs font-bold uppercase text-emerald-400 hover:bg-emerald-600/20 disabled:cursor-not-allowed disabled:opacity-40">To Base64</button>
                        <button onClick={() => handleBase64('from')} disabled={loading} className="min-h-10 w-full rounded-lg border border-emerald-600/20 bg-emerald-600/10 py-2.5 text-xs font-bold uppercase text-emerald-400 hover:bg-emerald-600/20 disabled:cursor-not-allowed disabled:opacity-40">From Base64</button>
                    </div>
                </div>
            </div>
                </section>
            </section>}
        </div>
    );
}