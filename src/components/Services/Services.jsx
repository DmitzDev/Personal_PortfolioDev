import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Plus,
  Minus,
  Clock,
  Terminal,
} from 'lucide-react';
import { services, clientProcess } from '../../data/services';
import './Services.css';

export function Services() {
  const [openServiceId, setOpenServiceId] = useState(1);

  const toggleService = (id) => {
    setOpenServiceId((prev) => (prev === id ? null : id));
  };

  const scrollToContact = (e, serviceTitle) => {
    e.preventDefault();
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      const messageInput =
        document.getElementById('message') || document.querySelector('textarea[name="message"]');
      if (messageInput && serviceTitle) {
        messageInput.value = `Hi Mitch, I'm interested in discussing a project regarding: ${serviceTitle}.`;
        messageInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="section services-section">
      <div className="container">
        {/* Section Header - Editorial Monograph Style */}
        <div className="services-editorial-header">
          <h2 className="services-editorial-title">
            What I Build For Clients &amp; Teams
          </h2>

          <p className="services-editorial-desc">
            End-to-end web engineering tailored for founders, startups, and product teams seeking speed, clean component architecture, and measurable ROI.
          </p>

          {/* Minimalist Typographic Metrics (Zero Boxes!) */}
          <div className="services-editorial-ticker">
            <div className="ticker-col">
              <span className="ticker-num">04</span>
              <span className="ticker-label">Core Disciplines</span>
            </div>
            <span className="ticker-divider" aria-hidden="true">/</span>
            <div className="ticker-col">
              <span className="ticker-num">2–3</span>
              <span className="ticker-label">Weeks Per Sprint</span>
            </div>
            <span className="ticker-divider" aria-hidden="true">/</span>
            <div className="ticker-col">
              <span className="ticker-num">100%</span>
              <span className="ticker-label">Code Ownership</span>
            </div>
            <span className="ticker-divider" aria-hidden="true">/</span>
            <div className="ticker-col">
              <span className="ticker-num">95+</span>
              <span className="ticker-label">Lighthouse Speed</span>
            </div>
          </div>
        </div>

        {/* Editorial Divider List (Zero Box/Card Containers!) */}
        <div className="services-editorial-list">
          {services.map((service) => {
            const isOpen = openServiceId === service.id;

            return (
              <div
                key={service.id}
                className={`service-editorial-row ${isOpen ? 'is-open' : ''}`}
              >
                {/* Clickable Header Row */}
                <button
                  type="button"
                  className="service-row-trigger"
                  onClick={() => toggleService(service.id)}
                  aria-expanded={isOpen}
                >
                  <div className="service-row-left">
                    <span className="service-row-index">{service.code}</span>
                    <div className="service-row-titles">
                      <h3 className="service-row-heading">{service.title}</h3>
                      <p className="service-row-tagline">{service.tagline}</p>
                    </div>
                  </div>

                  <div className="service-row-right">
                    <span className="service-row-badge">{service.badge}</span>
                    <span className="service-row-toggle" aria-hidden="true">
                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                    </span>
                  </div>
                </button>

                {/* Inline Editorial Detail Drawer */}
                {isOpen && (
                  <div className="service-row-drawer">
                    <div className="drawer-main-content">
                      <p className="drawer-description">{service.description}</p>

                      <div className="drawer-specs-layout">
                        {/* Deliverables Column */}
                        <div className="drawer-deliverables">
                          <span className="drawer-section-heading">CORE DELIVERABLES</span>
                          <ul className="drawer-list">
                            {service.deliverables.map((item, dIdx) => (
                              <li key={dIdx} className="drawer-item">
                                <span className="drawer-check"><Check size={13} /></span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Tech Stack & Turnaround Column */}
                        <div className="drawer-tech-block">
                          <span className="drawer-section-heading">TECH STACK &amp; ENVIRONMENT</span>
                          <div className="drawer-tech-tags">
                            {service.techStack.map((tech) => (
                              <span key={tech} className="drawer-tech-tag">
                                {tech}
                              </span>
                            ))}
                          </div>

                          <div className="drawer-turnaround-row">
                            <Clock size={14} className="drawer-clock-icon" />
                            <span>Estimated Turnaround: <strong>{service.turnaround}</strong></span>
                          </div>

                          <div className="drawer-action-row">
                            <a
                              href="#contact"
                              className="drawer-contact-link"
                              onClick={(e) => scrollToContact(e, service.title)}
                            >
                              <span>Inquire About This Service</span>
                              <ArrowUpRight size={16} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 4-Step Sprint Workflow: Clean Milestone Flow (No boxes!) */}
        <div className="workflow-editorial-section">
          <div className="workflow-editorial-header">
            <h3 className="workflow-title">From Architecture Spec to Production in 4 Sprints</h3>
            <p className="workflow-desc">
              No black-box development. Transparent communication, weekly live preview builds, and predictable milestones.
            </p>
          </div>

          <div className="workflow-milestone-flow">
            {clientProcess.map((step) => (
              <div key={step.step} className="workflow-milestone-node">
                <div className="milestone-top-bar">
                  <span className="milestone-step-index">{step.step}</span>
                  <span className="milestone-phase-label">{step.phase}</span>
                </div>
                <h4 className="milestone-title">{step.title}</h4>
                <p className="milestone-description">{step.description}</p>
                <div className="milestone-output">
                  <Terminal size={12} className="milestone-terminal-icon" />
                  <span>{step.output}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Clean Bottom Callout (No Box!) */}
          <div className="workflow-cta-row">
            <div className="workflow-cta-text">
              <h4>Ready to build or modernize your application?</h4>
              <p>Let's evaluate your requirements and scope out a delivery timeline.</p>
            </div>
            <a
              href="#contact"
              className="btn-primary workflow-cta-button"
              onClick={(e) => scrollToContact(e, 'General Project Inquiry')}
            >
              <span>Schedule a Project Discovery</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
