import React, { useState } from 'react';
import {
  ArrowUpRight,
  Check,
  Clock,
  Layout,
  PenTool,
  Rocket,
  Server,
  Terminal,
} from 'lucide-react';
import { services } from '../../data/services';
import { Tech3DIcon } from '../shared/Tech3DIcon';
import './Services.css';

const SERVICE_ICONS = {
  Layout,
  PenTool,
  Rocket,
  Server,
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
            Focused web engineering for startups, founders, and product teams.
          </p>
        </header>

        {/* Top Horizontal Service Tabs */}
        <div className="services-tabs-wrap">
          <div className="services-tabs-bar" role="tablist" aria-label="Select a service">
            {services.map((service) => {
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
                  className={`service-tab-pill ${isActive ? 'is-active' : ''}`}
                  onClick={() => setActiveId(service.id)}
                >
                  <IconComponent size={15} strokeWidth={2} aria-hidden="true" />
                  <span>{service.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Unboxed 2-Column Split Spotlight */}
        {activeService && (
          <article
            key={activeService.id}
            id={`service-panel-${activeService.id}`}
            role="tabpanel"
            aria-labelledby={`service-tab-${activeService.id}`}
            className="service-spotlight-grid"
          >
            {/* Left: Description & Deliverables */}
            <div className="service-spotlight-main">
              <div className="service-eyebrow-row">
                <span className="service-eyebrow-code">
                  {activeService.code} · {activeService.badge}
                </span>
                <span className="service-turnaround-chip">
                  <Clock size={12} aria-hidden="true" />
                  <span>{activeService.turnaround}</span>
                </span>
              </div>

              <h3 className="service-spotlight-title">{activeService.title}</h3>
              <p className="service-spotlight-desc">{activeService.description}</p>

              <ul className="service-deliverables" aria-label="Key deliverables">
                {activeService.deliverables.map((item) => (
                  <li key={item} className="service-deliverable-row">
                    <span className="service-check-badge" aria-hidden="true">
                      <Check size={12} strokeWidth={2.5} />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Pure Tech3DIcon Stack + Inquire Action */}
            <div className="service-spotlight-side">
              <div className="service-stack-block">
                <span className="service-side-label">Core Stack</span>
                <div className="service-tech-icons" aria-label="Tech stack">
                  {activeService.techStack.map((tech) => (
                    <div
                      key={tech.name}
                      className="service-tech-item"
                      tabIndex={0}
                      aria-label={tech.name}
                    >
                      <Tech3DIcon iconKey={tech.icon} size={42} />
                      <span className="service-tech-tooltip" role="tooltip">
                        {tech.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href="#contact"
                className="service-inquire-btn"
                onClick={(e) => scrollToContact(e, activeService.title)}
                aria-label={`Inquire about ${activeService.title}`}
              >
                <span>Start a Project</span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
