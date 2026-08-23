import React from 'react';
import { Briefcase, GraduationCap } from 'lucide-react';
import AnimatedContent from './AnimatedContent';

export default function Experience() {
  return (
    <section id="experience" className="section experience-section">
      <AnimatedContent distance={35} direction="vertical" duration={0.8} threshold={0.15}>
        <div className="section-tag">Journey</div>
        <h2 className="section-heading">
          Experience &amp; <em>Education</em>
        </h2>
      </AnimatedContent>

      <div className="timeline-grid">
        {/* Experience Column */}
        <AnimatedContent
          distance={40}
          direction="horizontal"
          duration={0.85}
          delay={0.1}
          threshold={0.15}
        >
          <div className="timeline-col">
            <h3 className="tl-col-title">
              <Briefcase size={17} strokeWidth={1.8} />
              Experience
            </h3>
            <div className="tl-item">
              <div className="tl-dot"></div>
              <div className="tl-content">
                <span className="tl-year">May 2026 — July 2026</span>
                <h4 className="tl-role">Research Intern</h4>
                <p className="tl-company">National Institute of Technology Karnataka</p>
                <p className="tl-desc">
                  Conducted research in Post-Quantum Cryptography with a focus on lattice-based
                  cryptographic algorithms including ML-KEM and ML-DSA. Worked on studying secure
                  key encapsulation and digital signature mechanisms designed to resist quantum
                  computing attacks, while exploring their practical implementation and performance.
                </p>
              </div>
            </div>
          </div>
        </AnimatedContent>

        {/* Education Column */}
        <AnimatedContent
          distance={40}
          direction="horizontal"
          reverse
          duration={0.85}
          delay={0.2}
          threshold={0.15}
        >
          <div className="timeline-col">
            <h3 className="tl-col-title">
              <GraduationCap size={17} strokeWidth={1.8} />
              Education
            </h3>
            <div className="tl-item">
              <div className="tl-dot"></div>
              <div className="tl-content">
                <span className="tl-year">2023 — Present</span>
                <h4 className="tl-role">B.Sc. Computer Science (Research)</h4>
                <p className="tl-company">Central University of Karnataka, Karnataka</p>
                <p className="tl-desc">
                  Studied core computer science subjects and gained practical experience.
                </p>
              </div>
            </div>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
