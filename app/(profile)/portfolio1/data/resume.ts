const getExperience = () => {
    const start = new Date("2018-10-21");
    const now = new Date();

    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();

    // Adjust if the current day hasn't reached the start day yet
    if (now.getDate() < start.getDate()) {
        months--;
    }

    // Adjust if months go negative
    if (months < 0) {
        years--;
        months += 12;
    }

    const yLabel = years === 1 ? "year" : "years";
    const mLabel = months === 1 ? "month" : "months";

    return `${years} ${yLabel} ${months} ${mLabel}`;
};

export const resume = {
    meta: {
        version: "1.0.1",
        lastUpdated: new Date().toISOString(),
        totalExperience: getExperience(),
        keywords: ["Senior Software Engineer", "React", "Next.js", "Node.js", "Microservices", "Fullstack"]
    },

    header: {
        name: "Ramprasad Selvam",
        title: "Senior Software Engineer | React.js | Node.js | Next.js",
        location: "Bengaluru, India",
        phone: "+91-8940756775",
        email: "ramprasadselvam@gmail.com",
        links: [
            { label: "LinkedIn", href: "https://linkedin.com/in/ramprasadselvam" },
            { label: "Portfolio", href: "https://ramprasadselvam.vercel.app" }
        ]
    },

    summary: `Senior Software Engineer with ${getExperience()} of experience in designing, 
developing, and scaling high-performance fullstack applications. Strong expertise in 
React.js, Node.js, and Next.js with hands-on experience in microservices, performance 
optimization, and end-to-end product ownership.`,

    skills: {
        primary: ["React.js", "Next.js", "Node.js", "JavaScript (ES6+)"],
        frontend: ["HTML5", "CSS3", "Redux", "React Native"],
        backend: ["Node.js", "Express.js", "REST APIs", "gRPC", "Protocol Buffers", "Socket.io", "PHP"],
        databases: ["MySQL", "Redis"],
        devops: ["GitLab", "Jenkins", "PM2", "Linux", "CI/CD"],
        performance: ["K6", "Clinic.js"]
    },

    experience: [
        {
            company: "Justdial Ltd",
            location: "Bengaluru",
            role: "Senior Software Engineer",
            start: "July 2021",
            end: "Present",
            techStack: ["Next.js", "Node.js", "MySQL", "Redis", "PHP"],
            highlights: [
                {
                    text: "Led development of scalable microservices for ticketing, CMS, and campaign platforms",
                    impact: "Supported high-traffic internal and external systems",
                    ats: "Led development of scalable microservices supporting high-traffic ticketing, CMS, and campaign platforms."
                },
                {
                    text: "Optimized API and application performance using K6 and Clinic.js",
                    impact: "Improved response time and system stability",
                    ats: "Optimized API and application performance using K6 and Clinic.js, improving response time and system stability."
                },
                {
                    text: "Built and maintained CI/CD pipelines using Jenkins",
                    impact: "Enabled faster and reliable deployments",
                    ats: "Built and maintained Jenkins-based CI/CD pipelines enabling faster and reliable deployments."
                }
            ]
        },
        {
            company: "Consortia22",
            location: "Chennai",
            role: "Senior Developer",
            start: "June 2020",
            end: "June 2021",
            techStack: ["React", "React Native", "gRPC", "Protocol Buffers"],
            highlights: [
                {
                    text: "Delivered cross-platform mobile applications using React and React Native",
                    impact: "Single codebase for Android and iOS",
                    ats: "Delivered cross-platform mobile applications using React and React Native with a single codebase for Android and iOS."
                },
                {
                    text: "Implemented high-performance service communication using gRPC",
                    impact: "Reduced latency compared to REST",
                    ats: "Implemented high-performance service communication using gRPC and Protocol Buffers, reducing latency compared to REST."
                }
            ]
        },
        {
            company: "Dotcue Technologies Pvt Ltd",
            location: "Chennai",
            role: "Associate Developer",
            start: "October 2018",
            end: "May 2020",
            techStack: ["React", "Node.js", "Redis", "Socket.io"],
            highlights: [
                {
                    text: "Migrated legacy PHP applications to modern React and Node.js stack",
                    impact: "Improved maintainability and performance",
                    ats: "Migrated legacy PHP applications to a modern React and Node.js stack, improving maintainability and performance."
                },
                {
                    text: "Built real-time communication systems using Socket.io",
                    impact: "300+ daily internal users",
                    ats: "Built real-time communication systems using Socket.io supporting 300+ daily internal users."
                }
            ]
        }
    ],

    education: [
        {
            institute: "Nehru Institute of Engineering and Technology",
            location: "Coimbatore",
            degree: "B.E. Aeronautical Engineering",
            period: "2013 - 2017",
            details: [
                "GPA: 6.13",
                "Final Project: Performance Analysis on a Small-Scale Tesla Turbine"
            ]
        }
    ]
};