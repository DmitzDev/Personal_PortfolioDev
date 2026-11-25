import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Send, Check, AlertCircle, Copy, Mail, X, ArrowUpRight } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { personalInfo } from '../../data/personalInfo';
import { AnimateOnScroll } from '../shared/AnimateOnScroll';
import './Contact.css';

export function Contact() {
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  // Allow other sections (e.g. Services "Inquire") to open the modal pre-filled
  useEffect(() => {
    const handleOpenContact = (event) => {
      const serviceTitle = event?.detail?.serviceTitle;
      if (serviceTitle) {
        setFormData((prev) => ({
          ...prev,
          subject: serviceTitle,
          message: `Hi Mitch, I'm interested in discussing a project regarding: ${serviceTitle}.`,
        }));
      }
      setIsModalOpen(true);
    };

    window.addEventListener('open-contact-modal', handleOpenContact);
    return () => window.removeEventListener('open-contact-modal', handleOpenContact);
  }, []);

  // Lock body scroll & close on Escape when modal is open
  useEffect(() => {
    if (!isModalOpen) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);

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

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email);
      setCopiedEmail(true);
      toast.success('Email copied!');
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      toast.error('Could not copy email.');
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
          setTimeout(() => {
            setSubmitStatus(null);
            setIsModalOpen(false);
          }, 1800);
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
        <AnimateOnScroll animation="fade-up" delay={40}>
          <div className="contact-cta-banner">
            <div className="contact-cta-copy">
              <div className="contact-cta-status">
                <span className="contact-pulse-dot" aria-hidden="true" />
                <span>{personalInfo.statusBadge || 'Available for new projects'}</span>
              </div>
              <h2 id="contact-heading" className="contact-cta-title">
                Let&apos;s Build Something Together
              </h2>
              <p className="contact-cta-subtitle">
                Have a web project, MVP, or front-end role in mind? Let&apos;s talk.
              </p>
            </div>

            <div className="contact-cta-actions">
              <button
                type="button"
                className={`contact-cta-secondary ${copiedEmail ? 'is-copied' : ''}`}
                onClick={handleCopyEmail}
                aria-label={`Copy email ${personalInfo.email}`}
              >
                {copiedEmail ? <Check size={15} /> : <Copy size={15} />}
                <span>{copiedEmail ? 'Email Copied' : 'Copy Email'}</span>
              </button>

              <button
                type="button"
                className="contact-cta-primary"
                onClick={() => setIsModalOpen(true)}
              >
                <Mail size={15} aria-hidden="true" />
                <span>Send Message</span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </button>
            </div>
          </div>
        </AnimateOnScroll>
      </div>

      {/* Modal Contact Form rendered via Portal to escape section stacking/overflow */}
      {isModalOpen &&
        createPortal(
          <div
            className="contact-modal-backdrop"
            role="presentation"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsModalOpen(false);
            }}
          >
            <div
              className="contact-modal-card"
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact-modal-title"
            >
              <div className="contact-modal-header">
                <div>
                  <h3 id="contact-modal-title" className="contact-modal-title">
                    Send a Message
                  </h3>
                  <p className="contact-modal-desc">
                    Or email directly at{' '}
                    <a href={`mailto:${personalInfo.email}`} className="contact-modal-email">
                      {personalInfo.email}
                    </a>
                  </p>
                </div>
                <button
                  type="button"
                  className="contact-modal-close"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Close contact form"
                >
                  <X size={18} />
                </button>
              </div>

              <form ref={form} className="inquiry-form" onSubmit={handleSubmit} noValidate>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">
                      Name <span className="required-star">*</span>
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
                      placeholder="Alex Morgan"
                      autoFocus
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
                      Email <span className="required-star">*</span>
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
                      placeholder="alex@company.com"
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
                    Subject <span className="required-star">*</span>
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
                    placeholder="Web App / UI Engineering"
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
                    Message <span className="required-star">*</span>
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
                    placeholder="Tell me briefly about your project and timeline..."
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
                    <span>Sending...</span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={15} aria-hidden="true" />
                    </>
                  )}
                </button>

                {submitStatus === 'success' && (
                  <div className="submit-alert success" role="status">
                    <Check size={17} aria-hidden="true" />
                    <span>Message received! I&apos;ll get back to you shortly.</span>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="submit-alert error" role="alert">
                    <AlertCircle size={17} aria-hidden="true" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </form>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}
