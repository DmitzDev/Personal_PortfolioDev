import React, { useState } from 'react';
import { ExternalLink, Search, X, CheckCircle2, FileText, Layers, Code2, Server, Mail, Lock, Activity } from 'lucide-react';
import { projects, projectCategories } from '../../data/projects';
import { AnimateOnScroll } from '../shared/AnimateOnScroll';
import './Projects.css';

const GithubIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path>
  </svg>
);

const getTechIconInfo = (tech) => {
  const t = tech.toLowerCase();
  if (t.includes('react')) {
    return { type: 'devicon', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' };
  }
  if (t.includes('node')) {
    return { type: 'devicon', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' };
  }
  if (t.includes('vite')) {
    return { type: 'devicon', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg' };
  }
  if (t.includes('javascript') || t.includes('js')) {
    if (t.includes('email')) {
      return { type: 'lucide', icon: 'mail' };
    }
    return { type: 'devicon', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' };
  }
  if (t.includes('css')) {
    return { type: 'devicon', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' };
  }
  if (t.includes('html')) {
    return { type: 'devicon', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' };
  }
  if (t.includes('firebase')) {
    return { type: 'devicon', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' };
  }
  if (t.includes('flutter')) {
    return { type: 'devicon', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' };
  }
  if (t.includes('dart')) {
    return { type: 'devicon', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg' };
  }
  if (t.includes('state') || t.includes('redux')) {
    return { type: 'devicon', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg' };
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

  const filteredProjects = projects.filter(project => {
    const matchesCategory = activeCategory === 'All' || project.category.includes(activeCategory);

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      project.title.toLowerCase().includes(query) ||
      (project.subtitle && project.subtitle.toLowerCase().includes(query)) ||
      project.description.toLowerCase().includes(query) ||
      project.technologies.some(tech => tech.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  return (
    <section id="projects" className="section projects-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Projects & Systems</h2>
          <p className="section-subtitle">
            Engineered with modern frontend architecture, robust cloud backends, and responsive user experiences.
          </p>
        </div>

        {/* Filter Controls & Search */}
        <div className="projects-controls">
          <div className="projects-filter">
            {projectCategories.map(category => (
              <button
                key={category}
                className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Case Studies Grid */}
        <div className="projects-grid">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <AnimateOnScroll
                key={project.id}
                animation="fade-up"
                delay={index * 80}
                className="case-study-card glass-card"
              >
                {/* Visual Preview */}
                <div
                  className="project-image-wrapper"
                  onClick={() => setSelectedProject(project)}
                >
                  <img src={project.image} alt={project.title} className="project-preview-img" />
                  <div className="project-hover-overlay">
                    <span className="view-case-study-btn">
                      <FileText size={15} />
                      View Project
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="project-body">
                  <div className="project-header-meta">
                    <span className="project-cat-badge">{project.category[0]}</span>
                    <span className={`project-status-pill ${project.status === 'Completed' ? 'status-completed' : 'status-in-progress'}`}>
                      <span className="status-led"></span>
                      <span className="status-label">{project.status}</span>
                    </span>
                  </div>

                  <h3 className="project-heading">{project.title}</h3>
                  <p className="project-subtitle-text">{project.subtitle}</p>
                  <p className="project-summary">{project.description}</p>

                  {/* Tech stack icons */}
                  <div className="project-tech-icons">
                    {project.technologies.map((tech) => {
                      const info = getTechIconInfo(tech);
                      return (
                        <div key={tech} className="tech-icon-badge" title={tech} aria-label={tech}>
                          {info.type === 'devicon' ? (
                            <img
                              src={info.src}
                              alt={tech}
                              className="tech-badge-img"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : info.icon === 'server' ? (
                            <Server size={16} className="tech-badge-lucide" />
                          ) : info.icon === 'mail' ? (
                            <Mail size={16} className="tech-badge-lucide" />
                          ) : (
                            <Code2 size={16} className="tech-badge-lucide" />
                          )}
                          <span className="tech-badge-tooltip">{tech}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div className="project-card-actions">
                    {project.liveDemo && project.liveDemo !== '#' && (
                      <a
                        href={project.liveDemo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-action-link primary"
                        title="Live"
                        aria-label="Live"
                      >
                        <span className="action-text">Live</span>
                        <ExternalLink size={13} />
                      </a>
                    )}
                    {project.github && project.github !== '#' && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-action-link"
                        title="Source Code"
                        aria-label="Source Code"
                      >
                        <GithubIcon size={14} />
                        <span className="action-text">Source</span>
                      </a>
                    )}
                    <button
                      className="project-details-btn"
                      onClick={() => setSelectedProject(project)}
                    >
                      Details →
                    </button>
                  </div>
                </div>
              </AnimateOnScroll>
            ))
          ) : (
            <div className="no-projects glass-card">
              <p>No projects matched your criteria. Try resetting the filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Case Study Modal */}
      {selectedProject && (
        <div className="modal-backdrop" onClick={() => setSelectedProject(null)}>
          <div className="modal-dialog glass-card" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="modal-header">
              <div className="modal-title-wrap">
                <div className="modal-meta-row">
                  <span className="modal-category">{selectedProject.category.join(' • ')}</span>
                  <span className={`project-status-pill ${selectedProject.status === 'Completed' ? 'status-completed' : 'status-in-progress'}`}>
                    <span className="status-led"></span>
                    <span className="status-label">{selectedProject.status}</span>
                  </span>
                  {selectedProject.timeline && (
                    <span className="modal-timeline-pill">{selectedProject.timeline}</span>
                  )}
                </div>
                <h3 className="modal-title">{selectedProject.title}</h3>
                {selectedProject.subtitle && (
                  <p className="modal-subtitle">{selectedProject.subtitle}</p>
                )}
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setSelectedProject(null)}
                aria-label="Close modal"
                title="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="modal-content-scroll">
              {/* Project Showcase Browser Window (16:9 Uncropped Viewport) */}
              <div className="modal-browser-frame">
                <div className="modal-browser-bar">
                  <div className="browser-traffic-lights">
                    <span className="dot dot-red"></span>
                    <span className="dot dot-yellow"></span>
                    <span className="dot dot-green"></span>
                  </div>
                  <div className="browser-url-pill">
                    <Lock size={11} className="browser-lock-icon" />
                    <span>
                      {selectedProject.liveDemo && selectedProject.liveDemo !== '#'
                        ? selectedProject.liveDemo.replace(/^https?:\/\//, '').replace(/\/$/, '')
                        : `${selectedProject.title.toLowerCase().replace(/[^a-z0-9]/g, '')}.app`}
                    </span>
                  </div>
                  <div className="browser-bar-spacer"></div>
                </div>
                <div className="modal-browser-viewport">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className={`modal-project-img ${selectedProject.title === 'Tambayan App' ? 'img-contain' : ''}`}
                  />
                </div>
              </div>

              {/* Architecture & Engineering Metrics Banner */}
              {selectedProject.metrics && (
                <div className="modal-metrics-banner">
                  <div className="metrics-icon-badge">
                    <Activity size={14} />
                  </div>
                  <div className="metrics-text-group">
                    <span className="metrics-label">Architecture Telemetry</span>
                    <p className="metrics-value">{selectedProject.metrics}</p>
                  </div>
                </div>
              )}

              {/* Problem & Solution Cards */}
              <div className="modal-section-grid">
                {selectedProject.challenge && (
                  <div className="modal-box">
                    <h4 className="modal-box-heading">
                      <span className="modal-heading-icon-badge">
                        <Layers size={14} />
                      </span>
                      <span>Problem & Scope</span>
                    </h4>
                    <p>{selectedProject.challenge}</p>
                  </div>
                )}
                {selectedProject.solution && (
                  <div className="modal-box">
                    <h4 className="modal-box-heading">
                      <span className="modal-heading-icon-badge">
                        <Code2 size={14} />
                      </span>
                      <span>Architecture & Solution</span>
                    </h4>
                    <p>{selectedProject.solution}</p>
                  </div>
                )}
              </div>

              {/* Core Engineering Highlights */}
              {selectedProject.features && (
                <div className="modal-features-list">
                  <h4 className="modal-section-title">
                    <CheckCircle2 size={16} className="title-icon" />
                    <span>Core Engineering Highlights</span>
                  </h4>
                  <div className="modal-features-grid">
                    {selectedProject.features.map((feature, idx) => (
                      <div key={idx} className="feature-item-card">
                        <div className="feature-check-dot">
                          <CheckCircle2 size={14} />
                        </div>
                        <span className="feature-text">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* System Tech Stack */}
              <div className="modal-tech-stack">
                <h4 className="modal-section-title">
                  <Code2 size={16} className="title-icon" />
                  <span>System Tech Stack</span>
                </h4>
                <div className="tech-tags-wrap">
                  {selectedProject.technologies.map(tech => {
                    const info = getTechIconInfo(tech);
                    return (
                      <span key={tech} className="tech-pill with-icon">
                        {info.type === 'devicon' ? (
                          <img
                            src={info.src}
                            alt={tech}
                            className="tech-badge-img"
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
            </div>

            {/* Modal Footer Actions */}
            <div className="modal-footer">
              <div className="modal-footer-links">
                {selectedProject.liveDemo && selectedProject.liveDemo !== '#' && (
                  <a
                    href={selectedProject.liveDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="modal-btn-primary"
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
                    className="modal-btn-secondary"
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
