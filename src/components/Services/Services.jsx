import React, { useState } from 'react';
import {
  Layout,
  PenTool,
  Rocket,
  Server,
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Cpu,
  Terminal,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { services, clientProcess } from '../../data/services';
import './Services.css';

const iconMap = {
  Layout,
  PenTool,
  Rocket,
  Server,
  Clock,
  ShieldCheck,
  Cpu,
};

export function Services() {
  const [activeServiceId, setActiveServiceId] = useState(1);
  const activeService = services.find((s) => s.id === activeServiceId) || services[0];
  const ActiveIcon = iconMap[activeService.icon] || Layout;

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
        {/* Section Header */}
        <div className="section-header services-section-header">
          <div className="section-kicker">
            <span className="kicker-badge">SERVICES &amp; CAPABILITIES</span>
          </div>
          <h2 className="section-title">What I Build For Clients &amp; Teams</h2>
          <p className="section-subtitle">
            End-to-end engineering tailored for founders and product teams seeking speed, clean component architecture, and measurable ROI.
          </p>

          {/* Integrated Hardware Standards Rail (Replaces standalone repetitive cards) */}
          <div className="services-standards-ribbon">
            <div className="standard-item">
              <span className="standard-pulse-dot" />
              <span className="standard-label">2–3 Week Typical Sprints</span>
            </div>
            <span className="standard-sep">•</span>
            <div className="standard-item">
              <span className="standard-pulse-dot" />
              <span className="standard-label">100% Code &amp; IP Ownership</span>
            </div>
            <span className="standard-sep">•</span>
            <div className="standard-item">
              <span className="standard-pulse-dot" />
              <span className="standard-label">Zero Framework Bloat (95+ Lighthouse)</span>
            </div>
          </div>
        </div>

        {/* Interactive Service Console (Split-View Studio) */}
        <div className="services-console-layout">
          {/* Mobile Tab Selector (Smooth Horizontal Pills) */}
          <div className="services-mobile-pill-bar" role="tablist" aria-label="Services selector">
            {services.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={activeServiceId === item.id}
                className={`services-mobile-pill ${activeServiceId === item.id ? 'is-active' : ''}`}
                onClick={() => setActiveServiceId(item.id)}
              >
                <span className="mobile-pill-code">{item.code}</span>
                <span className="mobile-pill-title">{item.title}</span>
              </button>
            ))}
          </div>

          {/* Desktop Left Rail: Service Selector Directory */}
          <div className="services-console-nav" role="tablist" aria-label="Services directory">
            <div className="console-nav-header">
              <span className="nav-header-label">SERVICE CATALOG</span>
              <span className="nav-header-count">{services.length} AVAILABLE</span>
            </div>

            <div className="console-nav-list">
              {services.map((item) => {
                const ItemIcon = iconMap[item.icon] || Layout;
                const isActive = activeServiceId === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`console-nav-item ${isActive ? 'is-active' : ''}`}
                    onClick={() => setActiveServiceId(item.id)}
                  >
                    <div className="nav-item-left">
                      <div className="nav-item-icon-box">
                        <ItemIcon size={18} className="nav-item-icon" />
                      </div>
                      <div className="nav-item-text">
                        <div className="nav-item-meta">
                          <span className="nav-item-code">{item.code}</span>
                          <span className="nav-item-badge">{item.badge}</span>
                        </div>
                        <span className="nav-item-title">{item.title}</span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="nav-item-arrow" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Stage: Interactive Service Blueprint & Spec Sheet */}
          <div className="services-console-stage">
            <div className="service-stage-card" key={activeService.id}>
              {/* Top Meta Bar */}
              <div className="stage-top-bar">
                <div className="stage-top-left">
                  <div className="stage-icon-wrap">
                    <ActiveIcon size={22} className="stage-icon" />
                  </div>
                  <div>
                    <span className="stage-code-pill">{activeService.code}</span>
                    <span className="stage-category-label">{activeService.badge}</span>
                  </div>
                </div>

                <div className="stage-top-right">
                  <div className="stage-turnaround-chip" title="Estimated turnaround">
                    <Clock size={13} />
                    <span>{activeService.turnaround}</span>
                  </div>
                  <span className="stage-status-dot-pill">
                    <span className="status-live-dot" /> Available
                  </span>
                </div>
              </div>

              {/* Service Headline & Bio */}
              <div className="stage-intro">
                <h3 className="stage-title">{activeService.title}</h3>
                <p className="stage-tagline">{activeService.tagline}</p>
                <p className="stage-description">{activeService.description}</p>
              </div>

              {/* Two-Column Technical Breakdown */}
              <div className="stage-specs-grid">
                {/* Column 1: Core Deliverables */}
                <div className="specs-block deliverables-block">
                  <span className="specs-block-label">
                    <CheckCircle2 size={13} className="label-icon" />
                    KEY DELIVERABLES INCLUDED
                  </span>
                  <ul className="stage-deliverables-list">
                    {activeService.deliverables.map((item, idx) => (
                      <li key={idx} className="stage-deliverable-item">
                        <span className="deliverable-bullet">✦</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 2: Tech Stack & Architecture */}
                <div className="specs-block tech-specs-block">
                  <span className="specs-block-label">
                    <Cpu size={13} className="label-icon" />
                    TECH STACK &amp; ENVIRONMENT
                  </span>
                  <div className="stage-tech-chips">
                    {activeService.techStack.map((tech) => (
                      <span key={tech} className="stage-tech-chip">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="stage-guarantee-note">
                    <Sparkles size={14} className="guarantee-icon" />
                    <p>
                      Built with scalable component hierarchy, full responsive testing, and clean source code handover.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="stage-action-footer">
                <div className="stage-action-meta">
                  <span className="action-meta-title">Direct Engineer Collaboration</span>
                  <span className="action-meta-sub">Zero middlemen • Weekly live staging previews</span>
                </div>

                <a
                  href="#contact"
                  className="btn-primary stage-cta-btn"
                  onClick={(e) => scrollToContact(e, activeService.title)}
                >
                  <span>Inquire About This Service</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Step Sprint Delivery Pipeline (Connected Timeline, Not Clunky Nested Boxes!) */}
        <div className="sprint-pipeline-section">
          <div className="pipeline-header">
            <span className="pipeline-kicker">STRUCTURED WORKFLOW</span>
            <h3 className="pipeline-title">From Architecture Spec to Production in 4 Sprints</h3>
            <p className="pipeline-desc">
              No black-box development. Transparent communication, sprint demos, and predictable milestones.
            </p>
          </div>

          <div className="pipeline-track-container">
            <div className="pipeline-connecting-line" aria-hidden="true" />
            <div className="pipeline-steps-grid">
              {clientProcess.map((step) => (
                <div key={step.step} className="pipeline-step-node">
                  <div className="node-marker-wrap">
                    <div className="node-number-circle">{step.step}</div>
                  </div>
                  <span className="node-phase-tag">{step.phase}</span>
                  <h4 className="node-title">{step.title}</h4>
                  <p className="node-desc">{step.description}</p>
                  <div className="node-output-chip">
                    <Terminal size={12} className="output-icon" />
                    <span>{step.output}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Project Inquiry Banner */}
          <div className="pipeline-cta-bar">
            <div className="pipeline-cta-text">
              <h4>Ready to build or modernize your application?</h4>
              <p>Let's evaluate your product requirements and outline a delivery timeline.</p>
            </div>
            <a
              href="#contact"
              className="btn-primary pipeline-cta-btn"
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
