"use client";

import React from "react";
import { 
  Github, Linkedin, Mail, MapPin, ExternalLink, 
  Terminal, Code2, Database, Cpu, Briefcase, GraduationCap, ChevronRight, Activity 
} from "lucide-react";

const resume = {
  header: {
    name: "Ramprasad",
    title: "Senior Software Engineer",
    email: "ramprasadselvam@gmail.com",
    phone: "+91-89407-56775",
    location: "Bengaluru, India",
    linkedin: "https://linkedin.com/in/ramprasadselvam", 
    github: "https://github.com/ramprasadselvam",
  },
  summary: "Senior Software Engineer with 6.5+ years of hands-on experience in architecting, developing, and deploying scalable fullstack applications. Expert in React.js, Node.js, and Next.js, with a strong background in improving app performance, building microservices, and managing full lifecycle product development.",
  skills: {
    frontend: ["React.js", "Next.js", "React Native", "Redux", "TypeScript", "Tailwind CSS"],
    backend: ["Node.js", "Express.js", "PHP", "gRPC", "Socket.io", "REST APIs"],
    databases: ["MySQL", "Redis", "Protocol Buffers"],
    devops: ["Jenkins", "GitLab", "PM2", "Docker", "CI/CD"],
    performance: ["K6", "Clinic.js", "Agile", "Scrum", "RAD Models"],
  },
  experience: [
    {
      company: "Justdial Ltd, Bengaluru",
      role: "Senior Software Engineer",
      period: "July 2021 – Present",
      points: [
        "Led fullstack development of scalable microservices for ticketing, CMS, and campaign modules",
        "Built performant web apps using Next.js, Node.js, MySQL, Redis, and PHP",
        "Conducted API and app performance tuning using K6 and Clinic.js",
        "Designed real-time dashboards and internal analytics systems for business insights",
        "Automated CI/CD using Jenkins, significantly improving deployment cycles",
      ],
    },
    {
      company: "Consortia22, Chennai",
      role: "Senior Developer",
      period: "June 2020 – June 2021",
      points: [
        "Delivered cross-platform mobile apps using React.js, React Native, and Redux",
        "Implemented high-performance service calls via gRPC and Protocol Buffers",
        "Managed microservices with PM2 to maintain high application uptime",
        "Delivered projects across both Agile and Waterfall lifecycles",
      ],
    },
    {
      company: "Dotcue Technologies Pvt Ltd, Chennai",
      role: "Associate Developer",
      period: "Oct 2018 – May 2020",
      points: [
        "Migrated legacy PHP systems to modern stack: React.js, Node.js, Redis, and Socket.io",
        "Created and maintained web/mobile apps with React Native and RESTful APIs",
        "Developed real-time communication systems using Socket.io",
        "Supported production-ready platforms for 300+ daily internal users",
      ],
    },
  ],
  education: {
    degree: "B.E. - Aeronautical Engineering",
    institution: "Nehru Institute of Engineering and Technology",
    details: "GPA: 6.13 | Final Project: Tesla Turbine Performance Analysis",
    year: "2013 - 2017",
  },
};

