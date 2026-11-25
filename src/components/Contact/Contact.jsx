import React, { useState, useRef } from 'react';
import { ArrowRight, Check, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
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
          return 'Please enter a valid email address.';
        }
        return '';
      case 'subject':
        if (!trimmed) return 'Please enter a subject.';
        if (trimmed.length < 3) return 'Subject must be at least 3 characters.';
        return '';
      case 'message':
        if (!trimmed) return 'Please enter your message.';
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
      toast.error('Please check the highlighted fields.');
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
          toast.success('Message sent successfully!');
          setTimeout(() => setSubmitStatus(null), 6000);
        },
        (error) => {
          setIsSubmitting(false);
          setSubmitStatus('error');
          const err = error.text || error.message || 'Failed to send message. Please try again.';
          setErrorMessage(err);
          toast.error('Failed to send message', { description: err });
          console.error('EmailJS Error:', error);
          setTimeout(() => setSubmitStatus(null), 8000);
        }
      );
  };

  return (
    <section id="contact" className="section contact-section" aria-labelledby="contact-heading">
      <div className="container">
        <header className="section-header contact-header">
          <h2 id="contact-heading" className="section-title">
            Get in Touch
          </h2>
          <p className="section-subtitle">
            Have a project or role in mind? Send a message below.
          </p>
        </header>

        <AnimateOnScroll animation="fade-up" delay={50} className="contact-frame-wrap">
          <form ref={form} className="contact-grid-form" onSubmit={handleSubmit} noValidate>
            <div className="contact-grid-row">
              <div className={`contact-cell ${touched.name && errors.name ? 'has-error' : ''}`}>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={touched.name && Boolean(errors.name)}
                  aria-describedby={touched.name && errors.name ? 'name-error' : undefined}
                  placeholder="Alex Morgan"
                />
                {touched.name && errors.name && (
                  <span id="name-error" className="contact-cell-error" role="alert">
                    <AlertCircle size={12} aria-hidden="true" />
                    <span>{errors.name}</span>
                  </span>
                )}
              </div>

              <div className={`contact-cell ${touched.email && errors.email ? 'has-error' : ''}`}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={touched.email && Boolean(errors.email)}
                  aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
                  placeholder="alex@company.com"
                />
                {touched.email && errors.email && (
                  <span id="email-error" className="contact-cell-error" role="alert">
                    <AlertCircle size={12} aria-hidden="true" />
                    <span>{errors.email}</span>
                  </span>
                )}
              </div>
            </div>

            <div className={`contact-cell contact-cell-full ${touched.subject && errors.subject ? 'has-error' : ''}`}>
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={touched.subject && Boolean(errors.subject)}
                aria-describedby={touched.subject && errors.subject ? 'subject-error' : undefined}
                placeholder="Web App / UI Engineering"
              />
              {touched.subject && errors.subject && (
                <span id="subject-error" className="contact-cell-error" role="alert">
                  <AlertCircle size={12} aria-hidden="true" />
                  <span>{errors.subject}</span>
                </span>
              )}
            </div>

            <div className={`contact-cell contact-cell-full ${touched.message && errors.message ? 'has-error' : ''}`}>
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={touched.message && Boolean(errors.message)}
                aria-describedby={touched.message && errors.message ? 'message-error' : undefined}
                placeholder="Tell me briefly about your project and timeline..."
              />
              {touched.message && errors.message && (
                <span id="message-error" className="contact-cell-error" role="alert">
                  <AlertCircle size={12} aria-hidden="true" />
                  <span>{errors.message}</span>
                </span>
              )}
            </div>

            <div className="contact-form-bar">
              <span className="contact-form-note">All fields required</span>
              <button
                type="submit"
                className="contact-form-submit"
                disabled={isSubmitting}
              >
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                {!isSubmitting && <ArrowRight size={15} className="contact-submit-arrow" aria-hidden="true" />}
              </button>
            </div>

            {submitStatus === 'success' && (
              <div className="contact-status-banner success" role="status">
                <Check size={16} aria-hidden="true" />
                <span>Message received. I&apos;ll get back to you shortly.</span>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="contact-status-banner error" role="alert">
                <AlertCircle size={16} aria-hidden="true" />
                <span>{errorMessage}</span>
              </div>
            )}
          </form>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
