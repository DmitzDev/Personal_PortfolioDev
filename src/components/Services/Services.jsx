import React, { useState } from 'react';
import {
  ArrowUpRight,
  Check,
  Plus,
  Minus,
  Clock,
  Terminal,
  Layout,
  PenTool,
  Rocket,
  Cpu
} from 'lucide-react';
import { services } from '../../data/services';
import './Services.css';

const SERVICE_ICONS = {
  Layout: Layout,
  PenTool: PenTool,
  Rocket: Rocket,
  Cpu: Cpu,
};

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
        </div>

        {/* Editorial Divider List (Zero Box/Card Containers!) */}
        <div className="services-editorial-list">
          {services.map((service) => {
            const isOpen = openServiceId === service.id;
            const IconComponent = SERVICE_ICONS[service.icon] || Terminal;

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
                    <span className="service-row-icon-glyph" aria-hidden="true">
                      <IconComponent size={20} />
                    </span>
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

        </div>
    </section>
  );
}
