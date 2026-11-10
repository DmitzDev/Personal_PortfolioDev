import React, { useState } from 'react';
import {
  ExternalLink,
  Search,
  X,
  FileText,
  Code2,
  Server,
  Mail,
  ChevronLeft,
  ChevronRight,
  Check,
  Calendar,
  User,
  Sparkles,
} from 'lucide-react';
import { projects, projectCategories } from '../../data/projects';
import './Projects.css';

const GithubIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path>
  </svg>
);

const getTechIconInfo = (tech) => {
  const t = tech.toLowerCase();
  if (t.includes('react')) {
    return { type: 'devicon', src: '/icons/react.svg' };
  }
  if (t.includes('node')) {
    return { type: 'devicon', src: '/icons/nodejs.svg' };
  }
  if (t.includes('vite')) {
    return { type: 'devicon', src: '/icons/vitejs.svg' };
  }
  if (t.includes('javascript') || t.includes('js')) {
    if (t.includes('email')) {
      return { type: 'lucide', icon: 'mail' };
    }
    return { type: 'devicon', src: '/icons/javascript.svg' };
  }
  if (t.includes('css')) {
    return { type: 'devicon', src: '/icons/css3.svg' };
  }
  if (t.includes('html')) {
    return { type: 'devicon', src: '/icons/html5.svg' };
  }
  if (t.includes('firebase')) {
    return { type: 'devicon', src: '/icons/firebase.svg' };
  }
  if (t.includes('flutter')) {
    return { type: 'devicon', src: '/icons/flutter.svg' };
  }
  if (t.includes('dart')) {
    return { type: 'devicon', src: '/icons/dart.svg' };
  }
  if (t.includes('state') || t.includes('redux')) {
    return { type: 'devicon', src: '/icons/redux.svg' };
  }
  if (t.includes('api') || t.includes('rest')) {
    return { type: 'lucide', icon: 'server' };
  }
  if (t.includes('email')) {
    return { type: 'lucide', icon: 'mail' };
  }
  return { type: 'lucide', icon: 'code' };
};

