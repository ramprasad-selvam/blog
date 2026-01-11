"use client";

import React from "react";
import { resume } from "./resume";

export default function ATSPage() {
  // Triggers the system print dialog which allows saving as PDF
  const handleDownloadPDF = () => {
    if (typeof window !== "undefined") {
window.location.href = '/api/resume/download';    }
  };

  return (
    <div className="bg-white min-h-screen text-black font-serif p-8 md:p-16 selection:bg-zinc-200">
      <div className="max-w-[800px] mx-auto">
        
        {/* PDF Action Button - Hidden during actual print/download */}
        <div className="flex justify-end mb-8 print:hidden">
          <button 
            onClick={handleDownloadPDF}
            className="bg-black text-white px-6 py-2 rounded-sm font-sans font-bold hover:bg-zinc-800 transition-all text-xs uppercase tracking-widest flex items-center gap-2"
          >
            Download Official PDF
          </button>
        </div>

        {/* ATS Resume Header */}
        <header className="text-center border-b-2 border-black pb-6 mb-8">
          <h1 className="text-4xl font-bold uppercase tracking-tight mb-2">
            {resume.header.name}
          </h1>
          <p className="text-[13px] tracking-wide mb-2">
            {resume.header.location} • {resume.header.phone} • {resume.header.email}
          </p>
          <div className="flex justify-center gap-4 text-[11px] font-bold uppercase tracking-widest text-zinc-600">
            {resume.header.links?.map((link, i) => (
              <span key={i}>
                {link.label}: {link.href.replace("https://", "")}
              </span>
            ))}
          </div>
          <p className="text-sm font-bold uppercase mt-4 py-1 border-y border-zinc-100 inline-block px-4 italic">
            {resume.header.title}
          </p>
        </header>

        {/* Summary Section */}
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase border-b border-black mb-2 pb-0.5">Professional Summary</h2>
          <p className="text-[12px] leading-relaxed text-justify">
            {resume.summary}
          </p>
        </section>

        {/* Skills Section */}
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase border-b border-black mb-3 pb-0.5">Technical Proficiencies</h2>
          <div className="space-y-1 text-[12px]">
            {Object.entries(resume.skills).map(([category, list]) => (
              <div key={category} className="flex gap-2">
                <strong className="capitalize min-w-[80px]">{category}:</strong>
                <span>{list.join(", ")}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Professional Experience */}
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase border-b border-black mb-4 pb-0.5">Professional Experience</h2>
          {resume.experience.map((exp, idx) => (
            <div key={idx} className="mb-5 last:mb-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className="font-bold text-[14px]">{exp.company}</h3>
                <span className="text-[11px] font-bold uppercase">{exp.period}</span>
              </div>
              <p className="text-[12px] font-bold italic mb-2 text-zinc-800">{exp.role}</p>
              <ul className="list-disc ml-5 text-[12px] space-y-1 leading-normal">
                {exp.points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Additional Future-Proof Sections (Education, Certs, etc.) */}
        {resume.additionalSections.map((section) => (
          <section key={section.title} className="mb-6 last:mb-0">
            <h2 className="text-sm font-bold uppercase border-b border-black mb-3 pb-0.5">{section.title}</h2>
            {section.items.map((item, i) => (
              <div key={i} className="mb-3 last:mb-0">
                <div className="flex justify-between items-baseline font-bold text-[13px]">
                  <h3>{item.heading}</h3>
                  <span className="font-normal text-[11px] uppercase tracking-tighter">
                    {item.subHeading.split('|').pop()?.trim()}
                  </span>
                </div>
                <p className="text-[11px] italic text-zinc-600">
                  {item.subHeading.split('|')[0]?.trim()}
                </p>
                {item.description && (
                  <p className="text-[11px] mt-1 text-zinc-500 leading-relaxed italic">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </section>
        ))}

      </div>

      {/* CSS Overrides for Print/PDF */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 0.75in;
          }
          body {
            background-color: white !important;
            color: black !important;
            -webkit-print-color-adjust: exact;
          }
          .print\:hidden {
            display: none !important;
          }
          /* Ensure sections don't break across pages awkwardly */
          section {
            page-break-inside: avoid;
            margin-bottom: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}