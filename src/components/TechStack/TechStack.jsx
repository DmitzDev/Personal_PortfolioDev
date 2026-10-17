import React from 'react';
import './TechStack.css';
import { skills } from '../../data/skills';

export function TechStack() {
  // Use a subset of skills or all skills for the marquee
  const marqueeItems = skills.filter(skill => skill.category !== 'Tools' || ['Git', 'GitHub', 'Figma'].includes(skill.name));
  
  // Create two rows with different items or different directions
  const row1 = marqueeItems.slice(0, Math.ceil(marqueeItems.length / 2));
  const row2 = marqueeItems.slice(Math.ceil(marqueeItems.length / 2));

  const renderMarqueeRow = (items, reverse = false) => {
    // Duplicate items to create seamless loop
    const loopItems = [...items, ...items, ...items];
    
    return (
      <div className={`marquee-row ${reverse ? 'reverse' : ''}`}>
        <div className="marquee-content">
          {loopItems.map((item, idx) => (
            <div key={`${item.name}-${idx}`} className="marquee-item glass-card">
              <img 
                src={`/icons/${item.icon}.svg`} 
                alt={item.name}
                className="marquee-icon"
                width="24"
                height="24"
                loading="lazy"
                onError={(e) => {
                  e.target.src = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${item.icon}/${item.icon}-original.svg`;
                }}
              />
              <span className="marquee-name">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="tech-stack-section">
      <div className="marquee-container">
        {renderMarqueeRow(row1)}
        {renderMarqueeRow(row2, true)}
        
        {/* Gradient overlays to hide the edges */}
        <div className="marquee-overlay left"></div>
        <div className="marquee-overlay right"></div>
      </div>
    </section>
  );
}
