"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Download, 
  Globe, 
  RefreshCw, 
  Loader2, 
  Monitor, 
  Smartphone, 
  Square, 
  ImageIcon, 
  ArrowDownToLine,
  Shuffle,
  Copy,
  Check,
  FileJson,
  Palette
} from "lucide-react";

export default function ImageStudio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [options, setOptions] = useState({
    width: 1920,
    height: 1080,
    sourceMode: "canvas" as "canvas" | "online",
    styleMode: "gradient" as "flat" | "gradient",
    color1: "#3b82f6",
    color2: "#9333ea",
    angle: 45,
    onlineUrl: "" 
  });

  const presets = [
    { name: "Landscape", w: 1920, h: 1080, icon: <Monitor size={14} /> },
    { name: "Portrait", w: 1080, h: 1920, icon: <Smartphone size={14} /> },
    { name: "Square", w: 1080, h: 1080, icon: <Square size={14} /> },
  ];

  const getRandomColor = () => {
    const chars = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += chars[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const randomizeGradient = () => {
    setOptions(prev => ({
      ...prev,
      sourceMode: "canvas",
      styleMode: "gradient",
      color1: getRandomColor(),
      color2: getRandomColor(),
      angle: Math.floor(Math.random() * 360)
    }));
  };

  const updateOnlineSource = () => {
    setIsFetching(true);
    const { width, height } = options;
    const seed = Math.floor(Math.random() * 5000);
    // Rotating through multiple APIs for variety
    const providers = [
      `https://picsum.photos/${width}/${height}?random=${seed}`,
      `https://loremflickr.com/${width}/${height}/abstract?lock=${seed}`,
      `https://source.unsplash.com/random/${width}x${height}/?wallpaper,nature&sig=${seed}`
    ];
    const randomProvider = providers[Math.floor(Math.random() * providers.length)];
    setOptions(prev => ({ ...prev, onlineUrl: randomProvider }));
  };

  useEffect(() => {
    drawCanvas();
  }, [options]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = options.width;
    canvas.height = options.height;

    if (options.sourceMode === "online" && options.onlineUrl) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = options.onlineUrl;
      img.onload = () => {
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        setIsFetching(false);
      };
      img.onerror = () => setIsFetching(false);
    } else {
      if (options.styleMode === "flat") {
        ctx.fillStyle = options.color1;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        const angleRad = (options.angle * Math.PI) / 180;
        const x2 = canvas.width * Math.cos(angleRad);
        const y2 = canvas.height * Math.sin(angleRad);
        const grad = ctx.createLinearGradient(0, 0, x2, y2);
        grad.addColorStop(0, options.color1);
        grad.addColorStop(1, options.color2);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const copyCSS = () => {
    const css = `background: linear-gradient(${options.angle}deg, ${options.color1}, ${options.color2});`;
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportAsset = (format: 'png' | 'jpeg' | 'webp') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `asset-${options.width}x${options.height}.${format}`;
    link.href = canvas.toDataURL(`image/${format}`, 0.9);
    link.click();
  };

  return (
    <div className="min-h-full bg-zinc-950 p-6 md:p-12 rounded-[4rem] flex flex-col xl:flex-row gap-10 text-white font-sans">
      
      {/* Sidebar Controls */}
      <div className="w-full xl:w-[400px] space-y-8 bg-zinc-900/40 p-10 rounded-[3rem] border border-white/5 h-fit shadow-2xl">
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tighter italic">Studio Asset</h1>
          <p className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase tracking-[0.2em]">Image & Gradient Engine</p>
        </div>

        {/* Resolution Control */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-[10px] font-black text-zinc-500 uppercase">
            <span>Precision Size</span>
            <div className="flex gap-2">
              {presets.map(p => (
                <button 
                  key={p.name} 
                  onClick={() => setOptions({...options, width: p.w, height: p.h})} 
                  className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-all text-zinc-400 hover:text-white"
                >
                  {p.icon}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[8px] font-bold text-zinc-600 uppercase ml-1">Width</span>
              <input type="number" value={options.width} onChange={(e) => setOptions({...options, width: Number(e.target.value)})} className="w-full bg-zinc-800/40 border border-white/5 p-4 rounded-xl text-xs font-mono outline-none focus:ring-1 ring-blue-500" />
            </div>
            <div className="space-y-1">
              <span className="text-[8px] font-bold text-zinc-600 uppercase ml-1">Height</span>
              <input type="number" value={options.height} onChange={(e) => setOptions({...options, height: Number(e.target.value)})} className="w-full bg-zinc-800/40 border border-white/5 p-4 rounded-xl text-xs font-mono outline-none focus:ring-1 ring-blue-500" />
            </div>
          </div>
        </div>

        {/* Source Toggle */}
        <div className="flex bg-zinc-800/50 p-1.5 rounded-2xl border border-white/5">
          <button onClick={() => setOptions({...options, sourceMode: 'canvas'})} className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all ${options.sourceMode === 'canvas' ? 'bg-zinc-700 text-white shadow-md' : 'text-zinc-500'}`}>LOCAL CANVAS</button>
          <button onClick={() => { setOptions({...options, sourceMode: 'online'}); updateOnlineSource(); }} className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all ${options.sourceMode === 'online' ? 'bg-zinc-700 text-white shadow-md' : 'text-zinc-500'}`}>CLOUD SOURCE</button>
        </div>

        {/* Dynamic Context Controls */}
        <div className="min-h-[140px]">
          {options.sourceMode === 'canvas' ? (
            <div className="space-y-6 animate-in fade-in duration-300">
               <div className="flex bg-zinc-800/30 p-1.5 rounded-xl border border-white/5 gap-2">
                <button onClick={() => setOptions({...options, styleMode: 'flat'})} className={`flex-1 py-2 rounded-lg text-[9px] font-black ${options.styleMode === 'flat' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}>FLAT</button>
                <button onClick={() => setOptions({...options, styleMode: 'gradient'})} className={`flex-1 py-2 rounded-lg text-[9px] font-black ${options.styleMode === 'gradient' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}>GRADIENT</button>
                <button 
                   onClick={randomizeGradient} 
                   title="Random Gradient"
                   className="px-4 py-2 bg-blue-600/10 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all border border-blue-500/20"
                >
                  <Shuffle size={14} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <input type="color" value={options.color1} onChange={(e) => setOptions({...options, color1: e.target.value})} className="w-full h-12 bg-transparent cursor-pointer rounded-xl border-none" />
                  <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-xl"></div>
                </div>
                {options.styleMode === 'gradient' && (
                  <div className="relative group">
                    <input type="color" value={options.color2} onChange={(e) => setOptions({...options, color2: e.target.value})} className="w-full h-12 bg-transparent cursor-pointer rounded-xl border-none" />
                    <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-xl"></div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button onClick={updateOnlineSource} disabled={isFetching} className="w-full py-8 bg-zinc-800 hover:bg-zinc-700 rounded-[2rem] border border-white/5 flex flex-col items-center gap-3 group transition-all">
              <RefreshCw className={`text-blue-400 ${isFetching ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} size={24} />
              <span className="text-[10px] font-black uppercase tracking-widest">{isFetching ? 'Fetching Cloud...' : 'Shuffle Cloud Image'}</span>
            </button>
          )}
        </div>

        {/* Instant Export HUD */}
        <div className="space-y-4 pt-8 border-t border-white/5">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <ArrowDownToLine size={12} /> Instant Export
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['png', 'jpeg', 'webp'].map((fmt) => (
              <button 
                key={fmt} 
                onClick={() => exportAsset(fmt as any)} 
                className={`group flex flex-col items-center gap-2 p-4 bg-zinc-900 border border-white/5 rounded-2xl transition-all ${
                  fmt === 'png' ? 'hover:bg-emerald-500/10 hover:border-emerald-500/20' : 
                  fmt === 'jpeg' ? 'hover:bg-blue-500/10 hover:border-blue-500/20' : 
                  'hover:bg-purple-500/10 hover:border-purple-500/20'
                }`}
              >
                <Download className={`text-zinc-600 group-hover:-translate-y-1 transition-all ${
                  fmt === 'png' ? 'group-hover:text-emerald-500' : 
                  fmt === 'jpeg' ? 'group-hover:text-blue-500' : 
                  'group-hover:text-purple-500'
                }`} size={18} />
                <span className="text-[10px] font-black uppercase tracking-tighter">{fmt === 'jpeg' ? 'JPG' : fmt}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Preview & Code Area */}
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="w-full flex-grow bg-zinc-900/20 border border-white/5 rounded-[4rem] p-12 flex flex-col items-center justify-center relative bg-grid-white/[0.02] overflow-hidden">
          <div className="absolute top-10 left-12 flex items-center gap-3 text-zinc-800">
             <ImageIcon size={20} />
             <span className="text-[10px] font-black uppercase tracking-[0.4em]">Asset Viewport</span>
          </div>

          <div className="w-full max-w-4xl aspect-video rounded-[3rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)] border border-white/5 bg-zinc-950 flex items-center justify-center">
             <canvas ref={canvasRef} className="max-w-full max-h-full object-contain" />
          </div>
        </div>

        {/* Real-time Code Component */}
        {options.sourceMode === 'canvas' && options.styleMode === 'gradient' && (
          <div className="mt-8 w-full max-w-2xl animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-5 flex items-center justify-between group shadow-xl">
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400">
                  <FileJson size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">CSS Output</span>
                  <code className="text-[11px] font-mono text-zinc-400 truncate leading-relaxed">
                    background: linear-gradient({options.angle}deg, {options.color1}, {options.color2});
                  </code>
                </div>
              </div>
              
              <button 
                onClick={copyCSS}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border border-white/5 ${
                  copied ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 active:scale-95'
                }`}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy CSS'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}