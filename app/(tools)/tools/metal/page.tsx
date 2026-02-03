"use client";

import { useState, useEffect } from "react";
import { 
  Gem, Coins, Calculator, ArrowRightLeft, 
  TrendingUp, Info, Activity 
} from "lucide-react";
// Add these imports
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function MetalDashboard() {
  const [rates, setRates] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]); // New state for graph
  const [loading, setLoading] = useState(true);
  const [selectedMetal, setSelectedMetal] = useState("gold_22k");
  const [calc, setCalc] = useState({ grams: "1", total: "" });

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
        console.error(error); 
      } finally { 
        setLoading(false); 
      }
    }
    getData();
  }, []);

  // ... (keep handleCalc and changeMetal functions same as your original)
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

  if (loading || !rates) return <div className="p-20 text-center animate-pulse text-zinc-500 font-black uppercase tracking-widest">Loading Market Data...</div>;

  const metalOptions = [
    { key: "gold_24k", label: "24K", purity: "99.9%" },
    { key: "gold_22k", label: "22K", purity: "91.6%" },
    { key: "gold_18k", label: "18K", purity: "75.0%" },
    { key: "gold_14k", label: "14K", purity: "58.5%" },
    { key: "platinum", label: "Plat", purity: "95.0%" },
    { key: "silver", label: "Silv", purity: "92.5%" },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-700 pb-20 px-4">
      
      {/* 1. TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RateCard label="24K Investment" price={rates.gold_24k} icon={<Gem className="text-yellow-400" />} percent="99.9%" highlight="border-yellow-500/20 bg-yellow-500/5" />
        <RateCard label="22K Standard" price={rates.gold_22k} icon={<Coins className="text-orange-400" />} percent="91.6%" highlight="border-orange-500/20 bg-orange-500/5" />
      </div>

      {/* 2. GRAPH SECTION */}
      <div className="bg-zinc-900/20 border border-white/5 rounded-[3rem] p-8">
        <h2 className="text-xl font-black italic text-white uppercase tracking-tighter flex items-center gap-2 mb-8">
          <Activity size={22} className="text-orange-500" /> Price Trend (90 Days)
        </h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="date" stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }}
                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
              />
              <Line type="monotone" dataKey="gold_24k" stroke="#eab308" strokeWidth={3} dot={false} name="24K Gold" />
              <Line type="monotone" dataKey="gold_22k" stroke="#f97316" strokeWidth={2} dot={false} name="22K Gold" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. ADVANCED CALCULATOR */}
      <div className="bg-zinc-900/20 border border-white/5 rounded-[3rem] p-8 md:p-12 space-y-10 relative overflow-hidden">
        {/* ... (Keep your original calculator code here) ... */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-1">
            <h2 className="text-xl font-black italic text-white uppercase tracking-tighter flex items-center gap-2">
              <Calculator size={22} className="text-blue-500" /> Professional Estimator
            </h2>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Calculated using live {selectedMetal.replace('_', ' ')} rate</p>
          </div>
          
          <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 w-full md:w-auto overflow-x-auto no-scrollbar">
            {metalOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => changeMetal(opt.key)}
                className={`flex flex-col items-center px-4 py-2 rounded-xl transition-all min-w-[70px] ${
                  selectedMetal === opt.key 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                  : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <span className="text-[10px] font-black uppercase tracking-tighter">{opt.label}</span>
                <span className={`text-[7px] font-bold uppercase ${selectedMetal === opt.key ? "text-blue-100" : "text-zinc-700"}`}>{opt.purity}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center relative z-10">
          <div className="md:col-span-5 space-y-2">
            <label className="text-[9px] font-black text-zinc-600 uppercase ml-4">Weight (Grams)</label>
            <input 
              type="number" value={calc.grams} onChange={(e) => handleCalc("grams", e.target.value)}
              className="w-full bg-black/40 border border-white/5 p-6 rounded-[2rem] text-2xl font-mono font-bold text-white outline-none focus:border-blue-500/40"
            />
          </div>
          <div className="md:col-span-1 flex justify-center text-zinc-800 pt-6"><ArrowRightLeft size={24} /></div>
          <div className="md:col-span-5 space-y-2">
            <label className="text-[9px] font-black text-zinc-600 uppercase ml-4">Estimated Value (₹)</label>
            <div className="relative">
              <input 
                type="number" value={calc.total} onChange={(e) => handleCalc("total", e.target.value)}
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

// ... (keep InfoItem, RateCard, and getUsage helper functions as they were)
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
    <div className={`p-8 rounded-[2.5rem] border transition-all ${highlight}`}>
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