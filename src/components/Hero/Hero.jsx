import React, { useEffect, useRef, useState } from 'react';
import { AnimateOnScroll } from '../shared/AnimateOnScroll';
import { useTheme } from '../../hooks/useTheme';
import { Tech3DIcon } from '../shared/Tech3DIcon';
import './Hero.css';

const ceoMitchNoBg = '/CeoMitch-NoBG.webp';

/* Light Theme Philippine Destination Mapping for each letter in MITCHELLE SALAZAR */
const FIRST_NAME_LETTERS = [
  { char: 'M', id: 'm-0', place: 'Makati', img: 'Name-Picture/makati.webp' },
  { char: 'I', id: 'i-1', place: 'Iloilo', img: 'Name-Picture/iloilo.webp' },
  { char: 'T', id: 't-2', place: 'Tagaytay', img: 'Name-Picture/tagaytay.webp' },
  { char: 'C', id: 'c-3', place: 'Cebu', img: 'Name-Picture/cebu.webp' },
  { char: 'H', id: 'h-4', place: 'Hinatuan, Surigao del Sur', img: 'Name-Picture/Hinatuan (Surigao del Sur).webp' },
  { char: 'E', id: 'e-5', place: 'El Nido, Palawan', img: 'Name-Picture/El Nido (Palawan).webp' },
  { char: 'L', id: 'l-6', place: 'Laguna', img: 'Name-Picture/Laguna.webp' },
  { char: 'L', id: 'l-7', place: 'Legazpi, Albay', img: 'Name-Picture/Legazpi (Albay).webp' },
  { char: 'E', id: 'e-8', place: 'Ermita, Manila', img: 'Name-Picture/Ermita (Manila).webp' },
];

const LAST_NAME_LETTERS = [
  { char: 'S', id: 's-9', place: 'Siargao', img: 'Name-Picture/Siargao.webp' },
  { char: 'A', id: 'a-10', place: 'Aklan', img: 'Name-Picture/Aklan.webp' },
  { char: 'L', id: 'l-11', place: 'Laoag, Ilocos Norte', img: 'Name-Picture/Laoag (Ilocos Norte).webp' },
  { char: 'A', id: 'a-12', place: 'Antipolo', img: 'Name-Picture/Antipolo.webp' },
  { char: 'Z', id: 'z-13', place: 'Zamboanga', img: 'Name-Picture/Zamboanga.webp' },
  { char: 'A', id: 'a-14', place: 'Aurora', img: 'Name-Picture/Aurora.webp' },
  { char: 'R', id: 'r-15', place: 'Rizal', img: 'Name-Picture/Rizal.webp' },
];

const ALL_NAME_LETTERS = [...FIRST_NAME_LETTERS, ...LAST_NAME_LETTERS];

const coreTechIcons = [
  { name: 'React', icon: '/icons/react.svg' },
  { name: 'JavaScript', icon: '/icons/javascript.svg' },
  { name: 'TypeScript', icon: '/icons/typescript.svg' },
  { name: 'Vite', icon: '/icons/vitejs.svg' },
  { name: 'Tailwind CSS', icon: '/icons/tailwindcss.svg' },
  { name: 'Node.js', icon: '/icons/nodejs.svg' },
  { name: 'Firebase', icon: '/icons/firebase.svg' },
  { name: 'Git', icon: '/icons/git.svg' },
];

