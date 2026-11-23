import React, { useState, useRef, useEffect } from 'react';
import { Award, Calendar, ChevronLeft, ChevronRight, Maximize2, ExternalLink, X } from 'lucide-react';
import { certificates } from '../../data/certificates';
import './Certificates.css';

export function Certificates() {
  const [certGroup, setCertGroup] = useState('cisco');
  const [activeCertIndex, setActiveCertIndex] = useState(0);
  const [selectedCert, setSelectedCert] = useState(null);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (!selectedCert) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedCert(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCert]);

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

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) {
      handleNextCert();
    } else if (diff < -45) {
      handlePrevCert();
    }
  };

  return (
    <section id="certificates" className="section certificates-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Certificates</h2>
          <p className="section-subtitle">
            Verified Cisco Networking Academy credentials and industry seminar certifications.
          </p>
        </div>

        <div className="credentials-view">
          <div className="cert-deck-showcase">
            {/* Left Side: Fixed Category Toggle + 3D Cards Deck */}
            <div className="cert-deck-column">
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

              <div
                className="cert-deck-stage"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
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
            </div>

            {/* Right Side: Clean Unboxed Context Details */}
            {currentCert && (
              <div className="cert-details-unboxed">
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
          <div className="cert-bottom-bar">
            <button
              type="button"
              className="cert-arrow-btn cert-arrow-desktop-only"
              onClick={handlePrevCert}
              aria-label="Previous credential"
              title="Previous credential"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="cert-dots">
              {visibleCerts.map((cert, idx) => (
                <button
                  key={cert.id}
                  type="button"
                  className={`cert-dot ${idx === safeIndex ? 'active' : ''}`}
                  onClick={() => setActiveCertIndex(idx)}
                  aria-label={`Go to certificate ${idx + 1}: ${cert.title}`}
                />
              ))}
            </div>

            <button
              type="button"
              className="cert-arrow-btn cert-arrow-desktop-only"
              onClick={handleNextCert}
              aria-label="Next credential"
              title="Next credential"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="cert-swipe-hint">
            <span>← Swipe cards left &amp; right to switch →</span>
          </div>
        </div>
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
          <div className="cert-modal-dialog" onClick={(e) => e.stopPropagation()}>
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
                decoding="async"
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
