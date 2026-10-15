import React from 'react';
import { Layout, PenTool, Rocket, Server, ArrowRight } from 'lucide-react';
import { services, clientProcess } from '../../data/services';
import { AnimateOnScroll } from '../shared/AnimateOnScroll';
import './Services.css';

const iconMap = {
  Layout: Layout,
  PenTool: PenTool,
  Rocket: Rocket,
  Server: Server,
};

export function Services() {
  return (
    <section id="services" className="section services-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">What I Build For Clients & Teams</h2>
          <p className="section-subtitle">
            Reliable engineering services tailored for founders, businesses, and development teams seeking speed, quality, and measurable ROI.
          </p>
        </div>

        {/* Services Grid */}
        <div className="services-grid">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon] || Layout;

            return (
              <AnimateOnScroll
                key={service.id}
                animation="fade-up"
                delay={index * 80}
                className="service-card glass-card"
              >
                <div className="service-card-top">
                  <div className="service-icon-box">
                    <IconComponent size={24} className="service-icon" />
                  </div>
                  {service.badge && (
                    <span className="service-badge-pill">{service.badge}</span>
                  )}
                </div>

                <h3 className="service-heading">{service.title}</h3>
                <p className="service-tagline-text">{service.tagline}</p>
                <p className="service-summary">{service.description}</p>
              </AnimateOnScroll>
            );
          })}
        </div>

        {/* 4-Step Client Delivery Process */}
        <div className="process-wrapper glass-card">
          <div className="process-header">
            <span className="process-label">STRUCTURED WORKFLOW</span>
            <h3 className="process-title">From Concept to Production in 4 Sprints</h3>
            <p className="process-desc">
              No black-box development. Transparent communication, sprint demos, and predictable milestones.
            </p>
          </div>

          <div className="process-steps-grid">
            {clientProcess.map((step) => (
              <div key={step.step} className="process-step-item">
                <div className="step-number-tag">{step.step}</div>
                <h4 className="step-title">{step.title}</h4>
                <p className="step-description">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="process-cta-banner">
            <div className="cta-banner-text">
              <h4>Have an upcoming project or need a quote?</h4>
              <p>Let's evaluate your requirements and scope out a delivery timeline.</p>
            </div>
            <a href="#contact" className="btn-primary">
              <span>Start a Project</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
