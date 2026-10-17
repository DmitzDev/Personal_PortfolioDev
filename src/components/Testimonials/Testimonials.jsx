import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { testimonials } from '../../data/testimonials';
import { AnimateOnScroll } from '../shared/AnimateOnScroll';
import './Testimonials.css';

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 400);
  }, [isAnimating]);

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 400);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [handleNext]);

  const setSlide = (index) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 400);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section id="testimonials" className="section testimonials-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">What Clients & Collaborators Say</h2>
          <p className="section-subtitle">
            Feedback from real-world business owners, team leads, and mentors on communication, code delivery, and work ethic.
          </p>
        </div>

        <AnimateOnScroll className="testimonials-carousel-wrapper">
          <div className="testimonials-carousel glass-card">
            <Quote size={40} className="quote-icon" />

            <div className={`carousel-content ${isAnimating ? 'animating' : ''}`}>
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < currentTestimonial.rating ? "star-filled" : "star-empty"}
                  />
                ))}
              </div>

              <p className="testimonial-text">"{currentTestimonial.feedback}"</p>

              <div className="testimonial-author">
                <div className="author-photo">
                  {currentTestimonial.photo ? (
                    <img src={currentTestimonial.photo} alt={currentTestimonial.name} width="48" height="48" loading="lazy" />
                  ) : (
                    <span>{currentTestimonial.name.charAt(0)}</span>
                  )}
                </div>
                <div className="author-info">
                  <h4 className="author-name">{currentTestimonial.name}</h4>
                  <p className="author-position">{currentTestimonial.position}</p>
                </div>
              </div>
            </div>

            <div className="carousel-controls">
              <button className="carousel-btn" onClick={handlePrev} aria-label="Previous testimonial">
                <ChevronLeft size={20} />
              </button>

              <div className="carousel-dots">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`dot ${index === currentIndex ? 'active' : ''}`}
                    onClick={() => setSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              <button className="carousel-btn" onClick={handleNext} aria-label="Next testimonial">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
