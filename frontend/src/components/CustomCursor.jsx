import React, { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const followerRef = useRef(null);

  useEffect(() => {
    let mx = -100, my = -100;
    let fx = -100, fy = -100;
    let animationFrameId;

    const onMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
    };

    document.addEventListener('mousemove', onMouseMove);

    const tick = () => {
      if (followerRef.current) {
        fx += (mx - fx) * 0.13;
        fy += (my - fy) * 0.13;
        followerRef.current.style.left = `${fx}px`;
        followerRef.current.style.top = `${fy}px`;
      }
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    const onMouseOver = (e) => {
      if (e.target.closest('a, button, .chip, .cert-featured-card, .cert-tags span, .project-card, .nav-item, .contact-icon-btn, input, textarea')) {
        document.body.classList.add('cursor-grow');
      }
    };

    const onMouseOut = (e) => {
      if (e.target.closest('a, button, .chip, .cert-featured-card, .cert-tags span, .project-card, .nav-item, .contact-icon-btn, input, textarea')) {
        document.body.classList.remove('cursor-grow');
      }
    };

    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div id="cursor-follower" ref={followerRef}></div>
  );
}
