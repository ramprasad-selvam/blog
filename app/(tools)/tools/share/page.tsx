"use client";

import React, { useState, ChangeEvent, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Link2, ScanLine } from 'lucide-react';

const QRGenerator: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('if you see this, it works!');
  const qrRef = useRef<SVGSVGElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const downloadQRCode = () => {
    const svg = qrRef.current;
    if (!svg) return;

    // 1. Serialize SVG to XML
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      // 2. Prepare Canvas
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      // 3. Trigger Download
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `qr-code-${Date.now()}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    // Convert to base64 to load into Image object
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 py-2 sm:py-6">
      <header className="max-w-2xl">
        <div className="mb-3 flex items-center gap-2 text-blue-400">
          <ScanLine size={18} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Share utility</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">QR Code Studio</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400 sm:text-base">Turn a URL or short message into a high-quality QR code ready to download.</p>
      </header>

      <section className="grid grid-cols-1 gap-5 rounded-[2rem] border border-white/10 bg-zinc-950/70 p-4 sm:p-6 lg:grid-cols-[1fr_360px] lg:p-8">
        <div className="flex flex-col justify-between gap-8">
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500" htmlFor="qr-input">
              <Link2 size={14} /> Share URL or text
            </label>
        <input
          id="qr-input"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Paste link here..."
          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white outline-none transition focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20"
        />
            <p className="text-xs text-zinc-600">Keep the content short for easier scanning.</p>
          </div>

          <button
            onClick={downloadQRCode}
            disabled={!inputValue}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500 sm:w-fit"
          >
            <Download size={17} />
            Download PNG
          </button>
        </div>

        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white p-6 shadow-xl shadow-black/20">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <QRCodeSVG
              ref={qrRef}
              value={inputValue || " "}
              size={220}
              level="H"
            />
          </div>
          <p className="mt-4 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Live preview</p>
        </div>
      </section>
    </div>
  );
};

export default QRGenerator;