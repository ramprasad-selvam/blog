import React from "react";
import Link from "next/link";
import ToolsBreadcrumbs from "./Breadcrumbs";

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="tools-shell min-h-screen bg-[#07090d] text-zinc-300 selection:bg-blue-500/30">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#07090d]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/tools" className="ml-auto rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-zinc-400 transition hover:border-blue-400/40 hover:text-white">All tools</Link>
        </div>
      </header>

      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-blue-950/15 via-[#07090d] to-[#07090d] p-3 sm:p-5 lg:p-8">
        <ToolsBreadcrumbs />
        {children}
      </main>
    </div>
  );
}