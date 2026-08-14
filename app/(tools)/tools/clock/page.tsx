"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Search, MapPin, Trash2, Plus, Moon, Sun, Sunrise, Sunset, CloudSun, Globe, Cloud } from "lucide-react";
import { secondsToMilliseconds } from "framer-motion";

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
    const timer = setInterval(() => setTime(new Date(Date.now() + 0.6 * secondsToMilliseconds(1))), 1000);
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

  if (!isLoaded) return <div className="flex min-h-[60vh] items-center justify-center text-xs font-black uppercase tracking-[0.35em] text-zinc-500">Loading clocks</div>;

  return (
    <div className="mx-auto flex min-h-full w-full max-w-7xl flex-col gap-8 rounded-3xl bg-zinc-950 p-4 text-white selection:bg-blue-500 sm:p-6 lg:p-10">
      
      {/* Search & Toggle */}
      <div className="flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Time utility</p>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">World Clock</h1>
          <p className="mt-2 text-sm text-zinc-500">Compare local time across the places that matter to you.</p>
        </div>
        <div className="flex w-fit rounded-xl border border-white/10 bg-zinc-900/70 p-1">
          <button onClick={() => setUse12Hour(true)} className={`rounded-lg px-5 py-2.5 text-[10px] font-black transition-all ${use12Hour ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}>12H</button>
          <button onClick={() => setUse12Hour(false)} className={`rounded-lg px-5 py-2.5 text-[10px] font-black transition-all ${!use12Hour ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}>24H</button>
        </div>

        <div className="relative w-full lg:max-w-xl" ref={dropdownRef}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
          <input 
            type="text" placeholder="Global City Search..." value={search}
            onFocus={() => setIsDropdownOpen(true)}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-zinc-900/50 p-4 pl-11 text-sm font-bold outline-none transition-all focus:border-blue-500/50 focus:ring-2 ring-blue-500/20"
          />
          {isDropdownOpen && (
            <div className="absolute top-full z-[100] mt-2 max-h-80 w-full overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl scrollbar-hide">
              {ALL_TIMEZONES.filter(tz => tz.toLowerCase().includes(search.toLowerCase())).slice(0, 12).map(tz => (
                <button key={tz} onClick={() => addZone(tz)} className="flex w-full items-center justify-between border-b border-white/5 px-5 py-4 text-left text-[10px] font-black uppercase tracking-widest transition-colors hover:bg-blue-600">
                  {tz.replace(/_/g, ' ')} <Plus size={16} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
            <div key={zone} className="group relative flex min-h-[390px] flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/30 p-6 shadow-2xl transition-all hover:border-white/20 hover:bg-zinc-900/50 sm:min-h-[420px] sm:p-8">
              
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
                    <h3 className="text-3xl font-black tracking-tight sm:text-4xl">{zone.split('/').pop()?.replace(/_/g, ' ')}</h3>
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
                  aria-label={`Remove ${zone}`}
                  className="rounded-xl p-3 text-zinc-600 transition-all hover:bg-red-500/10 hover:text-red-400 sm:opacity-0 sm:group-hover:opacity-100"
                >
                  <Trash2 size={24} />
                </button>
              </div>

              {/* Digital HUD Time */}
              <div className="relative z-10">
                <h2 className="font-mono text-[clamp(2.8rem,6vw,5.5rem)] font-bold tracking-tighter tabular-nums leading-none">
                  {new Intl.DateTimeFormat("en-US", { 
                    timeZone: zone, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: use12Hour 
                  }).format(time).replace(/AM|PM/, '').trim()}
                </h2>
              </div>

              {/* Adaptive Stage & Duration Segments */}
              <div className="relative z-10 flex flex-col gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className={`${period.color} drop-shadow-[0_0_12px_rgba(255,255,255,0.1)]`}>{period.icon}</span>
                  <div className="flex flex-col">
                    <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${period.color}`}>{period.label}</span>
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">{tzDate.toDateString()}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">
                    {Math.floor((totalMin - currentMin) / 60)}H {(totalMin - currentMin) % 60}M TO NEXT STAGE
                  </span>
                  {/* DYNAMIC BARS: Number of bars = Period Duration */}
                  <div className="flex gap-1.5 rounded-xl border border-white/10 bg-black/40 p-2">
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