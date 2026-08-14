"use client";

import { useEffect, useState } from "react";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer-continued";
import { GitCompare, Trash2, ArrowRightLeft } from "lucide-react";

export default function DiffCheckerPage() {
  const [oldCode, setOldCode] = useState("");
  const [newCode, setNewCode] = useState("");
  const [isSplit, setIsSplit] = useState(true);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    const updateTheme = () => {
      const documentTheme = document.documentElement.dataset.theme;
      setIsDark(documentTheme ? documentTheme === "dark" : !mediaQuery.matches);
    };
    updateTheme();
    mediaQuery.addEventListener("change", updateTheme);
    return () => mediaQuery.removeEventListener("change", updateTheme);
  }, []);

  const addedLines = newCode ? newCode.split("\n").length : 0;
  const removedLines = oldCode ? oldCode.split("\n").length : 0;
  const hasContent = Boolean(oldCode || newCode);
  const isIdentical = hasContent && oldCode === newCode;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 animate-in fade-in duration-500 pb-16">
      {/* Header */}
      <header className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-violet-400">Code utility</p>
          <h1 className="flex items-center gap-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
            <GitCompare className="text-blue-500" /> Diff Checker
          </h1>
          <p className="mt-2 text-sm text-zinc-500">Compare two versions of code with a precise, readable diff.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setIsSplit(!isSplit)}
            className="flex min-h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-zinc-300 transition-all hover:bg-white/10"
          >
            <ArrowRightLeft size={14} />
            {isSplit ? "Unified View" : "Split View"}
          </button>
          <button 
            onClick={() => { setOldCode(""); setNewCode(""); }}
            aria-label="Clear both code inputs"
            className="min-h-10 rounded-xl border border-white/10 px-3 text-zinc-500 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Original lines" value={removedLines} tone="text-rose-400" />
        <Stat label="Modified lines" value={addedLines} tone="text-emerald-400" />
        <Stat label="Mode" value={isSplit ? "Split" : "Unified"} tone="text-blue-400" />
      </div>

      {/* Input Inputs */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/50">
          <div className="bg-zinc-900/50 px-4 py-2 text-[10px] font-bold text-zinc-500 tracking-widest border-b border-zinc-800">ORIGINAL CODE</div>
          <textarea
            value={oldCode}
            onChange={(e) => setOldCode(e.target.value)}
            className="h-56 resize-none bg-transparent p-4 font-mono text-xs text-zinc-200 outline-none placeholder:text-zinc-600 sm:h-72"
            placeholder="Paste old code here..."
          />
        </div>
        <div className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/50">
          <div className="bg-zinc-900/50 px-4 py-2 text-[10px] font-bold text-zinc-500 tracking-widest border-b border-zinc-800">MODIFIED CODE</div>
          <textarea
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            className="h-56 resize-none bg-transparent p-4 font-mono text-xs text-zinc-200 outline-none placeholder:text-zinc-600 sm:h-72"
            placeholder="Paste new code here..."
          />
        </div>
      </div>

      {/* Diff Viewer Area */}
      <div className="min-h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/20">
        <div className="bg-zinc-900/50 px-4 py-2 text-[10px] font-bold text-zinc-500 tracking-widest border-b border-zinc-800">COMPARISON RESULT</div>
        <div className="max-h-[70vh] overflow-auto">
          <ReactDiffViewer
            oldValue={oldCode}
            newValue={newCode}
            splitView={isSplit}
            compareMethod={DiffMethod.WORDS}
            styles={{
              variables: {
                light: {
                  diffViewerBackground: "transparent",
                  diffViewerColor: "#334155",
                  addedBackground: "#dcfce7",
                  addedColor: "#166534",
                  removedBackground: "#fee2e2",
                  removedColor: "#991b1b",
                  wordAddedBackground: "#bbf7d0",
                  wordRemovedBackground: "#fecaca",
                  codeFoldBackground: "#f1f5f9",
                  codeFoldContentColor: "#64748b",
                  gutterBackground: "transparent",
                  gutterColor: "#94a3b8",
                },
                dark: {
                  diffViewerBackground: "transparent",
                  diffViewerColor: "#d4d4d8",
                  addedBackground: "#064e3b",
                  addedColor: "#34d399",
                  removedBackground: "#450a0a",
                  removedColor: "#f87171",
                  wordAddedBackground: "#065f46",
                  wordRemovedBackground: "#7f1d1d",
                  codeFoldBackground: "#18181b",
                  codeFoldContentColor: "#71717a",
                  gutterBackground: "transparent",
                  gutterColor: "#3f3f46",
                }
              }
            }}
            useDarkTheme={isDark}
          />
        </div>
        {isIdentical && <div className="border-t border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-center text-xs font-bold text-emerald-400">The two inputs are identical.</div>}
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string | number; tone: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <span className="block text-[9px] font-black uppercase tracking-widest text-zinc-600">{label}</span>
      <strong className={`mt-1 block text-lg font-bold ${tone}`}>{value}</strong>
    </div>
  );
}