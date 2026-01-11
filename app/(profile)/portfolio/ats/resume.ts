export const resume = {
  header: {
    name: "Your Full Name",
    title: "Senior Full Stack Engineer (React, Node.js)",
    email: "your@email.com",
    phone: "+91-XXXXXXXXXX",
    location: "India",
    linkedin: "https://linkedin.com/in/yourname",
    github: "https://github.com/yourname",
    portfolio: "https://yoursite.dev",
  },

  summary: `
Senior Full Stack Engineer with 6+ years of experience building scalable web
applications using React, Next.js, and Node.js. Strong background in system
design, REST and gRPC APIs, performance optimization, and database-driven
applications.
  `.trim(),

  skills: {
    frontend: [
      "React",
      "Next.js",
      "JavaScript",
      "TypeScript",
      "HTML",
      "CSS",
      "Tailwind CSS",
    ],
    backend: [
      "Node.js",
      "Express.js",
      "NestJS",
      "REST APIs",
      "gRPC",
      "WebSockets",
    ],
    databases: ["PostgreSQL", "MongoDB", "Redis"],
    devops: ["Docker", "Nginx", "PM2", "Git", "CI/CD"],
    architecture: [
      "Microservices",
      "Caching",
      "Rate Limiting",
      "Load Balancing",
      "Event Loop",
      "Asynchronous Programming",
    ],
  },

  experience: [
    {
      company: "Tech Solutions Inc.",
      role: "Senior Full Stack Engineer",
      period: "2023 – Present",
      points: [
        "Designed and developed scalable web applications using React and Next.js",
        "Built REST and gRPC APIs using Node.js for high-traffic applications",
        "Improved application performance by 40% through caching and optimization",
        "Worked with PostgreSQL and Redis for data storage and caching",
        "Mentored junior developers and conducted code reviews",
      ],
    },
    {
      company: "Creative Digital Agency",
      role: "Full Stack Developer",
      period: "2021 – 2023",
      points: [
        "Developed custom web applications using React and Node.js",
        "Built backend services using Express.js and PostgreSQL",
        "Delivered high-traffic marketing and e-commerce platforms",
        "Integrated third-party APIs and payment gateways",
      ],
    },
    {
      company: "Startup Hub",
      role: "Junior Developer",
      period: "2019 – 2021",
      points: [
        "Assisted in building MVP applications using JavaScript and React",
        "Implemented responsive UI components",
        "Worked with Firebase for authentication and data storage",
      ],
    },
  ],

  projects: [
    {
      name: "Real-Time Monitoring System",
      points: [
        "Built centralized monitoring for multiple Node.js instances",
        "Tracked request count, response time, and instance health",
        "Implemented gRPC-based communication",
        "Developed React dashboard for real-time visualization",
      ],
      tech: ["Node.js", "gRPC", "Redis", "React"],
    },
    {
      name: "Portfolio Website",
      points: [
        "Developed personal portfolio using Next.js and Tailwind CSS",
        "Implemented responsive and accessible UI",
        "Deployed using Vercel",
      ],
      tech: ["Next.js", "React", "Tailwind CSS"],
    },
  ],

  education: {
    degree: "Bachelor of Engineering",
    institution: "University Name",
    year: "2019",
  },
};
