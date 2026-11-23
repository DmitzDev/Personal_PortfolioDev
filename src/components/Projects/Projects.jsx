import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  ExternalLink,
  Code2,
  Server,
  Mail,
  X,
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
  const [selectedId, setSelectedId] = useState(projects[0]?.id ?? 1);
  const [lightboxProject, setLightboxProject] = useState(null);

  const filteredProjects = projects.filter((project) =>
    activeCategory === 'All' || project.category.includes(activeCategory)
  );

  const currentProject =
    filteredProjects.find((p) => p.id === selectedId) || filteredProjects[0] || null;

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    const nextFiltered = projects.filter((project) =>
      category === 'All' || project.category.includes(category)
    );
    if (nextFiltered[0]) {
      setSelectedId(nextFiltered[0].id);
    }
  };

  useEffect(() => {
    if (!lightboxProject) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setLightboxProject(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxProject]);

  return (
    <section id="projects" className="section projects-section" aria-labelledby="projects-heading">
      <div className="container">
        <div className="section-header">
          <h2 id="projects-heading" className="section-title">Projects</h2>
          <p className="section-subtitle">
            Featured web, mobile, and engineering systems built for production.
          </p>
        </div>

        {/* Category Filter Bar */}
        <div className="projects-filter" role="group" aria-label="Filter projects by category">
          {projectCategories.map((category) => (
            <button
              key={category}
              type="button"
              className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Studio Project Index + Live Preview Split */}
        {currentProject ? (
          <div className="projects-index-layout">
            {/* LEFT: Visual Thumbnail Index */}
            <div className="project-index-list" role="tablist" aria-label="Select a project">
              {filteredProjects.map((project, idx) => {
                const isActive = project.id === currentProject.id;
                const statusClass = getStatusClass(project.status);

                return (
                  <button
                    key={project.id}
                    type="button"
                    role="tab"
                    id={`project-tab-${project.id}`}
                    aria-selected={isActive}
                    aria-controls={`project-panel-${project.id}`}
                    className={`project-index-item ${isActive ? 'is-active' : ''}`}
                    onClick={() => setSelectedId(project.id)}
                  >
                    <span className="index-item-num">
                      {String(idx + 1).padStart(2, '0')}
                    </span>

                    <span className="index-thumb-wrap" aria-hidden="true">
                      <img
                        src={project.image}
                        alt=""
                        className="index-thumb-img"
                        width="56"
                        height="26"
                        loading="lazy"
                      />
                    </span>

                    <span className="index-item-main">
                      <span className="index-item-title">{project.title}</span>
                      <span className="index-item-cat">{project.category[0]}</span>
                    </span>

                    <span
                      className={`index-status-dot ${statusClass}`}
                      title={project.status}
                      aria-label={project.status}
                    />

                    <ArrowRight size={15} className="index-item-arrow" aria-hidden="true" />
                  </button>
                );
              })}
            </div>

            {/* RIGHT: Studio Live Preview Stage */}
            <article
              key={currentProject.id}
              id={`project-panel-${currentProject.id}`}
              role="tabpanel"
              aria-labelledby={`project-tab-${currentProject.id}`}
              className="project-preview-stage"
            >
              <button
                type="button"
                className="project-preview-media"
                onClick={() => setLightboxProject(currentProject)}
                aria-label={`Enlarge ${currentProject.title} preview`}
                title="Click to enlarge preview"
              >
                <img
                  src={currentProject.image}
                  alt={currentProject.title}
                  className="project-preview-img"
                  width="800"
                  height="368"
                  loading="eager"
                />
              </button>

              <div className="project-preview-body">
                <div className="project-header-meta">
                  <span className="project-cat-badge">{currentProject.category[0]}</span>
                  <span className={`project-status-pill ${getStatusClass(currentProject.status)}`}>
                    <span className="status-dot" aria-hidden="true"></span>
                    <span className="status-label">{currentProject.status}</span>
                  </span>
                  {currentProject.timeline && (
                    <span className="project-timeline-tag">{currentProject.timeline}</span>
                  )}
                </div>

                <h3 className="project-showcase-title">{currentProject.title}</h3>
                {currentProject.role && (
                  <p className="project-role-line">{currentProject.role}</p>
                )}

                <p className="project-showcase-desc">{currentProject.description}</p>

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

                {((currentProject.liveDemo && currentProject.liveDemo !== '#') ||
                  (currentProject.github && currentProject.github !== '#')) && (
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
                  </div>
                )}
              </div>
            </article>
          </div>
        ) : (
          <div className="no-projects">
            <p>No projects matched this category.</p>
          </div>
        )}
      </div>

      {/* Lightbox Preview */}
      {lightboxProject && (
        <div
          className="project-lightbox-backdrop"
          onClick={() => setLightboxProject(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${lightboxProject.title} full preview`}
        >
          <div
            className="project-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="project-lightbox-close"
              onClick={() => setLightboxProject(null)}
              aria-label="Close preview"
            >
              <X size={18} />
            </button>
            <img
              src={lightboxProject.image}
              alt={lightboxProject.title}
              className="project-lightbox-img"
            />
            <p className="project-lightbox-caption">{lightboxProject.title}</p>
          </div>
        </div>
      )}
    </section>
  );
}