export default function PortfolioPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 px-4 pt-8">
      
      {/* --- HERO SECTION --- */}
      <section className="relative p-8 md:p-12 rounded-[2.5rem] bg-zinc-900/40 border border-zinc-800/50 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
          <Terminal size={300} strokeWidth={1} />
        </div>
        
        <div className="relative z-10 flex flex-col gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold tracking-widest uppercase">
              <Activity size={12} className="animate-pulse" /> Available for Architectural Challenges
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white italic leading-tight">
              {resume.header.name.split(' ')[0]}<br/>
              <span className="text-zinc-700">{resume.header.name.split(' ')[1]}</span>
            </h1>
            <p className="text-blue-500 font-mono font-medium tracking-widest uppercase text-sm md:text-base">
              {resume.header.title}
            </p>
          </div>

          <p className="text-zinc-400 max-w-2xl leading-relaxed text-lg">
            {resume.summary}
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <a href={`mailto:${resume.header.email}`} className="flex items-center gap-2 text-xs font-bold text-zinc-300 hover:text-white transition-all bg-zinc-800/50 hover:bg-zinc-800 px-5 py-3 rounded-2xl border border-zinc-700/50">
              <Mail size={16} /> {resume.header.email}
            </a>
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 bg-zinc-800/20 px-5 py-3 rounded-2xl border border-zinc-800/50">
              <MapPin size={16} /> {resume.header.location}
            </div>
            <div className="flex gap-3">
              <SocialLink href={resume.header.github} icon={<Github size={20} />} />
              <SocialLink href={resume.header.linkedin} icon={<Linkedin size={20} />} />
            </div>
          </div>
        </div>
      </section>

      {/* --- SKILLS BENTO GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SkillBox title="Frontend" skills={resume.skills.frontend} icon={<Code2 size={18} />} color="text-blue-400" />
        <SkillBox title="Backend" skills={resume.skills.backend} icon={<Terminal size={18} />} color="text-emerald-400" />
        <SkillBox title="Cloud & Ops" skills={resume.skills.devops} icon={<Database size={18} />} color="text-purple-400" />
        <SkillBox title="Testing & QA" skills={resume.skills.performance} icon={<Activity size={18} />} color="text-orange-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pt-8">
        {/* --- EXPERIENCE TIMELINE --- */}
        <div className="lg:col-span-8 space-y-12">
          <SectionHeading icon={<Briefcase size={18} />} text="Professional Experience" />
          <div className="space-y-16 border-l-2 border-zinc-800/50 ml-4">
            {resume.experience.map((exp, idx) => (
              <div key={idx} className="relative pl-10 group">
                <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-black border-2 border-zinc-700 group-hover:border-blue-500 group-hover:bg-blue-500 transition-all duration-500 shadow-[0_0_15px_rgba(59,130,246,0)] group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-bold text-zinc-500 font-mono tracking-widest uppercase">{exp.period}</span>
                  <h4 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">{exp.role}</h4>
                  <p className="text-blue-500/80 font-semibold flex items-center gap-2">
                    {exp.company} <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </p>
                </div>
                <ul className="mt-6 space-y-4">
                  {exp.points.map((pt, i) => (
                    <li key={i} className="text-zinc-400 text-[15px] flex items-start gap-3 leading-relaxed">
                      <ChevronRight size={16} className="mt-1 text-blue-500/50 shrink-0" /> 
                      <span className="group-hover:text-zinc-300 transition-colors">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* --- EDUCATION & SIDECARS --- */}
        <div className="lg:col-span-4 space-y-16">
          <div className="space-y-8">
            <SectionHeading icon={<GraduationCap size={18} />} text="Academic Background" />
            <div className="p-6 rounded-3xl bg-gradient-to-br from-zinc-900/50 to-transparent border border-zinc-800/50 group hover:border-blue-500/30 transition-all">
              <h4 className="text-white font-bold text-lg mb-1">{resume.education.degree}</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">{resume.education.institution}</p>
              <div className="mt-4 pt-4 border-t border-zinc-800/50">
                <p className="text-xs text-zinc-500 italic">{resume.education.details}</p>
                <p className="text-blue-500 font-mono text-[10px] mt-2 font-bold uppercase tracking-widest">{resume.education.year}</p>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-[2rem] bg-blue-600 flex flex-col items-center text-center gap-4">
             <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                <Code2 className="text-white" size={32} />
             </div>
             <h3 className="text-xl font-bold text-white">Project Inquiry</h3>
             <p className="text-blue-100 text-sm">Interested in building performant, scalable fullstack architectures?</p>
             <a href={`mailto:${resume.header.email}`} className="w-full py-3 bg-white text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
               Let's Connect
             </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function SectionHeading({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <h3 className="text-[11px] font-black tracking-[0.3em] text-zinc-500 uppercase flex items-center gap-4">
      <span className="p-2 bg-zinc-900 rounded-lg border border-zinc-800">{icon}</span>
      {text}
    </h3>
  );
}

function SkillBox({ title, skills, icon, color }: { title: string, skills: string[], icon: React.ReactNode, color: string }) {
  return (
    <div className="p-6 rounded-3xl bg-zinc-900/20 border border-zinc-800/50 hover:bg-zinc-900/40 transition-all group">
      <div className={`mb-6 flex items-center gap-3 font-bold text-xs uppercase tracking-widest ${color}`}>
        {icon} {title}
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map(skill => (
          <span key={skill} className="px-3 py-1.5 bg-black/40 text-zinc-400 rounded-xl text-[11px] border border-zinc-800/80 group-hover:border-zinc-700 transition-colors">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

function SocialLink({ href, icon }: { href: string, icon: React.ReactNode }) {
  return (
    <a href={href} target="_blank" className="p-3 bg-zinc-800/50 rounded-2xl border border-zinc-700/50 hover:bg-blue-600 hover:border-blue-500 transition-all text-zinc-400 hover:text-white">
      {icon}
    </a>
  );
}