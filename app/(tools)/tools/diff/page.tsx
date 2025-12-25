"use client";

import { useState } from "react";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer-continued";
import { GitCompare, Trash2, ArrowRightLeft } from "lucide-react";

export default function DiffCheckerPage() {
  const [oldCode, setOldCode] = useState("");
  const [newCode, setNewCode] = useState("");
  const [isSplit, setIsSplit] = useState(true);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <GitCompare className="text-blue-500" /> Diff Checker
          </h1>
          <p className="text-zinc-500 text-sm">Compare two versions of code side-by-side</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsSplit(!isSplit)}
            className="flex items-center gap-2 bg-zinc-800 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-zinc-700 transition-all"
          >
            <ArrowRightLeft size={14} />
            {isSplit ? "Unified View" : "Split View"}
          </button>
          <button 
            onClick={() => { setOldCode(""); setNewCode(""); }}
            className="p-2.5 hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Input Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950/50">
          <div className="bg-zinc-900/50 px-4 py-2 text-[10px] font-bold text-zinc-500 tracking-widest border-b border-zinc-800">ORIGINAL CODE</div>
          <textarea
            value={oldCode}
            onChange={(e) => setOldCode(e.target.value)}
            className="h-48 p-4 bg-transparent outline-none font-mono text-xs resize-none placeholder:text-zinc-800"
            placeholder="Paste old code here..."
          />
        </div>
        <div className="flex flex-col border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950/50">
          <div className="bg-zinc-900/50 px-4 py-2 text-[10px] font-bold text-zinc-500 tracking-widest border-b border-zinc-800">MODIFIED CODE</div>
          <textarea
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            className="h-48 p-4 bg-transparent outline-none font-mono text-xs resize-none placeholder:text-zinc-800"
            placeholder="Paste new code here..."
          />
        </div>
      </div>

      {/* Diff Viewer Area */}
      <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/20 min-h-[400px]">
        <div className="bg-zinc-900/50 px-4 py-2 text-[10px] font-bold text-zinc-500 tracking-widest border-b border-zinc-800">COMPARISON RESULT</div>
        <div className="overflow-auto max-h-[60vh]">
          <ReactDiffViewer
            oldValue={oldCode}
            newValue={newCode}
            splitView={isSplit}
            compareMethod={DiffMethod.WORDS}
            styles={{
              variables: {
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
                  lineNumberColor: "#3f3f46",
                  gutterBackground: "transparent",
                  gutterColor: "#3f3f46",
                }
              }
            }}
            useDarkTheme={true}
          />
        </div>
      </div>
    </div>
  );
}