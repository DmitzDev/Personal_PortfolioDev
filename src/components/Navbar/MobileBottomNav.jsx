import React from 'react';
import { Home, FolderKanban, Cpu, Briefcase, Send } from 'lucide-react';
import './MobileBottomNav.css';

const navItems = [
  { id: 'hero', label: 'Home', icon: Home },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'skills', label: 'Tech', icon: Cpu },
  { id: 'experience', label: 'Career', icon: Briefcase },
  { id: 'contact', label: 'Contact', icon: Send },
];

export function MobileBottomNav({ activeSection, scrollTo }) {
  return (
    <div className="mobnav-dock-root">
      <nav className="mobnav-dock" aria-label="Mobile Navigation">
        <ul className="mobnav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <li key={item.id} className="mobnav-slot">
                <button
                  type="button"
                  className={`mobnav-key ${isActive ? 'is-active' : ''}`}
                  onClick={() => scrollTo(item.id)}
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
        </ul>
      </nav>
    </div>
  );
}
