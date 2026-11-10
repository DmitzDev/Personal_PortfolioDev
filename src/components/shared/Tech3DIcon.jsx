import React from 'react';
import { tech3DConfig } from './tech3DData';
import antigravitySvg from '../../assets/antigravity.svg';
import archLinuxSvg from '../../assets/archlinux.svg';
import './Tech3DIcon.css';

export function Tech3DIcon({ iconKey = '', size = 44, className = '', _showGlow = false }) {
  const safeKey = String(iconKey || '');
  const cleanKey = safeKey
    .toLowerCase()
    .replace('/icons/', '')
    .replace('.svg', '')
    .replace(/[^a-z0-9]/g, '');

  const config =
    tech3DConfig[cleanKey] ||
    tech3DConfig[iconKey] || {
      name: safeKey || 'Technology',
      color: '#94a3b8',
      glow: 'rgba(148, 163, 184, 0.4)',
    };

  const getIconSrc = () => {
    if (cleanKey === 'antigravity') return antigravitySvg;
    if (cleanKey === 'archlinux') return archLinuxSvg;
    const fileKey = cleanKey === 'vite' ? 'vitejs' : cleanKey;
    return `/icons/${fileKey}.svg`;
  };

  const handleImgError = (e) => {
    if (cleanKey !== 'antigravity' && cleanKey !== 'archlinux') {
      const fileKey = cleanKey === 'vite' ? 'vitejs' : cleanKey;
      if (!e.currentTarget.dataset.retried) {
        e.currentTarget.dataset.retried = 'true';
        e.currentTarget.src = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${fileKey}/${fileKey}-plain.svg`;
      } else {
        e.currentTarget.style.display = 'none';
      }
    }
  };

  const iconDimension = Math.round(size * 0.58);

  return (
    <div
      className={`tech-glass-token ${className}`}
      style={{
        '--t-size': `${size}px`,
        '--t-color': config.color,
        '--t-glow': config.glow || 'rgba(255, 255, 255, 0.25)',
      }}
      title={config.name}
      aria-label={`${config.name} Token`}
    >
      <div className="tech-glass-accent-glow" aria-hidden="true" />
      <div className="tech-glass-emblem">
        <img
          src={getIconSrc()}
          alt={config.name}
          className="tech-glass-img"
          width={iconDimension}
          height={iconDimension}
          loading="lazy"
          onError={handleImgError}
        />
      </div>
    </div>
  );
}
