import React, { useEffect, useRef } from 'react';
import { AnimateOnScroll } from '../shared/AnimateOnScroll';
import { useTheme } from '../../hooks/useTheme';
import ceoMitchNoBg from '../../assets/CeoMitch-NoBG.png';
import archLinuxSvg from '../../assets/archlinux.svg';
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
  const { theme } = useTheme();
  const videoRef = useRef(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let timer = null;

    if (isDark) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay policy or interruption
        });
      }
    } else {
      // Keep playing smoothly during the close animation (850ms), then pause to save resources
      timer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.pause();
        }
      }, 850);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isDark]);

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
      {/* Dark Mode Arch Linux Atmospheric Background Video */}
      <div className="hero-video-bg-wrap" aria-hidden="true">
        <video
          ref={videoRef}
          className="hero-video-bg-media"
          src={`${import.meta.env.BASE_URL}video/ArchLinux.mp4`}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
        <div className="hero-video-overlay" />
      </div>

      {/* Cinematic Ambient Atmosphere (Studio Streaks + Center Fog Glow) */}
      <div className="hero-atmosphere-backdrop" aria-hidden="true"></div>

      {/* Main Center Stage: Monumental Name Layered Underneath Portrait */}
      <div className="hero-center-stage">
        {/* Giant Name Typography Layer (Layered Underneath Picture on Desktop, In Front on Mobile) */}
        <h1 className="hero-monumental-name" aria-label="Mitchelle Salazar">
          <span className="name-word name-first">MITCHELLE</span>
          <span className="hero-name-arch-badge" aria-hidden="true" title="Arch Linux">
            <svg
              viewBox="0 0 128 128"
              className="hero-name-arch-svg"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M61.113 4.886C55.82 17.788 52.629 26.23 46.738 38.749c3.613 3.805 8.047 8.242 15.246 13.25-7.742-3.168-13.02-6.347-16.969-9.648-7.539 15.644-19.351 37.933-43.324 80.77 18.844-10.817 33.45-17.485 47.059-20.032a33.989 33.989 0 0 1-.895-8.023l.024-.602c.296-12.004 6.578-21.238 14.015-20.61 7.438.626 13.223 10.872 12.922 22.876-.055 2.261-.312 4.433-.762 6.449 13.465 2.621 27.914 9.273 46.5 19.941-3.664-6.707-6.933-12.757-10.058-18.52-4.922-3.792-10.055-8.726-20.524-14.073 7.196 1.863 12.348 4.007 16.364 6.406C74.578 38.12 72.004 30.308 61.113 4.886Zm0 0"
              />
              <path d="M121.14 112.57v-3.243h-1.215v-.433h2.93v.433h-1.223v3.243h-.492M123.363 112.57v-3.676h.734l.875 2.601c.082.243.14.426.176.543.043-.132.11-.328.2-.586l.882-2.558h.66v3.676h-.472v-3.079l-1.075 3.079h-.441l-1.066-3.13v3.13h-.473" />
            </svg>
          </span>
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
            Front-End Web Developer &amp; Computer Engineering
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
              <span>Projects</span>
            </a>
          </div>
        </AnimateOnScroll>

        {/* Right Corner: OS & Core Stack */}
        <AnimateOnScroll animation="fade-up" delay={120} className="hero-bottom-right-corner">
          {/* OS Section */}
          <div className="hero-corner-group">
            <span className="hero-corner-stack-label">OS</span>
            <div className="hero-corner-os-item" title="Arch Linux" aria-label="Arch Linux">
              <img
                src={archLinuxSvg}
                alt="Arch Linux"
                className="hero-corner-tech-img hero-corner-os-img"
              />
              <span className="hero-corner-os-name">Arch Linux</span>
            </div>
          </div>

          {/* Core Technologies Section */}
          <div className="hero-corner-group">
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
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
