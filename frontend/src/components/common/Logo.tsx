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
  // Size presets - MUCH LARGER now
  const sizeMap = {
    xs: { width: 120, height: 120 },
    sm: { width: 150, height: 150 },
    md: { width: 200, height: 200 },
    lg: { width: 250, height: 250 },
    xl: { width: 300, height: 300 }
  };

  const finalWidth = width || sizeMap[size].width;
  const finalHeight = height || sizeMap[size].height;

  return (
    <div 
      className={`flex items-center justify-center ${className}`} 
      style={{ 
        width: finalWidth, 
        height: finalHeight,
        padding: '12px',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,248,255,0.95) 100%)',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(91, 180, 229, 0.25), 0 2px 8px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = '0 6px 30px rgba(91, 180, 229, 0.4), 0 4px 12px rgba(0, 0, 0, 0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(91, 180, 229, 0.25), 0 2px 8px rgba(0, 0, 0, 0.08)';
      }}
    >
      <img 
        src="/logo512.png" 
        alt="AlfaTechX - AI Innovation" 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'contain',
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
        }}
      />
    </div>
  );
};

export default Logo; 