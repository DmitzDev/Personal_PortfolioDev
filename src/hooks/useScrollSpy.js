import { useState, useEffect } from 'react';

export function useScrollSpy(sectionIds, offset = 110) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] || '');

  useEffect(() => {
    const handleScroll = () => {
      // 1. Bottom of the page check (for Contact / last section)
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const scrollY = window.scrollY;

      if (scrollHeight - scrollY - clientHeight <= 90) {
        setActiveSection(sectionIds[sectionIds.length - 1]);
        return;
      }

      // 2. Top of the page check (Hero / first section)
      if (scrollY < 80) {
        setActiveSection(sectionIds[0]);
        return;
      }

      // 3. Find current section by bounding client rect
      let currentSection = sectionIds[0];
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the element's top has reached or passed the offset line
          if (rect.top <= offset) {
            currentSection = id;
          }
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds, offset]);

  return [activeSection, setActiveSection];
}
