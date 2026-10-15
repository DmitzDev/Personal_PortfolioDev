import React, { useState } from 'react';
import { Briefcase, GraduationCap, Award, FileText, Calendar, MapPin } from 'lucide-react';
import { experience } from '../../data/experience';
import { education } from '../../data/education';
import { certificates, achievements } from '../../data/certificates';
import { personalInfo } from '../../data/personalInfo';
import { AnimateOnScroll } from '../shared/AnimateOnScroll';
import './Experience.css';

export function Experience() {
  const [activeTab, setActiveTab] = useState('experience');
  const [selectedCert, setSelectedCert] = useState(null);

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

        {/* TAB 1: WORK EXPERIENCE */}
        {activeTab === 'experience' && (
          <div className="credentials-view">
            <div className="credentials-grid exp-cards-grid">
              {experience.map((item, index) => (
                <AnimateOnScroll
                  key={item.id}
                  animation="fade-up"
                  delay={index * 80}
                  className="cert-card exp-card glass-card"
                >
                  <div className="cert-body exp-card-body">
                    <div className="exp-card-header-meta">
                      <span className="cert-issuer">{item.company}</span>
                      <span className="timeline-type-pill">{item.type}</span>
                    </div>

                    <h3 className="cert-title exp-card-title">{item.position}</h3>

                    <div className="exp-meta-bar">
                      <span className="cert-date exp-date-meta">
                        <Calendar size={13} />
                        {item.duration}
                      </span>
                      {item.location && (
                        <span className="cert-date exp-location-meta">
                          <MapPin size={13} />
                          {item.location}
                        </span>
                      )}
                    </div>

                    <p className="cert-desc exp-card-desc">{item.description}</p>

                    {item.tech && (
                      <div className="cert-skills-wrap exp-tech-wrap">
                        {item.tech.map(tech => (
                          <span key={tech} className="tech-pill">{tech}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </AnimateOnScroll>
              ))}
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
