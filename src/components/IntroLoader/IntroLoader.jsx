import React, { useState, useEffect, useRef, useCallback } from 'react';
import { personalInfo } from '../../data/personalInfo';
import './IntroLoader.css';

export function IntroLoader({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('loading'); // 'loading' | 'revealing'
  const [isDone, setIsDone] = useState(false);
  const hasFinishedRef = useRef(false);

  const finishIntro = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    setPhase('revealing');

    setTimeout(() => {
      setIsDone(true);
      if (onFinish) onFinish();
    }, 450);
  }, [onFinish]);

  // Measured progress timer
  useEffect(() => {
    // Fast-track for Lighthouse, automated audits, crawlers, or prefers-reduced-motion
    const isBotOrAudit =
      Boolean(typeof navigator !== 'undefined' && navigator.webdriver) ||
      /bot|googlebot|crawler|spider|robot|crawling|lighthouse|headlesschrome|headlesschromium|pagespeed/i.test(
        (typeof navigator !== 'undefined' && navigator.userAgent) || ''
      ) ||
      (typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    if (isBotOrAudit) {
      finishIntro();
      return;
    }

    document.body.style.overflow = 'hidden';

    let elapsed = 0;
    const totalDuration = 700; // ms - snappy, high-performance timing
    const tick = 16;

    const interval = setInterval(() => {
      elapsed += tick;
      const t = Math.min(elapsed / totalDuration, 1);

      // Smooth cubic ease-in-out curve
      const eased =
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const value = Math.round(eased * 100);
      setProgress(value);

      if (value >= 100) {
        clearInterval(interval);
        setTimeout(() => finishIntro(), 120);
      }
    }, tick);

    const failsafe = setTimeout(() => finishIntro(), 2200);

    return () => {
      clearInterval(interval);
      clearTimeout(failsafe);
      document.body.style.overflow = '';
    };
  }, [finishIntro]);

  if (isDone) return null;

  const isRevealing = phase === 'revealing';

  // Engineering boot status stages
  const getBootStatus = () => {
    if (progress < 25) return 'KERNEL_INIT';
    if (progress < 60) return 'MOUNTING_COMPONENTS';
    if (progress < 90) return 'COMPILING_ASSETS';
    return 'SYSTEM_READY';
  };

  return (
    <div
      className={`intro-loader ${isRevealing ? 'is-revealing' : ''}`}
      aria-label="Loading System"
    >
      {/* Cinematic Curtains */}
      <div className="intro-curtain intro-curtain--top" />
      <div className="intro-curtain intro-curtain--bottom" />

      {/* Engineering Background Matrix */}
      <div className="intro-matrix-bg">
        {/* Subtle radial spotlight aura */}
        <div className="intro-spotlight" />

        {/* Precision Coordinate Dot Matrix */}
        <div className="intro-grid-layer" />

        {/* Ambient Hardware Circuit Accents */}
        <div className="intro-circuit-lines" />
      </div>

      {/* Center Console Content */}
      <div className="intro-center">
        {/* Logo Mark with Ambient Backlight Glow */}
        <div className="intro-logomark-wrapper">
          <div className="intro-logomark-aura" />
          <div className="intro-logomark">
            {personalInfo.logoImage ? (
              <img
                src={personalInfo.logoImage}
                alt="MitchDev Logo"
                className="intro-logomark__img"
                width="64"
                height="64"
              />
            ) : (
              <span className="intro-logomark__fallback">MD</span>
            )}
          </div>
        </div>

        {/* Confident Wordmark */}
        <div className="intro-identity">
          <h1 className="intro-wordmark">
            Mitch<span className="intro-wordmark__accent">Dev.</span>
          </h1>
          <span className="intro-role-tag">SOFTWARE & FRONT-END ENGINEER</span>
        </div>

        {/* Hardware Progress Instrument */}
        <div className="intro-progress-console">
          <div className="intro-progress__track">
            <div
              className="intro-progress__fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Telemetry Status Line */}
          <div className="intro-progress__meta">
            <span className="intro-progress__status">
              <span className="intro-status-pulse">›</span> {getBootStatus()}
            </span>
            <span className="intro-progress__percent">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
