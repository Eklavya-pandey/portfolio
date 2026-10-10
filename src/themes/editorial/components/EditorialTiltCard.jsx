import React, { useRef, useState, useCallback } from 'react';

/**
 * EditorialTiltCard
 * Apple / Linear style 3D perspective tilt with dynamic specular holographic glare.
 * Enhances cards with tactile physical depth that tracks cursor motion.
 */
export default function EditorialTiltCard({
  children,
  className = '',
  onClick,
  maxTilt = 7, // max rotation degrees
  ...props
}) {
  const cardRef = useRef(null);
  const [tiltStyle, setTiltStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
  });
  const [glareStyle, setGlareStyle] = useState({
    opacity: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.25), transparent 60%)'
  });

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within card
    const y = e.clientY - rect.top;  // y position within card

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`,
      transition: 'transform 0.08s ease-out'
    });

    setGlareStyle({
      opacity: 1,
      background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.18), transparent 65%)`
    });
  }, [maxTilt]);

  const handleMouseLeave = useCallback(() => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
    });
    setGlareStyle({
      opacity: 0,
      background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0), transparent 60%)'
    });
  }, []);

  return (
    <div
      ref={cardRef}
      className={`editorial-tilt-wrapper ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={tiltStyle}
      {...props}
    >
      {children}
      {/* Specular Glare / Holographic Light Layer */}
      <div className="editorial-tilt-glare" style={glareStyle} />
    </div>
  );
}
