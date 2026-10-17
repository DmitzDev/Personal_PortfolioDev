import React, { useRef, useState, useCallback } from 'react';
import './Tilt3DCard.css';

export function Tilt3DCard({
  children,
  className = '',
  maxTilt = 7.5,
  scale = 1.02,
  style = {},
  ...props
}) {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState('');
  const [glareState, setGlareState] = useState({ x: 50, y: 50, opacity: 0 });
  const isHoveredRef = useRef(false);

  const handleMouseMove = useCallback(
    (e) => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Normalized rotation
      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      setTransformStyle(
        `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`
      );

      setGlareState({
        x: ((x / rect.width) * 100).toFixed(1),
        y: ((y / rect.height) * 100).toFixed(1),
        opacity: 0.22,
      });
    },
    [maxTilt, scale]
  );

  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
    setTransformStyle('perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlareState((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  return (
    <div
      ref={cardRef}
      className={`tilt-3d-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        transform: transformStyle || undefined,
        '--glare-x': `${glareState.x}%`,
        '--glare-y': `${glareState.y}%`,
        '--glare-opacity': glareState.opacity,
      }}
      {...props}
    >
      {/* Specular dynamic light reflection glare */}
      <div className="tilt-3d-glare" aria-hidden="true" />

      {/* Card Content with 3D Parallax */}
      <div className="tilt-3d-inner">{children}</div>
    </div>
  );
}
