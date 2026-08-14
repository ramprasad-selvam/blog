import Link from "next/link";
import { ArrowUpRight, Atom, Binary } from "lucide-react";

export default function BlogPage() {
  const articles = [
    {
      title: "Pi Explorer",
      description: "Jump through the digits of pi and explore them in expandable, readable chunks.",
      href: "/blog/pie",
      label: "Interactive Data",
      icon: Binary,
      accent: "text-blue-600",
      surface: "from-blue-500/15",
    },
    {
      title: "Periodic Table",
      description: "Browse all elements by category, compare their properties, and open a full detail view.",
      href: "/blog/periodic-table",
      label: "Science Atlas",
      icon: Atom,
      accent: "text-emerald-600",
      surface: "from-emerald-500/15",
    },
  ];

  return (
    <main className="space-y-10 sm:space-y-14">
      <section className="reading-hero relative overflow-hidden rounded-[2rem] border border-zinc-200 bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-6 sm:p-10 lg:p-14">
        <div className="relative max-w-3xl">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Engineering Journal</p>
          <h1 className="text-4xl font-black tracking-[-0.04em] text-zinc-950 sm:text-6xl">Ideas worth exploring.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">Technical notes, visual explainers, and interactive experiments from the engineering desk.</p>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">Latest reading</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight">The journal</h2>
          </div>
          <span className="hidden text-xs text-zinc-400 sm:block">{articles.length} interactive articles</span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {articles.map((article) => (
            <Link key={article.href} href={article.href} className={`reading-card group rounded-2xl border border-zinc-200 bg-gradient-to-br ${article.surface} via-white to-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/10 sm:p-8`}>
              <div className="flex items-start justify-between">
                <article.icon size={28} className={article.accent} />
                <ArrowUpRight size={20} className="text-zinc-300 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-zinc-900" />
              </div>
              <div className="mt-12 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">
                <span>{article.label}</span>
                <span className="h-1 w-1 rounded-full bg-zinc-300" />
                <span>Interactive</span>
              </div>
              <h3 className="mt-2 text-2xl font-black tracking-tight text-zinc-950">{article.title}</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-zinc-600">{article.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}