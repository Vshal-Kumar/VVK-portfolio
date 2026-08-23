import React from 'react';
import { Award, Check } from 'lucide-react';
import AnimatedContent from './AnimatedContent';

const FOCUS_TAGS = [
  'Quantum Computing',
  'Qiskit',
  'Quantum Algorithms',
  'Quantum Communication',
  'Quantum Cryptography',
  'Post-Quantum Security'
];

export default function Certifications() {
  return (
    <section id="certifications" className="section certs-section">
      <AnimatedContent distance={35} direction="vertical" duration={0.8} threshold={0.15}>
        <div className="section-tag">Credentials</div>
        <h2 className="section-heading">
          Certifications &amp; <em>Achievements</em>
        </h2>
      </AnimatedContent>

      <div className="cert-featured-wrap">
        <AnimatedContent
          distance={45}
          direction="vertical"
          duration={0.9}
          delay={0.1}
          scale={0.97}
          threshold={0.12}
        >
          <div className="cert-featured-card">
            {/* Top header row: Badge & Metadata */}
            <div className="cert-card-header">
              <div className="cert-badge-wrap">
                <div className="cert-icon-box">
                  <Award size={19} strokeWidth={1.8} />
                </div>
                <div className="cert-header-text">
                  <span className="cert-issuer">
                    Issued by <strong>PROJECT-Q Community</strong>
                  </span>
                  <span className="cert-verified-tag">
                    <Check size={11} strokeWidth={2.5} />
                    Verified Credential
                  </span>
                </div>
              </div>
              <div className="cert-meta-pill">
                <span className="cert-duration">30 Days</span>
                <span className="cert-status-badge">Certificate of Completion</span>
              </div>
            </div>

            {/* Title & description */}
            <div className="cert-card-body">
              <h3 className="cert-title">
                PROJECT-Q – 30-Day Quantum Computing Challenge
              </h3>
              <p className="cert-desc">
                Completed an intensive 30-day program focusing on quantum algorithms, Qiskit simulations, quantum
                communication protocols, and post-quantum cryptographic security.
              </p>
            </div>

            {/* Focus areas tags */}
            <div className="cert-focus-section">
              <span className="cert-focus-label">Focus Areas</span>
              <div className="cert-tags">
                {FOCUS_TAGS.map((tag, idx) => (
                  <span key={idx}>{tag}</span>
                ))}
              </div>
            </div>

            {/* Ambient Glow */}
            <div className="cert-glow"></div>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
