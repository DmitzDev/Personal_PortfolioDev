import React, { useState, useCallback } from 'react';
import { Briefcase, GraduationCap, Award, FileText, Calendar, MapPin, ChevronLeft, ChevronRight, Server, Database, Code2 } from 'lucide-react';
import { experience } from '../../data/experience';
import { education } from '../../data/education';
import { certificates, achievements } from '../../data/certificates';
import { personalInfo } from '../../data/personalInfo';
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

  // 1. Work Experience Swiper State
  const [activeExpIndex, setActiveExpIndex] = useState(0);
  const [slideExpDir, setSlideExpDir] = useState('next');
  const [isExpAnimating, setIsExpAnimating] = useState(false);

  // 2. Education Swiper State
  const [activeEduIndex, setActiveEduIndex] = useState(0);
  const [slideEduDir, setSlideEduDir] = useState('next');
  const [isEduAnimating, setIsEduAnimating] = useState(false);

  // 3. Certificates Swiper State
  const [activeCertIndex, setActiveCertIndex] = useState(0);
  const [slideCertDir, setSlideCertDir] = useState('next');
  const [isCertAnimating, setIsCertAnimating] = useState(false);

  // Shared Touch Coordinates
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  const handleTouchStart = (e) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (onSwipeLeft, onSwipeRight) => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    if (distance > 45) {
      onSwipeLeft();
    } else if (distance < -45) {
      onSwipeRight();
    }
  };

  // Work Experience Nav
  const handleNextExp = useCallback(() => {
    if (isExpAnimating) return;
    setSlideExpDir('next');
    setIsExpAnimating(true);
    setActiveExpIndex((prev) => (prev + 1) % experience.length);
    setTimeout(() => setIsExpAnimating(false), 300);
  }, [isExpAnimating]);

  const handlePrevExp = useCallback(() => {
    if (isExpAnimating) return;
    setSlideExpDir('prev');
    setIsExpAnimating(true);
    setActiveExpIndex((prev) => (prev - 1 + experience.length) % experience.length);
    setTimeout(() => setIsExpAnimating(false), 300);
  }, [isExpAnimating]);

  // Education Nav
  const handleNextEdu = useCallback(() => {
    if (isEduAnimating) return;
    setSlideEduDir('next');
    setIsEduAnimating(true);
    setActiveEduIndex((prev) => (prev + 1) % education.length);
    setTimeout(() => setIsEduAnimating(false), 300);
  }, [isEduAnimating]);

  const handlePrevEdu = useCallback(() => {
    if (isEduAnimating) return;
    setSlideEduDir('prev');
    setIsEduAnimating(true);
    setActiveEduIndex((prev) => (prev - 1 + education.length) % education.length);
    setTimeout(() => setIsEduAnimating(false), 300);
  }, [isEduAnimating]);

  // Certificates Nav
  const handleNextCert = useCallback(() => {
    if (isCertAnimating) return;
    setSlideCertDir('next');
    setIsCertAnimating(true);
    setActiveCertIndex((prev) => (prev + 1) % certificates.length);
    setTimeout(() => setIsCertAnimating(false), 300);
  }, [isCertAnimating]);

  const handlePrevCert = useCallback(() => {
    if (isCertAnimating) return;
    setSlideCertDir('prev');
    setIsCertAnimating(true);
    setActiveCertIndex((prev) => (prev - 1 + certificates.length) % certificates.length);
    setTimeout(() => setIsCertAnimating(false), 300);
  }, [isCertAnimating]);

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
            {/* Main Swiper Stage */}
            <div
              className="exp-swiper-stage"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={() => handleTouchEnd(handleNextExp, handlePrevExp)}
            >
              {(() => {
                const currentItem = experience[activeExpIndex];
                return (
                  <div
                    key={currentItem.id}
                    className={`exp-swiper-card glass-card slide-${slideExpDir}`}
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

            {/* Bottom Controls: Desktop arrows at bottom, dots, mobile swipe gesture */}
            <div className="exp-swiper-bottom-bar">
              <button
                type="button"
                className="exp-swiper-arrow-btn exp-arrow-desktop-only"
                onClick={handlePrevExp}
                aria-label="Previous experience"
                title="Previous experience"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="exp-swiper-dots">
                {experience.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`exp-dot ${idx === activeExpIndex ? 'active' : ''}`}
                    onClick={() => {
                      if (idx === activeExpIndex) return;
                      setSlideExpDir(idx > activeExpIndex ? 'next' : 'prev');
                      setActiveExpIndex(idx);
                    }}
                    aria-label={`Go to role ${idx + 1}: ${item.company}`}
                  />
                ))}
              </div>

              <button
                type="button"
                className="exp-swiper-arrow-btn exp-arrow-desktop-only"
                onClick={handleNextExp}
                aria-label="Next experience"
                title="Next experience"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="exp-swipe-hint">
              <span>← Swipe to switch role →</span>
            </div>
          </div>
        )}

        {/* TAB 2: EDUCATION (SWIPER VIEW) */}
        {activeTab === 'education' && (
          <div className="exp-swiper-container">
            {/* Main Education Swiper Stage */}
            <div
              className="exp-swiper-stage"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={() => handleTouchEnd(handleNextEdu, handlePrevEdu)}
            >
              {(() => {
                const currentEdu = education[activeEduIndex];
                return (
                  <div
                    key={currentEdu.id}
                    className={`exp-swiper-card glass-card slide-${slideEduDir}`}
                  >
                    <div className="exp-card-body">
                      <div className="exp-card-header-meta">
                        <span className="cert-issuer exp-company-name">{currentEdu.school}</span>
                        <span className="timeline-type-pill academic">{currentEdu.status}</span>
                      </div>

                      <h3 className="cert-title exp-card-title">{currentEdu.degree}</h3>

                      <div className="exp-meta-bar">
                        <span className="cert-date exp-date-meta">
                          <Calendar size={13} />
                          {currentEdu.year}
                        </span>
                      </div>

                      <p className="cert-desc exp-card-desc">{currentEdu.description}</p>

                      {currentEdu.awards && currentEdu.awards.length > 0 && (
                        <div className="exp-tech-icons-section">
                          <span className="exp-tech-section-title">Recognitions &amp; Honors</span>
                          <div className="awards-tags">
                            {currentEdu.awards.map((award, idx) => (
                              <span key={idx} className="award-pill">
                                <Award size={13} />
                                <span>{award}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Bottom Controls: Desktop arrows at bottom, dots, mobile swipe gesture */}
            <div className="exp-swiper-bottom-bar">
              <button
                type="button"
                className="exp-swiper-arrow-btn exp-arrow-desktop-only"
                onClick={handlePrevEdu}
                aria-label="Previous education milestone"
                title="Previous education milestone"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="exp-swiper-dots">
                {education.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`exp-dot ${idx === activeEduIndex ? 'active' : ''}`}
                    onClick={() => {
                      if (idx === activeEduIndex) return;
                      setSlideEduDir(idx > activeEduIndex ? 'next' : 'prev');
                      setActiveEduIndex(idx);
                    }}
                    aria-label={`Go to education ${idx + 1}: ${item.school}`}
                  />
                ))}
              </div>

              <button
                type="button"
                className="exp-swiper-arrow-btn exp-arrow-desktop-only"
                onClick={handleNextEdu}
                aria-label="Next education milestone"
                title="Next education milestone"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="exp-swipe-hint">
              <span>← Swipe to switch milestone →</span>
            </div>
          </div>
        )}

        {/* TAB 3: CERTIFICATES & HONORS (SWIPER VIEW) */}
        {activeTab === 'credentials' && (
          <div className="credentials-view">
            <div className="exp-swiper-container">
              {/* Main Certificate Swiper Stage */}
              <div
                className="exp-swiper-stage"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={() => handleTouchEnd(handleNextCert, handlePrevCert)}
              >
                {(() => {
                  const currentCert = certificates[activeCertIndex];
                  return (
                    <div
                      key={currentCert.id}
                      className={`exp-swiper-card cert-swiper-card glass-card slide-${slideCertDir}`}
                    >
                      <div className="cert-swiper-grid">
                        <div
                          className="cert-image-preview cert-swiper-preview"
                          onClick={() => setSelectedCert(currentCert)}
                          title="Click to expand credential"
                        >
                          <img src={currentCert.image} alt={currentCert.title} />
                          <div className="cert-preview-overlay">
                            <span>Click to view credential</span>
                          </div>
                        </div>

                        <div className="cert-body exp-card-body">
                          <div className="exp-card-header-meta">
                            <span className="cert-issuer">{currentCert.organization}</span>
                            <span className="cert-date exp-date-meta">
                              <Calendar size={13} />
                              {currentCert.date}
                            </span>
                          </div>

                          <h3 className="cert-title exp-card-title">{currentCert.title}</h3>
                          <p className="cert-desc exp-card-desc">{currentCert.description}</p>

                          {currentCert.skills && (
                            <div className="cert-skills-wrap">
                              {currentCert.skills.map((s) => (
                                <span key={s} className="tech-pill">{s}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Bottom Controls: Desktop arrows at bottom, dots, mobile swipe gesture */}
              <div className="exp-swiper-bottom-bar">
                <button
                  type="button"
                  className="exp-swiper-arrow-btn exp-arrow-desktop-only"
                  onClick={handlePrevCert}
                  aria-label="Previous credential"
                  title="Previous credential"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="exp-swiper-dots">
                  {certificates.map((cert, idx) => (
                    <button
                      key={cert.id}
                      type="button"
                      className={`exp-dot ${idx === activeCertIndex ? 'active' : ''}`}
                      onClick={() => {
                        if (idx === activeCertIndex) return;
                        setSlideCertDir(idx > activeCertIndex ? 'next' : 'prev');
                        setActiveCertIndex(idx);
                      }}
                      aria-label={`Go to certificate ${idx + 1}: ${cert.title}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  className="exp-swiper-arrow-btn exp-arrow-desktop-only"
                  onClick={handleNextCert}
                  aria-label="Next credential"
                  title="Next credential"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="exp-swipe-hint">
                <span>← Swipe to switch credential →</span>
              </div>
            </div>

            {/* Honors & Milestones Grid */}
            <div className="achievements-section-wrap">
              <h4 className="sub-heading">Academic &amp; Industry Honors</h4>
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
