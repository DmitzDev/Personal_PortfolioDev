import React, { useState } from 'react';
import { Briefcase, GraduationCap, Award, MapPin } from 'lucide-react';
import { experience } from '../../data/experience';
import { education } from '../../data/education';
import './Experience.css';

export function Experience() {
  const [activeTab, setActiveTab] = useState('experience');

  const isExperience = activeTab === 'experience';

  return (
    <section id="experience" className="section experience-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Experience &amp; Education</h2>
          <p className="section-subtitle">
            Selected engineering roles, client engagements, and academic background in computer engineering.
          </p>
        </div>

        {/* Centered Segmented Switch */}
        <div className="exp-controls-wrap">
          <div className="exp-segmented-bar" role="tablist" aria-label="Career and academic history">
            <button
              type="button"
              role="tab"
              aria-selected={isExperience}
              className={`exp-segment-btn ${isExperience ? 'is-active' : ''}`}
              onClick={() => setActiveTab('experience')}
            >
              <Briefcase size={15} />
              <span>Work Experience</span>
              <span className="exp-segment-count">{String(experience.length).padStart(2, '0')}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={!isExperience}
              className={`exp-segment-btn ${!isExperience ? 'is-active' : ''}`}
              onClick={() => setActiveTab('education')}
            >
              <GraduationCap size={15} />
              <span>Education</span>
              <span className="exp-segment-count">{String(education.length).padStart(2, '0')}</span>
            </button>
          </div>
        </div>

        {/* Architectural Chronological Ledger */}
        <div className="exp-ledger" role="tabpanel">
          <div className="exp-ledger-header" aria-hidden="true">
            <span>{isExperience ? 'Period & Location' : 'Years & Standing'}</span>
            <span>{isExperience ? 'Role, Scope & Stack' : 'Degree, Institution & Distinctions'}</span>
          </div>

          {isExperience ? (
            <div className="exp-ledger-list" key="experience-list">
              {experience.map((item) => {
                const isCurrent = item.duration.toLowerCase().includes('present');
                return (
                  <article key={item.id} className="exp-ledger-row">
                    <div className="exp-row-rail">
                      <div className="exp-row-period">
                        <span
                          className={`exp-status-dot ${isCurrent ? 'is-current' : ''}`}
                          aria-hidden="true"
                        />
                        <span>{item.duration}</span>
                      </div>
                      {item.location && (
                        <div className="exp-row-submeta">
                          <MapPin size={12} />
                          <span>{item.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="exp-row-main">
                      <div className="exp-row-heading">
                        <h3 className="exp-row-title">{item.position}</h3>
                        {item.type && <span className="exp-row-badge">{item.type}</span>}
                      </div>

                      <p className="exp-row-org">{item.company}</p>
                      <p className="exp-row-desc">{item.description}</p>

                      {item.tech?.length > 0 && (
                        <div className="exp-row-tags" aria-label="Technologies used">
                          {item.tech.map((tech) => (
                            <span key={tech} className="exp-tag">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="exp-ledger-list" key="education-list">
              {education.map((edu) => {
                const isCurrent = edu.year.toLowerCase().includes('present');
                return (
                  <article key={edu.id} className="exp-ledger-row">
                    <div className="exp-row-rail">
                      <div className="exp-row-period">
                        <span
                          className={`exp-status-dot ${isCurrent ? 'is-current' : ''}`}
                          aria-hidden="true"
                        />
                        <span>{edu.year}</span>
                      </div>
                      {edu.status && (
                        <div className="exp-row-submeta">
                          <span>{edu.status}</span>
                        </div>
                      )}
                    </div>

                    <div className="exp-row-main">
                      <div className="exp-row-heading">
                        <h3 className="exp-row-title">{edu.degree}</h3>
                      </div>

                      <p className="exp-row-org">{edu.school}</p>
                      <p className="exp-row-desc">{edu.description}</p>

                      {edu.awards?.length > 0 && (
                        <div className="exp-row-tags" aria-label="Academic recognitions">
                          {edu.awards.map((award) => (
                            <span key={award} className="exp-tag is-award">
                              <Award size={12} />
                              <span>{award}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
