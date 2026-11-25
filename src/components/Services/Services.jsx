import React from 'react';
import { ArrowUpRight, Layout, PenTool, Rocket, Server, Terminal } from 'lucide-react';
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

        <div className="services-cards-grid">
          {services.map((service) => {
            const IconComponent = SERVICE_ICONS[service.icon] || Terminal;

            return (
              <article key={service.id} className="service-card">
                <span className="service-card-watermark" aria-hidden="true">
                  {service.code}
                </span>

                <div className="service-card-head">
                  <div className="service-card-icon-wrap" aria-hidden="true">
                    <IconComponent size={19} strokeWidth={2} />
                  </div>
                  <div className="service-card-heading">
                    <span className="service-card-kicker">{service.badge}</span>
                    <h3 className="service-card-title">{service.title}</h3>
                  </div>
                </div>

                <p className="service-card-desc">{service.description}</p>

                <div className="service-card-footer">
                  <div className="service-tech-icons" aria-label="Tech stack">
                    {service.techStack.map((tech) => (
                      <div
                        key={tech.name}
                        className="service-tech-item"
                        tabIndex={0}
                        aria-label={tech.name}
                      >
                        <Tech3DIcon iconKey={tech.icon} size={32} />
                        <span className="service-tech-tooltip" role="tooltip">
                          {tech.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  <a
                    href="#contact"
                    className="service-inquire-btn"
                    onClick={(e) => scrollToContact(e, service.title)}
                    aria-label={`Inquire about ${service.title}`}
                  >
                    <span>Inquire</span>
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
