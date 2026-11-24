import React, { useState, useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { certificates } from '../../data/certificates';
import './Certificates.css';

export function Certificates() {
  const [certGroup, setCertGroup] = useState('cisco');
  const [activeCertIndex, setActiveCertIndex] = useState(0);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const isCiscoCert = (c) => c.organization.toLowerCase().includes('cisco');
  const ciscoCerts = certificates.filter(isCiscoCert);
  const otherCerts = certificates.filter((c) => !isCiscoCert(c));

  const visibleCerts = certGroup === 'cisco' ? ciscoCerts : otherCerts;
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

        {/* Centered 2-Tab Category Switch */}
        <div className="cert-switch-wrap">
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
              <span>Cisco Academy</span>
              <span className="cert-toggle-count">{String(ciscoCerts.length).padStart(2, '0')}</span>
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
              <span>Industry &amp; Seminars</span>
              <span className="cert-toggle-count">{String(otherCerts.length).padStart(2, '0')}</span>
            </button>
          </div>
        </div>

        {/* Clean Unboxed Editorial Showcase */}
        {currentCert && (
          <>
            <div className="cert-gallery-stage">
              {/* Left: Pure Unboxed Certificate Image */}
              <div
                className="cert-frame-panel"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <img
                  key={currentCert.id}
                  src={currentCert.image}
                  alt={currentCert.title}
                  className="cert-frame-img"
                  loading="eager"
                  decoding="async"
                />
              </div>

              {/* Right: Clean Unboxed Editorial Details */}
              <div className="cert-editorial-panel" key={`detail-${currentCert.id}`}>
                <div className="cert-editorial-eyebrow">
                  <span className="cert-editorial-org">{currentCert.organization}</span>
                  <span className="cert-editorial-date">
                    <Calendar size={13} />
                    <span>{currentCert.date}</span>
                  </span>
                </div>

                <h3 className="cert-editorial-title">{currentCert.title}</h3>
                <p className="cert-editorial-desc">{currentCert.description}</p>

                {currentCert.skills?.length > 0 && (
                  <div className="cert-editorial-skills" aria-label="Key competencies">
                    {currentCert.skills.map((skill) => (
                      <span key={skill} className="tech-pill">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {currentCert.credentialUrl && currentCert.credentialUrl !== '#' && (
                  <div className="cert-editorial-actions">
                    <a
                      href={currentCert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary cert-verify-btn"
                    >
                      <ExternalLink size={15} />
                      <span>Verify Credential</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Centered Bottom Navigation Bar */}
            {total > 1 && (
              <div className="cert-nav-bar">
                <button
                  type="button"
                  className="cert-stepper-btn"
                  onClick={handlePrevCert}
                  aria-label="Previous certificate"
                  title="Previous certificate"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="cert-dots">
                  {visibleCerts.map((cert, idx) => (
                    <button
                      key={cert.id}
                      type="button"
                      className={`cert-dot ${idx === safeIndex ? 'is-active' : ''}`}
                      onClick={() => setActiveCertIndex(idx)}
                      aria-label={`Go to certificate ${idx + 1}: ${cert.title}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  className="cert-stepper-btn"
                  onClick={handleNextCert}
                  aria-label="Next certificate"
                  title="Next certificate"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