export function Hero() {
  const { theme } = useTheme();
  const videoRef = useRef(null);
  const isDark = theme === 'dark';
  const [activePlaceId, setActivePlaceId] = useState(null);

  const placeTimerRef = useRef(null);

  // Preload all 16 travel pictures in light mode (desktop browser only)
  useEffect(() => {
    if (theme === 'light' && typeof window !== 'undefined' && window.innerWidth > 1024) {
      ALL_NAME_LETTERS.forEach((item) => {
        const img = new Image();
        img.src = `${import.meta.env.BASE_URL}${item.img}`;
      });
    }
  }, [theme]);

  // Active place object (only active on desktop in light mode)
  const activePlace = !isDark
    ? ALL_NAME_LETTERS.find((item) => item.id === activePlaceId) || null
    : null;

  const handleLetterClick = (item) => {
    // Strictly for desktop browser only (> 1024px) in light mode
    if (isDark || (typeof window !== 'undefined' && window.innerWidth <= 1024)) return;

    if (placeTimerRef.current) {
      clearTimeout(placeTimerRef.current);
      placeTimerRef.current = null;
    }

    setActivePlaceId((prev) => {
      if (prev === item.id) {
        return null;
      }
      // Show for exactly 5 seconds, then smoothly fade out back to original background
      placeTimerRef.current = setTimeout(() => {
        setActivePlaceId(null);
        placeTimerRef.current = null;
      }, 5000);
      return item.id;
    });
  };

  useEffect(() => {
    return () => {
      if (placeTimerRef.current) {
        clearTimeout(placeTimerRef.current);
      }
    };
  }, [isDark]);

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

  const handleStageMouseMove = (e) => {
    if (window.innerWidth <= 1024) return;
    const stage = e.currentTarget;
    const rect = stage.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    stage.style.setProperty('--hero-tilt-x', `${(x * 10).toFixed(2)}deg`);
    stage.style.setProperty('--hero-tilt-y', `${(-y * 8).toFixed(2)}deg`);
  };

  const handleStageMouseLeave = (e) => {
    e.currentTarget.style.setProperty('--hero-tilt-x', '0deg');
    e.currentTarget.style.setProperty('--hero-tilt-y', '0deg');
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
          preload="none"
        />
        <div className="hero-video-overlay" />
      </div>

      {/* Cinematic Ambient Atmosphere (Studio Streaks + Center Fog Glow) */}
      <div className="hero-atmosphere-backdrop" aria-hidden="true"></div>

      {/* Light Mode Interactive Travel Destination Background Stage */}
      <div
        className={`hero-place-bg-stage ${activePlace && !isDark ? 'is-active' : ''}`}
        aria-hidden="true"
      >
        {ALL_NAME_LETTERS.map((item) => (
          <div
            key={item.id}
            className={`hero-place-bg-slide ${activePlace?.id === item.id ? 'is-visible' : ''}`}
            style={{
              backgroundImage: `url("${import.meta.env.BASE_URL}${item.img}")`,
            }}
          />
        ))}
        <div className="hero-place-bg-overlay" />
      </div>

      {/* Main Center Stage: Monumental Name Layered Underneath Portrait */}
      <div
        className="hero-center-stage"
        onMouseMove={handleStageMouseMove}
        onMouseLeave={handleStageMouseLeave}
      >
        {/* Giant Name Typography Layer */}
        <h1 className="hero-monumental-name" aria-label="Mitchelle Salazar">
          <span className="name-word name-first">
            {FIRST_NAME_LETTERS.map((item, i) => (
              <span
                key={item.id}
                className="char-3d"
                style={{ '--char-i': i }}
                onClick={() => handleLetterClick(item)}
                role={!isDark ? 'button' : undefined}
                tabIndex={!isDark ? 0 : undefined}
                onKeyDown={(e) => {
                  if (!isDark && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    handleLetterClick(item);
                  }
                }}
                title={!isDark ? `${item.char} for ${item.place} — Click to preview background (5s)` : undefined}
              >
                {item.char}
              </span>
            ))}
          </span>

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

          {/* Column 2: SALAZAR */}
          <span className="name-word name-last">
            {LAST_NAME_LETTERS.map((item, i) => (
              <span
                key={item.id}
                className="char-3d"
                style={{ '--char-i': i }}
                onClick={() => handleLetterClick(item)}
                role={!isDark ? 'button' : undefined}
                tabIndex={!isDark ? 0 : undefined}
                onKeyDown={(e) => {
                  if (!isDark && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    handleLetterClick(item);
                  }
                }}
                title={!isDark ? `${item.char} for ${item.place} — Click to preview background (5s)` : undefined}
              >
                {item.char}
              </span>
            ))}
          </span>
        </h1>

        {/* Portrait in Foreground Layer Overlapping the Name */}
        <div className="hero-portrait-stage">
          <div className="portrait-backlight" aria-hidden="true"></div>
          <img
            src={ceoMitchNoBg}
            alt="Mitchelle Salazar"
            className="portrait-img"
            loading="eager"
            fetchPriority="high"
            width="480"
            height="592"
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
              <Tech3DIcon iconKey="archlinux" size={20} showGlow={false} />
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
                  <Tech3DIcon iconKey={tech.name} size={30} />
                </div>
              ))}
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
