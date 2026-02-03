// app/page.tsx
import Link from 'next/link';
import { Hammer, BookText, UserCircle } from 'lucide-react';

export default function LandingPage() {
  const links = [
    { title: "Dev Tools", href: "/tools", icon: Hammer, desc: "JSON, Base64 & IDs", color: "text-blue-500" },
    { title: "Technical Blog", href: "/blog", icon: BookText, desc: "Thoughts on engineering", color: "text-emerald-500" },
    { title: "Portfolio", href: "/portfolio", icon: UserCircle, desc: "Work & Contact", color: "text-purple-500" },
  ];

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-5xl font-bold mb-4">DevBox Hub</h1>
      <p className="text-zinc-400 mb-12 max-w-md">Your centralized developer ecosystem.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {links.map((item) => (
          <Link key={item.href} href={item.href} className="group p-8 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all">
            <item.icon className={`mb-4 mx-auto ${item.color}`} size={40} />
            <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
            <p className="text-zinc-500 text-sm">{item.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}