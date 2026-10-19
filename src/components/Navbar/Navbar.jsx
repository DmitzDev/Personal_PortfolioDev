import React, { useState, useEffect, useRef } from 'react';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { ThemeToggle } from '../shared/ThemeToggle';
import { personalInfo } from '../../data/personalInfo';
import { MobileBottomNav } from './MobileBottomNav';
import './Navbar.css';

const ceoMitchNoBg = `${import.meta.env.BASE_URL}CeoMitch-NoBG.webp`;

const navLinks = [
  { id: 'hero', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Tech' },
  { id: 'services', label: 'Services' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMorphed, setIsMorphed] = useState(false);
  const avatarRef = useRef(null);
  const sectionIds = navLinks.map(link => link.id);
  const [activeSection, setActiveSection] = useScrollSpy(sectionIds, 110);

  useEffect(() => {
    let rafId = null;

    const updateScrollState = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 25);

      const portraitEl = document.getElementById('hero-portrait-img') ||
        document.getElementById('hero-portrait-stage') ||
        document.querySelector('.hero-portrait-stage');
      let shouldMorph = false;

      if (portraitEl) {
        const rect = portraitEl.getBoundingClientRect();
        // Morph once the bottom of the portrait scrolls off past the top navigation bar (~75px)
        shouldMorph = rect.bottom <= 75;
      } else {
        shouldMorph = scrollY > 400;
      }

      setIsMorphed(shouldMorph);
    };

    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateScrollState);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    updateScrollState();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const scrollTo = (id) => {
    if (id === 'hero') {
      setActiveSection('hero');
      if (window.lenis) {
        window.lenis.scrollTo(0, { duration: 1.1 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      setActiveSection(id);
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
    <>
      <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-container">
          <a
            href="#hero"
            className={`capsule-brand-pill ${isMorphed ? 'is-morphed' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              scrollTo('hero');
            }}
            aria-label={isMorphed ? 'MitchDev - Return to Top' : 'Mitchelle Salazar - Front-End Developer'}
          >
            {/* Scrolled Photo Avatar on Left Side */}
            <div className="brand-pill-avatar-wrap" ref={avatarRef} aria-hidden={!isMorphed}>
              <div className="brand-pill-avatar-inner">
                <img
                  src={ceoMitchNoBg}
                  alt="Mitchelle Salazar"
                  className="brand-pill-avatar-img"
                  width="30"
                  height="30"
                  loading="eager"
                />
              </div>
            </div>

            {/* Seamless Cross-fade Text Container */}
            <div className="brand-pill-text-wrap">
              {/* Default Hero State: Mitchelle Salazar + Front-End Developer */}
              <div className="brand-pill-text-default">
                <span className="brand-pill-name">{personalInfo.fullName || personalInfo.name}</span>
                <span className="brand-pill-role">Front-End Developer</span>
              </div>

              {/* Scrolled Morphed State: Photo + MitchDev */}
              <div className="brand-pill-text-morphed" aria-hidden={!isMorphed}>
                <span className="brand-pill-mitch">Mitch</span>
                <span className="brand-pill-dev">Dev</span>
              </div>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="desktop-nav">
            <ul className="nav-links">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className={`nav-link ${activeSection === link.id ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(link.id);
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="nav-actions">
              <ThemeToggle />
              <a
                href={personalInfo.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-resume"
              >
                Resume
              </a>
            </div>
          </nav>

          {/* Mobile Top Header */}
          <div className="mobile-nav-toggle">
            <ThemeToggle />
            <a
              href={personalInfo.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-resume mobile-btn"
            >
              Resume
            </a>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav activeSection={activeSection} scrollTo={scrollTo} />
    </>
  );
}
