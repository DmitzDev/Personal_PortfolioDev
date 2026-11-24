import React, { useState, useEffect, useRef } from 'react';
import {
  Home,
  FolderKanban,
  Cpu,
  Award,
  MoreHorizontal,
  X,
  Briefcase,
  Layers,
  Send,
} from 'lucide-react';
import './MobileBottomNav.css';

const primaryItems = [
  { id: 'hero', label: 'Home', icon: Home },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'skills', label: 'Tech', icon: Cpu },
  { id: 'certificates', label: 'Certs', icon: Award },
];

const moreItems = [
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'services', label: 'Services', icon: Layers },
  { id: 'contact', label: 'Contact', icon: Send },
];

export function MobileBottomNav({ activeSection, scrollTo }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const dockRef = useRef(null);

  const isMoreActive = moreItems.some((item) => item.id === activeSection);

  useEffect(() => {
    if (!moreOpen) return undefined;

    const handleOutside = (e) => {
      if (dockRef.current && !dockRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
    };

    const handleEsc = (e) => {
      if (e.key === 'Escape') setMoreOpen(false);
    };

    document.addEventListener('pointerdown', handleOutside);
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('pointerdown', handleOutside);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [moreOpen]);

  const handleNavigate = (id) => {
    setMoreOpen(false);
    scrollTo(id);
  };

  return (
    <div className="mobnav-dock-root" ref={dockRef}>
      {moreOpen && (
        <div className="mobnav-more-sheet" role="menu" aria-label="More sections">
          {moreItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                className={`mobnav-more-item ${isActive ? 'is-active' : ''}`}
                onClick={() => handleNavigate(item.id)}
              >
                <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      <nav className="mobnav-dock" aria-label="Mobile Navigation">
        <ul className="mobnav-list">
          {primaryItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <li key={item.id} className="mobnav-slot">
                <button
                  type="button"
                  className={`mobnav-key ${isActive ? 'is-active' : ''}`}
                  onClick={() => handleNavigate(item.id)}
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="mobnav-icon-wrap" aria-hidden="true">
                    <Icon size={18} strokeWidth={isActive ? 2.2 : 1.75} />
                  </span>
                  <span className="mobnav-key-label">{item.label}</span>
                </button>
              </li>
            );
          })}

          <li className="mobnav-slot">
            <button
              type="button"
              className={`mobnav-key ${moreOpen || isMoreActive ? 'is-active' : ''}`}
              onClick={() => setMoreOpen((prev) => !prev)}
              aria-label="More sections"
              aria-expanded={moreOpen}
              aria-haspopup="menu"
            >
              <span className="mobnav-icon-wrap" aria-hidden="true">
                {moreOpen ? (
                  <X size={18} strokeWidth={2.2} />
                ) : (
                  <MoreHorizontal size={18} strokeWidth={isMoreActive ? 2.2 : 1.75} />
                )}
              </span>
              <span className="mobnav-key-label">More</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
