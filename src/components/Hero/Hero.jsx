import React, { useState, useEffect } from 'react';
import { AnimateOnScroll } from '../shared/AnimateOnScroll';
import mitchNoBg from '../../assets/Mitch-NoBG.png';
import mitchSmileNoBg from '../../assets/MitchSmile-NoBG.png';
import shadeImg from '../../assets/Shade.png';
import './Hero.css';

const metricsData = [
  {
    header: "Client-Side Optimization • Core Web Vitals",
    stat: "-67%",
    description: "Two-thirds lower initial bundle latency after modular architecture optimizations"
  },
  {
    header: "Production Lighthouse Audit • Performance",
    stat: "99%",
    description: "Near-perfect Lighthouse audit scores on performance, accessibility, and SEO"
  },
  {
    header: "First Contentful Paint • SPA Routing",
    stat: "<1s",
    description: "Sub-second time-to-interactive with Vite and efficient client-side hydration"
  },
  {
    header: "Production Web Applications • Live",
    stat: "5+",
    description: "Production-ready platforms shipped with zero server persistence bloat"
  }
];

export function Hero() {
  const [activeMetric, setActiveMetric] = useState(0);
  const [isSmiling, setIsSmiling] = useState(false);

  // Auto-cycle through metrics every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % metricsData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
        {/* Left Column: Big Editorial Headline & Proposition */}
        <AnimateOnScroll animation="fade-up" delay={50} className="hero-col-left">
          <h1 className="hero-editorial-title">
            I build products<br />
            and the<br />
            web interfaces<br />
            behind them.
          </h1>

          <p className="hero-editorial-description">
            I engineer modern front-end platforms and bring computer engineering logic into tactile web design — from interactive prototypes to production-ready systems. Computer Engineering undergraduate based in the Philippines.
          </p>

          <div className="hero-editorial-actions">
            <a
              href="#contact"
              className="btn-coral-pill"
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

        {/* Center Column: Atmospheric Portrait with smooth gradient mask */}
        <AnimateOnScroll animation="fade-up" delay={120} className="hero-col-center">
          <div
            className={`portrait-atmosphere-stage ${isSmiling ? 'active-smile' : ''}`}
            onMouseEnter={() => setIsSmiling(true)}
            onMouseLeave={() => setIsSmiling(false)}
            onClick={() => setIsSmiling(prev => !prev)}
            title="Tap or hover for shades toggle"
          >
            <div className="portrait-backlight"></div>

            <div className="portrait-mask-wrapper">
              {/* Default Focused Look */}
              <img
                src={mitchNoBg}
                alt="Mitchelle Salazar"
                className={`portrait-img portrait-serious ${isSmiling ? 'faded' : 'active'}`}
              />

              {/* Smiling Look */}
              <img
                src={mitchSmileNoBg}
                alt="Mitchelle Salazar smiling"
                className={`portrait-img portrait-smile ${isSmiling ? 'active' : 'faded'}`}
              />

              {/* Dark Sunglasses (like Pavel in the reference photo) */}
              <img
                src={shadeImg}
                alt="Sunglasses"
                className={`portrait-shades ${isSmiling ? 'visible' : 'hidden'}`}
              />
            </div>
            <div className="portrait-ground-fade"></div>
          </div>
        </AnimateOnScroll>

        {/* Right Column: Two Floating Frosted Glass Cards */}
        <AnimateOnScroll animation="fade-up" delay={180} className="hero-col-right">
          {/* Top Metric Card */}
          <div className="floating-metric-card">
            <div className="metric-card-top">
              <span className="metric-card-category">{metricsData[activeMetric].header}</span>
            </div>
            
            <div className="metric-stat-display">
              <span className="matrix-digits">{metricsData[activeMetric].stat}</span>
            </div>

            <p className="metric-card-caption">
              {metricsData[activeMetric].description}
            </p>

            {/* Carousel Dots */}
            <div className="metric-dots-nav">
              {metricsData.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`metric-dot ${activeMetric === idx ? 'active' : ''}`}
                  onClick={() => setActiveMetric(idx)}
                  aria-label={`Show metric ${idx + 1}`}
                />
              ))}
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
