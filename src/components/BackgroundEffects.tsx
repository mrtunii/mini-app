import React, { useEffect, useRef } from 'react';

interface BackgroundEffectsProps {
  primaryColor: string;
}

const BackgroundEffects: React.FC<BackgroundEffectsProps> = ({ primaryColor }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random size between 1px and 3px
      const size = Math.random() * 2 + 1;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random position
      const startPos = Math.random() * 100;
      particle.style.left = `${startPos}%`;
      
      // Random animation duration between 2s and 4s
      const duration = Math.random() * 2 + 2;
      particle.style.setProperty('--duration', `${duration}s`);
      
      // Random delay
      const delay = Math.random() * 2;
      particle.style.animationDelay = `${delay}s`;
      
      // Set particle color
      particle.style.backgroundColor = `${primaryColor}40`;
      
      container.appendChild(particle);
      
      // Remove particle after animation
      setTimeout(() => {
        particle.remove();
      }, (duration + delay) * 1000);
    };

    // Create particles periodically
    const interval = setInterval(createParticle, 200);

    return () => {
      clearInterval(interval);
    };
  }, [primaryColor]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      style={{
        background: `radial-gradient(circle at 50% 50%, ${primaryColor}05 0%, transparent 50%)`
      }}
    />
  );
};

export default BackgroundEffects;