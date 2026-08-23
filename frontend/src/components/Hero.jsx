import React, { useEffect, useRef } from 'react';
import AnimatedContent from './AnimatedContent';

export default function Hero() {
  const photoWrapRef = useRef(null);
  const bgTextRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      if (photoWrapRef.current) {
        photoWrapRef.current.style.transform = `translate(-50%, calc(-50% + ${y * 0.11}px))`;
      }
      if (bgTextRef.current) {
        bgTextRef.current.style.transform = `translateY(${y * 0.06}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="hero" className="hero">
      <div className="hero-bg-text" ref={bgTextRef} aria-hidden="true">
        Quantum Computing Enthusiast
      </div>

      <div className="hero-photo-wrap" ref={photoWrapRef}>
        <div className="photo-frame">
          <img src="/images/prof.png" alt="Vadrangi Vishal Kumar" />
        </div>
      </div>

      <div className="hero-top-left">
        <AnimatedContent distance={25} direction="horizontal" duration={0.9} delay={0.2}>
          <p className="hero-copy">© Vishal Kumar</p>
        </AnimatedContent>
      </div>

      <div className="hero-mid-right">
        <AnimatedContent distance={30} direction="horizontal" reverse duration={0.9} delay={0.3}>
          <div className="hero-label">
            <span className="label-line">Quantum Computing Enthusiast</span>
          </div>
        </AnimatedContent>
      </div>

      <div className="hero-scroll">
        <AnimatedContent distance={20} direction="vertical" duration={0.8} delay={0.5}>
          <span>Scroll</span>
          <div className="scroll-line"></div>
        </AnimatedContent>
      </div>
    </section>
  );
}
