import React, { useState, useEffect, useRef } from 'react';
import './Jumpscare.css';

/**
 * Temporary prank component requested by the user.
 * Displays /jumscare.webp in fullscreen for 60 seconds (1 minute)
 * whenever light mode is activated.
 */
export function Jumpscare({ theme }) {
  const [active, setActive] = useState(false);
  const isFirstMountRef = useRef(true);

  useEffect(() => {
    const handleThemeChange = (e) => {
      if (e.detail === 'light') {
        setActive(true);
      }
    };

    window.addEventListener('theme-changed', handleThemeChange);

    return () => {
      window.removeEventListener('theme-changed', handleThemeChange);
    };
  }, []);

  // Also catch if theme prop changes to 'light' after initial mount
  useEffect(() => {
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      return;
    }
    if (theme === 'light') {
      setActive(true);
    }
  }, [theme]);

  useEffect(() => {
    if (!active) return;

    // Locks scroll during prank
    document.body.style.overflow = 'hidden';

    // Lasts exactly 1 minute (60 seconds)
    const timer = setTimeout(() => {
      setActive(false);
      document.body.style.overflow = '';
    }, 60000);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, [active]);

  if (!active) return null;

  return (
    <div className="jumpscare-fullscreen-overlay" role="dialog" aria-modal="true">
      <img
        src={`${import.meta.env.BASE_URL}jumscare.webp`}
        alt=""
        className="jumpscare-fullscreen-img"
      />
    </div>
  );
}
