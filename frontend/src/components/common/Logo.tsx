import React from 'react';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  variant?: 'light' | 'dark' | 'gradient';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  width,
  height,
  variant = 'gradient',
  size = 'md'
}) => {
  // Size presets
  const sizeMap = {
    xs: { width: 160, height: 40 },
    sm: { width: 200, height: 50 },
    md: { width: 280, height: 70 },
    lg: { width: 360, height: 90 },
    xl: { width: 480, height: 120 }
  };

  const finalWidth = width || sizeMap[size].width;
  const finalHeight = height || sizeMap[size].height;
  
  // Text styles based on variant
  const textStyles = {
    light: {
      alphatech: '#1e3a8a',
      x: '#c2410c',
      tagline: '#6b7280'
    },
    dark: {
      alphatech: '#3b82f6',
      x: '#f97316',
      tagline: '#9ca3af'
    },
    gradient: {
      alphatech: 'url(#alphaTechGradient)',
      x: 'url(#xGradient)',
      tagline: 'url(#taglineGradient)'
    }
  };

  const colors = textStyles[variant];

  return (
    <div className={`flex items-center ${className}`} style={{ width: finalWidth, height: finalHeight }}>
    <svg
        width={finalWidth}
        height={finalHeight}
        viewBox={`0 0 ${finalWidth} ${finalHeight}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
          {/* Gradient for ALPHATECH */}
          <linearGradient id="alphaTechGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="50%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          
          {/* Gradient for X */}
          <linearGradient id="xGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c2410c" />
            <stop offset="50%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
          
          {/* Gradient for tagline */}
          <linearGradient id="taglineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6b7280" />
            <stop offset="100%" stopColor="#9ca3af" />
        </linearGradient>
        
          {/* Text shadow filter */}
          <filter id="textShadow">
            <feDropShadow dx="1" dy="2" stdDeviation="1" floodColor="#00000015"/>
        </filter>
      </defs>

        {/* Main Brand Text */}
        <g>
          {/* ALPHATECH */}
          <text
            x="20"
            y={finalHeight * 0.55}
            fontSize={finalHeight * 0.35}
            fill={colors.alphatech}
            fontFamily="Inter, system-ui, -apple-system, sans-serif"
            fontWeight="800"
            letterSpacing="-0.02em"
            filter="url(#textShadow)"
          >
            Alphatech
          </text>

          {/* X with special styling */}
          <text
            x={finalWidth * 0.78}
            y={finalHeight * 0.55}
            fontSize={finalHeight * 0.4}
            fill={colors.x}
            fontFamily="Inter, system-ui, -apple-system, sans-serif"
            fontWeight="900"
            letterSpacing="-0.02em"
            filter="url(#textShadow)"
          >
            X
          </text>
          
          {/* AI Innovation tagline */}
          <text
            x="20"
            y={finalHeight * 0.85}
            fontSize={finalHeight * 0.12}
            fill={colors.tagline}
            fontFamily="Inter, system-ui, -apple-system, sans-serif"
            fontWeight="500"
            letterSpacing="0.05em"
            opacity="0.8"
          >
            AI INNOVATION
          </text>
      </g>
    </svg>
    </div>
  );
};

export default Logo; 