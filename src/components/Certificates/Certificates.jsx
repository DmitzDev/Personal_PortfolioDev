import React, { useState } from 'react';
import { ExternalLink, X } from 'lucide-react';
import { certificates } from '../../data/certificates';
import { SectionHeader } from '../shared/SectionHeader';
import { AnimateOnScroll } from '../shared/AnimateOnScroll';
import './Certificates.css';

export function Certificates() {
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  return (
    <section id="certificates" className="section certificates-section">
      <div className="container">
        <SectionHeader title="Certificates" subtitle="Continuous Learning" />

        <div className="certificates-grid">
          {certificates.map((cert, index) => (
            <AnimateOnScroll 
              key={cert.id} 
              animation="fade-up" 
              delay={index * 100}
              className="certificate-card glass-card"
            >
              <div className="cert-image-container">
                {cert.image ? (
                  <img src={cert.image} alt={cert.title} className="cert-image" width="400" height="280" loading="lazy" />
                ) : (
                  <div className="cert-image-placeholder">
                    <span className="text-gradient">Certificate</span>
                  </div>
                )}
                
                <div 
                  className="cert-overlay"
                  onClick={() => setSelectedCertificate(cert)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="view-credential">
                    <ExternalLink size={18} className="mr-2" /> View Details
                  </span>
                </div>
              </div>
              
              <div className="cert-content">
                <h3 className="cert-title">{cert.title}</h3>
                <div className="cert-meta">
                  <span className="cert-org">{cert.organization}</span>
                  <span className="cert-date">{cert.date}</span>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>

      {/* Certificate Modal */}
      {selectedCertificate && (
        <div className="modal-overlay" onClick={() => setSelectedCertificate(null)}>
          {selectedCertificate.id === 3 ? (
            /* Custom Layout for DOST Certificate */
            <div 
              className="modal-content glass-card" 
              onClick={e => e.stopPropagation()}
              style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}
            >
              <button className="modal-close" onClick={() => setSelectedCertificate(null)}>
                <X size={24} />
              </button>
              
              <div className="modal-hero" style={{ height: 'auto', flex: 1, overflowY: 'auto', background: 'transparent' }}>
                {selectedCertificate.image ? (
                  <img 
                    src={selectedCertificate.image} 
                    alt={selectedCertificate.title} 
                    width="800"
                    height="560"
                    loading="lazy"
                    style={{ width: '100%', height: 'auto', display: 'block' }} 
                  />
                ) : (
                  <div className="modal-hero-placeholder">
                    <span>{selectedCertificate.title.charAt(0)}</span>
                  </div>
                )}
              </div>
              
              <div className="modal-body" style={{ gridTemplateColumns: '1fr', paddingTop: '1.5rem', flexShrink: 0, borderTop: '1px solid var(--border)', background: 'var(--bg-primary)' }}>
                <div className="modal-info-main">
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    {selectedCertificate.title}
                  </h2>
                  <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    <span>{selectedCertificate.date}</span>
                    <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{selectedCertificate.organization}</span>
                  </div>
                  <h3>Credential Details</h3>
                  <p style={{ margin: 0 }}>This credential verifies the successful completion of the <strong>{selectedCertificate.title}</strong> certification program provided by <strong>{selectedCertificate.organization}</strong> in the year {selectedCertificate.date}.</p>
                </div>
              </div>
            </div>
          ) : (
            /* Standard Layout for other Certificates */
            <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedCertificate(null)}>
                <X size={24} />
              </button>
              
              <div className="modal-hero">
                {selectedCertificate.image ? (
                  <img src={selectedCertificate.image} alt={selectedCertificate.title} className="modal-hero-image" width="800" height="560" loading="lazy" />
                ) : (
                  <div className="modal-hero-placeholder">
                    <span>{selectedCertificate.title.charAt(0)}</span>
                  </div>
                )}
                <div className="modal-hero-overlay">
                  <h2 className="modal-title">{selectedCertificate.title}</h2>
                  <div className="project-meta">
                    <span className="project-date">{selectedCertificate.date}</span>
                    <span className="project-status status-completed">
                      {selectedCertificate.organization}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="modal-body" style={{ gridTemplateColumns: '1fr' }}>
                <div className="modal-info-main">
                  <h3>Credential Details</h3>
                  <p>This credential verifies the successful completion of the <strong>{selectedCertificate.title}</strong> certification program provided by <strong>{selectedCertificate.organization}</strong> in the year {selectedCertificate.date}.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
