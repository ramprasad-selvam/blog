import "./style.css";

export default function AboutPage() {
  return (
    <main className="about">
      <img src="/profile.jpg" alt="Ramprasad" className="profile-img" />

      <h1>Hi, I'm <span>Ramprasad</span> 👋</h1>
      <p>
        A <strong>Software Engineer</strong> with 6+ years of experience 
        building scalable apps using <span>Node.js</span> & <span>React</span>.  
        I love problem-solving, designing systems, and contributing 
        to the developer community.
      </p>

      <h2>📬 Contact</h2>
      <ul className="contact-list">
        <li>✉️ <a href="mailto:ramprasad@email.com">ramprasad@email.com</a></li>
        <li>📱 <a href="tel:+919876543210">+91 98765 43210</a></li>
        <li>🔗 <a href="https://linkedin.com/in/ramprasad" target="_blank">linkedin.com/in/ramprasad</a></li>
        <li>💻 <a href="https://github.com/ramprasad" target="_blank">github.com/ramprasad</a></li>
      </ul>
    </main>
  );
}
