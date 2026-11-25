import React, { useState } from 'react';
import {
  ExternalLink,
  Code2,
  Server,
  Mail,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { projects, projectCategories } from '../../data/projects';
import { AnimateOnScroll } from '../shared/AnimateOnScroll';
import './Projects.css';

const GithubIcon = ({ size = 15 }) => (
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
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4" />
  </svg>
);

const getTechIconInfo = (tech) => {
  const t = tech.toLowerCase();
  if (t.includes('react')) return { type: 'devicon', src: '/icons/react.svg' };
  if (t.includes('node')) return { type: 'devicon', src: '/icons/nodejs.svg' };
  if (t.includes('vite')) return { type: 'devicon', src: '/icons/vitejs.svg' };
  if (t.includes('javascript') || t.includes('js')) {
    if (t.includes('email')) return { type: 'lucide', icon: 'mail' };
    return { type: 'devicon', src: '/icons/javascript.svg' };
  }
  if (t.includes('css')) return { type: 'devicon', src: '/icons/css3.svg' };
  if (t.includes('html')) return { type: 'devicon', src: '/icons/html5.svg' };
  if (t.includes('firebase')) return { type: 'devicon', src: '/icons/firebase.svg' };
  if (t.includes('flutter')) return { type: 'devicon', src: '/icons/flutter.svg' };
  if (t.includes('dart')) return { type: 'devicon', src: '/icons/dart.svg' };
  if (t.includes('state') || t.includes('redux')) return { type: 'devicon', src: '/icons/redux.svg' };
  if (t.includes('api') || t.includes('rest')) return { type: 'lucide', icon: 'server' };
  if (t.includes('email')) return { type: 'lucide', icon: 'mail' };
  return { type: 'lucide', icon: 'code' };
};

const getStatusClass = (status) => {
  if (status === 'Completed') return 'status-completed';
  if (status === 'Maintenance') return 'status-maintenance';
  return 'status-in-progress';
};

export function Projects() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [showAll, setShowAll] = useState(false);

  const filteredProjects = projects.filter(
    (project) => activeCategory === 'All' || project.category.includes(activeCategory)
  );

  const visibleProjects =
    activeCategory === 'All' && !showAll
      ? filteredProjects.slice(0, 4)
      : filteredProjects;

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setShowAll(false);
  };

  return (
    <section id="projects" className="section projects-section" aria-labelledby="projects-heading">
      <div className="container">
        <header className="section-header projects-header">
          <h2 id="projects-heading" className="section-title">
            Projects
          </h2>
          <p className="section-subtitle">
            Featured web, mobile, and engineering systems built for production.
          </p>
        </header>

        {/* Category Filter Pills */}
        <div className="projects-filter-bar" role="group" aria-label="Filter projects by category">
          {projectCategories.map((category) => (
            <button
              key={category}
              type="button"
              className={`projects-filter-pill ${activeCategory === category ? 'is-active' : ''}`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Alternating Z-Pattern Editorial Rows */}
        {visibleProjects.length > 0 ? (
          <div className="projects-z-list">
            {visibleProjects.map((project, idx) => {
              const isReversed = idx % 2 === 1;
              const isMobileApp = project.category.includes('Mobile App');
              const statusClass = getStatusClass(project.status);
              const hasLive = project.liveDemo && project.liveDemo !== '#';
              const hasGithub = project.github && project.github !== '#';

              return (
                <AnimateOnScroll
                  key={project.id}
                  animation="fade-up"
                  delay={idx < 2 ? idx * 60 : 40}
                >
                  <article className={`project-z-row ${isReversed ? 'is-reversed' : ''}`}>
                    {/* Device Frame Preview: Phone for Mobile App, Laptop for Web */}
                    <div
                      className={`project-device-frame ${isMobileApp ? 'is-mobile-device' : 'is-laptop-device'}`}
                    >
                      {isMobileApp ? (
                        <div className="device-phone">
                          <span className="device-phone-btn-vol-up" aria-hidden="true" />
                          <span className="device-phone-btn-vol-down" aria-hidden="true" />
                          <span className="device-phone-btn-power" aria-hidden="true" />
                          <div className="device-phone-body">
                            <div className="device-phone-island" aria-hidden="true">
                              <span className="device-phone-lens" />
                            </div>
                            <div className="device-phone-screen">
                              <div className="device-phone-glare" aria-hidden="true" />
                              <div className="device-phone-statusbar" aria-hidden="true">
                                <span>9:41</span>
                                <span className="device-phone-icons">
                                  <svg width="13" height="9" viewBox="0 0 13 9" fill="currentColor">
                                    <rect x="0" y="5" width="2" height="4" rx="0.5" />
                                    <rect x="3.5" y="3.5" width="2" height="5.5" rx="0.5" />
                                    <rect x="7" y="2" width="2" height="7" rx="0.5" />
                                    <rect x="10.5" y="0" width="2" height="9" rx="0.5" />
                                  </svg>
                                  <svg width="16" height="9" viewBox="0 0 16 9" fill="none">
                                    <rect x="0.5" y="0.5" width="13" height="8" rx="2" stroke="currentColor" strokeOpacity="0.6" />
                                    <rect x="2" y="2" width="9" height="5" rx="1" fill="currentColor" />
                                    <rect x="14.5" y="2.8" width="1.5" height="3.4" rx="0.7" fill="currentColor" fillOpacity="0.6" />
                                  </svg>
                                </span>
                              </div>
                              <div className="device-phone-media-wrap">
                                <img
                                  src={project.image}
                                  alt={project.title}
                                  className="device-phone-img"
                                  width="640"
                                  height="360"
                                  loading={idx < 2 ? 'eager' : 'lazy'}
                                />
                              </div>
                              <div className="device-phone-app-meta" aria-hidden="true">
                                <span className="device-phone-app-name">{project.title}</span>
                                <span className="device-phone-app-tag">Mobile App</span>
                              </div>
                              <div className="device-phone-homebar" aria-hidden="true" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="device-laptop">
                          <div className="device-laptop-lid">
                            <div className="device-laptop-notch-top" aria-hidden="true">
                              <span className="device-laptop-cam" />
                            </div>
                            <div className="device-laptop-screen">
                              <div className="device-laptop-glare" aria-hidden="true" />
                              <img
                                src={project.image}
                                alt={project.title}
                                className="device-laptop-img"
                                width="800"
                                height="450"
                                loading={idx < 2 ? 'eager' : 'lazy'}
                              />
                            </div>
                          </div>
                          <div className="device-laptop-base" aria-hidden="true">
                            <div className="device-laptop-groove" />
                          </div>
                          <div className="device-laptop-shadow" aria-hidden="true" />
                        </div>
                      )}
                    </div>

                    {/* Project Details */}
                    <div className="project-z-details">
                      <div className="project-z-meta">
                        <span className="project-z-index">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="project-z-category">{project.category[0]}</span>
                        <span className={`project-z-status ${statusClass}`}>
                          <span className="status-dot" aria-hidden="true" />
                          <span>{project.status}</span>
                        </span>
                        {project.timeline && (
                          <span className="project-z-year">{project.timeline}</span>
                        )}
                      </div>

                      <h3 className="project-z-title">{project.title}</h3>
                      <p className="project-z-desc">{project.description}</p>

                      {/* Tech Stack Icons */}
                      <div className="project-z-tech" aria-label="Tech stack">
                        {project.technologies.map((tech) => {
                          const info = getTechIconInfo(tech);
                          return (
                            <span key={tech} className="project-z-tech-chip" title={tech}>
                              {info.type === 'devicon' ? (
                                <img
                                  src={info.src}
                                  alt=""
                                  width="15"
                                  height="15"
                                  loading="lazy"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              ) : info.icon === 'server' ? (
                                <Server size={14} aria-hidden="true" />
                              ) : info.icon === 'mail' ? (
                                <Mail size={14} aria-hidden="true" />
                              ) : (
                                <Code2 size={14} aria-hidden="true" />
                              )}
                              <span>{tech}</span>
                            </span>
                          );
                        })}
                      </div>

                      {/* Action Links */}
                      {(hasLive || hasGithub) && (
                        <div className="project-z-actions">
                          {hasLive && (
                            <a
                              href={project.liveDemo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="project-z-btn-primary"
                            >
                              <span>Live Demo</span>
                              <ExternalLink size={14} aria-hidden="true" />
                            </a>
                          )}
                          {hasGithub && (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="project-z-btn-secondary"
                            >
                              <GithubIcon size={14} />
                              <span>GitHub</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                </AnimateOnScroll>
              );
            })}
          </div>
        ) : (
          <div className="no-projects">
            <p>No projects matched this category.</p>
          </div>
        )}

        {/* Show More / Less Toggle when viewing All */}
        {activeCategory === 'All' && filteredProjects.length > 4 && (
          <div className="projects-more-wrap">
            <button
              type="button"
              className="projects-more-btn"
              onClick={() => setShowAll((prev) => !prev)}
            >
              <span>
                {showAll
                  ? 'Show Featured Only'
                  : `View All ${filteredProjects.length} Projects`}
              </span>
              {showAll ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
