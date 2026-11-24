import React, { useState, useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight, ExternalLink, ShieldCheck } from 'lucide-react';
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
  const progressPercent = total > 0 ? ((safeIndex + 1) / total) * 100 : 0;

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

        {/* Clean Editorial Gallery Showcase */}
        {currentCert && (
          <div className="cert-gallery-stage">
            {/* Left: Crisp Uncropped Certificate Frame */}
            <div
              className="cert-frame-panel"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="cert-frame-mat">
                <img
                  key={currentCert.id}
                  src={currentCert.image}
                  alt={currentCert.title}
                  className="cert-frame-img"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>

            {/* Right: Clean Unboxed Editorial Details & Minimal Stepper */}
            <div className="cert-editorial-panel" key={`detail-${currentCert.id}`}>
              <div className="cert-editorial-eyebrow">
                <span className="cert-editorial-org">{currentCert.organization}</span>
                {currentCert.hasBadge && (
                  <span className="cert-verified-chip">
                    <ShieldCheck size={13} />
                    <span>Verified Badge</span>
                  </span>
                )}
              </div>

              <h3 className="cert-editorial-title">{currentCert.title}</h3>

              <div className="cert-editorial-date">
                <Calendar size={13} />
                <span>{currentCert.date}</span>
              </div>

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

              <div className="cert-editorial-footer">
                {currentCert.credentialUrl && currentCert.credentialUrl !== '#' && (
                  <a
                    href={currentCert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary cert-verify-btn"
                  >
                    <ExternalLink size={15} />
                    <span>Verify Credential</span>
                  </a>
                )}

                {total > 1 && (
                  <div className="cert-stepper">
                    <button
                      type="button"
                      className="cert-stepper-btn"
                      onClick={handlePrevCert}
                      aria-label="Previous certificate"
                      title="Previous certificate"
                    >
                      <ChevronLeft size={17} />
                    </button>

                    <div className="cert-stepper-progress">
                      <span className="cert-stepper-count">
                        {String(safeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                      </span>
                      <div className="cert-progress-track" aria-hidden="true">
                        <div
                          className="cert-progress-fill"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      className="cert-stepper-btn"
                      onClick={handleNextCert}
                      aria-label="Next certificate"
                      title="Next certificate"
                    >
                      <ChevronRight size={17} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
