import React from 'react';
import { Mail, Phone } from 'lucide-react';
import AnimatedContent from './AnimatedContent';

function GithubIcon({ size = 15 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

function LinkedinIcon({ size = 15 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export default function About() {
  return (
    <section id="about" className="section about-section">
      <AnimatedContent distance={35} direction="vertical" duration={0.8} threshold={0.15}>
        <div className="section-tag">About</div>
      </AnimatedContent>

      <div className="about-grid">
        <div className="about-left">
          <AnimatedContent distance={40} direction="vertical" duration={0.85} delay={0.1} threshold={0.15}>
            <h2 className="section-heading">
              <em>Quantum Computing Enthusiast</em>
            </h2>
            <p className="about-bio">
              I am a Computer Science student with a strong interest in Quantum Computing and emerging quantum technologies.
              I enjoy exploring quantum concepts, computational models, and the potential of quantum systems to address
              complex problems beyond the capabilities of classical computing.
            </p>
            <p className="about-bio" style={{ marginTop: '1rem' }}>
              My interests span Quantum Computing, Quantum Algorithms, Quantum Communication, Quantum Cryptography, and
              Quantum Security. I am focused on continuously building my knowledge through hands-on learning,
              experimentation, and practical projects while exploring the evolving applications of quantum technology.
            </p>
          </AnimatedContent>

          {/* Social / contact buttons */}
          <AnimatedContent distance={30} direction="vertical" duration={0.8} delay={0.2} threshold={0.15}>
            <div className="about-contacts">
              <a
                href="https://github.com/Vshal-Kumar"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-icon-btn"
                title="GitHub"
              >
                <GithubIcon size={15} />
                <span>GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/vadrangi-vishal-kumar-2a9b74341/"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-icon-btn"
                title="LinkedIn"
              >
                <LinkedinIcon size={15} />
                <span>LinkedIn</span>
              </a>
              <a
                href="mailto:vadrangi.vishalkumar@gmail.com"
                className="contact-icon-btn"
                title="Email"
              >
                <Mail size={15} strokeWidth={1.8} />
                <span>Email</span>
              </a>
              <a
                href="tel:+918919257391"
                className="contact-icon-btn"
                title="Call"
              >
                <Phone size={15} strokeWidth={1.8} />
                <span>+91 89192 57391</span>
              </a>
            </div>
          </AnimatedContent>
        </div>

        <div className="about-right">
          <AnimatedContent distance={45} direction="horizontal" reverse duration={0.9} delay={0.25} threshold={0.15}>
            <div className="about-info-grid">
              <div className="about-info-card">
                <span className="info-label">Status</span>
                <span className="info-val available">Open to work ✓</span>
              </div>
              <div className="about-info-card">
                <span className="info-label">Location</span>
                <span className="info-val">Hyderabad, Telangana</span>
              </div>
            </div>
          </AnimatedContent>
        </div>
      </div>
    </section>
  );
}
