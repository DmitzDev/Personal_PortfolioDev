import React from 'react';
import {
  Layout,
  PenTool,
  Rocket,
  Server,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Cpu,
  Terminal,
} from 'lucide-react';
import { services, clientProcess, clientAssurances } from '../../data/services';
import { AnimateOnScroll } from '../shared/AnimateOnScroll';
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
  const scrollToContact = (e, serviceTitle) => {
    e.preventDefault();
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      const messageInput = document.getElementById('message') || document.querySelector('textarea[name="message"]');
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
            Reliable engineering services tailored for founders, businesses, and development teams seeking speed, clean component architecture, and measurable ROI.
          </p>
        </div>

        {/* Client Engineering Assurances / Trust Pillars */}
        <div className="services-assurances-grid">
          {clientAssurances.map((item, idx) => {
            const AssuranceIcon = iconMap[item.icon] || ShieldCheck;
            return (
              <AnimateOnScroll
                key={item.title}
                animation="fade-up"
                delay={idx * 60}
                className="assurance-card"
              >
                <div className="assurance-icon-wrap">
                  <AssuranceIcon size={18} className="assurance-icon" />
                </div>
                <div className="assurance-content">
                  <h4 className="assurance-title">{item.title}</h4>
                  <p className="assurance-desc">{item.description}</p>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>

        {/* Services Grid */}
        <div className="services-grid">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon] || Layout;

            return (
              <AnimateOnScroll
                key={service.id}
                animation="fade-up"
                delay={index * 90}
                className="service-card"
              >
                {/* Header Bar */}
                <div className="service-card-top">
                  <div className="service-card-top-left">
                    <div className="service-icon-box" aria-hidden="true">
                      <IconComponent size={22} className="service-icon" />
                    </div>
                    <span className="service-code-tag">{service.code}</span>
                  </div>

                  <div className="service-card-top-right">
                    <span className="service-badge-pill">{service.badge}</span>
                  </div>
                </div>

                {/* Main Content */}
                <div className="service-card-body">
                  <h3 className="service-heading">{service.title}</h3>
                  <p className="service-tagline-text">{service.tagline}</p>
                  <p className="service-summary">{service.description}</p>
                </div>

                {/* Concrete Deliverables Section */}
                <div className="service-deliverables-block">
                  <span className="deliverables-heading">CORE DELIVERABLES:</span>
                  <ul className="deliverables-list">
                    {service.deliverables.map((item, dIdx) => (
                      <li key={dIdx} className="deliverable-item">
                        <CheckCircle2 size={14} className="deliverable-check-icon" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Stack Chips */}
                <div className="service-tech-cluster">
                  {service.techStack?.map((tech) => (
                    <span key={tech} className="service-tech-chip">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Card Action Footer */}
                <div className="service-card-footer">
                  <div className="service-turnaround-badge" title="Estimated turnaround">
                    <Clock size={13} className="turnaround-icon" />
                    <span>{service.turnaround}</span>
                  </div>

                  <a
                    href="#contact"
                    className="service-inquire-btn"
                    onClick={(e) => scrollToContact(e, service.title)}
                  >
                    <span>Inquire Scope</span>
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>

        {/* 4-Step Client Delivery Process */}
        <div className="process-wrapper">
          <div className="process-header">
            <span className="process-label">STRUCTURED SPRINT WORKFLOW</span>
            <h3 className="process-title">From Concept to Production in 4 Sprints</h3>
            <p className="process-desc">
              No black-box development. Transparent communication, weekly live preview builds, and predictable milestones.
            </p>
          </div>

          <div className="process-steps-grid">
            {clientProcess.map((step) => (
              <div key={step.step} className="process-step-item">
                <div className="step-top-row">
                  <span className="step-number-tag">{step.step}</span>
                  <span className="step-phase-badge">{step.phase}</span>
                </div>
                <h4 className="step-title">{step.title}</h4>
                <p className="step-description">{step.description}</p>
                <div className="step-output-tag">
                  <Terminal size={12} className="step-output-icon" />
                  <span>{step.output}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="process-cta-banner">
            <div className="cta-banner-text">
              <h4>Ready to build or modernize your application?</h4>
              <p>Let's evaluate your product requirements and outline a delivery timeline.</p>
            </div>
            <a
              href="#contact"
              className="btn-primary"
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
