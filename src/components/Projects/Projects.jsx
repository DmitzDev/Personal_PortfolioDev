import React, { useState } from 'react';
import { ExternalLink, Search, X, CheckCircle2, FileText, Layers, Code2 } from 'lucide-react';
import { projects, projectCategories } from '../../data/projects';
import { AnimateOnScroll } from '../shared/AnimateOnScroll';
import './Projects.css';

const GithubIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path>
  </svg>
);

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
          <div className="section-tag">FEATURED PROJECTS</div>
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

                  {/* Tech stack pills */}
                  <div className="project-tech-pills">
                    {project.technologies.slice(0, 4).map((tech, idx) => (
                      <span key={tech} className={`tech-pill ${idx >= 2 ? 'desktop-only-pill' : ''}`}>
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 2 && (
                      <span className="tech-pill muted mobile-only-pill">
                        +{project.technologies.length - 2}
                      </span>
                    )}
                    {project.technologies.length > 4 && (
                      <span className="tech-pill muted desktop-only-pill">
                        +{project.technologies.length - 4} more
                      </span>
                    )}
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
            <div className="modal-header">
              <div className="modal-title-wrap">
                <div className="modal-meta-row">
                  <span className="modal-category">{selectedProject.category.join(' • ')}</span>
                  <span className={`project-status-pill ${selectedProject.status === 'Completed' ? 'status-completed' : 'status-in-progress'}`}>
                    <span className="status-led"></span>
                    <span className="status-label">{selectedProject.status}</span>
                  </span>
                </div>
                <h3 className="modal-title">{selectedProject.title}</h3>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setSelectedProject(null)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-content-scroll">
              <div className="modal-hero-image">
                <img src={selectedProject.image} alt={selectedProject.title} />
              </div>

              <div className="modal-section-grid">
                {selectedProject.challenge && (
                  <div className="modal-box">
                    <h4 className="modal-box-heading">
                      <Layers size={16} className="modal-heading-icon" />
                      <span>Problem & Scope</span>
                    </h4>
                    <p>{selectedProject.challenge}</p>
                  </div>
                )}
                {selectedProject.solution && (
                  <div className="modal-box">
                    <h4 className="modal-box-heading">
                      <Code2 size={16} className="modal-heading-icon" />
                      <span>Architecture & Solution</span>
                    </h4>
                    <p>{selectedProject.solution}</p>
                  </div>
                )}
              </div>

              {selectedProject.features && (
                <div className="modal-features-list">
                  <h4>Core Engineering Highlights</h4>
                  <ul>
                    {selectedProject.features.map((feature, idx) => (
                      <li key={idx}>
                        <CheckCircle2 size={16} className="feature-check-icon" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="modal-tech-stack">
                <h4>System Tech Stack</h4>
                <div className="tech-tags-wrap">
                  {selectedProject.technologies.map(tech => (
                    <span key={tech} className="tech-pill">{tech}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <div className="modal-footer-links">
                {selectedProject.liveDemo && selectedProject.liveDemo !== '#' && (
                  <a
                    href={selectedProject.liveDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    <span>Launch Live Application</span>
                    <ExternalLink size={16} />
                  </a>
                )}
                {selectedProject.github && selectedProject.github !== '#' && (
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
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
