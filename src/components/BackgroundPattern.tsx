import React from 'react';

interface BackgroundPatternProps {
  primaryColor: string;
}

const BackgroundPattern: React.FC<BackgroundPatternProps> = ({ primaryColor }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-5">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(${primaryColor}20 1px, transparent 1px),
            linear-gradient(90deg, ${primaryColor}20 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${primaryColor}20 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
};

export default BackgroundPattern;