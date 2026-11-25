import React, { useState, useRef } from 'react';
import {
  Send,
  Check,
  AlertCircle,
  Mail,
  Copy,
  MapPin,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import emailjs from '@emailjs/browser';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { personalInfo } from '../../data/personalInfo';
import { socialLinks } from '../../data/socialLinks';
import { AnimateOnScroll } from '../shared/AnimateOnScroll';
import './Contact.css';

const QUICK_SCOPES = [
  'Full-Stack Web App',
  'UI / Figma to React',
  'MVP Launch',
  'API & Automation',
];

const SocialIconSVG = ({ name, size = 17 }) => {
  switch (name) {
    case 'Github':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4" />
        </svg>
      );
    case 'Linkedin':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
    case 'Facebook':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      );
    case 'Instagram':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      );
    default:
      return null;
  }
};

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const form = useRef();

  const validateField = (name, value) => {
    const trimmed = (value || '').trim();
    switch (name) {
      case 'name':
        if (!trimmed) return 'Please enter your name.';
        if (trimmed.length < 2) return 'Name must be at least 2 characters.';
        return '';
      case 'email':
        if (!trimmed) return 'Please enter your email address.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
          return 'Please enter a valid email address (e.g. name@company.com).';
        }
        return '';
      case 'subject':
        if (!trimmed) return 'Please enter a subject or project scope.';
        if (trimmed.length < 3) return 'Subject must be at least 3 characters.';
        return '';
      case 'message':
        if (!trimmed) return 'Please describe your project requirements.';
        if (trimmed.length < 10) return 'Message must be at least 10 characters.';
        return '';
      default:
        return '';
    }
  };

  const validateForm = (data) => {
    const newErrors = {};
    ['name', 'email', 'subject', 'message'].forEach((field) => {
      const err = validateField(field, data[field]);
      if (err) newErrors[field] = err;
    });
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const fieldError = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleQuickScope = (scope) => {
    setFormData((prev) => ({ ...prev, subject: scope }));
    setTouched((prev) => ({ ...prev, subject: true }));
    setErrors((prev) => ({ ...prev, subject: '' }));
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email);
      setCopiedEmail(true);
      toast.success('Email copied to clipboard!');
      setTimeout(() => setCopiedEmail(false), 2200);
    } catch {
      toast.error('Could not copy email. Please use the mail link.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const allTouched = {
      name: true,
      email: true,
      subject: true,
      message: true,
    };
    setTouched(allTouched);

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error('Please fix the errors before submitting.', {
        description: 'Ensure all required fields are filled out correctly.',
      });
      const firstErrorField = Object.keys(validationErrors)[0];
      const el = form.current?.querySelector(`[name="${firstErrorField}"]`);
      if (el) el.focus();
      return;
    }

    setIsSubmitting(true);

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setIsSubmitting(false);
          setSubmitStatus('success');
          setFormData({ name: '', email: '', subject: '', message: '' });
          setTouched({});
          setErrors({});
          confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.6 },
            colors: ['#ffffff', '#94a3b8', '#38bdf8', '#10b981'],
          });
          toast.success('Message sent successfully!', {
            description: "Thanks for reaching out! I'll get back to you as soon as possible.",
          });
          setTimeout(() => setSubmitStatus(null), 6000);
        },
        (error) => {
          setIsSubmitting(false);
          setSubmitStatus('error');
          const err =
            error.text || error.message || 'Failed to dispatch email. Please email directly.';
          setErrorMessage(err);
          toast.error('Failed to send message', {
            description: err,
          });
          console.error('EmailJS Error:', error);
          setTimeout(() => setSubmitStatus(null), 8000);
        }
      );
  };

  return (
    <section id="contact" className="section contact-section" aria-labelledby="contact-heading">
      <div className="container">
        <div className="contact-split-layout">
          {/* Left Column: Direct Connect & Quick Scopes */}
          <AnimateOnScroll animation="fade-up" delay={40} className="contact-info-col">
            <div className="contact-availability-pill">
              <span className="contact-pulse-dot" aria-hidden="true" />
              <span>{personalInfo.statusBadge || 'Available for new projects'}</span>
            </div>

            <h2 id="contact-heading" className="contact-split-title">
              Let&apos;s Build Something Exceptional
            </h2>
            <p className="contact-split-subtitle">
              Have a web app, UI system, or MVP in mind? Send a message or reach out directly — I
              usually reply within 24 hours.
            </p>

            {/* Direct Contact Channels */}
            <div className="contact-channels">
              <div className="contact-channel-row">
                <div className="contact-channel-icon" aria-hidden="true">
                  <Mail size={17} />
                </div>
                <div className="contact-channel-meta">
                  <span className="contact-channel-label">Direct Email</span>
                  <a href={`mailto:${personalInfo.email}`} className="contact-channel-value">
                    {personalInfo.email}
                  </a>
                </div>
                <button
                  type="button"
                  className={`contact-copy-btn ${copiedEmail ? 'is-copied' : ''}`}
                  onClick={handleCopyEmail}
                  aria-label="Copy email address"
                >
                  {copiedEmail ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="contact-channel-row">
                <div className="contact-channel-icon" aria-hidden="true">
                  <MapPin size={17} />
                </div>
                <div className="contact-channel-meta">
                  <span className="contact-channel-label">Location &amp; Hours</span>
                  <span className="contact-channel-text">{personalInfo.location}</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="contact-social-block">
              <span className="contact-block-label">Connect Elsewhere</span>
              <div className="contact-social-row">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-social-pill"
                    aria-label={link.name}
                  >
                    <SocialIconSVG name={link.icon} size={16} />
                    <span>{link.name}</span>
                    <ArrowUpRight size={13} className="contact-social-arrow" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </AnimateOnScroll>

          {/* Right Column: Project Inquiry Form */}
          <AnimateOnScroll animation="fade-up" delay={100} className="contact-form-col">
            <div className="contact-form-card">
              <div className="contact-form-header">
                <h3 className="form-card-title">Send a Message</h3>
                <span className="contact-scope-hint">
                  <Sparkles size={13} aria-hidden="true" />
                  <span>Quick topics</span>
                </span>
              </div>

              {/* 1-Tap Quick Scope Chips */}
              <div className="contact-scope-chips" role="group" aria-label="Quick project topics">
                {QUICK_SCOPES.map((scope) => (
                  <button
                    key={scope}
                    type="button"
                    className={`contact-scope-chip ${formData.subject === scope ? 'is-selected' : ''}`}
                    onClick={() => handleQuickScope(scope)}
                  >
                    {scope}
                  </button>
                ))}
              </div>

              <form ref={form} className="inquiry-form" onSubmit={handleSubmit} noValidate>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">
                      Your Name <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={touched.name && Boolean(errors.name)}
                      aria-describedby={touched.name && errors.name ? 'name-error' : undefined}
                      className={touched.name && errors.name ? 'input-error' : ''}
                      placeholder="e.g. Alex Morgan"
                    />
                    {touched.name && errors.name && (
                      <span id="name-error" className="field-error" role="alert">
                        <AlertCircle size={13} aria-hidden="true" />
                        <span>{errors.name}</span>
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      Your Email <span className="required-star">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={touched.email && Boolean(errors.email)}
                      aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
                      className={touched.email && errors.email ? 'input-error' : ''}
                      placeholder="e.g. alex@company.com"
                    />
                    {touched.email && errors.email && (
                      <span id="email-error" className="field-error" role="alert">
                        <AlertCircle size={13} aria-hidden="true" />
                        <span>{errors.email}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">
                    Subject / Scope <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={touched.subject && Boolean(errors.subject)}
                    aria-describedby={touched.subject && errors.subject ? 'subject-error' : undefined}
                    className={touched.subject && errors.subject ? 'input-error' : ''}
                    placeholder="e.g. Front-End Web App Development"
                  />
                  {touched.subject && errors.subject && (
                    <span id="subject-error" className="field-error" role="alert">
                      <AlertCircle size={13} aria-hidden="true" />
                      <span>{errors.subject}</span>
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="message">
                    Project Details <span className="required-star">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={touched.message && Boolean(errors.message)}
                    aria-describedby={touched.message && errors.message ? 'message-error' : undefined}
                    className={touched.message && errors.message ? 'input-error' : ''}
                    placeholder="Tell me about your project goals, timeline, and key features..."
                  />
                  {touched.message && errors.message && (
                    <span id="message-error" className="field-error" role="alert">
                      <AlertCircle size={13} aria-hidden="true" />
                      <span>{errors.message}</span>
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn-primary submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span>Sending Proposal...</span>
                  ) : (
                    <>
                      <span>Dispatch Message</span>
                      <Send size={15} aria-hidden="true" />
                    </>
                  )}
                </button>

                {submitStatus === 'success' && (
                  <div className="submit-alert success" role="status">
                    <Check size={18} aria-hidden="true" />
                    <span>Message received! I&apos;ll review your details and reply shortly.</span>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="submit-alert error" role="alert">
                    <AlertCircle size={18} aria-hidden="true" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </form>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
