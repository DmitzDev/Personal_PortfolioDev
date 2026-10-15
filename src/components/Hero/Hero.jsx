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
    <section id="hero" className="hero-section modern-hero">
      <div className="hero-ambient-fog" aria-hidden="true"></div>

      <div className="container hero-container-modern">
        {/* Left Column: Direct Introduction, Role & CTAs */}
        <AnimateOnScroll animation="fade-up" delay={50} className="hero-col-left">
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

        {/* Center Column: Portrait with clean natural studio lighting */}
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

        {/* Right Column: Unboxed Clean Core Tech Stack & Career Timeline */}
        <AnimateOnScroll animation="fade-up" delay={180} className="hero-col-right">
          {/* Top Tech Stack Block (Unboxed, Icon Only) */}
          <div className="hero-stack-block">
            <div className="hero-block-header">
              <span className="hero-block-title">Core Stack</span>
            </div>

            <div className="tech-icons-cluster">
              {coreTechIcons.map((tech) => (
                <div key={tech.name} className="tech-icon-box" title={tech.name} aria-label={tech.name}>
                  <img
                    src={tech.icon}
                    alt={tech.name}
                    className="tech-tile-icon"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Career Timeline Block (Unboxed) */}
          <div className="hero-career-block">
            <div className="hero-block-header">
              <span className="hero-block-title">Career</span>
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
