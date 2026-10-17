import React, { useState, lazy, Suspense } from 'react';
import { skills, skillCategories } from '../../data/skills';
import { AnimateOnScroll } from '../shared/AnimateOnScroll';
import { useTheme } from '../../hooks/useTheme';
import { Terminal, ChevronLeft, ChevronRight } from 'lucide-react';
import antigravitySvg from '../../assets/antigravity.svg';
import './Skills.css';

const GitHubCalendar = lazy(() =>
  import('react-github-calendar').then((mod) => ({ default: mod.GitHubCalendar || mod.default }))
);

const getSkillIconUrl = (icon) => {
  if (icon === 'antigravity') {
    return antigravitySvg;
  }
  return `/icons/${icon}.svg`;
};

const ITEMS_PER_PAGE = 6;

export function Skills() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const { theme } = useTheme();

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const filteredSkills = activeCategory === 'All'
    ? skills
    : skills.filter(skill => skill.category === activeCategory);

  const totalPages = Math.ceil(filteredSkills.length / ITEMS_PER_PAGE);

  const displayedSkills = totalPages > 1
    ? filteredSkills.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
    : filteredSkills;

  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  const handleTouchStart = (e) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    if (distance > 45 && currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    } else if (distance < -45 && currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  return (
    <section id="skills" className="section skills-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Core Engineering Capabilities</h2>
          <p className="section-subtitle">
            Focused on modern front-end development, responsive component architecture, and high-performance cloud databases.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="skills-tabs-container">
          {skillCategories.map(category => (
            <button
              key={category}
              className={`skill-tab-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Skills Cards Grid */}
        <div
          className={`skills-grid ${totalPages > 1 ? 'is-paginated' : ''}`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {displayedSkills.map((skill, index) => (
            <AnimateOnScroll
              key={skill.name}
              animation="fade-up"
              delay={(index % 6) * 60}
              className="skill-card glass-card"
            >
              <div className="skill-card-top">
                <div className="skill-icon-wrap">
                  <img
                    src={getSkillIconUrl(skill.icon)}
                    alt={skill.name}
                    className="skill-devicon"
                    width="42"
                    height="42"
                    loading="lazy"
                    onError={(e) => {
                      if (skill.icon !== 'antigravity') {
                        e.target.src = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${skill.icon}/${skill.icon}-plain.svg`;
                      }
                    }}
                  />
                </div>
                <div className="skill-meta-wrap">
                  <h3 className="skill-name">{skill.name}</h3>
                  <span className="skill-level-badge">{skill.badge || skill.level}</span>
                </div>
              </div>

              <p className="skill-description">{skill.description}</p>
            </AnimateOnScroll>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="skills-pagination">
            <button
              type="button"
              className="skills-page-btn nav-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous skills page"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="skills-page-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  className={`skills-page-btn num-btn ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="skills-page-btn nav-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next skills page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Continuous Tech Stack Marquee */}
        <div className="skills-ticker-wrapper glass-card">
          <div className="ticker-label">
            <Terminal size={14} />
            <span>PRODUCTION ARSENAL:</span>
          </div>
          <div className="ticker-track-container">
            <div className="ticker-track">
              {[...skills, ...skills].map((item, idx) => (
                <div key={`${item.name}-${idx}`} className="ticker-item">
                  <img
                    src={getSkillIconUrl(item.icon)}
                    alt={item.name}
                    className="ticker-icon"
                    width="20"
                    height="20"
                    loading="lazy"
                    onError={(e) => {
                      if (item.icon !== 'antigravity') {
                        e.target.src = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${item.icon}/${item.icon}-plain.svg`;
                      }
                    }}
                  />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* GitHub Engineering Dashboard */}
        <AnimateOnScroll animation="fade-up" delay={100}>
          <div className="gh-panel glass-card">
            {/* Panel Header — Hardware titlebar */}
            <div className="gh-panel-header">
              <div className="gh-panel-titlebar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="gh-git-icon">
                  <circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" />
                  <path d="M13 6h3a2 2 0 0 1 2 2v7" /><path d="M6 9v12" />
                </svg>
                <h4 className="gh-panel-title">Source Control Activity</h4>
              </div>
              <a
                href="https://github.com/DmitzDev"
                target="_blank"
                rel="noopener noreferrer"
                className="gh-profile-badge"
              >
                <span className="gh-profile-handle">@DmitzDev</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17l9.2-9.2M17 17V7H7" />
                </svg>
              </a>
            </div>

            {/* Contribution Heatmap */}
            <div className="gh-calendar-viewport">
              <Suspense fallback={<div className="gh-calendar-loading" style={{ minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading activity...</div>}>
                <GitHubCalendar
                  username="DmitzDev"
                  colorScheme={theme === 'dark' ? 'dark' : 'light'}
                  fontSize={12}
                  blockSize={13}
                  blockMargin={4}
                />
              </Suspense>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
