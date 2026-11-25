import React, { useState } from 'react';
import {
  ArrowUpRight,
  Check,
  Clock,
  Layout,
  PenTool,
  Plus,
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
  const [openId, setOpenId] = useState(services[0]?.id ?? 1);

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

        <div className="services-accordion">
          {services.map((service) => {
            const isOpen = openId === service.id;
            const IconComponent = SERVICE_ICONS[service.icon] || Terminal;

            return (
              <article
                key={service.id}
                className={`service-row ${isOpen ? 'is-open' : ''}`}
              >
                <button
                  type="button"
                  className="service-row-trigger"
                  aria-expanded={isOpen}
                  aria-controls={`service-drawer-${service.id}`}
                  onClick={() => setOpenId(isOpen ? null : service.id)}
                >
                  <div className="service-trigger-left">
                    <span className="service-row-num">{service.code}</span>
                    <span className="service-row-icon" aria-hidden="true">
                      <IconComponent size={18} strokeWidth={1.9} />
                    </span>
                    <h3 className="service-row-title">{service.title}</h3>
                  </div>

                  <div className="service-trigger-right">
                    <span className="service-row-sprint">
                      <Clock size={12} aria-hidden="true" />
                      <span>{service.turnaround}</span>
                    </span>
                    <span className="service-row-plus" aria-hidden="true">
                      <Plus size={18} strokeWidth={2} />
                    </span>
                  </div>
                </button>

                <div
                  id={`service-drawer-${service.id}`}
                  className="service-row-drawer"
                  aria-hidden={!isOpen}
                >
                  <div className="service-row-drawer-inner">
                    <div className="service-drawer-grid">
                      <div className="service-drawer-main">
                        <p className="service-drawer-desc">{service.description}</p>
                        <ul className="service-drawer-deliverables" aria-label="Key deliverables">
                          {service.deliverables.map((item) => (
                            <li key={item} className="service-drawer-item">
                              <Check size={13} strokeWidth={2.4} aria-hidden="true" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="service-drawer-side">
                        <div className="service-tech-icons" aria-label="Tech stack">
                          {service.techStack.map((tech) => (
                            <div
                              key={tech.name}
                              className="service-tech-item"
                              tabIndex={isOpen ? 0 : -1}
                              aria-label={tech.name}
                            >
                              <Tech3DIcon iconKey={tech.icon} size={38} />
                              <span className="service-tech-tooltip" role="tooltip">
                                {tech.name}
                              </span>
                            </div>
                          ))}
                        </div>

                        <a
                          href="#contact"
                          className="service-inquire-btn"
                          tabIndex={isOpen ? 0 : -1}
                          onClick={(e) => scrollToContact(e, service.title)}
                          aria-label={`Inquire about ${service.title}`}
                        >
                          <span>Inquire</span>
                          <ArrowUpRight size={15} aria-hidden="true" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
