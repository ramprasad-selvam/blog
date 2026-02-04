import { resume } from "./data/resume";

export default function PortfolioPage() {
  return (
    <main className="max-w-4xl mx-auto p-6 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-5xl font-extrabold tracking-tight">{resume.header.name}</h1>
        <p className="text-xl text-blue-600 font-medium">{resume.header.title}</p>
        <p className="text-gray-500 max-w-2xl mx-auto">{resume.summary}</p>
      </section>

      {/* Experience Timeline */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold">Experience</h2>
        {resume.experience.map((exp, i) => (
          <div key={i} className="relative pl-8 border-l-2 border-blue-100 group">
            <div className="absolute -left-[9px] top-1 w-4 h-4 bg-blue-600 rounded-full border-4 border-white group-hover:scale-125 transition-transform" />
            <div className="flex flex-col md:flex-row md:justify-between mb-2">
              <h3 className="text-xl font-bold">{exp.role}</h3>
              {/* <span className="text-blue-600 font-mono text-sm">{exp.period}</span> */}
            </div>
            <p className="text-lg font-semibold text-gray-700">{exp.company}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {exp.techStack.map(s => (
                <span key={s} className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* View ATS Link */}
      <div className="text-center pt-10">
        <a href="/portfolio1/ats" className="text-blue-600 underline font-medium">
          View Professional PDF Version
        </a>
      </div>
    </main>
  );
}