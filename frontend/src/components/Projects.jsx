import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import AnimatedContent from './AnimatedContent';

function GithubIcon({ size = 13 }) {
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

const PROJECTS = [
  {
    num: '01',
    tags: ['Python', 'Qiskit', 'Qiskit Aer', 'Quantum Cryptography'],
    name: 'Bell-State-Based Quantum Mutual Authentication',
    desc: 'Developed a quantum mutual authentication framework using Bell-state entanglement and quantum challenge–response for identity verification, with BB84-based session key establishment and simulated impersonation and replay attacks.',
    github: 'https://github.com/Vshal-Kumar',
    demo: '#',
    demoLabel: 'Simulation Demo'
  },
  {
    num: '02',
    tags: ['Python', 'Qiskit', 'Quantum Simulation'],
    name: 'Quantum Coin Toss Simulation',
    desc: 'Simulated a quantum coin toss using superposition (Hadamard gate) and measurement in Qiskit to demonstrate quantum randomness.',
    github: 'https://github.com/Vshal-Kumar',
    demo: '#',
    demoLabel: 'Simulation Demo'
  },
  {
    num: '03',
    tags: ['Python', 'Flask', 'REST APIs', 'Wrapper Agent'],
    name: 'AI-Based Internship Management System',
    desc: 'Developed backend for an AI-based internship system enabling skill-based allocation. Designed and integrated wrapper agents for automated task assignment, tracking, and feedback, with a scalable backend architecture for efficient task and performance management.',
    github: 'https://github.com/Vshal-Kumar',
    demo: '#',
    demoLabel: 'Live Demo'
  }
];

export default function Projects() {
  return (
    <section id="projects" className="section projects-section">
      <AnimatedContent distance={35} direction="vertical" duration={0.8} threshold={0.15}>
        <div className="section-tag">Projects</div>
        <h2 className="section-heading">
          Featured <em>Work</em>
        </h2>
      </AnimatedContent>

      <div className="projects-grid">
        {PROJECTS.map((proj, idx) => (
          <AnimatedContent
            key={idx}
            distance={45}
            direction="vertical"
            duration={0.85}
            delay={idx * 0.12}
            threshold={0.1}
          >
            <div className="project-card">
              <div className="project-num">{proj.num}</div>
              <div className="project-body">
                <div className="project-tags">
                  {proj.tags.map((tag, tIdx) => (
                    <span key={tIdx}>{tag}</span>
                  ))}
                </div>
                <h3 className="project-name">{proj.name}</h3>
                <p className="project-desc">{proj.desc}</p>
                <div className="project-links">
                  <a
                    href={proj.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="proj-link"
                  >
                    <GithubIcon size={13} />
                    <span>View Code</span>
                  </a>
                  <a
                    href={proj.demo}
                    className="proj-link muted"
                    onClick={(e) => {
                      if (proj.demo === '#') e.preventDefault();
                    }}
                  >
                    <ArrowUpRight size={13} strokeWidth={1.8} />
                    <span>{proj.demoLabel}</span>
                  </a>
                </div>
              </div>
              <div className="project-glow"></div>
            </div>
          </AnimatedContent>
        ))}
      </div>
    </section>
  );
}
