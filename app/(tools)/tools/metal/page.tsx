"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Gem, Coins, Calculator, ArrowRightLeft, 
  TrendingUp, Info, Activity, Calendar, Eye, EyeOff, Loader2 
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid 
} from 'recharts';

export default function MetalDashboard() {
  const [rates, setRates] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetal, setSelectedMetal] = useState("gold_22k");
  const [calc, setCalc] = useState({ grams: "1", total: "" });

  // 1. History Graph States
  const [days, setDays] = useState(90);
  const [visibleLines, setVisibleLines] = useState({
    gold_24k: true,
    gold_22k: true,
    gold_18k: false,
    gold_14k: false,
    platinum: true,
    silver: false,
  });

  useEffect(() => {
    async function getData() {
      try {
        const [ratesRes, historyRes] = await Promise.all([
          fetch("/api/metal"),
          fetch("/api/metal/history")
        ]);
        
        const ratesJson = await ratesRes.json();
        const historyJson = await historyRes.json();

        if (ratesJson.success && ratesJson.data?.rates) {
          setRates(ratesJson.data.rates);
          setCalc({ grams: "1", total: ratesJson.data.rates.gold_22k.toString() });
        }
        if (historyJson.success) {
          setHistory(historyJson.data);
        }
      } catch (error) { 
        console.error("Fetch error:", error); 
      } finally { 
        setLoading(false); 
      }
    }
    getData();
  }, []);

  // Filtered data for the graph
  const filteredHistory = useMemo(() => {
    return history.slice(-days);
  }, [history, days]);

  const handleCalc = (field: "grams" | "total", value: string, currentRate?: number) => {
    if (!rates) return;
    const rate = currentRate || rates[selectedMetal];
    if (field === "grams") {
      const g = parseFloat(value) || 0;
      setCalc({ grams: value, total: (g * rate).toFixed(2) });
    } else {
      const t = parseFloat(value) || 0;
      setCalc({ total: value, grams: (t / rate).toFixed(4) });
    }
  };

  const changeMetal = (key: string) => {
    setSelectedMetal(key);
    handleCalc("grams", calc.grams, rates[key]);
  };

  const toggleLine = (key: string) => {
    setVisibleLines(prev => ({ ...prev, [key as keyof typeof prev]: !prev[key as keyof typeof prev] }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-zinc-500 font-black uppercase tracking-widest animate-pulse">Synchronizing Market Data...</p>
      </div>
    );
  }

  const metalOptions = [
    { key: "gold_24k", label: "24K", purity: "99.9%", color: "#eab308" },
    { key: "gold_22k", label: "22K", purity: "91.6%", color: "#f97316" },
    { key: "gold_18k", label: "18K", purity: "75.0%", color: "#fbbf24" },
    { key: "gold_14k", label: "14K", purity: "58.5%", color: "#d97706" },
    { key: "platinum", label: "Plat", purity: "95.0%", color: "#94a3b8" },
    { key: "silver", label: "Silv", purity: "92.5%", color: "#cbd5e1" },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-1000 pb-20 px-4 max-w-7xl mx-auto w-full">
      
      {/* 1. TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RateCard label="24K Investment" price={rates.gold_24k} icon={<Gem className="text-yellow-400" />} percent="99.9%" highlight="border-yellow-500/20 bg-yellow-500/5" />
        <RateCard label="22K Standard" price={rates.gold_22k} icon={<Coins className="text-orange-400" />} percent="91.6%" highlight="border-orange-500/20 bg-orange-500/5" />
      </div>

      {/* 2. INTERACTIVE GRAPH SECTION */}
      <div className="bg-zinc-900/20 border border-white/5 rounded-[3rem] p-6 md:p-10 space-y-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black italic text-white uppercase tracking-tighter flex items-center gap-2">
              <Activity size={22} className="text-orange-500" /> Market Analytics
            </h2>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Compare price trends across different intervals</p>
          </div>

          {/* DATE FILTERS */}
          <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 overflow-x-auto">
            {[7, 10, 30, 60, 90].map((d) => (
              <button key={d} onClick={() => setDays(d)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${days === d ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                {d}D
              </button>
            ))}
          </div>
        </div>

        {/* CHART AREA */}
        <div className="h-[350px] w-full bg-black/20 rounded-[2.5rem] p-4 border border-white/5 relative group">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis dataKey="date" stroke="#444" fontSize={10} tickLine={false} axisLine={false} minTickGap={30} />
              <YAxis stroke="#444" fontSize={10} tickLine={false} axisLine={false} domain={['auto', 'auto']} tickFormatter={(v) => `₹${v/1000}k`} />
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
        </div>

        {/* VISIBILITY TOGGLES */}
        <div className="flex flex-wrap gap-2 pt-2">
          {metalOptions.map((m) => {
            const active = visibleLines[m.key as keyof typeof visibleLines];
            return (
              <button key={m.key} onClick={() => toggleLine(m.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${active ? "bg-white/5 border-white/10 text-white" : "bg-transparent border-white/5 text-zinc-600"}`}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: active ? m.color : '#333' }} />
                <span className="text-[9px] font-black uppercase tracking-widest">{m.label}</span>
                {active ? <Eye size={12} /> : <EyeOff size={12} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. CALCULATOR SECTION */}
      <div className="bg-zinc-900/20 border border-white/5 rounded-[3rem] p-8 md:p-12 space-y-10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-1">
            <h2 className="text-xl font-black italic text-white uppercase tracking-tighter flex items-center gap-2">
              <Calculator size={22} className="text-blue-500" /> Professional Estimator
            </h2>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Calculated using live {selectedMetal.replace('_', ' ')} rate</p>
          </div>
          
          <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 w-full md:w-auto overflow-x-auto scrollbar-hide">
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

        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center relative z-10">
          <div className="md:col-span-5 space-y-2">
            <label className="text-[9px] font-black text-zinc-600 uppercase ml-4 tracking-widest">Weight (Grams)</label>
            <input type="number" value={calc.grams} onChange={(e) => handleCalc("grams", e.target.value)}
              className="w-full bg-black/40 border border-white/5 p-6 rounded-[2rem] text-2xl font-mono font-bold text-white outline-none focus:border-blue-500/40"
            />
          </div>
          <div className="md:col-span-1 flex justify-center text-zinc-800 pt-6"><ArrowRightLeft size={24} /></div>
          <div className="md:col-span-5 space-y-2">
            <label className="text-[9px] font-black text-zinc-600 uppercase ml-4 tracking-widest">Estimated Value (₹)</label>
            <div className="relative">
              <input type="number" value={calc.total} onChange={(e) => handleCalc("total", e.target.value)}
                className="w-full bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-[2rem] text-2xl font-mono font-bold text-emerald-400 outline-none"
              />
              <TrendingUp size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-emerald-500/20" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-black/20 rounded-[2rem] border border-white/5 flex flex-col md:flex-row gap-6 justify-between">
           <InfoItem label="Current Rate" value={`₹${rates[selectedMetal].toLocaleString()}/g`} />
           <InfoItem label="Metal Purity" value={metalOptions.find(o => o.key === selectedMetal)?.purity || ""} />
           <InfoItem label="Typical Use" value={getUsage(selectedMetal)} />
        </div>
      </div>
    </div>
  );
}

// Sub-components
function InfoItem({ label, value }: any) {
    return (
        <div className="space-y-1">
            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{label}</p>
            <p className="text-xs font-bold text-zinc-300 uppercase tracking-tighter">{value}</p>
        </div>
    )
}

function RateCard({ label, price, icon, percent, highlight }: any) {
  return (
    <div className={`p-8 rounded-[2.5rem] border transition-all duration-500 hover:scale-[1.01] ${highlight}`}>
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-black/40 rounded-2xl border border-white/5">{icon}</div>
        <div className="bg-black/40 px-3 py-1 rounded-full border border-white/5">
            <p className="text-[10px] font-black text-white font-mono">{percent}</p>
        </div>
      </div>
      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-black text-white font-mono tracking-tighter">₹{(price || 0).toLocaleString()}</p>
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