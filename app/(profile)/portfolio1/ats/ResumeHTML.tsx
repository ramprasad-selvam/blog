import { resume } from "../data/resume";

export default function ResumeHTML() {
    return (
        <div className="p-12 text-black bg-white min-h-[1056px] font-serif leading-tight">
            <header className="text-center border-b-2 border-black pb-4 mb-6">
                <h1 className="text-3xl font-bold uppercase tracking-tighter">{resume.header.name}</h1>
                <p className="text-sm mt-1">
                    {resume.header.location} | {resume.header.phone} | {resume.header.email}
                </p>
                <p className="bg-slate-100 py-1 px-2 mt-3 inline-block font-bold text-xs uppercase tracking-widest">
                    {resume.header.title}
                </p>
            </header>

            <section className="mb-6">
                <h2 className="border-b border-slate-300 font-bold uppercase text-sm mb-2">Professional Summary</h2>
                <p className="text-sm text-justify leading-relaxed">{resume.summary}</p>
            </section>

            <section className="mb-6">
                <h2 className="border-b border-slate-300 font-bold uppercase text-sm mb-2">Technical Skills</h2>
                <div className="text-sm space-y-1">
                    {Object.entries(resume.skills).map(([category, list]) => (
                        <p key={category}>
                            <span className="font-bold capitalize">{category}:</span> {list.join(", ")}
                        </p>
                    ))}
                </div>
            </section>

            <section className="mb-6">
                <h2 className="border-b border-slate-300 font-bold uppercase text-sm mb-2">Experience</h2>
                {resume.experience.map((exp, i) => (
                    <div key={i} className="mb-4">
                        <div className="flex justify-between font-bold text-sm">
                            <span>{exp.company}</span>
                            <span>{exp.start} — {exp.end}</span>
                        </div>
                        <p className="text-sm italic mb-2">{exp.role}</p>
                        <ul className="list-disc ml-5 text-sm space-y-1">
                            {exp.highlights.map((h, j) => (
                                <li key={j}>{h.ats}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </section>

            <section>
                <h2 className="border-b border-slate-300 font-bold uppercase text-sm mb-2">Education</h2>
                <div className="flex justify-between font-bold text-sm">
                    <span>{resume.education[0].institute}</span>
                    <span>{resume.education[0].period}</span>
                </div>
                <p className="text-sm">{resume.education[0].degree}</p>
                <p className="text-xs text-slate-600 italic">{resume.education[0].details.join(" | ")}</p>
            </section>
        </div>
    );
}