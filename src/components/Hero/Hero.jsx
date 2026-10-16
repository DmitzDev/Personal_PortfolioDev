import React from 'react';
import { AnimateOnScroll } from '../shared/AnimateOnScroll';
import ceoMitchNoBg from '../../assets/CeoMitch-NoBG.png';
import './Hero.css';

const coreTechIcons = [
  { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
  { name: 'Vite', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg' },
  { name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
  { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
  { name: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' },
  { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
];

export function Hero() {
  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const navOffset = window.innerWidth <= 768 ? 64 : 76;
      const targetTop = element.getBoundingClientRect().top + window.scrollY - navOffset;
      if (window.lenis) {
        window.lenis.scrollTo(targetTop, { duration: 1.1 });
      } else {
        window.scrollTo({
          top: Math.max(0, targetTop),
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <section id="hero" className="hero-section editorial-hero">
      {/* Cinematic Ambient Atmosphere (Studio Streaks + Center Fog Glow) */}
      <div className="hero-atmosphere-backdrop" aria-hidden="true"></div>

      {/* Main Center Stage: Monumental Name Layered Underneath Portrait */}
      <div className="hero-center-stage">
        {/* Giant Name Typography Layer (Layered Underneath Picture) */}
        <h1 className="hero-monumental-name" aria-label="Mitchelle Salazar">
          <span className="name-word name-first">MITCHELLE</span>
          <span className="name-word name-last">SALAZAR</span>
        </h1>

        {/* Portrait in Foreground Layer Overlapping the Name */}
        <div className="hero-portrait-stage">
          <div className="portrait-backlight" aria-hidden="true"></div>
          <img
            src={ceoMitchNoBg}
            alt="Mitchelle Salazar"
            className="portrait-img"
            loading="eager"
          />
        </div>
      </div>

      {/* Bottom Bar: User Specified Content in Left Corner */}
      <div className="hero-bottom-bar">
        {/* Left Corner: Role, Bio & CTAs */}
        <AnimateOnScroll animation="fade-up" delay={80} className="hero-bottom-left-corner">
          <p className="hero-corner-role">
            Front-End Web Developer &amp; Computer Engineering Student
          </p>

          <p className="hero-corner-desc">
            I craft modern web applications, high-performance user interfaces, and dependable digital products with clean component architecture. Based in the Philippines.
          </p>

          <div className="hero-corner-actions">
            <a
              href="#contact"
              className="btn-primary hero-btn-corner"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('contact');
              }}
            >
              <span>Get in touch</span>
            </a>
            <a
              href="#projects"
              className="hero-link-work"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('projects');
              }}
            >
              <span>View selected work</span>
              <span className="arrow-sym">→</span>
            </a>
          </div>
        </AnimateOnScroll>

        {/* Right Corner: Clean Core Stack */}
        <AnimateOnScroll animation="fade-up" delay={120} className="hero-bottom-right-corner">
          <span className="hero-corner-stack-label">Core Technologies</span>
          <div className="hero-corner-tech-cluster">
            {coreTechIcons.map((tech) => (
              <div
                key={tech.name}
                className="hero-corner-tech-item"
                title={tech.name}
                aria-label={tech.name}
              >
                <img
                  src={tech.icon}
                  alt={tech.name}
                  className="hero-corner-tech-img"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            ))}
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
