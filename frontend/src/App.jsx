import React, { useState, useEffect } from 'react';
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import SplashCursor from './components/SplashCursor';
import QuantumBackground from './components/background/QuantumBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollTop from './components/ScrollTop';
import Toast from './components/Toast';
import { initBackendKeepAlive } from './utils/keepAlive';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [toast, setToast] = useState(null);

  // Render backend keep-alive & pre-warm
  useEffect(() => {
    const cleanup = initBackendKeepAlive();
    return () => cleanup?.();
  }, []);

  // Scroll reveal observer
  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          } else {
            entry.target.classList.remove('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -55px 0px' }
    );

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => revealObserver.observe(el));

    return () => {
      revealElements.forEach((el) => revealObserver.unobserve(el));
    };
  }, []);

  // Active navigation scrollspy
  useEffect(() => {
    const sections = ['hero', 'about', 'skills', 'experience', 'projects', 'certifications', 'contact'];

    const handleScroll = () => {
      const scrollY = window.scrollY;
      let current = 'hero';

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && scrollY >= el.offsetTop - 220) {
          current = id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toast notification helper
  const showToast = (type, message, duration = 3500) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, duration);
  };

  const closeToast = () => {
    setToast(null);
  };

  return (
    <>
      <Preloader />
      <CustomCursor />
      <SplashCursor />
      <QuantumBackground />
      <Navbar activeSection={activeSection} />

      <main className="website-content">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Certifications />
        <Contact onShowToast={showToast} />
      </main>

      <Footer />
      <ScrollTop />
      <Toast toast={toast} onClose={closeToast} />
    </>
  );
}
