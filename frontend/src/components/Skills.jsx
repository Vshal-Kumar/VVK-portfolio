import React from 'react';
import AnimatedContent from './AnimatedContent';

const SKILL_GROUPS = [
  {
    category: 'Languages',
    skills: ['Python', 'Java', 'SQL', 'C']
  },
  {
    category: 'Frameworks & Libraries',
    skills: ['Flask', 'NumPy', 'Pandas', 'Qiskit', 'Qiskit Aer', 'Matplotlib']
  },
  {
    category: 'Tools & Platforms',
    skills: ['Git', 'GitHub', 'VS Code', 'Linux', 'MySQL']
  },
  {
    category: 'Core Concepts',
    skills: [
      'Object-Oriented Programming',
      'Data Structures & Algorithms',
      'Computer Networks',
      'Database Management System',
      'Operating Systems',
      'System Design'
    ]
  }
];

export default function Skills() {
  return (
    <section id="skills" className="section skills-section">
      <AnimatedContent distance={35} direction="vertical" duration={0.8} threshold={0.15}>
        <div className="section-tag">Skills &amp; Stack</div>
        <h2 className="section-heading">
          Technical <em>Expertise</em>
        </h2>
      </AnimatedContent>

      <div className="skills-layout">
        <div className="skills-chips-col">
          {SKILL_GROUPS.map((group, idx) => (
            <AnimatedContent
              key={idx}
              distance={35}
              direction="vertical"
              duration={0.8}
              delay={0.1 + idx * 0.12}
              threshold={0.12}
            >
              <div className="chip-group">
                <p className="chip-group-label">{group.category}</p>
                <div className="chip-row">
                  {group.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="chip">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  );
}
