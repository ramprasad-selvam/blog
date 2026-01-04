"use client";

import React, { useState, ChangeEvent, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

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
    <div className="flex flex-col items-center gap-6 p-10 bg-gray-50 rounded-2xl shadow-inner">
      <div className="w-full max-w-sm space-y-2">
        <label className="text-sm font-medium text-gray-700">Share URL or Text</label>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Paste link here..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>

      <div className="p-6 bg-white rounded-xl shadow-md">
        <QRCodeSVG
          ref={qrRef}
          value={inputValue || " "}
          size={200}
          level="H" 
        />
      </div>

      <button
        onClick={downloadQRCode}
        disabled={!inputValue}
        className="w-full max-w-sm py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
      >
        Download QR Code (.png)
      </button>
    </div>
  );
};

export default QRGenerator;