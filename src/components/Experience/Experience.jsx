import React, { useState } from 'react';
import { Briefcase, GraduationCap, Award, MapPin } from 'lucide-react';
import { experience } from '../../data/experience';
import { education } from '../../data/education';
import { Tech3DIcon } from '../shared/Tech3DIcon';
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
            Engineering roles, client work, and academic milestones.
          </p>
        </div>

        {/* Centered Tactile Toggle */}
        <div className="exp-toggle-wrap">
          <div className="exp-group-toggle" role="tablist" aria-label="Career and academic history">
            <button
              type="button"
              role="tab"
              aria-selected={isExperience}
              className={`exp-group-toggle-btn ${isExperience ? 'is-active' : ''}`}
              onClick={() => setActiveTab('experience')}
            >
              <Briefcase size={14} />
              <span>Work Experience</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={!isExperience}
              className={`exp-group-toggle-btn ${!isExperience ? 'is-active' : ''}`}
              onClick={() => setActiveTab('education')}
            >
              <GraduationCap size={14} />
              <span>Education</span>
            </button>
          </div>
        </div>

        {/* Unboxed Architectural Vertical Timeline Spine */}
        {isExperience ? (
          <div className="exp-timeline" role="tabpanel" key="timeline-experience">
            {experience.map((item, idx) => {
              const isCurrent = item.duration.toLowerCase().includes('present');
              const isLast = idx === experience.length - 1;

              return (
                <article
                  key={item.id}
                  className={`exp-timeline-item ${isLast ? 'is-last' : ''}`}
                >
                  {/* Desktop Left Meta Column */}
                  <div className="exp-timeline-meta">
                    <span className="exp-timeline-period">{item.duration}</span>
                    {item.location && (
                      <span className="exp-timeline-submeta">
                        <MapPin size={11} />
                        <span>{item.location}</span>
                      </span>
                    )}
                  </div>

                  {/* Center Spine + Glowing Hardware Node */}
                  <div className="exp-timeline-axis" aria-hidden="true">
                    <span className={`exp-timeline-node ${isCurrent ? 'is-current' : ''}`}>
                      <span className="exp-timeline-node-core" />
                    </span>
                    <span className="exp-timeline-line" />
                  </div>

                  {/* Right Unboxed Content (Minimal Copy + Pure Tech Icons) */}
                  <div className="exp-timeline-content">
                    <div className="exp-timeline-mobile-meta">
                      <span className="exp-timeline-period">{item.duration}</span>
                      {item.location && (
                        <span className="exp-timeline-submeta">
                          <MapPin size={11} />
                          <span>{item.location}</span>
                        </span>
                      )}
                    </div>

                    <span className="exp-node-org">{item.company}</span>
                    <h3 className="exp-node-title">{item.position}</h3>
                    <p className="exp-node-desc">{item.description}</p>

                    {item.tech?.length > 0 && (
                      <div className="exp-tech-icons-row" aria-label="Technologies used">
                        {item.tech.map((t) => (
                          <div key={t.name} className="exp-tech-icon-item">
                            <Tech3DIcon iconKey={t.icon} size={38} />
                            <span className="exp-tech-tooltip" role="tooltip">
                              {t.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="exp-timeline" role="tabpanel" key="timeline-education">
            {education.map((edu, idx) => {
              const isCurrent = edu.year.toLowerCase().includes('present');
              const isLast = idx === education.length - 1;

              return (
                <article
                  key={edu.id}
                  className={`exp-timeline-item ${isLast ? 'is-last' : ''}`}
                >
                  {/* Desktop Left Meta Column */}
                  <div className="exp-timeline-meta">
                    <span className="exp-timeline-period">{edu.year}</span>
                    {edu.location && (
                      <span className="exp-timeline-submeta">
                        <MapPin size={11} />
                        <span>{edu.location}</span>
                      </span>
                    )}
                  </div>

                  {/* Center Spine + Glowing Hardware Node */}
                  <div className="exp-timeline-axis" aria-hidden="true">
                    <span className={`exp-timeline-node ${isCurrent ? 'is-current' : ''}`}>
                      <span className="exp-timeline-node-core" />
                    </span>
                    <span className="exp-timeline-line" />
                  </div>

                  {/* Right Unboxed Content */}
                  <div className="exp-timeline-content">
                    <div className="exp-timeline-mobile-meta">
                      <span className="exp-timeline-period">{edu.year}</span>
                      {edu.location && (
                        <span className="exp-timeline-submeta">
                          <MapPin size={11} />
                          <span>{edu.location}</span>
                        </span>
                      )}
                    </div>

                    <span className="exp-node-org">{edu.school}</span>
                    <h3 className="exp-node-title">{edu.degree}</h3>
                    <p className="exp-node-desc">{edu.description}</p>

                    {edu.awards?.length > 0 && (
                      <div className="exp-node-tags" aria-label="Academic recognitions">
                        {edu.awards.map((award) => (
                          <span key={award} className="tech-pill exp-award-pill">
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
    </section>
  );
}
