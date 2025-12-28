import React from 'react';

interface ParallaxBackgroundProps {
  scrollProgress: number;
  currentLevel: number;
}

const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({ scrollProgress, currentLevel }) => {
  // Calculate layer offsets based on scroll
  const slowOffset = scrollProgress * 100;
  const mediumOffset = scrollProgress * 200;
  const fastOffset = scrollProgress * 300;
  
  // Level-specific background colors
  const levelColors = [
    { from: 'hsl(222 47% 6%)', via: 'hsl(280 50% 10%)', to: 'hsl(222 47% 6%)' }, // Storm
    { from: 'hsl(222 47% 6%)', via: 'hsl(222 60% 8%)', to: 'hsl(222 47% 6%)' },  // Definition
    { from: 'hsl(222 47% 6%)', via: 'hsl(222 47% 8%)', to: 'hsl(222 60% 4%)' },  // Economic
    { from: 'hsl(222 47% 6%)', via: 'hsl(210 40% 96%)', to: 'hsl(222 47% 6%)' }, // Rights
    { from: 'hsl(222 47% 6%)', via: 'hsl(190 40% 8%)', to: 'hsl(222 47% 6%)' },  // Citizen
  ];
  
  const currentColors = levelColors[Math.min(currentLevel - 1, levelColors.length - 1)];
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div 
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: `linear-gradient(180deg, ${currentColors.from} 0%, ${currentColors.via} 50%, ${currentColors.to} 100%)`,
        }}
      />
      
      {/* Slow parallax layer - distant stars */}
      <div 
        className="absolute inset-0"
        style={{ transform: `translateY(${-slowOffset * 0.1}px)` }}
      >
        {[...Array(50)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute w-1 h-1 bg-foreground/20 rounded-full"
            style={{
              left: `${(i * 17) % 100}%`,
              top: `${(i * 23) % 200}%`,
            }}
          />
        ))}
      </div>
      
      {/* Medium parallax layer - grid lines */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{ 
          transform: `translateY(${-mediumOffset * 0.1}px)`,
          backgroundImage: `
            linear-gradient(to right, hsl(190 100% 50%) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(190 100% 50%) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />
      
      {/* Fast parallax layer - floating geometric shapes */}
      <div 
        className="absolute inset-0"
        style={{ transform: `translateY(${-fastOffset * 0.1}px)` }}
      >
        {[...Array(10)].map((_, i) => (
          <div
            key={`shape-${i}`}
            className="absolute border border-primary/10 rounded-lg"
            style={{
              left: `${(i * 13) % 90}%`,
              top: `${(i * 31) % 300}%`,
              width: `${40 + (i * 7) % 60}px`,
              height: `${40 + (i * 11) % 60}px`,
              transform: `rotate(${i * 15}deg)`,
            }}
          />
        ))}
      </div>
      
      {/* Horizontal gradient overlay for depth */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50"
      />
      
      {/* Scanline overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(190 100% 50% / 0.1) 2px, hsl(190 100% 50% / 0.1) 4px)',
        }}
      />
    </div>
  );
};

export default ParallaxBackground;
