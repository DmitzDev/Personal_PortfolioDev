import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock,
  Cpu,
  Layout,
  PenTool,
  Rocket,
  Server,
  Terminal,
} from 'lucide-react';
import { services } from '../../data/services';
import './Services.css';

const SERVICE_ICONS = {
  Layout,
  PenTool,
  Rocket,
  Server,
  Cpu,
};

const servicesStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Web Engineering & UI/UX Services by MitchDev',
  itemListElement: services.map((service, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Service',
      name: service.title,
      description: service.description,
      serviceType: service.badge,
      provider: {
        '@type': 'Person',
        name: 'Mitchelle (MitchDev)',
        url: 'https://mitchdev.vercel.app',
      },
      areaServed: 'Worldwide',
    },
  })),
};

export function Services() {
  const [activeId, setActiveId] = useState(services[0]?.id ?? 1);
  const activeService = services.find((s) => s.id === activeId) || services[0];

  const scrollToContact = (e, serviceTitle) => {
    e.preventDefault();
    const contactEl = document.getElementById('contact');
    if (!contactEl) return;

    const messageInput =
      document.getElementById('message') || document.querySelector('textarea[name="message"]');

    if (messageInput && serviceTitle) {
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        'value'
      )?.set;
      const text = `Hi Mitch, I'm interested in discussing a project regarding: ${serviceTitle}.`;
      if (nativeSetter) {
        nativeSetter.call(messageInput, text);
      } else {
        messageInput.value = text;
      }
      messageInput.dispatchEvent(new Event('input', { bubbles: true }));
    }

    contactEl.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="services"
      className="section services-section"
      aria-labelledby="services-heading"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesStructuredData) }}
      />

      <div className="container">
        <header className="section-header services-header">
          <h2 id="services-heading" className="section-title">
            Services
          </h2>
          <p className="section-subtitle">
            End-to-end web engineering tailored for founders, startups, and product teams.
          </p>
        </header>

        <div className="services-split-layout">
          {/* LEFT: Clean Interactive Service Selector */}
          <div
            className="services-selector-list"
            role="tablist"
            aria-label="Select a service"
          >
            {services.map((service, index) => {
              const isActive = service.id === activeService.id;
              const IconComponent = SERVICE_ICONS[service.icon] || Terminal;

              return (
                <button
                  key={service.id}
                  type="button"
                  role="tab"
                  id={`service-tab-${service.id}`}
                  aria-selected={isActive}
                  aria-controls={`service-panel-${service.id}`}
                  className={`service-selector-item ${isActive ? 'is-active' : ''}`}
                  onClick={() => setActiveId(service.id)}
                >
                  <span className="selector-icon-wrap" aria-hidden="true">
                    <IconComponent size={19} />
                  </span>

                  <span className="selector-text">
                    <span className="selector-index">
                      {String(index + 1).padStart(2, '0')} · {service.badge}
                    </span>
                    <span className="selector-title">{service.title}</span>
                  </span>

                  <ArrowRight
                    size={16}
                    className="selector-arrow"
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>

          {/* RIGHT: Focused Active Service Detail View */}
          {activeService && (
            <article
              key={activeService.id}
              id={`service-panel-${activeService.id}`}
              role="tabpanel"
              aria-labelledby={`service-tab-${activeService.id}`}
              className="service-detail-panel"
            >
              <div className="detail-meta-row">
                <span className="detail-code-badge">
                  {activeService.code} · {activeService.badge}
                </span>
                <span className="detail-turnaround-pill">
                  <Clock size={13} aria-hidden="true" />
                  <span>{activeService.turnaround}</span>
                </span>
              </div>

              <h3 className="detail-title">{activeService.title}</h3>
              <p className="detail-description">{activeService.description}</p>

              <div className="detail-deliverables-block">
                <span className="detail-block-label">Key Deliverables</span>
                <ul className="detail-deliverables-list">
                  {activeService.deliverables.map((item, idx) => (
                    <li key={idx} className="detail-deliverable-item">
                      <span className="detail-check-icon" aria-hidden="true">
                        <Check size={12} />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <footer className="detail-footer">
                <div className="detail-tech-list" aria-label="Tech stack">
                  {activeService.techStack.map((tech) => (
                    <span key={tech} className="detail-tech-pill">
                      {tech}
                    </span>
                  ))}
                </div>

                <a
                  href="#contact"
                  className="detail-inquire-btn"
                  onClick={(e) => scrollToContact(e, activeService.title)}
                  aria-label={`Inquire about ${activeService.title}`}
                >
                  <span>Inquire</span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </footer>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
