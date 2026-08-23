import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function ScrollTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      id="scrollTop"
      type="button"
      className={visible ? 'visible' : ''}
      onClick={scrollToTop}
      title="Back to top"
      aria-label="Scroll to top"
    >
      <ChevronUp size={15} strokeWidth={2} />
    </button>
  );
}
