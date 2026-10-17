import React, { useState, useRef } from 'react';
import { Send, Check, AlertCircle } from 'lucide-react';
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
    setFormData(prev => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const fieldError = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: fieldError }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: fieldError }));
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

    emailjs.sendForm(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      form.current,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
      .then(() => {
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
      }, (error) => {
        setIsSubmitting(false);
        setSubmitStatus('error');
        const err = error.text || error.message || 'Failed to dispatch email. Please email directly.';
        setErrorMessage(err);
        toast.error('Failed to send message', {
          description: err,
        });
        console.error('EmailJS Error:', error);
        setTimeout(() => setSubmitStatus(null), 8000);
      });
  };

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Let's Build Something Exceptional</h2>
          <p className="section-subtitle">
            Whether you have an upcoming web project, need a front-end MVP engineered, or want to discuss front-end contracting — my inbox is open.
          </p>
        </div>

        <div className="contact-grid">
          {/* Inquiry Form */}
          <AnimateOnScroll animation="fade-up" delay={80} className="contact-form-col">
            <div className="contact-form-card glass-card">
              <h3 className="form-card-title">Send a Direct Message</h3>
              <p className="form-card-desc">Fill in the project details below and I'll review your scope.</p>

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
                    Subject / Project Scope <span className="required-star">*</span>
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
                    Project Requirements &amp; Timeline <span className="required-star">*</span>
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
                    placeholder="Describe your project, target launch date, and key features..."
                  ></textarea>
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
                      <Send size={16} />
                    </>
                  )}
                </button>

                {submitStatus === 'success' && (
                  <div className="submit-alert success">
                    <Check size={18} />
                    <span>Message received! I'll review your project details and respond shortly.</span>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="submit-alert error">
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
