import React, { useState, lazy, Suspense } from 'react';
import { skills, skillCategories } from '../../data/skills';
import { AnimateOnScroll } from '../shared/AnimateOnScroll';
import { Tech3DIcon } from '../shared/Tech3DIcon';
import { Terminal, ChevronLeft, ChevronRight } from 'lucide-react';
import antigravitySvg from '../../assets/antigravity.svg';
import './Skills.css';

const GitHubTelemetry = lazy(() =>
  import('../GitHubTelemetry/GitHubTelemetry').then(m => ({ default: m.GitHubTelemetry }))
);

const getSkillIconUrl = (icon) => {
  if (icon === 'antigravity') {
    return antigravitySvg;
  }
  return `/icons/${icon}.svg`;
};

const ITEMS_PER_PAGE = 3;

export function Skills() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSkillName, setSelectedSkillName] = useState(skills[0]?.name || '');

  const filteredSkills = activeCategory === 'All'
    ? skills
    : skills.filter(skill => skill.category === activeCategory);

  const totalPages = Math.ceil(filteredSkills.length / ITEMS_PER_PAGE);

  const displayedSkills = totalPages > 1
    ? filteredSkills.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
    : filteredSkills;

  const activeSkill =
    displayedSkills.find((s) => s.name === selectedSkillName) || displayedSkills[0] || null;

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
    const nextFiltered = category === 'All'
      ? skills
      : skills.filter(skill => skill.category === category);
    if (nextFiltered[0]) setSelectedSkillName(nextFiltered[0].name);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    const nextSlice = filteredSkills.slice((newPage - 1) * ITEMS_PER_PAGE, newPage * ITEMS_PER_PAGE);
    if (nextSlice[0]) setSelectedSkillName(nextSlice[0].name);
  };

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

        {/* Interactive Vertical 3-Icon Split Showcase */}
        <div
          className="skills-split-showcase"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* LEFT: 3 Selectable Stack Icons (Vertical Column) */}
          <div className="skills-icon-dock" role="tablist" aria-label="Select a technology">
            {displayedSkills.map((skill) => {
              const isActive = activeSkill?.name === skill.name;
              return (
                <button
                  key={skill.name}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`skill-dock-btn ${isActive ? 'is-active' : ''}`}
                  onClick={() => setSelectedSkillName(skill.name)}
                  title={skill.name}
                >
                  <span className="skill-dock-icon">
                    <Tech3DIcon iconKey={skill.icon} size={42} />
                  </span>
                  <span className="skill-dock-label">{skill.name}</span>
                </button>
              );
            })}
          </div>

          {/* RIGHT: Clean Focused Description (Minimal Text) */}
          {activeSkill && (
            <div key={activeSkill.name} className="skills-focus-detail" role="tabpanel">
              {activeSkill.level && (
                <span className="skill-focus-badge">{activeSkill.level}</span>
              )}
              <h3 className="skill-focus-title">{activeSkill.name}</h3>
              <p className="skill-focus-desc">{activeSkill.description}</p>
            </div>
          )}
        </div>

        {/* Centered Pagination Controls (Original Position) */}
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

        {/* Continuous Tech Stack Marquee (Unboxed Editorial Strip) */}
        <div className="skills-ticker-wrapper">
          <div className="ticker-label">
            <Terminal size={13} aria-hidden="true" />
            <span>PRODUCTION ARSENAL</span>
          </div>
          <div className="ticker-track-container">
            <div className="ticker-track">
              {[...skills, ...skills].map((item, idx) => (
                <button
                  key={`${item.name}-${idx}`}
                  type="button"
                  className="ticker-item"
                  onClick={() => {
                    const targetIndex = skills.findIndex((s) => s.name === item.name);
                    if (targetIndex !== -1) {
                      setActiveCategory('All');
                      setCurrentPage(Math.floor(targetIndex / ITEMS_PER_PAGE) + 1);
                      setSelectedSkillName(item.name);
                    }
                  }}
                  title={`Inspect ${item.name}`}
                >
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
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* GitHub Telemetry Bento Grid Showcase */}
        <AnimateOnScroll animation="fade-up" delay={100}>
          <Suspense fallback={<div className="p-8 text-center text-sm font-mono text-slate-500">Loading Telemetry...</div>}><GitHubTelemetry username="DmitzDev" /></Suspense>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
