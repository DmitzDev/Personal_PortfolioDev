import React from 'react';
import {
  ArrowUpRight,
  Check,
  Clock,
  Cpu,
  Layout,
  PenTool,
  Rocket,
  Server,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import { services, clientAssurances } from '../../data/services';
import './Services.css';

const SERVICE_ICONS = {
  Layout,
  PenTool,
  Rocket,
  Server,
  Cpu,
};

const ASSURANCE_ICONS = {
  Clock,
  ShieldCheck,
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
            End-to-end web engineering for founders, startups, and product teams.
          </p>
        </header>

        {/* Clean 2x2 Minimal Service Grid */}
        <div className="services-grid">
          {services.map((service) => {
            const IconComponent = SERVICE_ICONS[service.icon] || Terminal;

            return (
              <article
                key={service.id}
                className="service-card"
                aria-labelledby={`service-title-${service.id}`}
              >
                <div className="service-card-top">
                  <span className="service-card-icon" aria-hidden="true">
                    <IconComponent size={20} />
                  </span>

                  <span className="service-card-turnaround" title="Estimated turnaround">
                    <Clock size={12} aria-hidden="true" />
                    <span>{service.turnaround}</span>
                  </span>
                </div>

                <h3 id={`service-title-${service.id}`} className="service-card-title">
                  {service.title}
                </h3>
                <p className="service-card-tagline">{service.tagline}</p>

                <ul className="service-deliverables-list" aria-label={`Key deliverables for ${service.title}`}>
                  {service.deliverables.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="service-deliverable-item">
                      <Check size={14} className="service-check-icon" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <footer className="service-card-footer">
                  <div className="service-tech-list" aria-label={`Technologies for ${service.title}`}>
                    {service.techStack.slice(0, 3).map((tech) => (
                      <span key={tech} className="service-tech-pill">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <a
                    href="#contact"
                    className="service-inquire-link"
                    onClick={(e) => scrollToContact(e, service.title)}
                    aria-label={`Inquire about ${service.title}`}
                  >
                    <span>Inquire</span>
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                </footer>
              </article>
            );
          })}
        </div>

        {/* Compact 1-Line Assurances Strip */}
        <div className="services-assurances-bar" aria-label="Engineering assurances">
          {clientAssurances.map((assurance) => {
            const AssuranceIcon = ASSURANCE_ICONS[assurance.icon] || ShieldCheck;

            return (
              <div key={assurance.title} className="service-assurance-pill">
                <AssuranceIcon size={15} aria-hidden="true" />
                <span>{assurance.title}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
