import React from 'react';
import { AnimateOnScroll } from '../shared/AnimateOnScroll';
import ceoMitchNoBg from '../../assets/CeoMitch-NoBG.png';
import './Hero.css';

const coreTechStack = [
  {
    name: 'React',
    category: 'Frontend Library',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'
  },
  {
    name: 'JavaScript',
    category: 'ES6+ Architecture',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg'
  },
  {
    name: 'Vite',
    category: 'Next-Gen Bundler',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg'
  },
  {
    name: 'Node.js',
    category: 'Backend & Tooling',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg'
  },
  {
    name: 'Tailwind CSS',
    category: 'Utility Styling',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg'
  },
  {
    name: 'Firebase',
    category: 'BaaS & Realtime DB',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg'
  }
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
    <section id="hero" className="hero-section modern-hero">
      <div className="hero-ambient-fog"></div>

      <div className="container hero-container-modern">
        {/* Left Column: Direct Introduction, Role & CTAs */}
        <AnimateOnScroll animation="fade-up" delay={50} className="hero-col-left">
          <div className="hero-status-pill">
            <span className="hero-status-dot"></span>
            <span>Available for Opportunities</span>
          </div>

          <h1 className="hero-editorial-title">
            Hi, I'm <span className="hero-name-gradient">Mitchelle Salazar</span>
          </h1>

          <p className="hero-role-title">
            Front-End Web Developer &amp; Computer Engineering Student
          </p>

          <p className="hero-editorial-description">
            I craft modern web applications, high-performance user interfaces, and dependable digital products with clean component architecture. Based in the Philippines.
          </p>

          <div className="hero-editorial-actions">
            <a
              href="#contact"
              className="btn-primary hero-btn-main"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('contact');
              }}
            >
              <span>Get in touch</span>
            </a>
            <a
              href="#projects"
              className="link-selected-work"
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

        {/* Center Column: Atmospheric Portrait with CeoMitch */}
        <AnimateOnScroll animation="fade-up" delay={120} className="hero-col-center">
          <div className="portrait-atmosphere-stage">
            <div className="portrait-backlight"></div>

            <div className="portrait-mask-wrapper">
              <img
                src={ceoMitchNoBg}
                alt="Mitchelle Salazar"
                className="portrait-img"
                loading="eager"
              />
            </div>
            <div className="portrait-ground-fade"></div>
          </div>
        </AnimateOnScroll>

        {/* Right Column: Core Tech Stack Card & Career Timeline Card */}
        <AnimateOnScroll animation="fade-up" delay={180} className="hero-col-right">
          {/* Top Tech Stack Card */}
          <div className="floating-tech-card">
            <div className="tech-card-header">
              <div className="tech-header-text">
                <span className="tech-card-category">Core Stack</span>
                <span className="tech-card-subtitle">Daily Web Architecture</span>
              </div>
              <div className="tech-live-badge">
                <span className="tech-live-dot"></span>
                <span>Active</span>
              </div>
            </div>

            <div className="tech-items-grid">
              {coreTechStack.map((tech) => (
                <div key={tech.name} className="tech-badge-pill" title={`${tech.name} — ${tech.category}`}>
                  <img
                    src={tech.icon}
                    alt={tech.name}
                    className="tech-devicon"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="tech-badge-meta">
                    <span className="tech-badge-title">{tech.name}</span>
                    <span className="tech-badge-sub">{tech.category}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="tech-card-footer">
              <span className="tech-footer-tag">✦ Component Architecture</span>
              <span className="tech-footer-tag">✦ Sub-Second FCP</span>
            </div>
          </div>

          {/* Bottom Career Timeline Card */}
          <div className="floating-career-card">
            <div className="career-card-header">
              <span className="career-header-title">Career</span>
              <span className="career-status-dot" title="Actively coding and building"></span>
            </div>

            <div className="career-items-list">
              <div className="career-item-row active-now">
                <span className="career-year-tag">2024–NOW</span>
                <div className="career-text-block">
                  <span className="career-org">Independent Web Dev</span>
                  <span className="career-role-desc">Freelance, React &amp; UI Architecture</span>
                </div>
              </div>

              <div className="career-item-row">
                <span className="career-year-tag">2023–NOW</span>
                <div className="career-text-block">
                  <span className="career-org">Universidad de Dagupan</span>
                  <span className="career-role-desc">Lead Frontend &amp; System Projects</span>
                </div>
              </div>

              <div className="career-item-row">
                <span className="career-year-tag">2023–NOW</span>
                <div className="career-text-block">
                  <span className="career-org">Personal Products</span>
                  <span className="career-role-desc">CV Studio, MDev Blog, Web Apps</span>
                </div>
              </div>

              <div className="career-item-row">
                <span className="career-year-tag">2022–2026</span>
                <div className="career-text-block">
                  <span className="career-org">B.S. Computer Engineering</span>
                  <span className="career-role-desc">Undergraduate Candidate</span>
                </div>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
