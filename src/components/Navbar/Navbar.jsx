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

const FULL_NAME = 'Mitchelle Salazar';
const MORPHED_NAME = 'MitchDev';
const COMMON_ROOT = 'Mitch';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMorphed, setIsMorphed] = useState(false);
  const [typedText, setTypedText] = useState(FULL_NAME);
  const [isTyping, setIsTyping] = useState(false);
  const avatarRef = useRef(null);
  const sectionIds = navLinks.map(link => link.id);
  const [activeSection, setActiveSection] = useScrollSpy(sectionIds, 110);

  // Smooth typewriter eraser & typing engine
  // Erases character-by-character down to "Mitch", pauses briefly, then types forward to target
  useEffect(() => {
    const target = isMorphed ? MORPHED_NAME : FULL_NAME;
    let timer = null;

    const step = () => {
      let delay = 55;

      setTypedText((current) => {
        if (current === target) {
          setIsTyping(false);
          return current;
        }

        setIsTyping(true);

        // Need to erase down to COMMON_ROOT:
        // Erase 1 character if target doesn't start with current and current is longer than COMMON_ROOT
        if (!target.startsWith(current) && current.length > COMMON_ROOT.length) {
          const next = current.slice(0, -1);
          // When it reaches "Mitch", pause briefly before typing forward
          if (next === COMMON_ROOT) {
            delay = 140;
          } else {
            delay = 50; // smooth deliberate backspace
          }
          return next;
        }

        // When at COMMON_ROOT or current matches start of target, type forward
        if (target.startsWith(current) && current.length < target.length) {
          delay = 72; // deliberate, readable typing keystroke
          return target.slice(0, current.length + 1);
        }

        // Fallback: delete if mismatched
        if (!target.startsWith(current)) {
          delay = 50;
          return current.slice(0, -1);
        }

        return current;
      });

      timer = setTimeout(step, delay);
    };

    // Initial micro-pause before starting typewriter
    timer = setTimeout(step, 80);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isMorphed]);

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
            <div className={`brand-pill-avatar-wrap ${isMorphed ? 'is-active' : ''}`} ref={avatarRef} aria-hidden={!isMorphed}>
              <div className="brand-pill-avatar-inner">
                <img
                  src={ceoMitchNoBg}
                  alt="Mitchelle Salazar"
                  className="brand-pill-avatar-img"
                  width="30"
                  height="30"
                  loading="eager"
                />
                <span className="brand-pill-avatar-gleam" aria-hidden="true" />
              </div>
            </div>

            {/* Dynamic Typewriter Name & Sliding Role */}
            <div className="brand-pill-text-wrap">
              <div className="brand-pill-type-container">
                {typedText.startsWith('Mitch') && (isMorphed || typedText.startsWith('MitchD')) ? (
                  <>
                    <span className="brand-pill-name-mitch">Mitch</span>
                    <span className="brand-pill-name-dev">{typedText.slice(5)}</span>
                  </>
                ) : (
                  <span className="brand-pill-name">{typedText}</span>
                )}
                <span className={`brand-pill-cursor ${isTyping ? 'typing' : ''}`} aria-hidden="true">|</span>
              </div>

              {/* Front-End Developer tag that smoothly slides away on morph */}
              <span className={`brand-pill-role ${isMorphed ? 'is-hidden' : ''}`}>
                Front-End Developer
              </span>
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
