"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Zap, FileCode, GitCompare, Clock, 
  Image as ImageIcon, Calculator, Calendar ,TableProperties
} from "lucide-react";

const navItems = [
  { name: "Code Studio", icon: Zap, href: "/tools", sub: "Core Engine" },
  { name: "Diff Checker", icon: GitCompare, href: "/tools/diff", sub: "Date & Time Diff" },
  { name: "World Clock", icon: Clock, href: "/tools/clock", sub: "Live Precision" },
  { name: "Images", icon: ImageIcon, href: "/tools/image", sub: "Gradients & Assets" },
  { name: "JSON Inspector", icon: TableProperties, href: "/tools/json-table", sub: "Data Explorer" },
  { name: "Calculators", icon: Calculator, href: "/tools/calc", sub: "Interest & EMI" },
];
export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-black text-zinc-300">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 flex flex-col bg-zinc-950/50">
        <div className="p-6">
          <h1 className="text-xl font-black tracking-tighter text-white italic">DEVBOX.</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
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

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto p-8 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-zinc-900/20 via-black to-black">
        {children}
      </main>
    </div>
  );
}