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

  return (
    <div className={`flex items-center ${className}`} style={{ width: finalWidth, height: finalHeight }}>
      <img 
        src="/logo512.png" 
        alt="AlfaTechX Logo" 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'contain' 
        }}
      />
    </div>
  );
};

export default Logo; 