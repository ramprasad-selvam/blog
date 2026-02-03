const experience = () => {
  const startDate = new Date('2018-10-21');
  const now = new Date();
  const diffInMs = now.getTime() - startDate.getTime();
  const diffInYears = diffInMs / (31557600000);
  return diffInYears.toFixed(1);
}
export const resume = {
  header: {
    name: "Ramprasad Selvam",
    location: "Bengaluru, India",
    phone: "+91-8940756775",
    email: "ramprasadselvam@gmail.com",
    title: "Senior Software Engineer - React.js | Node.js | Next.js",
    links: [
      { label: "LinkedIn", href: "https://linkedin.com/in/ramprasadselvam" },
      // { label: "GitHub", href: "https://github.com/ramprasadselvam" },
      { label: "Portfolio", href: "https://ramprasadselvam.vercel.app" }
    ]
  },
  summary: `Senior Software Engineer with ${experience()} years of hands-on experience in architecting, developing, and deploying scalable fullstack applications. Expert in React.js, Node.js, and Next.js, with a strong background in both frontend and backend engineering. Adept at improving app performance, building microservices, and managing full lifecycle product development.`,
  skills: {
    frontend: ["JavaScript (ES6+)", "HTML5", "CSS3", "React.js", "React Native", "Redux", "Next.js"],
    backend: ["Node.js", "Express.js", "PHP", "RESTful APIs", "gRPC", "Protocol Buffers", "Socket.io"],
    tools: ["MySQL", "Redis", "K6", "Clinic.js", "GitLab", "Jenkins", "PM2", "Postman", "Linux", "CI/CD"]
  },
  experience: [
    {
      company: "Justdial Ltd, Bengaluru",
      role: "Senior Software Engineer",
      period: "July 2021 - Present",
      points: [
        "Led fullstack development of scalable microservices for ticketing, CMS, and campaign modules.",
        "Built performant web apps with Next.js, Node.js, MySQL, Redis, and PHP.",
        "Conducted API and app performance tuning using K6 and Clinic.js.",
        "Automated CI/CD using Jenkins, improving deployment cycles."
      ]
    },
    {
      company: "Consortia22, Chennai",
      role: "Senior Developer",
      period: "June 2020 - June 2021",
      points: [
        "Delivered cross-platform mobile apps using React.js, React Native, Redux.",
        "Implemented high-performance service calls via gRPC and Protocol Buffers.",
        "Managed microservices with PM2 to maintain application uptime."
      ]
    },
    {
      company: "Dotcue Technologies Pvt Ltd, Chennai",
      role: "Associate Developer",
      period: "Oct 2018 - May 2020",
      points: [
        "Migrated legacy PHP systems to modern stack: React.js, Node.js, Redis, and Socket.io.",
        "Developed real-time communication systems using Socket.io.",
        "Delivered production-ready platforms with 300+ daily internal users."
      ]
    }
  ],
  additionalSections: [
    {
      title: "Education",
      items: [
        {
          heading: "Nehru Institute of Engineering and Technology, Coimbatore",
          subHeading: "B.E. - Aeronautical Engineering | 2013 - 2017",
          description: "GPA: 6.13 | Final Project: Performance Analysis on a Small-Scale Tesla Turbine"
        }
      ]
    }
  ]
};