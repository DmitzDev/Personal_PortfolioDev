import React, { useState, useRef } from 'react';
import { Send, Check, AlertCircle, Copy } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { personalInfo } from '../../data/personalInfo';
import { AnimateOnScroll } from '../shared/AnimateOnScroll';
import './Contact.css';

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
        <div className="contact-editorial-grid">
          {/* Left: Clean Unboxed Editorial Info */}
          <AnimateOnScroll animation="fade-up" delay={40} className="contact-editorial-info">
            <span className="contact-eyebrow">Contact</span>
            <h2 id="contact-heading" className="contact-editorial-title">
              Let&apos;s Build Something Exceptional
            </h2>
            <p className="contact-editorial-subtitle">
              Have a project, MVP, or front-end role in mind? Drop a note or reach out directly.
            </p>

            <div className="contact-meta-list">
              <div className="contact-meta-item">
                <span className="contact-meta-label">Email</span>
                <div className="contact-meta-value-row">
                  <a href={`mailto:${personalInfo.email}`} className="contact-meta-link">
                    {personalInfo.email}
                  </a>
                  <button
                    type="button"
                    className={`contact-inline-copy ${copiedEmail ? 'is-copied' : ''}`}
                    onClick={handleCopyEmail}
                    aria-label="Copy email address"
                  >
                    {copiedEmail ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="contact-meta-item">
                <span className="contact-meta-label">Location</span>
                <span className="contact-meta-text">{personalInfo.location}</span>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Right: Unboxed Minimal Underline Form */}
          <AnimateOnScroll animation="fade-up" delay={90} className="contact-editorial-form-col">
            <form ref={form} className="contact-minimal-form" onSubmit={handleSubmit} noValidate>
              <div className="contact-minimal-row">
                <div className="contact-minimal-field">
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
                  />
                  {touched.name && errors.name && (
                    <span id="name-error" className="field-error" role="alert">
                      <AlertCircle size={13} aria-hidden="true" />
                      <span>{errors.name}</span>
                    </span>
                  )}
                </div>

                <div className="contact-minimal-field">
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

              <div className="contact-minimal-field">
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

              <div className="contact-minimal-field">
                <label htmlFor="message">
                  Message <span className="required-star">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="3"
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

              <div className="contact-minimal-actions">
                <button
                  type="submit"
                  className="contact-minimal-submit"
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
              </div>

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
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
