"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Calculator, ArrowRightLeft,
  TrendingUp, Activity, Eye, EyeOff, Loader2
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts';

type MetalKey = 'gold_24k' | 'gold_22k' | 'gold_18k' | 'gold_14k' | 'platinum' | 'silver';
type Rates = Record<MetalKey, number>;
type HistoryRow = Rates & { date: string };

export default function MetalDashboard() {
  const [rates, setRates] = useState<Rates | null>(null);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [loadingRates, setLoadingRates] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [selectedMetal, setSelectedMetal] = useState<MetalKey>("gold_22k");
  const [calc, setCalc] = useState({ grams: "1", total: "" });

  // 1. History Graph States
  const [days, setDays] = useState(90);
  const [visibleLines, setVisibleLines] = useState<Record<MetalKey, boolean>>({
    gold_24k: false,
    gold_22k: true,
    gold_18k: false,
    gold_14k: false,
    platinum: false,
    silver: false,
  });

  useEffect(() => {
    async function getRates() {
      try {
        const ratesRes = await fetch("/api/metal");
        const ratesJson = await ratesRes.json();

        if (ratesJson.success && ratesJson.data?.rates) {
          setRates(ratesJson.data.rates);
          setCalc({ grams: "1", total: ratesJson.data.rates.gold_22k.toString() });
        }
      } catch (error) {
        console.error("Rates fetch error:", error);
      } finally {
        setLoadingRates(false);
      }
    }

    async function getHistory() {
      try {
        const historyRes = await fetch("/api/metal/history");
        const historyJson = await historyRes.json();

        if (historyJson.success) {
          setHistory(historyJson.data);
        }
      } catch (error) {
        console.error("History fetch error:", error);
      } finally {
        setLoadingHistory(false);
      }
    }

    getRates();
    getHistory();
  }, []);

  // Filtered data for the graph
  const filteredHistory = useMemo(() => {
    return history.slice(-days);
  }, [history, days]);

  const handleCalc = (field: "grams" | "total", value: string, currentRate?: number) => {
    if (!rates) return;
    const rate = currentRate ?? rates[selectedMetal];
    if (field === "grams") {
      const g = parseFloat(value) || 0;
      setCalc({ grams: value, total: (g * rate).toFixed(2) });
    } else {
      const t = parseFloat(value) || 0;
      setCalc({ total: value, grams: (t / rate).toFixed(4) });
    }
  };

  const changeMetal = (key: MetalKey) => {
    setSelectedMetal(key);
    handleCalc("grams", calc.grams, rates?.[key]);
  };

  const toggleLine = (key: MetalKey) => {
    setVisibleLines(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const currentRate = rates?.[selectedMetal] ?? 0;
  const currentRateLabel = loadingRates ? "Loading..." : `₹${currentRate.toLocaleString()}/g`;

  const metalOptions: Array<{ key: MetalKey; label: string; purity: string; color: string }> = [
    { key: "gold_24k", label: "24K", purity: "99.9%", color: "#eab308" },
    { key: "gold_22k", label: "22K", purity: "91.6%", color: "#f97316" },
    { key: "gold_18k", label: "18K", purity: "75.0%", color: "#fbbf24" },
    { key: "gold_14k", label: "14K", purity: "58.5%", color: "#d97706" },
    { key: "platinum", label: "Plat", purity: "95.0%", color: "#94a3b8" },
    { key: "silver", label: "Silv", purity: "92.5%", color: "#cbd5e1" },
  ];

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 animate-in fade-in duration-700 pb-16">
      <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-orange-400">Market instrument</p>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Metal Terminal</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">Track live precious-metal rates, compare recent movement, and estimate value by weight.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left sm:text-right">
          <span className="block text-[9px] font-black uppercase tracking-widest text-zinc-600">Pricing unit</span>
          <strong className="mt-1 block text-sm text-zinc-300">Indian rupees / gram</strong>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <RateCard
          label="22K Gold"
          price={rates?.gold_22k}
          percent="91.6%"
          highlight="border-orange-500/20 bg-orange-500/5"
        />
        <RateCard
          label="Platinum"
          price={rates?.platinum}
          percent="95.0%"
          highlight="border-slate-500/20 bg-slate-500/5"
        />
        <RateCard
          label="Silver"
          price={rates?.silver}
          percent="92.5%"
          highlight="border-cyan-500/20 bg-cyan-500/5"
        />
      </div>
      <section className="space-y-6 rounded-3xl border border-white/10 bg-zinc-900/25 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1">
            <h2 className="flex items-center gap-2 text-xl font-black tracking-tight text-white">
              <Activity size={22} className="text-orange-500" /> Market Analytics
            </h2>
            <p className="text-xs text-zinc-500">Compare price trends across different intervals.</p>
          </div>
          <div className="flex w-full overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-1 lg:w-auto">
            {[7, 10, 30, 60, 90].map((d) => (
              <button key={d} onClick={() => setDays(d)}
                className={`min-w-14 rounded-lg px-4 py-2 text-[10px] font-black transition-all ${days === d ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                {d}D
              </button>
            ))}
          </div>
        </div>
        <div className="relative h-[280px] w-full rounded-2xl border border-white/10 bg-black/20 p-2 sm:h-[350px] sm:p-4">
          {loadingHistory ? (
            <div className="flex h-full w-full items-center justify-center rounded-[2rem] bg-black/60 text-zinc-400 text-sm font-bold uppercase tracking-widest">
              <Loader2 className="w-8 h-8 mr-3 animate-spin" /> Loading historical market data...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="date" stroke="#444" fontSize={10} tickLine={false} axisLine={false} minTickGap={30} />
                <YAxis stroke="#444" fontSize={10} tickLine={false} axisLine={false} domain={['auto', 'auto']} tickFormatter={(v) => `${(v).toLocaleString()}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #222', borderRadius: '16px', fontSize: '12px' }}
                  itemStyle={{ fontWeight: 'bold', padding: '2px 0' }}
                  cursor={{ stroke: '#333', strokeWidth: 1 }}
                />
                {metalOptions.map(m => (
                  <Line key={m.key} type="monotone" dataKey={m.key} stroke={m.color} strokeWidth={3} dot={false}
                    hide={!visibleLines[m.key as keyof typeof visibleLines]} animationDuration={1000}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {metalOptions.map((m) => {
            const active = visibleLines[m.key as keyof typeof visibleLines];
            return (
              <button key={m.key} onClick={() => toggleLine(m.key)}
                className={`flex min-h-10 items-center gap-2 rounded-full border px-4 py-2 text-xs transition-all ${active ? "border-white/15 bg-white/10 text-white" : "border-white/10 bg-transparent text-zinc-600"}`}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: active ? m.color : '#333' }} />
                <span className="text-[9px] font-black uppercase tracking-widest">{m.label}</span>
                {active ? <Eye size={12} /> : <EyeOff size={12} />}
              </button>
            );
          })}
        </div>
      </section>
      <section className="relative space-y-8 overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/25 p-5 sm:p-8 lg:p-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-1">
            <h2 className="flex items-center gap-2 text-xl font-black tracking-tight text-white">
              <Calculator size={22} className="text-blue-500" /> Professional Estimator
            </h2>
            <p className="text-xs text-zinc-500">Calculated using the live {selectedMetal.replace('_', ' ')} rate.</p>
          </div>
          <div className="flex w-full overflow-x-auto rounded-2xl border border-white/10 bg-black/40 p-1.5 scrollbar-hide md:w-auto">
            {metalOptions.map((opt) => (
              <button key={opt.key} onClick={() => changeMetal(opt.key)}
                className={`flex flex-col items-center px-4 py-2 rounded-xl transition-all min-w-[70px] ${selectedMetal === opt.key ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <span className="text-[10px] font-black uppercase tracking-tighter">{opt.label}</span>
                <span className={`text-[7px] font-bold uppercase ${selectedMetal === opt.key ? "text-blue-100" : "text-zinc-700"}`}>{opt.purity}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="relative z-10 grid grid-cols-1 items-center gap-4 md:grid-cols-11">
          <div className="md:col-span-5 space-y-2">
            <label className="text-[9px] font-black text-zinc-600 uppercase ml-4 tracking-widest">Weight (Grams)</label>
            <input type="number" value={calc.grams} onChange={(e) => handleCalc("grams", e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/40 p-5 text-2xl font-mono font-bold text-white outline-none focus:border-blue-500/40"
            />
          </div>
          <div className="md:col-span-1 flex justify-center text-zinc-800 pt-6"><ArrowRightLeft size={24} /></div>
          <div className="md:col-span-5 space-y-2">
            <label className="text-[9px] font-black text-zinc-600 uppercase ml-4 tracking-widest">Estimated Value (₹)</label>
            <div className="relative">
              <input type="number" value={calc.total} onChange={(e) => handleCalc("total", e.target.value)}
                className="w-full rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-2xl font-mono font-bold text-emerald-400 outline-none"
              />
              <TrendingUp size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-emerald-500/20" />
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-5 rounded-2xl border border-white/10 bg-black/20 p-5 sm:flex-row sm:flex-wrap">
          <InfoItem label="Current Rate" value={currentRateLabel} />
          <InfoItem label="Metal Purity" value={metalOptions.find(o => o.key === selectedMetal)?.purity || ""} />
          <InfoItem label="Typical Use" value={getUsage(selectedMetal)} />
        </div>
      </section>
    </div>
  );
}

// Sub-components
function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{label}</p>
      <p className="text-xs font-bold text-zinc-300 uppercase tracking-tighter">{value}</p>
    </div>
  )
}

function RateCard({ label, price, percent, highlight }: { label: string; price?: number; percent: string; highlight: string }) {
  return (
    <div
      className={`relative p-5 rounded-[2rem] bg-zinc-900/60 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:bg-zinc-800/80 hover:border-white/20 hover:shadow-white/5 group overflow-hidden ${highlight}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
      <div className="relative flex items-center justify-between gap-3">
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest transition-colors duration-300 group-hover:text-zinc-300">
          {label}
        </p>
        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 shadow-sm">
          <p className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider">
            {percent}
          </p>
        </div>
      </div>
      <p className="relative text-4xl font-black text-white tracking-tighter">
        <span className="text-zinc-500 mr-1 font-sans text-2xl font-medium">₹</span>
        <span className="font-mono">{((price || 0)).toLocaleString()}</span>
      </p>
    </div>
  );
}

function getUsage(key: string) {
  const usages: any = {
    gold_24k: "Bars/Coins",
    gold_22k: "Jewelry",
    gold_18k: "Stone Settings",
    gold_14k: "Watch/Daily Wear",
    platinum: "Premium Bands",
    silver: "Articles/Utensils"
  };
  return usages[key] || "Jewelry";
}