export function Projects() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Touch Swipe State for Mobile
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  const filteredProjects = projects.filter((project) => {
    const matchesCategory =
      activeCategory === 'All' || project.category.includes(activeCategory);

    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesSearch =
      project.title.toLowerCase().includes(query) ||
      (project.subtitle && project.subtitle.toLowerCase().includes(query)) ||
      project.description.toLowerCase().includes(query) ||
      project.technologies.some((tech) => tech.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  const safeIndex =
    filteredProjects.length > 0
      ? Math.min(currentIndex, filteredProjects.length - 1)
      : 0;
  const currentProject = filteredProjects[safeIndex];

  const handlePrev = () => {
    if (filteredProjects.length <= 1) return;
    setCurrentIndex((prev) =>
      prev > 0 ? prev - 1 : filteredProjects.length - 1
    );
  };

  const handleNext = () => {
    if (filteredProjects.length <= 1) return;
    setCurrentIndex((prev) =>
      prev < filteredProjects.length - 1 ? prev + 1 : 0
    );
  };

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
    if (distance > 45) {
      handleNext();
    } else if (distance < -45) {
      handlePrev();
    }
  };

  return (
    <section id="projects" className="section projects-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Projects</h2>
          <p className="section-subtitle">
            Featured web systems and applications built for scale and performance.
          </p>
        </div>

        {/* Filter Controls & Search */}
        <div className="projects-controls">
          <div className="projects-filter">
            {projectCategories.map((category) => (
              <button
                key={category}
                type="button"
                className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory(category);
                  setCurrentIndex(0);
                }}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="projects-search glass-card">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by tech or keyword..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentIndex(0);
              }}
              className="search-input"
              aria-label="Search projects"
            />
          </div>
        </div>

        {/* Main Split Showcase Layout (Open Architecture - Rock-Solid Layout Stability) */}
        {currentProject ? (
          <div className="project-showcase-layout">
            {/* LEFT SIDE: Independent picture thumbnail with left/right arrow buttons below */}
            <div className="project-showcase-visual">
              <div
                className="project-showcase-thumbnail-wrap"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onClick={() => setSelectedProject(currentProject)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedProject(currentProject);
                  }
                }}
                aria-label={`View details of ${currentProject.title}`}
              >
                {/* Browser-style frame header */}
                <div className="thumbnail-browser-bar">
                  <span className="browser-dot red"></span>
                  <span className="browser-dot yellow"></span>
                  <span className="browser-dot green"></span>
                  <span className="browser-url-pill">{currentProject.title.toLowerCase().replace(/[^a-z0-9]/g, '')}.app</span>
                </div>

                <div className="thumbnail-img-canvas">
                  <img
                    src={currentProject.image}
                    alt={currentProject.title}
                    className="project-showcase-img"
                    width="640"
                    height="380"
                    loading="eager"
                  />
                  <div className="project-thumbnail-overlay">
                    <span className="thumbnail-view-pill">
                      <FileText size={15} />
                      View Project Details
                    </span>
                  </div>
                </div>
              </div>

              {/* Left and Right arrow buttons directly below the picture */}
              <div className="project-thumbnail-nav">
                <button
                  type="button"
                  className="project-nav-arrow-btn prev-btn"
                  onClick={handlePrev}
                  aria-label="Previous project"
                  title="Previous project"
                >
                  <ChevronLeft size={22} />
                </button>

                <div className="project-nav-indicators">
                  <span className="project-nav-counter">
                    <strong className="counter-current">
                      {String(safeIndex + 1).padStart(2, '0')}
                    </strong>
                    <span className="counter-sep">/</span>
                    <span className="counter-total">
                      {String(filteredProjects.length).padStart(2, '0')}
                    </span>
                  </span>

                  <div className="project-nav-dots" role="tablist" aria-label="Select project">
                    {filteredProjects.map((p, idx) => (
                      <button
                        key={p.id}
                        type="button"
                        role="tab"
                        aria-selected={idx === safeIndex}
                        className={`project-nav-dot ${idx === safeIndex ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(idx)}
                        aria-label={`Jump to project ${idx + 1}: ${p.title}`}
                        title={p.title}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className="project-nav-arrow-btn next-btn"
                  onClick={handleNext}
                  aria-label="Next project"
                  title="Next project"
                >
                  <ChevronRight size={22} />
                </button>
              </div>
            </div>

            {/* RIGHT SIDE: Independent Title, descriptions, Tech stack, and Live/Source/Details buttons */}
            <div className="project-showcase-content">
              <div className="project-header-meta">
                <span className="project-cat-badge">{currentProject.category[0]}</span>
                <span
                  className={`project-status-pill ${
                    currentProject.status === 'Completed'
                      ? 'status-completed'
                      : 'status-in-progress'
                  }`}
                >
                  <span className="status-led"></span>
                  <span className="status-label">{currentProject.status}</span>
                </span>
                {currentProject.timeline && (
                  <span className="project-timeline-tag">{currentProject.timeline}</span>
                )}
              </div>

              <h3 className="project-showcase-title">{currentProject.title}</h3>

              {currentProject.subtitle && (
                <p className="project-showcase-subtitle">{currentProject.subtitle}</p>
              )}

              <p className="project-showcase-desc">{currentProject.description}</p>

              {/* Tech Stack */}
              <div className="project-showcase-tech">
                <span className="tech-heading-label">TECH STACK</span>
                <div className="project-tech-badges-list">
                  {currentProject.technologies.map((tech) => {
                    const info = getTechIconInfo(tech);
                    return (
                      <div key={tech} className="tech-icon-pill" title={tech}>
                        {info.type === 'devicon' ? (
                          <img
                            src={info.src}
                            alt={tech}
                            className="tech-pill-img"
                            width="16"
                            height="16"
                            loading="lazy"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : info.icon === 'server' ? (
                          <Server size={14} className="tech-pill-lucide" />
                        ) : info.icon === 'mail' ? (
                          <Mail size={14} className="tech-pill-lucide" />
                        ) : (
                          <Code2 size={14} className="tech-pill-lucide" />
                        )}
                        <span className="tech-pill-text">{tech}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons: Live button, Source button, Details button */}
              <div className="project-showcase-actions">
                {currentProject.liveDemo && currentProject.liveDemo !== '#' && (
                  <a
                    href={currentProject.liveDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-project-action btn-action-live"
                    title={`Visit ${currentProject.title} Live`}
                    aria-label={`Visit ${currentProject.title} Live Demo`}
                  >
                    <span>Live</span>
                    <ExternalLink size={15} />
                  </a>
                )}

                {currentProject.github && currentProject.github !== '#' && (
                  <a
                    href={currentProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-project-action btn-action-source"
                    title="View Source Code"
                    aria-label={`View Source Code for ${currentProject.title}`}
                  >
                    <GithubIcon size={15} />
                    <span>Source</span>
                  </a>
                )}

                <button
                  type="button"
                  className="btn-project-action btn-action-details"
                  onClick={() => setSelectedProject(currentProject)}
                  title="View Full Case Study Details"
                  aria-label={`View details of ${currentProject.title}`}
                >
                  <FileText size={15} />
                  <span>Details</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-projects glass-card">
            <p>No projects matched your criteria. Try resetting the filters.</p>
          </div>
        )}
      </div>

      {/* Case Study Modal (Redesigned: High-End Architectural Presentation) */}
      {selectedProject && (
        <div className="modal-backdrop" onClick={() => setSelectedProject(null)}>
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-project-title"
          >
            {/* Modal Header Bar */}
            <div className="modal-header">
              <div className="modal-header-info">
                <div className="modal-tags-row">
                  <span className="modal-cat-tag">
                    {selectedProject.category.join(' • ')}
                  </span>
                  <span
                    className={`project-status-pill ${
                      selectedProject.status === 'Completed'
                        ? 'status-completed'
                        : 'status-in-progress'
                    }`}
                  >
                    <span className="status-led"></span>
                    <span className="status-label">{selectedProject.status}</span>
                  </span>
                </div>
                <h3 id="modal-project-title" className="modal-main-title">
                  {selectedProject.title}
                </h3>
                {selectedProject.subtitle && (
                  <p className="modal-sub-title">{selectedProject.subtitle}</p>
                )}
              </div>
              <button
                type="button"
                className="modal-close-icon-btn"
                onClick={() => setSelectedProject(null)}
                aria-label="Close modal"
                title="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="modal-content-scroll">
              {/* Clean Framed Visual Stage */}
              <div className="modal-framed-stage">
                <div className="stage-browser-header">
                  <span className="browser-dot red"></span>
                  <span className="browser-dot yellow"></span>
                  <span className="browser-dot green"></span>
                  <span className="stage-url-indicator">
                    {selectedProject.liveDemo && selectedProject.liveDemo !== '#'
                      ? selectedProject.liveDemo.replace('https://', '')
                      : `${selectedProject.title.toLowerCase().replace(/[^a-z0-9]/g, '')}.app`}
                  </span>
                </div>
                <div className="stage-image-container">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="modal-showcase-img"
                    width="800"
                    height="450"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Quick Specs Grid */}
              <div className="modal-specs-grid">
                {selectedProject.role && (
                  <div className="modal-spec-card">
                    <User size={15} className="spec-icon" />
                    <div className="spec-text">
                      <span className="spec-label">Role</span>
                      <strong className="spec-value">{selectedProject.role}</strong>
                    </div>
                  </div>
                )}
                {selectedProject.timeline && (
                  <div className="modal-spec-card">
                    <Calendar size={15} className="spec-icon" />
                    <div className="spec-text">
                      <span className="spec-label">Timeline</span>
                      <strong className="spec-value">{selectedProject.timeline}</strong>
                    </div>
                  </div>
                )}
                {selectedProject.metrics && (
                  <div className="modal-spec-card spec-card-wide">
                    <Sparkles size={15} className="spec-icon" />
                    <div className="spec-text">
                      <span className="spec-label">Key Highlight</span>
                      <strong className="spec-value">{selectedProject.metrics}</strong>
                    </div>
                  </div>
                )}
              </div>

              {/* Overview Narrative */}
              {selectedProject.description && (
                <div className="modal-narrative-block">
                  <h4 className="modal-block-heading">Project Overview</h4>
                  <p className="modal-lead-desc">{selectedProject.description}</p>
                </div>
              )}

              {/* Challenge & Solution if present */}
              {selectedProject.challenge && (
                <div className="modal-cs-grid">
                  <div className="modal-cs-col">
                    <h5 className="modal-cs-title">The Engineering Challenge</h5>
                    <p className="modal-cs-text">{selectedProject.challenge}</p>
                  </div>
                  <div className="modal-cs-col">
                    <h5 className="modal-cs-title">The Implemented Solution</h5>
                    <p className="modal-cs-text">{selectedProject.solution}</p>
                  </div>
                </div>
              )}

              {/* Technologies Pills */}
              <div className="modal-tech-stack">
                <h4 className="modal-block-heading">Technologies &amp; Architecture</h4>
                <div className="tech-tags-wrap">
                  {selectedProject.technologies.map((tech) => {
                    const info = getTechIconInfo(tech);
                    return (
                      <span key={tech} className="tech-pill with-icon">
                        {info.type === 'devicon' ? (
                          <img
                            src={info.src}
                            alt={tech}
                            className="tech-badge-img"
                            width="14"
                            height="14"
                            loading="lazy"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : info.icon === 'server' ? (
                          <Server size={14} className="tech-badge-lucide" />
                        ) : info.icon === 'mail' ? (
                          <Mail size={14} className="tech-badge-lucide" />
                        ) : (
                          <Code2 size={14} className="tech-badge-lucide" />
                        )}
                        <span>{tech}</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Key Features Cards (Sleek 2-Column Grid instead of plain bullets) */}
              {selectedProject.features && selectedProject.features.length > 0 && (
                <div className="modal-features-section">
                  <h4 className="modal-block-heading">Core System Features</h4>
                  <div className="modal-feature-cards-grid">
                    {selectedProject.features.map((feat, idx) => (
                      <div key={idx} className="modal-feature-card">
                        <span className="feature-check-glyph">
                          <Check size={13} />
                        </span>
                        <span className="feature-card-text">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="modal-footer">
              <div className="modal-footer-links">
                {selectedProject.liveDemo && selectedProject.liveDemo !== '#' && (
                  <a
                    href={selectedProject.liveDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary modal-action-btn"
                  >
                    <span>Launch Live Application</span>
                    <ExternalLink size={15} />
                  </a>
                )}
                {selectedProject.github && selectedProject.github !== '#' && (
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary modal-action-btn"
                  >
                    <GithubIcon size={16} />
                    <span>View Repository</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
