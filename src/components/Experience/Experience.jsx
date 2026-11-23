import React, { useState, useCallback, useEffect } from 'react';
import { Briefcase, GraduationCap, Award, Calendar, MapPin, ChevronLeft, ChevronRight, Maximize2, ExternalLink, X } from 'lucide-react';
import { experience } from '../../data/experience';
import { education } from '../../data/education';
import { certificates, achievements } from '../../data/certificates';
import './Experience.css';

export function Experience() {
  const [activeTab, setActiveTab] = useState('experience');
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    if (!selectedCert) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedCert(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCert]);

  // 1. Work Experience Swiper State
  const [activeExpIndex, setActiveExpIndex] = useState(0);
  const [slideExpDir, setSlideExpDir] = useState('next');
  const [isExpAnimating, setIsExpAnimating] = useState(false);

  // 2. Education Swiper State
  const [activeEduIndex, setActiveEduIndex] = useState(0);
  const [slideEduDir, setSlideEduDir] = useState('next');
  const [isEduAnimating, setIsEduAnimating] = useState(false);

  // 3. Certificates 3D Deck State
  const [certGroup, setCertGroup] = useState('cisco');
  const [activeCertIndex, setActiveCertIndex] = useState(0);

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

                      {/* Core Technologies: Single Responsive Paragraph */}
                      {currentItem.tech && (
                        <div className="exp-tech-paragraph-wrap">
                          <p className="exp-tech-paragraph">
                            <strong className="exp-tech-label">Core Technologies: </strong>
                            {currentItem.tech.join(' • ')}
                          </p>
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

        {/* TAB 3: CERTIFICATES & HONORS (3D PLAYING CARDS "BARAHA" DECK + CISCO / SEMINARS TOGGLE) */}
        {activeTab === 'credentials' && (() => {
          const isCiscoCert = (c) => c.organization.toLowerCase().includes('cisco');
          const visibleCerts =
            certGroup === 'cisco'
              ? certificates.filter(isCiscoCert)
              : certificates.filter((c) => !isCiscoCert(c));

          const total = visibleCerts.length;
          const safeIndex = total > 0 ? Math.min(activeCertIndex, total - 1) : 0;
          const currentCert = visibleCerts[safeIndex] || visibleCerts[0];

          const handlePrevCert = () => {
            if (total <= 1) return;
            setActiveCertIndex((prev) => (prev - 1 + total) % total);
          };

          const handleNextCert = () => {
            if (total <= 1) return;
            setActiveCertIndex((prev) => (prev + 1) % total);
          };

          return (
            <div className="credentials-view">
              <div className="cert-deck-showcase">
                {/* Left Side: 3D Playing Cards ("Baraha") Deck */}
                <div
                  className="cert-deck-stage"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={() => handleTouchEnd(handleNextCert, handlePrevCert)}
                >
                  <div className="cert-deck-stack">
                    {visibleCerts.map((cert, idx) => {
                      let cardState = 'hidden';
                      if (total === 1) {
                        cardState = 'active';
                      } else if (total === 2) {
                        cardState = idx === safeIndex ? 'active' : 'next';
                      } else {
                        if (idx === safeIndex) {
                          cardState = 'active';
                        } else if (idx === (safeIndex - 1 + total) % total) {
                          cardState = 'prev';
                        } else if (idx === (safeIndex + 1) % total) {
                          cardState = 'next';
                        }
                      }

                      return (
                        <div
                          key={cert.id}
                          className={`cert-deck-card cert-card-${cardState}`}
                          onClick={() => {
                            if (cardState === 'prev') handlePrevCert();
                            else if (cardState === 'next') handleNextCert();
                            else if (cardState === 'active') setSelectedCert(cert);
                          }}
                          title={
                            cardState === 'active'
                              ? 'Click to enlarge certificate'
                              : cardState === 'prev'
                              ? `Previous: ${cert.title}`
                              : `Next: ${cert.title}`
                          }
                          aria-label={cert.title}
                        >
                          <div className="cert-deck-card-inner">
                            <img
                              src={cert.image}
                              alt={cert.title}
                              className="cert-deck-img"
                              width="600"
                              height="400"
                              loading="lazy"
                            />
                            {cardState === 'active' && (
                              <div className="cert-deck-hover-overlay">
                                <span className="cert-expand-pill">
                                  <Maximize2 size={13} />
                                  <span>Enlarge</span>
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Side: Category Toggle + Clean Unboxed Context Details */}
                {currentCert && (
                  <div className="cert-details-unboxed">
                    <div className="cert-group-toggle" role="tablist" aria-label="Certificate category">
                      <button
                        type="button"
                        role="tab"
                        aria-selected={certGroup === 'cisco'}
                        className={`cert-group-toggle-btn ${certGroup === 'cisco' ? 'is-active' : ''}`}
                        onClick={() => {
                          setCertGroup('cisco');
                          setActiveCertIndex(0);
                        }}
                      >
                        Cisco Academy
                      </button>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={certGroup === 'other'}
                        className={`cert-group-toggle-btn ${certGroup === 'other' ? 'is-active' : ''}`}
                        onClick={() => {
                          setCertGroup('other');
                          setActiveCertIndex(0);
                        }}
                      >
                        Industry &amp; Seminars
                      </button>
                    </div>

                    <div className="cert-unboxed-meta-bar">
                      <span className="cert-unboxed-issuer">{currentCert.organization}</span>
                      <span className="cert-unboxed-date">
                        <Calendar size={13} />
                        <span>{currentCert.date}</span>
                      </span>
                    </div>

                    <h3 className="cert-unboxed-title">{currentCert.title}</h3>
                    <p className="cert-unboxed-desc">{currentCert.description}</p>

                    {currentCert.skills && currentCert.skills.length > 0 && (
                      <div className="cert-unboxed-skills-section">
                        <span className="cert-unboxed-skills-title">Key Competencies</span>
                        <div className="cert-skills-wrap">
                          {currentCert.skills.map((s) => (
                            <span key={s} className="tech-pill">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {currentCert.credentialUrl && currentCert.credentialUrl !== '#' && (
                      <div className="cert-unboxed-actions">
                        <a
                          href={currentCert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary cert-action-btn"
                        >
                          <ExternalLink size={15} />
                          <span>Verify Credential</span>
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Controls: Desktop arrows, dots, mobile swipe */}
              <div className="exp-swiper-bottom-bar cert-deck-bottom-bar">
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
                  {visibleCerts.map((cert, idx) => (
                    <button
                      key={cert.id}
                      type="button"
                      className={`exp-dot ${idx === safeIndex ? 'active' : ''}`}
                      onClick={() => setActiveCertIndex(idx)}
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
                <span>← Swipe cards left &amp; right to switch →</span>
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
          );
        })()}
      </div>

      {/* Certificate Inspector Modal */}
      {selectedCert && (
        <div
          className="cert-modal-backdrop"
          onClick={() => setSelectedCert(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cert-modal-title"
        >
          <div className="cert-modal-dialog glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="cert-modal-header">
              <div className="cert-modal-header-info">
                <div className="cert-modal-meta-row">
                  <span className="cert-modal-issuer">
                    <Award size={13} />
                    {selectedCert.organization}
                  </span>
                  <span className="cert-modal-dot" aria-hidden="true">·</span>
                  <span className="cert-modal-date">
                    <Calendar size={13} />
                    {selectedCert.date}
                  </span>
                </div>
                <h3 id="cert-modal-title" className="cert-modal-title">{selectedCert.title}</h3>
              </div>
              <button
                type="button"
                className="cert-close-btn"
                onClick={() => setSelectedCert(null)}
                aria-label="Close certificate preview"
              >
                <X size={18} />
              </button>
            </div>
            <div className="cert-modal-img-wrap">
              <img
                src={selectedCert.image}
                alt={selectedCert.title}
                loading="eager"
              />
            </div>
            <div className="cert-modal-footer">
              <div className="cert-modal-footer-body">
                <p className="cert-modal-desc">{selectedCert.description}</p>
                {selectedCert.skills?.length > 0 && (
                  <div className="cert-modal-skills">
                    {selectedCert.skills.map((skill) => (
                      <span key={skill} className="cert-modal-skill-pill">{skill}</span>
                    ))}
                  </div>
                )}
              </div>
              {selectedCert.credentialUrl && selectedCert.credentialUrl !== '#' && (
                <a
                  href={selectedCert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary cert-action-btn"
                >
                  <ExternalLink size={15} />
                  <span>Verify Credential</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
