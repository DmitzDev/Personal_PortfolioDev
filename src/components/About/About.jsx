import React, { useState } from 'react';
import { MapPin, Mail, Calendar } from 'lucide-react';
import { personalInfo } from '../../data/personalInfo';
import { education } from '../../data/education';
import { experience } from '../../data/experience';
import { SectionHeader } from '../shared/SectionHeader';
import { AnimateOnScroll } from '../shared/AnimateOnScroll';
import './About.css';
import { useMouseTilt } from '../../hooks/useMouseTilt';
import ceoMitchImage from '../../assets/CeoMitch.webp';

export function About() {
  const [activeTab, setActiveTab] = useState('education');
  const tilt = useMouseTilt(10);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'education':
        return (
          <ul className="tab-list">
            {education.map(edu => (
              <li key={edu.id} className="tab-item">
                <h4 className="tab-item-title">{edu.degree}</h4>
                <p className="tab-item-subtitle">{edu.school} | {edu.year}</p>
              </li>
            ))}
          </ul>
        );
      case 'experience':
        return (
          <ul className="tab-list">
            {experience.slice(0, 3).map(exp => (
              <li key={exp.id} className="tab-item">
                <h4 className="tab-item-title">{exp.position}</h4>
                <p className="tab-item-subtitle">{exp.company} | {exp.duration}</p>
              </li>
            ))}
          </ul>
        );
      case 'funfacts':
        return (
          <ul className="tab-list facts-list">
            {personalInfo.funFacts.map((fact, index) => (
              <li key={index} className="tab-item fact-item">
                {fact}
              </li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <section id="about" className="section about-section">
      <div className="container">
        <SectionHeader title="About Me" subtitle="My Introduction" />

        <div className="about-content">
          <AnimateOnScroll className="about-image-col">
            <div 
              className="about-image-wrapper"
              ref={tilt.ref}
              style={tilt.style}
            >
              <img src={ceoMitchImage} alt="About Me" className="about-image" width="400" height="400" loading="lazy" />
              <div className="image-frame"></div>
            </div>
            
            <div className="info-cards glass-card">
              <div className="info-item">
                <MapPin className="info-icon" />
                <div>
                  <h5>Location</h5>
                  <p>{personalInfo.location}</p>
                </div>
              </div>
              <div className="info-item">
                <Mail className="info-icon" />
                <div>
                  <h5>Email</h5>
                  <p>{personalInfo.email}</p>
                </div>
              </div>
              <div className="info-item">
                <Calendar className="info-icon" />
                <div>
                  <h5>Freelance</h5>
                  <p className="text-gradient">{personalInfo.freelanceStatus}</p>
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={200} className="about-text-col">
            <p className="about-bio">{personalInfo.bio}</p>
            <p className="about-objective">{personalInfo.careerObjective}</p>
            
            <div className="about-tabs glass-card">
              <div className="tab-headers">
                <button 
                  className={`tab-btn ${activeTab === 'education' ? 'active' : ''}`}
                  onClick={() => setActiveTab('education')}
                >
                  Education
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'experience' ? 'active' : ''}`}
                  onClick={() => setActiveTab('experience')}
                >
                  Experience
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'funfacts' ? 'active' : ''}`}
                  onClick={() => setActiveTab('funfacts')}
                >
                  Fun Facts
                </button>
              </div>
              
              <div className="tab-content">
                {renderTabContent()}
              </div>
            </div>
            
            <a href={personalInfo.resumeUrl} className="btn-primary mt-6" target="_blank" rel="noopener noreferrer">
              Download CV
            </a>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
