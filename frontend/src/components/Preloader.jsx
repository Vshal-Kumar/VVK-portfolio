import React, { useEffect, useState } from 'react';

export default function Preloader() {
  const [hidden, setHidden] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const hideTimer = setTimeout(() => {
      setHidden(true);
    }, 2300);

    const removeTimer = setTimeout(() => {
      setRemoved(true);
    }, 3050);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (removed) return null;

  return (
    <div id="preloader" className={hidden ? 'hidden' : ''}>
      <div className="pre-inner">
        <div className="pre-text">VVK</div>
        <div className="pre-bar">
          <div className="pre-fill"></div>
        </div>
      </div>
    </div>
  );
}
