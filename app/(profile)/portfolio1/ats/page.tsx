"use client";
import React, { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ResumePDF } from "./ResumePDF";
import ResumeHTML from "./ResumeHTML";

export default function AtsPage() {
  const [isClient, setIsClient] = useState(false);

  // Avoid hydration mismatch for PDF generation
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-[800px] mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Resume Preview</h1>
          <p className="text-slate-500 text-sm">ATS-optimized format</p>
        </div>
        
        {isClient && (
          <PDFDownloadLink
            document={<ResumePDF />}
            fileName="Ramprasad_Selvam_Resume.pdf"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition shadow-lg"
          >
            {({ loading }) => (loading ? "Preparing PDF..." : "Download PDF")}
          </PDFDownloadLink>
        )}
      </div>

      {/* The HTML preview rendered for the browser */}
      <div className="bg-white shadow-2xl border border-slate-200">
        <ResumeHTML />
      </div>
    </div>
  );
}