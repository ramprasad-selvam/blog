"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Search, MapPin, Trash2, Plus, Moon, Sun, Sunrise, Sunset, CloudSun, Globe, Cloud } from "lucide-react";

const ALL_TIMEZONES = Intl.supportedValuesOf('timeZone');

export default function WorldClockDashboard() {
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [weatherData, setWeatherData] = useState<Record<string, string>>({});
  const [use12Hour, setUse12Hour] = useState(true);
  const [time, setTime] = useState(new Date());
  const [search, setSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedZones = localStorage.getItem("devbox_clock_zones");
    const saved12H = localStorage.getItem("devbox_clock_12h");
    if (savedZones) setSelectedZones(JSON.parse(savedZones));
    else setSelectedZones(["Asia/Kolkata", "Asia/Kuwait", "Asia/Singapore", "Asia/Dubai"]);
    if (saved12H) setUse12Hour(saved12H === "true");
    setIsLoaded(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("devbox_clock_zones", JSON.stringify(selectedZones));
      localStorage.setItem("devbox_clock_12h", use12Hour.toString());
    }
  }, [selectedZones, use12Hour, isLoaded]);

  const fetchWeather = async (zone: string) => {
    try {
      const city = zone.split('/').pop()?.replace(/_/g, ' ');
      const response = await fetch(`https://wttr.in/${city}?format=%c%t`);
      const data = await response.text();
      if (!data.includes("Unknown")) setWeatherData(prev => ({ ...prev, [zone]: data }));
    } catch (e) { console.error("Weather unreachable"); }
  };

  useEffect(() => {
    selectedZones.forEach(zone => { if (!weatherData[zone]) fetchWeather(zone); });
  }, [selectedZones]);

  // --- Strict Mapping of Your Provided Stages ---
  const getDayPeriod = (hour: number) => {
    if (hour >= 5 && hour < 8)   return { label: "Early Morning", icon: <Sunrise size={18} />, color: "text-orange-400", bg: "bg-orange-500", duration: 3, start: 5 };
    if (hour >= 8 && hour < 12)  return { label: "Morning", icon: <Sun size={18} />, color: "text-amber-400", bg: "bg-amber-500", duration: 4, start: 8 };
    if (hour >= 12 && hour < 17) return { label: "Afternoon", icon: <CloudSun size={18} />, color: "text-yellow-400", bg: "bg-yellow-500", duration: 5, start: 12 };
    if (hour >= 17 && hour < 20) return { label: "Evening", icon: <Sunset size={18} />, color: "text-rose-400", bg: "bg-rose-500", duration: 3, start: 17 };
    if (hour >= 20 || hour < 0)  return { label: "Night", icon: <Moon size={18} />, color: "text-blue-400", bg: "bg-blue-500", duration: 4, start: 20 };
    // Pre-Dawn (12 AM - 5 AM)
    return { label: "Pre‑Dawn", icon: <Cloud size={18} />, color: "text-indigo-500", bg: "bg-indigo-600", duration: 5, start: 0 };
  };

  const addZone = (zone: string) => {
    if (selectedZones.length < 6 && !selectedZones.includes(zone)) setSelectedZones(prev => [...prev, zone]);
    setSearch(""); setIsDropdownOpen(false);
  };

  if (!isLoaded) return <div className="min-h-full bg-zinc-950 flex items-center justify-center text-zinc-700 font-black uppercase tracking-[0.4em]">Calibrating HUD</div>;

  return (
    <div className="min-h-full bg-zinc-950 p-6 md:p-12 rounded-[4rem] space-y-10 text-white selection:bg-blue-500">
      
      {/* Search & Toggle */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-8 border-b border-white/5 pb-10">
        <div className="flex bg-zinc-900/40 p-1.5 rounded-2xl border border-white/5 shadow-inner">
          <button onClick={() => setUse12Hour(true)} className={`px-8 py-2.5 rounded-xl text-[10px] font-black transition-all ${use12Hour ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-600'}`}>12H</button>
          <button onClick={() => setUse12Hour(false)} className={`px-8 py-2.5 rounded-xl text-[10px] font-black transition-all ${!use12Hour ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-600'}`}>24H</button>
        </div>

        <div className="relative w-full md:w-[500px]" ref={dropdownRef}>
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600" size={20} />
          <input 
            type="text" placeholder="Global City Search..." value={search}
            onFocus={() => setIsDropdownOpen(true)}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900/30 border border-white/10 p-5 pl-16 rounded-[2rem] text-xs font-bold outline-none focus:ring-2 ring-blue-500/20 transition-all"
          />
          {isDropdownOpen && (
            <div className="absolute top-full mt-4 w-full max-h-80 overflow-y-auto bg-zinc-900 border border-zinc-800 rounded-[2rem] z-[100] shadow-2xl scrollbar-hide">
              {ALL_TIMEZONES.filter(tz => tz.toLowerCase().includes(search.toLowerCase())).slice(0, 12).map(tz => (
                <button key={tz} onClick={() => addZone(tz)} className="w-full text-left px-8 py-5 text-[10px] font-black border-b border-white/5 hover:bg-blue-600 flex justify-between items-center uppercase tracking-widest transition-colors">
                  {tz.replace(/_/g, ' ')} <Plus size={16} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {selectedZones.map((zone) => {
          const tzDate = new Date(time.toLocaleString("en-US", { timeZone: zone }));
          const h = tzDate.getHours();
          const m = tzDate.getMinutes();
          const period = getDayPeriod(h);

          // Correct block calculation for Pre-Dawn and Night spanning midnight
          let hoursPassedInBlock = h - period.start;
          if (period.label === "Night" && h < period.start) hoursPassedInBlock = (h + 24) - period.start;
          
          const totalMin = period.duration * 60;
          const currentMin = (hoursPassedInBlock * 60) + m;

          return (
            <div key={zone} className="relative group bg-zinc-900/20 border border-white/5 rounded-[4rem] p-12 flex flex-col justify-between min-h-[440px] transition-all hover:bg-zinc-900/30 hover:border-white/10 shadow-2xl overflow-hidden">
              
              {/* AM/PM Side Glow */}
              {use12Hour && (
                <div className={`absolute right-0 top-0 bottom-0 w-24 flex items-center justify-center ${h >= 12 ? 'bg-blue-500/5' : 'bg-amber-500/5'}`}>
                  <span className={`rotate-90 text-5xl font-black tracking-widest opacity-10 ${h >= 12 ? 'text-blue-500' : 'text-amber-500'}`}>
                    {h >= 12 ? 'P.M.' : 'A.M.'}
                  </span>
                </div>
              )}

              {/* City & Weather */}
              <div className="relative z-10 flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <h3 className="text-4xl font-black tracking-tighter">{zone.split('/').pop()?.replace(/_/g, ' ')}</h3>
                    {/* {weatherData[zone] && (
                      <span className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-2xl text-[11px] font-black text-blue-400">
                        {weatherData[zone]}
                      </span>
                    )} */}
                  </div>
                  <span className="block text-[11px] font-black uppercase tracking-[0.4em] text-zinc-600">{zone.split('/')[0]}</span>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setSelectedZones(prev => prev.filter(z => z !== zone)); }} 
                  className="p-4 text-zinc-800 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={24} />
                </button>
              </div>

              {/* Digital HUD Time */}
              <div className="relative z-10">
                <h2 className="text-[9vw] md:text-[6vw] font-mono font-bold tracking-tighter tabular-nums leading-none">
                  {new Intl.DateTimeFormat("en-US", { 
                    timeZone: zone, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: use12Hour 
                  }).format(time).replace(/AM|PM/, '').trim()}
                </h2>
              </div>

              {/* Adaptive Stage & Duration Segments */}
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between pt-10 border-t border-white/5 gap-6">
                <div className="flex items-center gap-4">
                  <span className={`${period.color} drop-shadow-[0_0_12px_rgba(255,255,255,0.1)]`}>{period.icon}</span>
                  <div className="flex flex-col">
                    <span className={`text-[12px] font-black uppercase tracking-[0.2em] ${period.color}`}>{period.label}</span>
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">{tzDate.toDateString()}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">
                    {Math.floor((totalMin - currentMin) / 60)}H {(totalMin - currentMin) % 60}M TO NEXT STAGE
                  </span>
                  {/* DYNAMIC BARS: Number of bars = Period Duration */}
                  <div className="flex gap-2 p-2.5 bg-black/40 rounded-2xl border border-white/5">
                    {[...Array(period.duration)].map((_, i) => {
                      const isFull = hoursPassedInBlock > i;
                      const isNow = hoursPassedInBlock === i;
                      
                      return (
                        <div key={i} className={`h-8 w-2.5 rounded-full transition-all duration-1000 ${
                          isFull 
                            ? `${period.bg} shadow-lg opacity-100` 
                            : isNow 
                              ? `${period.bg} animate-pulse opacity-40` 
                              : "bg-zinc-800 opacity-20"
                        }`} />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}