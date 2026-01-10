"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Calculator, Percent, Calendar, Banknote, 
  RefreshCcw, Zap, PieChart, TrendingUp 
} from "lucide-react";

export default function LoanSolver() {
  const [values, setValues] = useState({
    amount: "600000",
    tenure: "36",
    rate: "",
    emi: "19800"
  });

  // This ref tracks what the user is currently typing so we don't overwrite it
  const lastChanged = useRef<"rate" | "emi" | null>("emi");

  const [stats, setStats] = useState({
    totalInterest: 0,
    totalPayment: 0,
    principalPercent: 0,
    solvingFor: ""
  });

  useEffect(() => {
    const P = parseFloat(values.amount);
    const N = parseFloat(values.tenure);
    if (!P || !N) return;

    // AUTO-POPULATE LOGIC
    // If user is typing Rate, we solve for EMI.
    // If user is typing EMI, we solve for Rate.
    
    if (lastChanged.current === "rate" && values.rate) {
      const r = parseFloat(values.rate) / 12 / 100;
      if (r > 0) {
        const solvedEMI = P * r * Math.pow(1 + r, N) / (Math.pow(1 + r, N) - 1);
        
        // Update EMI state without triggering lastChanged update
        setValues(prev => ({ ...prev, emi: solvedEMI.toFixed(2) }));
        
        const totalPayment = solvedEMI * N;
        setStats({
          totalPayment,
          totalInterest: totalPayment - P,
          principalPercent: (P / totalPayment) * 100,
          solvingFor: "EMI"
        });
      }
    } 
    
    else if (lastChanged.current === "emi" && values.emi) {
      const E = parseFloat(values.emi);
      if (E > 0) {
        // Newton-Raphson to find Rate
        let r = E / P; 
        for (let i = 0; i < 20; i++) {
          let t1 = Math.pow(1 + r, N);
          let t2 = Math.pow(1 + r, N - 1);
          r = r - (P * r * t1 - E * (t1 - 1)) / (P * (t1 + r * N * t2) - E * N * t2);
        }
        const solvedRate = r * 12 * 100;
        
        // Update Rate state without triggering lastChanged update
        setValues(prev => ({ ...prev, rate: solvedRate.toFixed(2) }));
        
        const totalPayment = E * N;
        setStats({
          totalPayment,
          totalInterest: totalPayment - P,
          principalPercent: (P / totalPayment) * 100,
          solvingFor: "Interest Rate"
        });
      }
    }
  }, [values.amount, values.tenure, values.rate, values.emi]);

  const handleManualInput = (field: "amount" | "tenure" | "rate" | "emi", val: string) => {
    if (field === "rate" || field === "emi") {
      lastChanged.current = field;
    }
    setValues(prev => ({ ...prev, [field]: val }));
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700 pb-20">
      
      {/* Header HUD */}
      <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-black italic text-white uppercase tracking-tighter">Live Solver</h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <Zap size={10} className="text-emerald-500" />
            Auto-calculating {stats.solvingFor === "EMI" ? "Interest Rate" : "Monthly EMI"}
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-black/40 border border-white/5 px-6 py-4 rounded-3xl text-center min-w-[140px]">
            <p className="text-[8px] font-black text-zinc-600 uppercase mb-1">Interest Cost</p>
            <p className="text-xl font-bold text-orange-400 font-mono">₹ {stats.totalInterest.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
          </div>
          <div className="bg-black/40 border border-white/5 px-6 py-4 rounded-3xl text-center min-w-[140px]">
            <p className="text-[8px] font-black text-zinc-600 uppercase mb-1">Total Payback</p>
            <p className="text-xl font-bold text-blue-400 font-mono">₹ {stats.totalPayment.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Input Controls */}
        <div className="xl:col-span-5 bg-zinc-900/20 border border-white/5 rounded-[3rem] p-10 space-y-8">
          <div className="space-y-6">
            <SolverInput label="Loan Amount" icon={<Banknote size={18}/>} value={values.amount} onChange={(v:string) => handleManualInput("amount", v)} />
            <SolverInput label="Tenure (Months)" icon={<Calendar size={18}/>} value={values.tenure} onChange={(v:string) => handleManualInput("tenure", v)} />
            
            <div className="h-px bg-white/5 my-4" />

            <SolverInput 
              label="Interest Rate (%)" 
              icon={<Percent size={18}/>} 
              value={values.rate} 
              onChange={(v:string) => handleManualInput("rate", v)} 
              isAuto={lastChanged.current === "emi"} 
            />
            
            <SolverInput 
              label="Monthly EMI" 
              icon={<Calculator size={18}/>} 
              value={values.emi} 
              onChange={(v:string) => handleManualInput("emi", v)} 
              isAuto={lastChanged.current === "rate"} 
            />
          </div>
        </div>

        {/* Visual Analysis */}
        <div className="xl:col-span-7 flex flex-col gap-6">
          <div className="bg-zinc-900/40 border border-white/5 p-10 rounded-[3rem] space-y-10 flex-grow relative overflow-hidden">
            <div className="flex items-center gap-3">
              <PieChart size={18} className="text-zinc-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Repayment Distribution</span>
            </div>

            
            
            <div className="space-y-8 relative z-10">
              <div className="h-4 w-full bg-zinc-800 rounded-full flex overflow-hidden border border-white/5">
                <div style={{ width: `${stats.principalPercent}%` }} className="h-full bg-emerald-500 transition-all duration-700" />
                <div style={{ width: `${100 - stats.principalPercent}%` }} className="h-full bg-orange-500 transition-all duration-700" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-6 bg-black/40 rounded-3xl border border-white/5 text-center">
                    <p className="text-[9px] font-black text-zinc-600 uppercase mb-2">Principal</p>
                    <p className="text-3xl font-black text-emerald-500">{stats.principalPercent.toFixed(1)}%</p>
                 </div>
                 <div className="p-6 bg-black/40 rounded-3xl border border-white/5 text-center">
                    <p className="text-[9px] font-black text-zinc-600 uppercase mb-2">Interest</p>
                    <p className="text-3xl font-black text-orange-500">{(100 - stats.principalPercent).toFixed(1)}%</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SolverInput({ label, icon, value, onChange, isAuto }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center px-2">
        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</label>
        {isAuto && <span className="text-[8px] font-bold text-emerald-500 uppercase animate-pulse">Auto-Solving</span>}
      </div>
      <div className="relative group">
        <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isAuto ? "text-emerald-500" : "text-zinc-700 group-focus-within:text-blue-500"}`}>
          {icon}
        </div>
        <input 
          type="number" 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-black/40 border p-4 pl-12 rounded-2xl text-sm font-mono outline-none transition-all ${
            isAuto 
              ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.05)]" 
              : "border-white/5 focus:border-blue-500/40 text-zinc-200"
          }`}
        />
      </div>
    </div>
  );
}