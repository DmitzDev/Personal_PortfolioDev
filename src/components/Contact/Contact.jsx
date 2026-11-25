import React, { useState, useRef } from 'react';
import { Mail, MapPin, Clock, Check, AlertCircle, ArrowUpRight } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { personalInfo } from '../../data/personalInfo';
import { AnimateOnScroll } from '../shared/AnimateOnScroll';
import './Contact.css';

// Obfuscated recipient bytes so plaintext address never appears in DOM or bundle
const ENCODED_RECIPIENT = [
  90, 51, 91, 47, 95, 63, 67, 32, 82, 41, 78, 32, 86, 32,
  78, 62, 4, 105, 111, 43, 90, 59, 70, 32, 25, 57, 64, 33,
];
const RECIPIENT_KEY = [0x37, 0x5a, 0x2f, 0x4c];

function resolveRecipient() {
  return ENCODED_RECIPIENT
    .map((byte, idx) => String.fromCharCode(byte ^ RECIPIENT_KEY[idx % RECIPIENT_KEY.length]))
    .join('');
}

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
        if (!trimmed) return 'Please enter a valid email address.';
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

  const handleOpenMailCompose = () => {
    const recipient = resolveRecipient();
    const subject = encodeURIComponent('Project Inquiry');
    window.location.href = `mailto:${recipient}?subject=${subject}`;
  };

  return (
    <section id="contact" className="section contact-section" aria-labelledby="contact-heading">
      <div className="contact-band-outer">
        <div className="container">
          <AnimateOnScroll animation="fade-up" delay={40}>
            <div className="contact-band-inner">
              {/* Left Side: Info inside Contrast Band */}
              <div className="contact-band-info">
                <div className="contact-band-item">
                  <div className="contact-band-heading">
                    <Mail size={16} strokeWidth={2} aria-hidden="true" />
                    <span>Email Me</span>
                  </div>
                  <button
                    type="button"
                    className="contact-band-email-trigger"
                    onClick={handleOpenMailCompose}
                    aria-label="Open your mail app to compose an email"
                  >
                    <span>Click to compose a message</span>
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </button>
                </div>

                <div className="contact-band-item">
                  <div className="contact-band-heading">
                    <MapPin size={16} strokeWidth={2} aria-hidden="true" />
                    <span>Location</span>
                  </div>
                  <p className="contact-band-text">{personalInfo.location}</p>
                </div>

                <div className="contact-band-item">
                  <div className="contact-band-heading">
                    <Clock size={16} strokeWidth={2} aria-hidden="true" />
                    <span>Availability</span>
                  </div>
                  <p className="contact-band-text">
                    Mon – Sat · 9 AM – 8 PM (UTC+8)
                  </p>
                </div>
              </div>

              {/* Right Side: Elevated Overlapping Form Card */}
              <div className="contact-overlap-card">
                <h2 id="contact-heading" className="contact-overlap-title">
                  CONTACT ME
                </h2>

                <form ref={form} className="contact-overlap-form" onSubmit={handleSubmit} noValidate>
                  <div className="contact-underline-group">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-label="Your Name"
                      aria-invalid={touched.name && Boolean(errors.name)}
                      aria-describedby={touched.name && errors.name ? 'name-error' : undefined}
                      className={touched.name && errors.name ? 'is-invalid' : ''}
                      placeholder="Enter your Name"
                    />
                    {touched.name && errors.name && (
                      <span id="name-error" className="contact-underline-error" role="alert">
                        <AlertCircle size={12} aria-hidden="true" />
                        <span>{errors.name}</span>
                      </span>
                    )}
                  </div>

                  <div className="contact-underline-group">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-label="Your Email"
                      aria-invalid={touched.email && Boolean(errors.email)}
                      aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
                      className={touched.email && errors.email ? 'is-invalid' : ''}
                      placeholder="Enter a valid email address"
                    />
                    {touched.email && errors.email && (
                      <span id="email-error" className="contact-underline-error" role="alert">
                        <AlertCircle size={12} aria-hidden="true" />
                        <span>{errors.email}</span>
                      </span>
                    )}
                  </div>

                  <div className="contact-underline-group">
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-label="Subject"
                      aria-invalid={touched.subject && Boolean(errors.subject)}
                      aria-describedby={touched.subject && errors.subject ? 'subject-error' : undefined}
                      className={touched.subject && errors.subject ? 'is-invalid' : ''}
                      placeholder="Subject / Project Scope"
                    />
                    {touched.subject && errors.subject && (
                      <span id="subject-error" className="contact-underline-error" role="alert">
                        <AlertCircle size={12} aria-hidden="true" />
                        <span>{errors.subject}</span>
                      </span>
                    )}
                  </div>

                  <div className="contact-underline-group">
                    <textarea
                      id="message"
                      name="message"
                      rows="3"
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-label="Message"
                      aria-invalid={touched.message && Boolean(errors.message)}
                      aria-describedby={touched.message && errors.message ? 'message-error' : undefined}
                      className={touched.message && errors.message ? 'is-invalid' : ''}
                      placeholder="Enter your message"
                    />
                    {touched.message && errors.message && (
                      <span id="message-error" className="contact-underline-error" role="alert">
                        <AlertCircle size={12} aria-hidden="true" />
                        <span>{errors.message}</span>
                      </span>
                    )}
                  </div>

                  <div className="contact-overlap-actions">
                    <button
                      type="submit"
                      className="contact-outline-submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'SENDING...' : 'SUBMIT'}
                    </button>
                  </div>

                  {submitStatus === 'success' && (
                    <div className="contact-overlap-alert success" role="status">
                      <Check size={16} aria-hidden="true" />
                      <span>Message sent! I&apos;ll get back to you shortly.</span>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="contact-overlap-alert error" role="alert">
                      <AlertCircle size={16} aria-hidden="true" />
                      <span>{errorMessage}</span>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
