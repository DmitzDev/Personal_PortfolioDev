import React, { useState, useEffect } from 'react';
import { ArrowRight, Mail, FileText } from 'lucide-react';
import { personalInfo } from '../../data/personalInfo';
import { AnimateOnScroll } from '../shared/AnimateOnScroll';
import mitchNoBg from '../../assets/Mitch-NoBG.png';
import mitchSmileNoBg from '../../assets/MitchSmile-NoBG.png';
import shadeImg from '../../assets/Shade.png';
import './Hero.css';

export function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(80);
  const [isSmiling, setIsSmiling] = useState(false);

  // Typing effect logic
  useEffect(() => {
    const handleTyping = () => {
      const currentRole = personalInfo.roles[roleIndex];

      if (isDeleting) {
        setDisplayText(currentRole.substring(0, displayText.length - 1));
        setTypingSpeed(40);
      } else {
        setDisplayText(currentRole.substring(0, displayText.length + 1));
        setTypingSpeed(80);
      }

      if (!isDeleting && displayText === currentRole) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && displayText === '') {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % personalInfo.roles.length);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, roleIndex, typingSpeed]);

  return (
    <section id="hero" className="hero-section">
      <div className="container hero-container">
        {/* Left Column: Client Proposition & Actions */}
        <AnimateOnScroll animation="fade-up" delay={50} className="hero-content">
          {/* Live Availability Status Badge */}
          <div className="hero-status-badge">
            <span className="status-dot-wrapper">
              <span className="status-indicator-ping"></span>
              <span className="status-indicator-dot"></span>
            </span>
            <span>Available for New Projects &amp; Contracts</span>
          </div>

          <h1 className="hero-title">
            Hi, I'm <span className="title-accent">Mitchelle Salazar</span> 👋
          </h1>

          {/* Desktop Role Console Badge */}
          <div className="hero-role-console desktop-hero-role">
            <span className="console-prompt">&gt;</span>
            <span className="console-text">{displayText}</span>
            <span className="console-cursor">_</span>
          </div>

          <p className="hero-description">
            Front-End Developer &amp; Computer Engineering student from the Philippines. I build fast, interactive web applications with modern React, clean component architecture, and tactile interfaces.
          </p>

          {/* Authentic Engineering Gauges */}
          <div className="hero-gauges-grid">
            <div className="gauge-card">
              <span className="gauge-val">5</span>
              <span className="gauge-label">Live Web Apps</span>
            </div>
            <div className="gauge-card">
              <span className="gauge-val">CpE</span>
              <span className="gauge-label">Computer Eng.</span>
            </div>
            <div className="gauge-card">
              <span className="gauge-val">React</span>
              <span className="gauge-label">Core Ecosystem</span>
            </div>
          </div>

          {/* Physical Buttons */}
          <div className="hero-actions">
            <a href="#projects" className="btn-primary">
              <span>Explore Projects</span>
              <ArrowRight size={17} />
            </a>
            <a href="#contact" className="btn-secondary">
              <Mail size={17} />
              <span>Get in Touch</span>
            </a>
            <a
              href={personalInfo.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-resume-tactile"
              title="Download verified resume"
            >
              <FileText size={16} />
              <span>Resume PDF</span>
            </a>
          </div>
        </AnimateOnScroll>

        {/* Right Column: Tactile Hardware Instrument Plaque */}
        <AnimateOnScroll animation="fade-up" delay={150} className="hero-visual-wrapper">
          {/* Mobile-only Role Console (Placed above the portrait chassis on phone screens) */}
          <div className="hero-role-console mobile-hero-role">
            <span className="console-prompt">&gt;</span>
            <span className="console-text">{displayText}</span>
            <span className="console-cursor">_</span>
          </div>

          <div className="hardware-chassis">
            {/* Corner Mechanical Screws */}
            <span className="screw screw-tl"></span>
            <span className="screw screw-tr"></span>
            <span className="screw screw-bl"></span>
            <span className="screw screw-br"></span>

            {/* Recessed Portrait Chamber (Interactive: Hover or Tap to swap to Smile + Shades) */}
            <div
              className={`portrait-chamber ${isSmiling ? 'active-smile' : ''}`}
              onMouseEnter={() => setIsSmiling(true)}
              onMouseLeave={() => setIsSmiling(false)}
              onClick={() => setIsSmiling(prev => !prev)}
              onTouchStart={() => setIsSmiling(prev => !prev)}
              title="Click or tap to toggle smile & shades!"
            >
              <div className="chamber-spotlight"></div>

              {/* Exact 1:1 Stage Wrapper so shades scale and align 100% with the face */}
              <div className="portrait-stage">
                {/* Default Focused Look */}
                <img
                  src={mitchNoBg}
                  alt={personalInfo.name}
                  className={`chassis-portrait portrait-serious ${isSmiling ? 'faded' : 'active'}`}
                />

                {/* Smiling Look */}
                <img
                  src={mitchSmileNoBg}
                  alt={`${personalInfo.name} smiling`}
                  className={`chassis-portrait portrait-smile ${isSmiling ? 'active' : 'faded'}`}
                />

                {/* Pixel Shades positioned exactly over eyes */}
                <img
                  src={shadeImg}
                  alt="Shades"
                  className={`chassis-shades ${isSmiling ? 'visible' : 'hidden'}`}
                />
              </div>

              <div className="chamber-base-shadow"></div>
            </div>

            {/* Stamped Metal Specification Plaque */}
            <div className="hardware-spec-plate">
              <div className="spec-row-main">
                <span className="spec-name">{personalInfo.fullName.toUpperCase()} • DEVELOPER</span>
                <span className="spec-tag">FRONT-END &amp; CpE</span>
              </div>
              <div className="spec-divider"></div>
              <div className="spec-items-grid">
                <div className="spec-item">
                  <span className="spec-k">CORE STACK</span>
                  <span className="spec-v">React • Node • Firebase • Vite</span>
                </div>
                <div className="spec-item">
                  <span className="spec-k">FOCUS</span>
                  <span className="spec-v">Web Apps &amp; Production UX</span>
                </div>
                <div className="spec-item">
                  <span className="spec-k">LOCATION</span>
                  <span className="spec-v">Philippines (UTC+8) • Remote</span>
                </div>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
