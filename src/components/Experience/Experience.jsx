import React, { useState, useCallback } from 'react';
import { Briefcase, GraduationCap, Award, FileText, Calendar, MapPin, ChevronLeft, ChevronRight, Server, Database, Code2 } from 'lucide-react';
import { experience } from '../../data/experience';
import { education } from '../../data/education';
import { certificates, achievements } from '../../data/certificates';
import { personalInfo } from '../../data/personalInfo';
import { AnimateOnScroll } from '../shared/AnimateOnScroll';
import './Experience.css';

const getExpTechIcon = (techName) => {
  const t = techName.toLowerCase();
  if (t.includes('react')) {
    return { type: 'devicon', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' };
  }
  if (t.includes('javascript') || t.includes('es6')) {
    return { type: 'devicon', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' };
  }
  if (t.includes('firebase') || t.includes('firestore')) {
    return { type: 'devicon', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' };
  }
  if (t.includes('node')) {
    return { type: 'devicon', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' };
  }
  if (t.includes('css')) {
    return { type: 'devicon', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' };
  }
  if (t.includes('vite')) {
    return { type: 'devicon', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg' };
  }
  if (t.includes('state') || t.includes('redux')) {
    return { type: 'devicon', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg' };
  }
  if (t.includes('tailwind')) {
    return { type: 'devicon', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' };
  }
  if (t.includes('vercel')) {
    return { type: 'devicon', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg' };
  }
  if (t.includes('git') || t.includes('github')) {
    return { type: 'devicon', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' };
  }
  if (t.includes('api') || t.includes('rest')) {
    return { type: 'lucide', icon: 'server' };
  }
  if (t.includes('database') || t.includes('sql') || t.includes('architecture')) {
    return { type: 'lucide', icon: 'database' };
  }
  return { type: 'lucide', icon: 'code' };
};

export function Experience() {
  const [activeTab, setActiveTab] = useState('experience');
  const [selectedCert, setSelectedCert] = useState(null);
  const [activeExpIndex, setActiveExpIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState('next');
  const [isExpAnimating, setIsExpAnimating] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  const handleNextExp = useCallback(() => {
    if (isExpAnimating) return;
    setSlideDirection('next');
    setIsExpAnimating(true);
    setActiveExpIndex((prev) => (prev + 1) % experience.length);
    setTimeout(() => setIsExpAnimating(false), 320);
  }, [isExpAnimating]);

  const handlePrevExp = useCallback(() => {
    if (isExpAnimating) return;
    setSlideDirection('prev');
    setIsExpAnimating(true);
    setActiveExpIndex((prev) => (prev - 1 + experience.length) % experience.length);
    setTimeout(() => setIsExpAnimating(false), 320);
  }, [isExpAnimating]);

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
    if (distance > 50) {
      handleNextExp();
    } else if (distance < -50) {
      handlePrevExp();
    }
  };

  return (
    <section id="experience" className="section experience-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Experience, Education & Credentials</h2>
          <p className="section-subtitle">
            A comprehensive record of client engagements, technical internships, computer engineering education, and industry certifications.
          </p>
        </div>

        {/* Tab Controls + Resume Action */}
        <div className="experience-controls-bar">
          <div className="experience-tabs">
            <button
              className={`exp-tab-btn ${activeTab === 'experience' ? 'active' : ''}`}
              onClick={() => setActiveTab('experience')}
            >
              <Briefcase size={16} />
              <span>Work Experience</span>
            </button>
            <button
              className={`exp-tab-btn ${activeTab === 'education' ? 'active' : ''}`}
              onClick={() => setActiveTab('education')}
            >
              <GraduationCap size={16} />
              <span>Education</span>
            </button>
            <button
              className={`exp-tab-btn ${activeTab === 'credentials' ? 'active' : ''}`}
              onClick={() => setActiveTab('credentials')}
            >
              <Award size={16} />
              <span>Certificates & Honors</span>
            </button>
          </div>

          <a
            href={personalInfo.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-resume-download"
            title="Download full resume PDF"
          >
            <FileText size={16} />
            <span>Download Full CV</span>
          </a>
        </div>

        {/* TAB 1: WORK EXPERIENCE (SWIPER VIEW) */}
        {activeTab === 'experience' && (
          <div className="exp-swiper-container">
            {/* Top Swiper Meta & Arrow Controls */}
            <div className="exp-swiper-top-bar">
              <div className="exp-swiper-counter">
                <span className="exp-counter-current">0{activeExpIndex + 1}</span>
                <span className="exp-counter-separator">/</span>
                <span className="exp-counter-total">0{experience.length}</span>
                <span className="exp-counter-label">Role Focus</span>
              </div>

              <div className="exp-swiper-nav-buttons">
                <button
                  type="button"
                  className="exp-swiper-arrow-btn"
                  onClick={handlePrevExp}
                  aria-label="Previous experience"
                  title="Previous experience"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  className="exp-swiper-arrow-btn"
                  onClick={handleNextExp}
                  aria-label="Next experience"
                  title="Next experience"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Main Swiper Stage */}
            <div
              className="exp-swiper-stage"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {(() => {
                const currentItem = experience[activeExpIndex];
                return (
                  <div
                    key={currentItem.id}
                    className={`exp-swiper-card glass-card slide-${slideDirection}`}
                  >
                    <div className="exp-card-body">
                      <div className="exp-card-header-meta">
                        <span className="cert-issuer exp-company-name">{currentItem.company}</span>
                        <span className="timeline-type-pill">{currentItem.type}</span>
                      </div>

                      <h3 className="cert-title exp-card-title">{currentItem.position}</h3>

                      <div className="exp-meta-bar">
                        <span className="cert-date exp-date-meta">
                          <Calendar size={13} />
                          {currentItem.duration}
                        </span>
                        {currentItem.location && (
                          <span className="cert-date exp-location-meta">
                            <MapPin size={13} />
                            {currentItem.location}
                          </span>
                        )}
                      </div>

                      <p className="cert-desc exp-card-desc">{currentItem.description}</p>

                      {/* Tech Stack Icons (No plain text tags) */}
                      {currentItem.tech && (
                        <div className="exp-tech-icons-section">
                          <span className="exp-tech-section-title">Core Technologies</span>
                          <div className="exp-tech-icons-cluster">
                            {currentItem.tech.map((tech) => {
                              const iconInfo = getExpTechIcon(tech);
                              return (
                                <div
                                  key={tech}
                                  className="exp-tech-icon-box"
                                  title={tech}
                                  aria-label={tech}
                                >
                                  {iconInfo.type === 'devicon' ? (
                                    <img
                                      src={iconInfo.src}
                                      alt={tech}
                                      className="exp-tech-icon-img"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                  ) : iconInfo.icon === 'database' ? (
                                    <Database size={22} className="exp-tech-icon-svg" />
                                  ) : iconInfo.icon === 'server' ? (
                                    <Server size={22} className="exp-tech-icon-svg" />
                                  ) : (
                                    <Code2 size={22} className="exp-tech-icon-svg" />
                                  )}
                                  <span className="exp-tech-icon-tooltip">{tech}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Bottom Dots & Mobile Swipe Hint */}
            <div className="exp-swiper-bottom-bar">
              <div className="exp-swiper-dots">
                {experience.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`exp-dot ${idx === activeExpIndex ? 'active' : ''}`}
                    onClick={() => {
                      if (idx === activeExpIndex) return;
                      setSlideDirection(idx > activeExpIndex ? 'next' : 'prev');
                      setActiveExpIndex(idx);
                    }}
                    aria-label={`Go to role ${idx + 1}: ${item.company}`}
                  />
                ))}
              </div>

              <div className="exp-swipe-hint">
                <span>← Swipe to switch →</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EDUCATION */}
        {activeTab === 'education' && (
          <div className="credentials-view">
            <div className="credentials-grid edu-cards-grid">
              {education.map((item, index) => (
                <AnimateOnScroll
                  key={item.id}
                  animation="fade-up"
                  delay={index * 80}
                  className="cert-card edu-card glass-card"
                >
                  <div className="cert-body exp-card-body">
                    <div className="exp-card-header-meta">
                      <span className="cert-issuer">{item.school}</span>
                      <span className="timeline-type-pill academic">{item.status}</span>
                    </div>

                    <h3 className="cert-title exp-card-title">{item.degree}</h3>

                    <div className="exp-meta-bar">
                      <span className="cert-date exp-date-meta">
                        <Calendar size={13} />
                        {item.year}
                      </span>
                    </div>

                    <p className="academic-description exp-academic-desc">{item.description}</p>

                    {item.awards && item.awards.length > 0 && (
                      <div className="academic-awards exp-awards-wrap">
                        <span className="awards-label">Recognitions:</span>
                        <div className="awards-tags">
                          {item.awards.map((award, idx) => (
                            <span key={idx} className="award-pill">
                              <Award size={12} />
                              {award}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CERTIFICATES & HONORS */}
        {activeTab === 'credentials' && (
          <div className="credentials-view">
            {/* Industry Certificates */}
            <div className="credentials-grid">
              {certificates.map((cert, index) => (
                <AnimateOnScroll
                  key={cert.id}
                  animation="fade-up"
                  delay={index * 80}
                  className="cert-card glass-card"
                >
                  <div className="cert-image-preview" onClick={() => setSelectedCert(cert)}>
                    <img src={cert.image} alt={cert.title} />
                    <div className="cert-preview-overlay">
                      <span>Click to view credential</span>
                    </div>
                  </div>

                  <div className="cert-body">
                    <span className="cert-issuer">{cert.organization}</span>
                    <h3 className="cert-title">{cert.title}</h3>
                    <span className="cert-date">{cert.date}</span>
                    <p className="cert-desc">{cert.description}</p>

                    {cert.skills && (
                      <div className="cert-skills-wrap">
                        {cert.skills.map(s => (
                          <span key={s} className="tech-pill">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </AnimateOnScroll>
              ))}
            </div>

            {/* Honors & Milestones */}
            <div className="achievements-section-wrap">
              <h4 className="sub-heading">Academic & Industry Honors</h4>
              <div className="achievements-grid">
                {achievements.map((ach) => (
                  <div key={ach.id} className="achievement-card glass-card">
                    <div className="ach-metric">{ach.metric}</div>
                    <h5 className="ach-title">{ach.title}</h5>
                    <p className="ach-desc">{ach.description}</p>
                    <span className="ach-year">{ach.year}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Certificate Modal */}
      {selectedCert && (
        <div className="cert-modal-backdrop" onClick={() => setSelectedCert(null)}>
          <div className="cert-modal-dialog glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="cert-modal-header">
              <div>
                <span className="cert-modal-issuer">{selectedCert.organization}</span>
                <h3 className="cert-modal-title">{selectedCert.title}</h3>
              </div>
              <button className="cert-close-btn" onClick={() => setSelectedCert(null)}>✕</button>
            </div>
            <div className="cert-modal-img-wrap">
              <img src={selectedCert.image} alt={selectedCert.title} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
