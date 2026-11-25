import React, { useState, useRef, useEffect } from 'react';
import {
  Activity,
  BookOpen,
  Braces,
  Bug,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CircuitBoard,
  ClipboardCheck,
  Cpu,
  ExternalLink,
  FlaskConical,
  Gauge,
  GitBranch,
  Globe,
  HardHat,
  Home,
  Lightbulb,
  Network,
  Radio,
  Router,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Workflow,
} from 'lucide-react';
import { certificates } from '../../data/certificates';
import { Tech3DIcon } from '../shared/Tech3DIcon';
import './Certificates.css';

const renderSkillEmblem = (skill) => {
  const s = skill.toLowerCase();
  if (s.includes('python')) return <Tech3DIcon iconKey="python" size={38} />;
  if (s.includes('javascript') || s === 'core js') return <Tech3DIcon iconKey="javascript" size={38} />;

  let IconComp = Cpu;
  if (s.includes('algorithm')) IconComp = Workflow;
  else if (s.includes('exception')) IconComp = ShieldAlert;
  else if (s.includes('library')) IconComp = BookOpen;
  else if (s.includes('debug')) IconComp = Bug;
  else if (s.includes('packet tracer') || s.includes('simulation') || s.includes('topology')) IconComp = Network;
  else if (s.includes('smart home')) IconComp = Home;
  else if (s.includes('network') || s.includes('lan')) IconComp = Router;
  else if (s.includes('control flow')) IconComp = GitBranch;
  else if (s.includes('function')) IconComp = Braces;
  else if (s.includes('analysis') || s.includes('inspection')) IconComp = Activity;
  else if (s.includes('diagnostic')) IconComp = Gauge;
  else if (s.includes('sensor')) IconComp = Radio;
  else if (s.includes('microcontroller')) IconComp = CircuitBoard;
  else if (s.includes('ip address')) IconComp = Globe;
  else if (s.includes('routing')) IconComp = Router;
  else if (s.includes('cli')) IconComp = Terminal;
  else if (s.includes('innovation')) IconComp = Lightbulb;
  else if (s.includes('research')) IconComp = FlaskConical;
  else if (s.includes('risk')) IconComp = ShieldCheck;
  else if (s.includes('safety')) IconComp = HardHat;
  else if (s.includes('sop')) IconComp = ClipboardCheck;

  return (
    <span className="cert-skill-icon-box" aria-hidden="true">
      <IconComp size={17} strokeWidth={1.9} />
    </span>
  );
};

export function Certificates() {
  const [certGroup, setCertGroup] = useState('cisco');
  const [activeCertIndex, setActiveCertIndex] = useState(0);
  const [flipDir, setFlipDir] = useState('next');
  const [outgoingCert, setOutgoingCert] = useState(null);
  const [isFlipping, setIsFlipping] = useState(false);

  const flipTimerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    return () => {
      if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
    };
  }, []);

  const isCiscoCert = (c) => c.organization.toLowerCase().includes('cisco');
  const ciscoCerts = certificates.filter(isCiscoCert);
  const otherCerts = certificates.filter((c) => !isCiscoCert(c));

  const visibleCerts = certGroup === 'cisco' ? ciscoCerts : otherCerts;
  const total = visibleCerts.length;
  const safeIndex = total > 0 ? Math.min(activeCertIndex, total - 1) : 0;
  const currentCert = visibleCerts[safeIndex] || visibleCerts[0];

  // Preload & decode certificate images so switching tabs or flipping never stalls
  useEffect(() => {
    certificates.forEach((cert) => {
      if (!cert?.image) return;
      const img = new window.Image();
      img.src = cert.image;
      if (typeof img.decode === 'function') {
        img.decode().catch(() => {});
      }
    });
  }, []);

  const triggerCertSwitch = (nextIdx, dir) => {
    if (nextIdx === safeIndex || !currentCert) return;
    if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
    setOutgoingCert(currentCert);
    setFlipDir(dir);
    setIsFlipping(true);
    setActiveCertIndex(nextIdx);
    flipTimerRef.current = setTimeout(() => {
      setIsFlipping(false);
      setOutgoingCert(null);
    }, 560);
  };

  const handlePrevCert = () => {
    if (total <= 1) return;
    triggerCertSwitch((safeIndex - 1 + total) % total, 'prev');
  };

  const handleNextCert = () => {
    if (total <= 1) return;
    triggerCertSwitch((safeIndex + 1) % total, 'next');
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
                if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
                setIsFlipping(false);
                setOutgoingCert(null);
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
                if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
                setIsFlipping(false);
                setOutgoingCert(null);
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
              {/* Left: Pure Unboxed Certificate Image with 180° Card Flip */}
              <div
                className="cert-frame-panel"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {isFlipping && outgoingCert ? (
                  <div
                    key={`flip-${outgoingCert.id}-${currentCert.id}`}
                    className={`cert-flip-card is-flipping-${flipDir}`}
                  >
                    <div className="cert-flip-face cert-flip-front" aria-hidden="true">
                      <img
                        src={outgoingCert.image}
                        alt=""
                        className="cert-frame-img"
                        decoding="async"
                      />
                    </div>
                    <div className="cert-flip-face cert-flip-back">
                      <img
                        src={currentCert.image}
                        alt={currentCert.title}
                        className="cert-frame-img"
                        loading="eager"
                        decoding="async"
                      />
                    </div>
                  </div>
                ) : (
                  <img
                    key={currentCert.id}
                    src={currentCert.image}
                    alt={currentCert.title}
                    className="cert-frame-img"
                    loading="eager"
                    decoding="async"
                  />
                )}
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
                  <div className="cert-skill-icons-row" aria-label="Key competencies">
                    {currentCert.skills.map((skill) => (
                      <div
                        key={skill}
                        className="cert-skill-icon-item"
                        tabIndex={0}
                        aria-label={skill}
                      >
                        {renderSkillEmblem(skill)}
                        <span className="cert-skill-tooltip" role="tooltip">
                          {skill}
                        </span>
                      </div>
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

                    {currentCert.credlyBadgeId && currentCert.badgeImage && (
                      <a
                        href={`https://www.credly.com/badges/${currentCert.credlyBadgeId}/public_url`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cert-inline-credly-badge"
                        title={`View ${currentCert.title} on Credly`}
                        aria-label={`View ${currentCert.title} verified badge on Credly`}
                      >
                        <img
                          src={currentCert.badgeImage}
                          alt={`${currentCert.title} Verified Badge`}
                          width="48"
                          height="48"
                          loading="lazy"
                        />
                      </a>
                    )}
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
                      onClick={() => {
                        if (idx === safeIndex) return;
                        triggerCertSwitch(idx, idx > safeIndex ? 'next' : 'prev');
                      }}
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
