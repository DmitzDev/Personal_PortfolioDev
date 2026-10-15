import React, { useState, useEffect } from 'react';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { ThemeToggle } from '../shared/ThemeToggle';
import { personalInfo } from '../../data/personalInfo';
import { MobileBottomNav } from './MobileBottomNav';
import './Navbar.css';

const navLinks = [
  { id: 'hero', label: 'Overview' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Capabilities' },
  { id: 'services', label: 'Services' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const sectionIds = navLinks.map(link => link.id);
  const [activeSection, setActiveSection] = useScrollSpy(sectionIds, 110);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
            className="logo-container"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('hero');
            }}
          >
            <img src={personalInfo.logoImage} alt="Logo" className="nav-logo-img" />
            <span className="logo">Mitch<span className="logo-accent">Dev.</span></span>
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
                className="btn-resume"
                target="_blank"
                rel="noopener noreferrer"
              >
                Resume
              </a>
            </div>
          </nav>

          {/* Mobile Top Header (Theme Toggle) */}
          <div className="mobile-nav-toggle">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav activeSection={activeSection} scrollTo={scrollTo} />
    </>
  );
}
