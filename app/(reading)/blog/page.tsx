import React from "react";
import { 
  Terminal, 
  ArrowLeft,
  Settings,
  ShieldCheck,
  Cpu,
  Globe,
  Command
} from "lucide-react";
import Link from "next/link";

export default function BlogUnderConstruction() {
  return (
    /* Note: min-h-screen and bg-[#050505] ensure the 
       background is locked to dark even if global CSS is light.
    */
    <main className="min-h-screen bg-[#050505] text-zinc-200 flex items-center justify-center p-6 selection:bg-blue-500/30">
      <div className="max-w-3xl w-full animate-in fade-in zoom-in-95 duration-1000">
        
        {/* Main Console Box */}
        <div className="bg-zinc-900/20 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl relative">
          
          {/* Subtle Glow Effect */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Top Bar - Window Controls Aesthetic */}
          <div className="border-b border-white/5 bg-white/[0.02] px-6 py-4 flex justify-between items-center">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-zinc-800 border border-white/5" />
              <div className="w-3 h-3 rounded-full bg-zinc-800 border border-white/5" />
              <div className="w-3 h-3 rounded-full bg-zinc-800 border border-white/5" />
            </div>
            <div className="flex items-center gap-2">
              <Command size={12} className="text-zinc-600" />
              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em]">devbox_blog_init.log</span>
            </div>
          </div>

          <div className="p-8 md:p-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              
              {/* Left Column: Status Text */}
              <div className="space-y-6 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                  <Cpu size={12} className="text-blue-500 animate-pulse" />
                  <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Building Engine</span>
                </div>

                <h1 className="text-5xl font-black italic text-white uppercase tracking-tighter leading-[0.85]">
                  Dev <br />
                  <span className="text-zinc-700">In</span> <br />
                  Progress
                </h1>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-center md:justify-start gap-3 text-zinc-500">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">MDX Core Ready</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-3 text-zinc-500">
                    <Settings size={14} className="animate-spin-slow text-blue-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Compiling UI Assets</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Console */}
              <div className="bg-black/40 border border-white/5 rounded-3xl p-8 space-y-6 relative overflow-hidden">
                <div className="flex justify-between items-end">
                    <p className="text-[10px] font-black text-zinc-600 uppercase">Deployment</p>
                    <p className="text-2xl font-black font-mono text-white tracking-tighter">36.9%</p>
                </div>

                {/* Progress Bar Container */}
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden border border-white/5 flex">
                    <div className="h-full bg-blue-500 rounded-full w-[36%] shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                </div>

                <div className="pt-2 space-y-2">
                    <div className="flex justify-between text-[8px] font-mono uppercase text-zinc-600">
                        <span>Loading styles...</span>
                        <span className="text-emerald-500">Done</span>
                    </div>
                    <div className="flex justify-between text-[8px] font-mono uppercase text-zinc-600">
                        <span>Fetching nodes...</span>
                        <span className="text-emerald-500">Done</span>
                    </div>
                    <div className="flex justify-between text-[8px] font-mono uppercase text-zinc-600 animate-pulse">
                        <span>Building routes...</span>
                        <span className="text-blue-500">Pending</span>
                    </div>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row gap-6 justify-between items-center">
               <Link 
                 href="/" 
                 className="group flex items-center gap-3 px-8 py-4 bg-zinc-950 hover:bg-zinc-900 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 transition-all active:scale-95"
               >
                 <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                 Exit Console
               </Link>
               
               <div className="text-right">
                  <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest mb-1">Estimated Uptime</p>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Q1 — 2026</p>
               </div>
            </div>
          </div>
        </div>

        {/* Outer Background Note */}
        <div className="mt-8 text-center">
           <span className="text-[8px] font-mono text-zinc-800 uppercase tracking-[0.5em] font-bold">Secure Access Only // DevBox v2.0.4</span>
        </div>
      </div>
    </main>
  );
}