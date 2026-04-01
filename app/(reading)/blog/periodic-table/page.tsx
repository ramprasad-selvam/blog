'use client';

import { useState } from 'react';
import Link from 'next/link';
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

  const handleCategoryClick = (category: string) => {
    setActiveCategory(prev => prev === category ? null : category);
  };

  return (
    // Changed bg-white and text-slate-900 for maximum readability
    <main className="min-h-screen bg-white text-slate-900 font-sans">
      <div className="max-w-[85%] mx-auto p-10">
        <div className="grid grid-cols-[repeat(18,minmax(0,1fr))] gap-1 md:gap-2 min-w-[1000px] overflow-x-auto pb-10">
          {elements.map((el) => {
            const categoryConfig = categoryColors[el.category] || "bg-gray-50 border-gray-200 text-gray-400";
            const isDimmed = activeCategory && activeCategory !== el.category;

            const classArray = categoryConfig.split(' ');
            const containerClasses = classArray.filter(c => c.startsWith('bg-') || c.startsWith('border-')).join(' ');
            const textClass = classArray.find(c => c.startsWith('text-')) || "text-slate-900";

            return (
              <Link
                key={el.number}
                href={`/blog/periodic-table/${el.symbol.toLowerCase()}`}
                style={{ gridColumn: el.xpos, gridRow: el.ypos }}
                className={`group aspect-square border ${containerClasses} transition-all duration-200 flex flex-col p-1 md:p-2 relative
                  ${isDimmed ? 'opacity-20 grayscale scale-95' : 'opacity-100 shadow-sm hover:shadow-md hover:scale-105 hover:z-10'}
                `}
              >
                <span className={`text-[8px] md:text-[10px] font-bold leading-none ${textClass}`}>
                  {el.number}
                </span>
                <span className={`text-sm md:text-xl font-black text-center flex-1 flex items-center justify-center ${textClass}`}>
                  {el.symbol}
                </span>
                <span className={`text-[6px] md:text-[8px] uppercase font-bold text-center truncate ${textClass}`}>
                  {el.name}
                </span>
              </Link>
            );
          })}
        </div>

        {/* --- Interactive Legend --- */}
        <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl">
          <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500 mb-6 flex items-center">
            <span className="w-2 h-2 bg-slate-400 mr-2"></span>
            Classification Legend
          </h3>
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
        </div>
      </div>
    </main>
  );
}