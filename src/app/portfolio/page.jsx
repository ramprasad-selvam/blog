import "./style.css";

export default function AboutPage() {
  return (
    <div className="about-container">
      <h1>About Me</h1>
      <p className="intro">
        Hi, I'm <strong>Ramprasad Selvam</strong> 👋
        A passionate <strong>Full-Stack Developer</strong> with over 6 years of
        experience in building scalable web applications and modern interfaces.
      </p>

      <section className="about-section">
        <h2>What I Do</h2>
        <p>
          I specialize in <strong>Node.js</strong>, <strong>React</strong>, and
          modern JavaScript frameworks. I love solving complex problems, making
          clean architectures, and delivering meaningful user experiences.
        </p>
      </section>

      <section className="about-section">
        <h2>Beyond Coding</h2>
        <p>
          When I'm not writing code, I enjoy riding my bike 🏍️, exploring new
          technologies, and sharing knowledge with the developer community.
        </p>
      </section>

      <section className="about-section">
        <h2>Quick Highlights</h2>
        <ul>
          <li>💻 6+ years of professional experience in web development</li>
          <li>🚀 Built multiple full-stack projects with React + Node.js</li>
          <li>⚡ Passionate about open-source & developer tooling</li>
          <li>🌱 Currently exploring Kubernetes and cloud-native apps</li>
        </ul>
      </section>
    </div>
  );
}
