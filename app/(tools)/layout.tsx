"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Zap, FileCode, GitCompare, Clock, 
  Image as ImageIcon, Calculator, TableProperties,
  Menu, X 
} from "lucide-react";

const navItems = [
  { name: "Code Studio", icon: Zap, href: "/tools", sub: "Core Engine" },
  { name: "Diff Checker", icon: GitCompare, href: "/tools/diff", sub: "Date & Time Diff" },
  { name: "World Clock", icon: Clock, href: "/tools/clock", sub: "Live Precision" },
  { name: "Images", icon: ImageIcon, href: "/tools/image", sub: "Gradients & Assets" },
  { name: "JSON Inspector", icon: TableProperties, href: "/tools/json-table", sub: "Data Explorer" },
  { name: "Calculators", icon: Calculator, href: "/tools/calc", sub: "Interest & EMI" },
  { name: "Share", icon: Calculator, href: "/tools/share", sub: "QR Code Generator" },
];

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="flex h-screen bg-black text-zinc-300 overflow-hidden">
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 border-r border-zinc-800 bg-zinc-950 
        transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-xl font-black tracking-tighter text-white italic">DEVBOX.</h1>
          <button onClick={toggleMenu} className="lg:hidden text-zinc-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)} // Close menu on navigation
                className={`flex items-start gap-3 p-3 rounded-xl transition-all group ${
                  isActive ? "bg-blue-600/10 text-blue-500" : "hover:bg-zinc-900"
                }`}
              >
                <item.icon size={20} className={isActive ? "text-blue-500" : "text-zinc-500 group-hover:text-zinc-300"} />
                <div>
                  <p className={`text-xs font-bold ${isActive ? "text-white" : ""}`}>{item.name}</p>
                  {item.sub && <p className="text-[9px] text-zinc-600 mt-0.5">{item.sub}</p>}
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-zinc-800 bg-black/50 backdrop-blur-md">
          <h1 className="text-lg font-black tracking-tighter text-white italic">DEVBOX.</h1>
          <button 
            onClick={toggleMenu}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300"
          >
            <Menu size={20} />
          </button>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-8 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-zinc-900/20 via-black to-black">
          {children}
        </main>
      </div>
    </div>
  );
}