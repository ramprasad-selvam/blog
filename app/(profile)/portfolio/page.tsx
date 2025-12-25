import { Briefcase, Calendar, ExternalLink } from "lucide-react";

// 1. Define your data (Keep this separate so it's easy to update)
const experiences = [
  {
    company: "Tech Solutions Inc.",
    role: "Senior Frontend Engineer",
    period: "2023 - Present",
    desc: "Architecting modern web applications using Next.js 16 and Tailwind 4. Focused on performance and DX.",
    tags: ["Next.js", "TypeScript", "Vercel"],
  },
  {
    company: "Creative Digital Agency",
    role: "Full Stack Developer",
    period: "2021 - 2023",
    desc: "Built custom e-commerce engines and high-traffic marketing sites for global brands.",
    tags: ["React", "Node.js", "PostgreSQL"],
  },
  {
    company: "Startup Hub",
    role: "Junior Developer",
    period: "2019 - 2021",
    desc: "Collaborated on MVP development and implemented responsive UI components.",
    tags: ["JavaScript", "Sass", "Firebase"],
  },
];

export default function PortfolioPage() {
  return (
    <div className="max-w-4xl mx-auto py-10">
      {/* Hero Section */}
      <section className="mb-20">
        <h1 className="text-4xl font-extrabold mb-4">My Professional Journey</h1>
        <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
          I specialize in building high-performance web tools and aesthetic user interfaces. 
          Currently focused on the intersection of Edge computing and React.
        </p>
      </section>

      {/* Experience Timeline */}
      <section>
        <h2 className="text-xl font-semibold mb-10 flex items-center gap-2">
          <Briefcase size={20} className="text-purple-500" />
          Work History
        </h2>

        <div className="space-y-12 border-l border-zinc-800 ml-3 pl-8 relative">
          {experiences.map((exp, index) => (
            <div key={index} className="relative">
              {/* Timeline Dot */}
              <div className="absolute -left-[41px] top-1 w-5 h-5 bg-zinc-950 border-2 border-purple-500 rounded-full" />
              
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold">{exp.role}</h3>
                  <p className="text-purple-400 font-medium">{exp.company}</p>
                </div>
                <div className="flex items-center gap-1 text-zinc-500 text-sm mt-1 md:mt-0">
                  <Calendar size={14} />
                  {exp.period}
                </div>
              </div>

              <p className="text-zinc-400 mb-4 leading-relaxed">
                {exp.desc}
              </p>

              <div className="flex flex-wrap gap-2">
                {exp.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-24 p-8 bg-zinc-900 rounded-2xl border border-zinc-800 text-center">
        <h2 className="text-2xl font-bold mb-2">Have a project in mind?</h2>
        <p className="text-zinc-400 mb-6">I am currently open to freelance opportunities and collaborations.</p>
        <a 
          href="/contact" 
          className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-all"
        >
          Let's Talk <ExternalLink size={18} />
        </a>
      </section>
    </div>
  );
}