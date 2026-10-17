import React from 'react';
import { tech3DConfig } from './tech3DData';
import antigravitySvg from '../../assets/antigravity.svg';
import archLinuxSvg from '../../assets/archlinux.svg';
import './Tech3DIcon.css';

export function Tech3DIcon({ iconKey = '', size = 44, className = '', showGlow = false }) {
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
      gradient: 'linear-gradient(135deg, #94a3b8 0%, #475569 100%)',
      pedestalDark: 'linear-gradient(145deg, #1e293b, #0f172a)',
      pedestalLight: 'linear-gradient(145deg, #ffffff, #e2e8f0)',
      sidewallDark: '#334155',
      sidewallLight: '#cbd5e1',
      rimDark: 'rgba(255, 255, 255, 0.7)',
      rimLight: 'rgba(100, 116, 139, 0.7)',
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

  return (
    <div
      className={`tech-3d-token ${className}`}
      style={{
        '--t-size': `${size}px`,
        '--t-color': config.color,
        '--t-glow': showGlow ? config.glow : 'transparent',
        '--t-gradient': config.gradient,
        '--t-pedestal-dark': config.pedestalDark,
        '--t-pedestal-light': config.pedestalLight,
        '--t-sidewall-dark': config.sidewallDark,
        '--t-sidewall-light': config.sidewallLight,
        '--t-rim-dark': config.rimDark,
        '--t-rim-light': config.rimLight,
      }}
      title={config.name}
      aria-label={`${config.name} 3D Token`}
    >
      <div className="tech-3d-stage">
        {/* Soft Ambient Depth Shadow */}
        <div className="tech-3d-shadow" />

        {/* 3D Cylindrical Pedestal / Isometric Coin */}
        <div className="tech-3d-pedestal">
          {/* Beveled Top Surface with Specular Sheen */}
          <div className="tech-3d-surface">
            <div className="tech-3d-sheen" />

            {/* Extruded Floating 3D Vector Emblem */}
            <div className="tech-3d-emblem">
              <img
                src={getIconSrc()}
                alt={config.name}
                className="tech-3d-img"
                width={Math.round(size * 0.58)}
                height={Math.round(size * 0.58)}
                loading="lazy"
                onError={handleImgError}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
