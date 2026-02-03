"use client";

import { useState } from "react";
import { 
  Copy, ArrowRightLeft, Check
} from "lucide-react";

// --- TYPES & INTERFACES ---
type Category = "area" | "length" | "mass" | "temp" | "volume" | "digital" | "speed" | "pressure";

interface FieldProps {
  label: string;
  val: string;
  on: (val: string) => void;
  id: string;
  copy: (val: string, id: string) => void;
  copied: string | null;
}

interface RefCardProps {
  title: string;
  notes: string;
  items: string[];
}

export default function UniversalConverter() {
  const [activeTab, setActiveTab] = useState<Category>("area");
  const [copied, setCopied] = useState<string | null>(null);

  // --- STATE MANAGEMENT ---
  const [area, setArea] = useState({ acre: "1", cent: "100", sqft: "43560", sqm: "4046.86", sqyard: "4840", hectare: "0.4046" });
  const [length, setLength] = useState({ m: "1", ft: "3.2808", in: "39.37", cm: "100", mm: "1000", km: "0.001", mile: "0.00062" });
  const [mass, setMass] = useState({ kg: "1", lbs: "2.2046", oz: "35.27", g: "1000", ton: "0.001", mg: "1000000" });
  const [volume, setVolume] = useState({ l: "1", gal: "0.2641", ml: "1000", cf: "0.0353", cup: "4.226", pt: "2.113" });
  const [digital, setDigital] = useState({ gb: "1", mb: "1024", tb: "0.00097", bit: "8589934592", kb: "1048576" });
  const [temp, setTemp] = useState({ c: "0", f: "32", k: "273.15" });
  const [speed, setSpeed] = useState({ kmh: "100", mph: "62.13", ms: "27.77", knot: "53.99" });
  const [pressure, setPressure] = useState({ bar: "1", psi: "14.50", pascal: "100000", atm: "0.98" });

  // --- CONVERSION ENGINE ---
  const handleConvert = (cat: Category, unit: string, val: string) => {
    const v = parseFloat(val) || 0;
    if (val === "") return;

    if (cat === "area") {
      const f: Record<string, number> = { acre: 43560, cent: 435.6, sqft: 1, sqm: 10.7639, sqyard: 9, hectare: 107639 };
      const base = v * f[unit];
      setArea({ acre: (base / f.acre).toFixed(4), cent: (base / f.cent).toFixed(2), sqft: base.toFixed(2), sqm: (base / f.sqm).toFixed(2), sqyard: (base / f.sqyard).toFixed(2), hectare: (base / f.hectare).toFixed(4) });
    } else if (cat === "length") {
      const f: Record<string, number> = { m: 1, ft: 0.3048, in: 0.0254, cm: 0.01, mm: 0.001, km: 1000, mile: 1609.34 };
      const base = v * f[unit];
      setLength({ m: base.toFixed(2), ft: (base / f.ft).toFixed(2), in: (base / f.in).toFixed(2), cm: (base / f.cm).toFixed(0), mm: (base / f.mm).toFixed(0), km: (base / f.km).toFixed(4), mile: (base / f.mile).toFixed(4) });
    } else if (cat === "mass") {
      const f: Record<string, number> = { kg: 1, lbs: 0.453592, oz: 0.0283495, g: 0.001, ton: 1000, mg: 0.000001 };
      const base = v * f[unit];
      setMass({ kg: base.toFixed(3), lbs: (base / f.lbs).toFixed(2), oz: (base / f.oz).toFixed(2), g: (base / f.g).toFixed(0), ton: (base / f.ton).toFixed(4), mg: (base / f.mg).toFixed(0) });
    } else if (cat === "volume") {
      const f: Record<string, number> = { l: 1, gal: 3.78541, ml: 0.001, cf: 28.3168, cup: 0.236588, pt: 0.473176 };
      const base = v * f[unit];
      setVolume({ l: base.toFixed(2), gal: (base / f.gal).toFixed(3), ml: (base / f.ml).toFixed(0), cf: (base / f.cf).toFixed(3), cup: (base / f.cup).toFixed(2), pt: (base / f.pt).toFixed(2) });
    } else if (cat === "speed") {
      const f: Record<string, number> = { kmh: 1, mph: 1.60934, ms: 3.6, knot: 1.852 };
      const base = v * f[unit];
      setSpeed({ kmh: base.toFixed(2), mph: (base / f.mph).toFixed(2), ms: (base / f.ms).toFixed(2), knot: (base / f.knot).toFixed(2) });
    } else if (cat === "pressure") {
      const f: Record<string, number> = { bar: 1, psi: 0.0689476, pascal: 0.00001, atm: 1.01325 };
      const base = v * f[unit];
      setPressure({ bar: base.toFixed(3), psi: (base / f.psi).toFixed(2), pascal: (base / f.pascal).toFixed(0), atm: (base / f.atm).toFixed(3) });
    } else if (cat === "digital") {
      const f: Record<string, number> = { gb: 1024, mb: 1, tb: 1048576, bit: 0.000000119209, kb: 0.0009765625 };
      const base = v * f[unit];
      setDigital({ gb: (base / 1024).toFixed(3), mb: base.toFixed(0), tb: (base / 1048576).toFixed(5), bit: (base * 8388608).toFixed(0), kb: (base * 1024).toFixed(0) });
    }
  };

  const handleTemp = (unit: string, val: string) => {
    const v = parseFloat(val) || 0;
    if (unit === 'c') setTemp({ c: val, f: ((v * 9/5) + 32).toFixed(1), k: (v + 273.15).toFixed(2) });
    if (unit === 'f') setTemp({ c: ((v - 32) * 5/9).toFixed(1), f: val, k: (((v - 32) * 5/9) + 273.15).toFixed(2) });
    if (unit === 'k') setTemp({ c: (v - 273.15).toFixed(1), f: ((v - 273.15) * 9/5 + 32).toFixed(1), k: val });
  };

  const refData: Record<Category, { title: string; notes: string; items: string[] }> = {
    area: { title: "Area & Land", notes: "Used for real estate and surveying.", items: ["1 Acre = 100 Cents", "1 Cent = 435.6 Sq. Ft", "1 Hectare = 2.471 Acres"] },
    length: { title: "Distance", notes: "Standard metric and imperial lengths.", items: ["1 Mile = 1.609 KM", "1 Meter = 3.281 Feet", "1 Inch = 2.54 CM"] },
    mass: { title: "Weight & Mass", notes: "Industrial and domestic weight scales.", items: ["1 KG = 2.204 Pounds", "1 Pound = 16 Ounces", "1 Ton = 1000 KG"] },
    volume: { title: "Liquid Volume", notes: "Fluid capacity measurements.", items: ["1 US Gal = 3.785 Liters", "1 Cubic Ft = 28.31 L", "1 Cup = 236.6 ML"] },
    speed: { title: "Speed & Velocity", notes: "Aviation and transit motion.", items: ["1 MPH = 1.609 KMH", "1 Knot = 1.852 KMH", "1 M/S = 3.6 KMH"] },
    pressure: { title: "Pressure Scales", notes: "Atmospheric and industrial force.", items: ["1 Bar = 14.503 PSI", "1 ATM = 1.013 Bar", "1 Bar = 100k Pascals"] },
    digital: { title: "Digital Storage", notes: "Binary based data calculations.", items: ["1 TB = 1024 GB", "1 GB = 1024 MB", "1 Byte = 8 Bits"] },
    temp: { title: "Thermal Points", notes: "Standard thermodynamic scales.", items: ["Freezing: 0°C / 32°F", "Boiling: 100°C / 212°F", "Room: 25°C / 77°F"] },
  };

  const handleCopy = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 animate-in fade-in duration-1000">
      
      {/* HEADER */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black italic tracking-tighter text-white uppercase">
          Unit <span className="text-blue-500">Forge</span>
        </h1>
        <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-[0.4em] mt-3 underline underline-offset-8 decoration-blue-500/20">The Final Converter</p>
      </div>

      {/* TABS */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 bg-zinc-900/50 p-2 rounded-[2.5rem] border border-white/5 mb-8 gap-1">
        {(Object.keys(refData) as Category[]).map((tab) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)} 
            className={`flex items-center gap-2 px-4 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all justify-center ${activeTab === tab ? "bg-blue-600 text-white shadow-xl scale-105" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 bg-zinc-900/20 border border-white/5 rounded-[3.5rem] p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeTab === "area" && Object.entries(area).map(([u, v]) => <Field key={u} label={u} val={v} on={val => handleConvert('area', u, val)} id={u} copy={handleCopy} copied={copied} />)}
            {activeTab === "length" && Object.entries(length).map(([u, v]) => <Field key={u} label={u} val={v} on={val => handleConvert('length', u, val)} id={u} copy={handleCopy} copied={copied} />)}
            {activeTab === "mass" && Object.entries(mass).map(([u, v]) => <Field key={u} label={u} val={v} on={val => handleConvert('mass', u, val)} id={u} copy={handleCopy} copied={copied} />)}
            {activeTab === "volume" && Object.entries(volume).map(([u, v]) => <Field key={u} label={u} val={v} on={val => handleConvert('volume', u, val)} id={u} copy={handleCopy} copied={copied} />)}
            {activeTab === "speed" && Object.entries(speed).map(([u, v]) => <Field key={u} label={u} val={v} on={val => handleConvert('speed', u, val)} id={u} copy={handleCopy} copied={copied} />)}
            {activeTab === "pressure" && Object.entries(pressure).map(([u, v]) => <Field key={u} label={u} val={v} on={val => handleConvert('pressure', u, val)} id={u} copy={handleCopy} copied={copied} />)}
            {activeTab === "digital" && Object.entries(digital).map(([u, v]) => <Field key={u} label={u} val={v} on={val => handleConvert('digital', u, val)} id={u} copy={handleCopy} copied={copied} />)}
            {activeTab === "temp" && Object.entries(temp).map(([u, v]) => <Field key={u} label={u} val={v} on={val => handleTemp(u, val)} id={u} copy={handleCopy} copied={copied} />)}
          </div>
        </div>

        <div className="lg:col-span-1">
          <ReferenceCard 
            title={refData[activeTab].title} 
            notes={refData[activeTab].notes} 
            items={refData[activeTab].items} 
          />
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function Field({ label, val, on, id, copy, copied }: FieldProps) {
  return (
    <div className="space-y-3 bg-black/30 p-6 rounded-[2.2rem] border border-white/5 hover:border-blue-500/20 transition-all">
      <div className="flex justify-between items-center px-2">
        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{label}</label>
        <button onClick={() => copy(val, id)} className="text-zinc-800 hover:text-blue-500 transition-colors">
          {copied === id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
        </button>
      </div>
      <input 
        type="number" step="any"
        value={val} 
        onChange={(e) => on(e.target.value)} 
        className="w-full bg-transparent text-3xl font-mono font-bold text-white outline-none placeholder:text-zinc-900" 
      />
    </div>
  );
}

function ReferenceCard({ title, notes, items }: RefCardProps) {
  return (
    <div className="p-8 rounded-[3rem] bg-blue-600 text-white shadow-2xl shadow-blue-600/20">
      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-80">{title}</h4>
      <p className="text-sm font-bold mb-6 leading-tight">{notes}</p>
      <div className="space-y-3 pt-6 border-t border-white/20">
        {items.map((it, i) => (
          <div key={i} className="flex justify-between items-center">
            <span className="text-[11px] font-mono font-bold">{it.split('=')[0]}</span>
            <ArrowRightLeft size={10} className="opacity-40" />
            <span className="text-[11px] font-mono font-bold">{it.split('=')[1]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
