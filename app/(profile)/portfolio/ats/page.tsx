"use client";

import React from "react";

const resume = {
  header: {
    name: "Ramprasad Selvam",
    location: "Bengaluru, India",
    phone: "+91-89407-56775",
    email: "ramprasadselvam@gmail.com",
    title: "Senior Software Engineer (React.js, Node.js, Next.js)",
  },
  summary: "Senior Software Engineer with 6.5+ years of experience in architecting and deploying scalable fullstack applications. Expert in React.js, Node.js, and Next.js with a strong background in performance tuning, microservices, and full lifecycle development.",
  skills: [
    "JavaScript (ES6+), HTML5, CSS3, PHP, React.js, React Native, Redux, Next.js, Node.js, Express.js",
    "MySQL, Redis, RESTful APIs, gRPC, Protocol Buffers",
    "K6, Clinic.js, GitLab, Jenkins, PM2, Postman, Linux",
    "Agile, Scrum, RAD, CI/CD"
  ],
  experience: [
    {
      company: "Justdial Ltd, Bengaluru",
      role: "Senior Software Engineer",
      period: "July 2021 – Present",
      points: [
        "Led fullstack development of scalable microservices for ticketing, CMS, and campaign modules.",
        "Built performant web apps with Next.js, Node.js, MySQL, Redis, and PHP.",
        "Conducted API and app performance tuning using K6 and Clinic.js.",
        "Designed real-time dashboards and internal analytics systems for business insights.",
        "Automated CI/CD using Jenkins, improving deployment cycles."
      ]
    },
    {
      company: "Consortia22, Chennai",
      role: "Senior Developer",
      period: "June 2020 – June 2021",
      points: [
        "Developed frontend apps and integrated backend services in a social platform.",
        "Delivered cross-platform mobile apps using React.js, React Native, and Redux.",
        "Implemented high-performance service calls via gRPC and Protocol Buffers.",
        "Managed microservices with PM2 to maintain application uptime."
      ]
    },
    {
      company: "Dotcue Technologies Pvt Ltd, Chennai",
      role: "Associate Developer",
      period: "Oct 2018 – May 2020",
      points: [
        "Migrated legacy PHP systems to modern stack: React.js, Node.js, Redis, and Socket.io.",
        "Created and maintained web/mobile apps with React Native and RESTful APIs.",
        "Developed real-time communication systems using Socket.io.",
        "Delivered production-ready platforms with 300+ daily internal users."
      ]
    }
  ],
  education: [
    {
      degree: "B.E. - Aeronautical Engineering",
      institution: "Nehru Institute of Engineering and Technology, Coimbatore",
      year: "2013-2017",
      details: "GPA: 6.13 | Final Project: Performance Analysis on a Small-Scale Tesla Turbine"
    }
  ]
};

export default function ATSResume() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white min-h-screen py-10 px-4 sm:px-10 text-black font-serif">
      <div className="max-w-[800px] mx-auto bg-white border border-gray-100 p-8 shadow-sm print:shadow-none print:border-none">
        
        {/* Floating Download Button (Hidden on Print) */}
        <div className="flex justify-end mb-6 print:hidden">
          <button 
            onClick={handlePrint}
            className="bg-black text-white px-6 py-2 rounded font-sans font-bold hover:bg-gray-800 transition-colors"
          >
            Download as PDF
          </button>
        </div>

        {/* HEADER */}
        <header className="text-center border-b-2 border-black pb-4 mb-6">
          <h1 className="text-3xl font-bold uppercase mb-1">{resume.header.name}</h1>
          <p className="text-sm">
            {resume.header.location} | {resume.header.phone} | {resume.header.email}
          </p>
          <p className="text-sm font-bold mt-1 uppercase tracking-wide">{resume.header.title}</p>
        </header>

        {/* SUMMARY */}
        <section className="mb-6">
          <h2 className="text-lg font-bold border-b border-gray-300 uppercase mb-2">Professional Summary</h2>
          <p className="text-[14px] leading-relaxed text-justify">{resume.summary}</p>
        </section>

        {/* SKILLS */}
        <section className="mb-6">
          <h2 className="text-lg font-bold border-b border-gray-300 uppercase mb-2">Technical Skills</h2>
          <ul className="list-disc ml-5 text-[14px] space-y-1">
            {resume.skills.map((skill, i) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>
        </section>

        {/* EXPERIENCE */}
        <section className="mb-6">
          <h2 className="text-lg font-bold border-b border-gray-300 uppercase mb-2">Professional Experience</h2>
          {resume.experience.map((exp, idx) => (
            <div key={idx} className="mb-4">
              <div className="flex justify-between items-baseline font-bold text-[15px]">
                <h3>{exp.company}</h3>
                <span>{exp.period}</span>
              </div>
              <p className="italic text-[14px] mb-2">{exp.role}</p>
              <ul className="list-disc ml-5 text-[14px] space-y-1">
                {exp.points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* EDUCATION */}
        <section className="mb-6">
          <h2 className="text-lg font-bold border-b border-gray-300 uppercase mb-2">Education</h2>
          {resume.education.map((edu, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-baseline font-bold text-[15px]">
                <h3>{edu.institution}</h3>
                <span>{edu.year}</span>
              </div>
              <p className="text-[14px]">{edu.degree}</p>
              <p className="text-[13px] text-gray-700 italic">{edu.details}</p>
            </div>
          ))}
        </section>
      </div>

      <style jsx global>{`
        @media print {
          body { background: white !important; }
          .print\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}