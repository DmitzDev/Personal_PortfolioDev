import React, { useState, useRef } from 'react';
import { Mail, MapPin, Send, Copy, Check, Clock, ShieldCheck } from 'lucide-react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const form = useRef();

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopiedEmail(true);
    toast.success('Email copied to clipboard!', {
      description: personalInfo.email,
    });
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
          <div className="section-tag">GET IN TOUCH</div>
          <h2 className="section-title">Let's Build Something Exceptional</h2>
          <p className="section-subtitle">
            Whether you have an upcoming web project, need a front-end MVP engineered, or want to discuss front-end contracting — my inbox is open.
          </p>
        </div>

        <div className="contact-grid">
          {/* Direct Communication Channels */}
          <AnimateOnScroll animation="fade-up" delay={50} className="contact-info-col">
            <div className="contact-info-card glass-card">
              <h3 className="info-card-title">Get in Touch Directly</h3>
              <p className="info-card-desc">
                Prefer direct communication over filling out forms? Feel free to copy my direct email below or reach out via GitHub.
              </p>

              {/* Quick Copy Email Box */}
              <div className="copy-email-box">
                <div className="email-display">
                  <Mail size={18} className="email-icon" />
                  <span className="email-address">{personalInfo.email}</span>
                </div>
                <button
                  type="button"
                  className="copy-btn"
                  onClick={handleCopyEmail}
                  title="Copy email to clipboard"
                >
                  {copiedEmail ? (
                    <>
                      <Check size={15} className="copied-icon" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={15} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Guarantees & SLA List */}
              <div className="contact-sla-list">
                <div className="sla-item">
                  <Clock size={18} className="sla-icon" />
                  <div>
                    <h4>Fast Turnaround</h4>
                    <p>Responses guaranteed within 24 hours (UTC+8).</p>
                  </div>
                </div>

                <div className="sla-item">
                  <ShieldCheck size={18} className="sla-icon" />
                  <div>
                    <h4>Contract & NDA Ready</h4>
                    <p>Open for scoped freelance contracts and milestone agreements.</p>
                  </div>
                </div>

                <div className="sla-item">
                  <MapPin size={18} className="sla-icon" />
                  <div>
                    <h4>Location & Availability</h4>
                    <p>{personalInfo.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Inquiry Form */}
          <AnimateOnScroll animation="fade-up" delay={150} className="contact-form-col">
            <div className="contact-form-card glass-card">
              <h3 className="form-card-title">Send a Direct Message</h3>
              <p className="form-card-desc">Fill in the project details below and I'll review your scope.</p>

              <form ref={form} className="inquiry-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Alex Morgan"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Your Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="e.g. alex@company.com"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject / Project Scope</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Front-End Web App Development"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Project Requirements & Timeline</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Describe your project, target launch date, and key features..."
                  ></textarea>
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
