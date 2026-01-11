"use client";

import React from "react";
import { Mail, MapPin, Briefcase, ChevronRight, LayoutGrid, Code2, Terminal, Cpu } from "lucide-react";
import { resume } from "./ats/resume";

export default function PortfolioPage() {
  // Mapping icons to your skill categories for visual flair
  const categoryIcons: Record<string, React.ReactNode> = {
    frontend: <Code2 size={20} className="text-blue-400 mb-4" />,
    backend: <Terminal size={20} className="text-emerald-400 mb-4" />,
    tools: <Cpu size={20} className="text-purple-400 mb-4" />,
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 px-4 pt-8 bg-black text-zinc-300 min-h-screen font-sans">
      {/* --- HEADER --- */}
      <header className="p-8 md:p-12 rounded-[2.5rem] bg-zinc-900/40 border border-zinc-800/50">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white italic lowercase mb-4">
          {resume.header.name.split(' ')[0]}<span className="text-zinc-700">{resume.header.name.split(' ')[1]}</span>
        </h1>
        <p className="text-blue-500 font-mono tracking-widest uppercase text-sm mb-6">{resume.header.title}</p>
        <div className="flex flex-wrap gap-6 text-xs font-bold text-zinc-500">
          <span className="flex items-center gap-2"><Mail size={14} /> {resume.header.email}</span>
          <span className="flex items-center gap-2"><MapPin size={14} /> {resume.header.location}</span>
        </div>
      </header>

      {/* --- DYNAMIC SKILLS BENTO --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(resume.skills).map(([category, list]) => (
          <div key={category} className="p-6 rounded-3xl bg-zinc-900/20 border border-zinc-800/50 hover:bg-zinc-900/40 transition-all group">
            {categoryIcons[category] || <LayoutGrid size={20} className="text-zinc-400 mb-4" />}
            <h3 className="text-[10px] font-black uppercase tracking-widest mb-4 text-zinc-500 group-hover:text-blue-400 transition-colors">
              {category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {list.map(skill => (
                <span key={skill} className="px-2 py-1 bg-black/40 border border-zinc-800 rounded text-[10px] text-zinc-400">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* --- EXPERIENCE --- */}
      <section className="space-y-8">
        <h3 className="text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase flex items-center gap-4">
          <Briefcase size={18} /> Career History
        </h3>
        <div className="space-y-12 border-l border-zinc-800 ml-4">
          {resume.experience.map((exp, idx) => (
            <div key={idx} className="relative pl-10 group">
              <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-zinc-800 group-hover:bg-blue-500 transition-colors" />
              <h4 className="text-2xl font-bold text-white leading-none mb-1">{exp.role}</h4>
              <p className="text-blue-500 text-sm mb-4 font-mono">{exp.company} • {exp.period}</p>
              <ul className="space-y-2">
                {exp.points.map((pt, i) => (
                  <li key={i} className="text-sm text-zinc-400 flex items-start gap-2 leading-relaxed">
                    <ChevronRight size={14} className="mt-1 text-zinc-700 shrink-0" /> {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* --- DYNAMIC ADDITIONAL SECTIONS (Education, etc.) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-zinc-900">
        {resume.additionalSections.map((section) => (
          <section key={section.title} className="space-y-6">
            <h3 className="text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase flex items-center gap-4">
              <LayoutGrid size={18} /> {section.title}
            </h3>
            <div className="space-y-6">
              {section.items.map((item, i) => (
                <div key={i} className="p-6 rounded-2xl bg-zinc-900/10 border border-zinc-800/30 group hover:border-zinc-700 transition-all">
                  <h4 className="text-white font-bold text-sm">{item.heading}</h4>
                  <p className="text-blue-500 text-[11px] font-mono mt-1">{item.subHeading}</p>
                  <p className="text-zinc-500 text-xs mt-3 leading-relaxed italic">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}