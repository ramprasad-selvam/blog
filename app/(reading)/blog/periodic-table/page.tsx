'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { Elements } from './elements';

const categoryColors: Record<string, string> = {
  "diatomic nonmetal": "bg-sky-100 border-sky-400 text-sky-900",
  "noble gas": "bg-purple-100 border-purple-400 text-purple-900",
  "alkali metal": "bg-red-100 border-red-400 text-red-900",
  "alkaline earth metal": "bg-orange-100 border-orange-400 text-orange-900",
  "metalloid": "bg-emerald-100 border-emerald-400 text-emerald-900",
  "polyatomic nonmetal": "bg-cyan-100 border-cyan-400 text-cyan-900",
  "post-transition metal": "bg-slate-200 border-slate-400 text-slate-900",
  "transition metal": "bg-yellow-100 border-yellow-400 text-yellow-900",
  "lanthanide": "bg-indigo-100 border-indigo-400 text-indigo-900",
  "actinide": "bg-pink-100 border-pink-400 text-pink-900",
  "unknown, probably transition metal": "bg-gray-100 border-gray-300 text-gray-600",
  "unknown, probably post-transition metal": "bg-gray-100 border-gray-300 text-gray-600",
};

export default function PeriodicTablePage() {
  const elements = Elements.elements;
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const handleCategoryClick = (category: string) => {
    setActiveCategory(prev => prev === category ? null : category);
  };

  const normalizedSearch = search.trim().toLowerCase();
  const visibleElements = elements.filter((element) => {
    const matchesCategory = !activeCategory || activeCategory === element.category;
    const matchesSearch = !normalizedSearch || [element.name, element.symbol, String(element.number)]
      .some(value => value.toLowerCase().includes(normalizedSearch));
    return matchesCategory && matchesSearch;
  });
  const visibleNumbers = new Set(visibleElements.map(element => element.number));

  return (
    // Changed bg-white and text-slate-900 for maximum readability
    <main className="reading-detail min-h-screen bg-white text-slate-900 font-sans">
      <div className="mx-auto max-w-[1600px] p-0 sm:p-4 lg:p-8">
        <header className="mb-8 max-w-3xl sm:mb-12">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Interactive Reference</p>
          <h1 className="text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">The Periodic Table</h1>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">Explore the elements by family, then open any tile for its properties, history, and visual profile.</p>
        </header>
        <section className="periodic-panel rounded-3xl border border-slate-200 bg-slate-50/70 p-3 sm:p-5 lg:p-7" aria-label="Periodic table">
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">{visibleElements.length} of {elements.length} elements</p>
            <span className="shrink-0 text-[10px] font-bold text-slate-400 sm:hidden">Swipe to explore</span>
          </div>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by element, symbol, or atomic number..."
                aria-label="Search elements"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-10 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
              {search && <button type="button" onClick={() => setSearch('')} aria-label="Clear element search" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X size={15} /></button>}
            </div>
            {activeCategory && <button type="button" onClick={() => setActiveCategory(null)} className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-700 hover:bg-emerald-100">Clear family filter</button>}
          </div>
        <div className="overflow-x-auto pb-8">
        <div className="grid w-[1320px] min-w-[1320px] grid-cols-[repeat(18,minmax(0,1fr))] gap-1.5 md:gap-2">
          <div className="series-reference lanthanide-reference col-start-3 row-start-6 flex h-[64px] flex-col items-center justify-center border border-dashed border-teal-300 bg-teal-50 p-1 text-center md:h-[76px] md:p-2">
            <span className="text-[9px] font-black uppercase tracking-tight text-teal-700 md:text-[10px]">57-71</span>
            <span className="mt-1 text-[7px] font-bold uppercase leading-tight text-teal-600 md:text-[8px]">Lanthanides</span>
            <span className="mt-1 text-[6px] font-semibold text-teal-500 md:text-[7px]">See below</span>
          </div>
          <div className="series-reference actinide-reference col-start-3 row-start-7 flex h-[64px] flex-col items-center justify-center border border-dashed border-amber-300 bg-amber-50 p-1 text-center md:h-[76px] md:p-2">
            <span className="text-[9px] font-black uppercase tracking-tight text-amber-700 md:text-[10px]">89-103</span>
            <span className="mt-1 text-[7px] font-bold uppercase leading-tight text-amber-600 md:text-[8px]">Actinides</span>
            <span className="mt-1 text-[6px] font-semibold text-amber-500 md:text-[7px]">See below</span>
          </div>
          {elements.map((el) => {
            const categoryConfig = categoryColors[el.category] || "bg-gray-50 border-gray-200 text-gray-400";
            const isDimmed = !visibleNumbers.has(el.number);

            const classArray = categoryConfig.split(' ');
            const containerClasses = classArray.filter(c => c.startsWith('bg-') || c.startsWith('border-')).join(' ');
            const textClass = classArray.find(c => c.startsWith('text-')) || "text-slate-900";

            return (
              <Link
                key={el.number}
                href={`/blog/periodic-table/${el.symbol.toLowerCase()}`}
                title={`${el.name} (${el.symbol})`}
                style={{ gridColumn: el.xpos, gridRow: el.ypos }}
                className={`element-tile group h-[64px] border ${containerClasses} transition-all duration-200 flex flex-col p-1 md:h-[76px] md:p-2 relative
                  ${isDimmed ? 'opacity-20 grayscale scale-95' : 'opacity-100 shadow-sm hover:shadow-md hover:scale-105 hover:z-10'}
                `}
              >
                <span className={`element-number text-[8px] md:text-[10px] font-bold leading-none ${textClass}`}>
                  {el.number}
                </span>
                <span className={`element-symbol text-sm md:text-xl font-black text-center flex-1 flex items-center justify-center ${textClass}`}>
                  {el.symbol}
                </span>
                <span className={`element-name px-0.5 text-[7px] leading-tight md:text-[9px] uppercase font-bold text-center break-words ${textClass}`}>
                  {el.name}
                </span>
              </Link>
            );
          })}
        </div>
        </div>

        {/* --- Interactive Legend --- */}
        </section>
        <section className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-7" aria-labelledby="legend-title">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 id="legend-title" className="flex items-center text-xs font-bold uppercase tracking-[0.3em] text-slate-500">
                <span className="mr-2 h-2 w-2 bg-slate-400"></span>
                Classification Legend
              </h2>
            </div>
            <span className="hidden text-xs text-slate-400 sm:block">Select a family to highlight it</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-y-4 gap-x-2">
            {Object.entries(categoryColors).map(([category, config]) => {
              const classArray = config.split(' ');
              const boxClasses = classArray.filter(c => c.startsWith('bg-') || c.startsWith('border-')).join(' ');
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`flex items-center gap-3 group transition-all ${activeCategory && !isActive ? 'opacity-40' : 'opacity-100'}`}
                >
                  <div className={`w-4 h-4 border shadow-sm ${boxClasses} ${isActive ? 'ring-2 ring-slate-900 scale-110' : 'group-hover:scale-110'}`} />
                  <span className={`text-[10px] uppercase font-bold tracking-tight transition-colors ${isActive ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>
                    {category.replace("unknown, probably ", "? ")}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}