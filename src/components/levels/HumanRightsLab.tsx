import React, { useState, useEffect } from 'react';
import { Scale, BookOpen, CheckCircle, XCircle } from 'lucide-react';

interface HumanRightsLabProps {
  progress: number;
}

const mythsAndFacts = [
  {
    myth: "Migrants don't pay taxes",
    fact: "Migrants contribute billions in taxes annually, often without accessing benefits",
  },
  {
    myth: "They take jobs from citizens",
    fact: "Studies show migrants often fill labor gaps and create new jobs through entrepreneurship",
  },
  {
    myth: "Most migrants are undocumented",
    fact: "The vast majority of migrants hold legal status in their host countries",
  },
  {
    myth: "Refugees choose wealthy countries",
    fact: "85% of refugees are hosted by developing countries neighboring their homeland",
  },
];

const HumanRightsLab: React.FC<HumanRightsLabProps> = ({ progress }) => {
  const [activeMyth, setActiveMyth] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);
  
  useEffect(() => {
    if (progress > 0.3) {
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            setActiveMyth(am => (am + 1) % mythsAndFacts.length);
            return 0;
          }
          return prev + 2;
        });
      }, 50);
      
      return () => clearInterval(interval);
    }
  }, [progress]);
  
  const isScanning = scanProgress > 0 && scanProgress < 100;
  const showFact = scanProgress >= 100 || (scanProgress === 0 && progress > 0.5);
  
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Light/Clean Background for contrast */}
      <div 
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: `linear-gradient(180deg, 
            hsl(210 40% 98% / ${progress * 0.95}) 0%, 
            hsl(210 40% 96% / ${progress * 0.9}) 50%,
            hsl(222 47% 6%) 100%
          )`,
        }}
      />
      
      {/* Article 14 Display */}
      <div 
        className="absolute top-12 left-1/2 -translate-x-1/2 text-center max-w-3xl px-8"
        style={{ 
          opacity: Math.min(1, progress * 2),
          transform: `translateX(-50%) translateY(${(1 - Math.min(1, progress * 2)) * 20}px)`,
        }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Scale size={28} className="text-primary" />
          <p className="font-mono text-sm text-primary">UNIVERSAL DECLARATION OF HUMAN RIGHTS</p>
          <BookOpen size={28} className="text-primary" />
        </div>
        
        <div className="bg-card/95 backdrop-blur-sm rounded-lg p-8 neon-border-blue">
          <h3 className="font-display text-xl text-primary mb-4">ARTICLE 14</h3>
          <blockquote className="text-lg text-foreground leading-relaxed italic">
            "Everyone has the right to seek and to enjoy in other countries asylum from persecution."
          </blockquote>
          <p className="text-sm text-muted-foreground mt-4">
            — United Nations, 1948
          </p>
        </div>
      </div>
      
      {/* Perspective Slider - Myth to Fact */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl px-8"
        style={{ 
          opacity: progress > 0.3 ? 1 : 0,
          transform: `translate(-50%, -50%) scale(${0.9 + Math.min(0.1, (progress - 0.3) * 0.5)})`,
        }}
      >
        <div className="relative bg-card/95 backdrop-blur-sm rounded-xl overflow-hidden border border-border">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <XCircle size={18} className="text-destructive" />
              <span className="font-mono text-xs text-destructive">MYTH</span>
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              PERSPECTIVE SCANNER
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-primary">FACT</span>
              <CheckCircle size={18} className="text-primary" />
            </div>
          </div>
          
          {/* Content Area */}
          <div className="relative p-8 min-h-[200px]">
            {/* Myth Layer */}
            <div 
              className="absolute inset-8 flex items-center justify-center transition-opacity duration-300"
              style={{ opacity: showFact ? 0 : 1 }}
            >
              <div className="text-center">
                <p className="text-2xl font-display text-destructive text-glow-red">
                  "{mythsAndFacts[activeMyth].myth}"
                </p>
                <p className="text-xs text-muted-foreground mt-4 font-mono">COMMON MISCONCEPTION</p>
              </div>
            </div>
            
            {/* Scan Line Effect */}
            {isScanning && (
              <div 
                className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden"
              >
                <div 
                  className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
                  style={{ 
                    top: `${scanProgress}%`,
                    boxShadow: '0 0 20px hsl(190 100% 50% / 0.8), 0 0 40px hsl(190 100% 50% / 0.4)',
                  }}
                />
                {/* Scan glow area */}
                <div 
                  className="absolute top-0 left-0 w-full bg-primary/10"
                  style={{ height: `${scanProgress}%` }}
                />
              </div>
            )}
            
            {/* Fact Layer */}
            <div 
              className="absolute inset-8 flex items-center justify-center transition-opacity duration-500"
              style={{ opacity: showFact ? 1 : 0 }}
            >
              <div className="text-center">
                <p className="text-2xl font-display text-primary text-glow-blue">
                  "{mythsAndFacts[activeMyth].fact}"
                </p>
                <p className="text-xs text-primary mt-4 font-mono flex items-center justify-center gap-2">
                  <CheckCircle size={14} />
                  VERIFIED FACT
                </p>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="p-4 border-t border-border">
            <div className="h-1 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-destructive via-neon-purple to-primary transition-all duration-100"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-muted-foreground font-mono">
                {scanProgress < 100 ? 'SCANNING...' : 'VERIFIED'}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                {activeMyth + 1}/{mythsAndFacts.length}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Level Label */}
      <div className="absolute bottom-8 left-8 z-20">
        <p className="font-mono text-xs text-muted-foreground mb-1">LEVEL 04</p>
        <h2 className="font-display text-2xl text-foreground text-glow-blue">THE HUMAN RIGHTS LAB</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">
          Transform myths into verified facts with the perspective scanner
        </p>
      </div>
    </div>
  );
};

export default HumanRightsLab;
