import React, { useEffect, useRef } from 'react';

interface FlightChartProps {
  data: number[];
  isFlying: boolean;
  hasCrashed: boolean;
  primaryColor: string;
}

const FlightChart: React.FC<FlightChartProps> = ({ 
  data, 
  isFlying, 
  hasCrashed,
  primaryColor 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#2D3748';
    ctx.lineWidth = 0.5;
    
    // Vertical grid lines
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let i = 0; i < canvas.height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw flight path with smooth curve
    if (data.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2;
      
      const xStep = canvas.width / Math.max(50, data.length);
      const maxY = Math.max(...data, 10);
      
      // Start point
      ctx.moveTo(0, canvas.height - (data[0] / maxY) * canvas.height);
      
      // Draw curved line through points
      for (let i = 1; i < data.length - 2; i++) {
        const x0 = (i - 1) * xStep;
        const x1 = i * xStep;
        const x2 = (i + 1) * xStep;
        
        const y0 = canvas.height - (data[i - 1] / maxY) * canvas.height;
        const y1 = canvas.height - (data[i] / maxY) * canvas.height;
        const y2 = canvas.height - (data[i + 1] / maxY) * canvas.height;
        
        // Calculate control points
        const cp1x = x0 + (x1 - x0) * 0.5;
        const cp1y = y0 + (y1 - y0) * 0.5;
        const cp2x = x1 + (x2 - x1) * 0.5;
        const cp2y = y1 + (y2 - y1) * 0.5;
        
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x1, y1);
      }
      
      ctx.stroke();

      // Create gradient fill
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, `${primaryColor}20`);
      gradient.addColorStop(1, 'transparent');
      
      ctx.lineTo(data.length * xStep, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Add glow effect
      ctx.shadowColor = primaryColor;
      ctx.shadowBlur = 10;
      ctx.strokeStyle = `${primaryColor}80`;
      ctx.stroke();
    }

  }, [data, isFlying, hasCrashed, primaryColor]);

  return (
    <canvas 
      ref={canvasRef}
      className="w-full h-full rounded-lg bg-gray-800/50 transition-all duration-300"
      style={{ 
        boxShadow: `0 0 20px ${primaryColor}20`,
        filter: hasCrashed ? 'brightness(0.7)' : 'none'
      }}
    />
  );
};

export default FlightChart;