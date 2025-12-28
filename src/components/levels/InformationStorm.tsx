import React from 'react';
import { Twitter, Facebook, Instagram, Youtube, MessageCircle, Radio } from 'lucide-react';

interface FloatingIconProps {
  delay: number;
  x: number;
  y: number;
  icon: 'twitter' | 'facebook' | 'instagram' | 'youtube' | 'message' | 'radio';
  isMyth?: boolean;
}

const FloatingIcon: React.FC<FloatingIconProps> = ({ delay, x, y, icon, isMyth = false }) => {
  const icons = {
    twitter: Twitter,
    facebook: Facebook,
    instagram: Instagram,
    youtube: Youtube,
    message: MessageCircle,
    radio: Radio,
  };
  
  const Icon = icons[icon];
  
  return (
    <div 
      className={`absolute animate-storm-drift opacity-60 ${isMyth ? 'text-neon-red' : 'text-muted-foreground'}`}
      style={{ 
        left: `${x}%`, 
        top: `${y}%`,
        animationDelay: `${delay}s`,
      }}
    >
      <Icon size={24} className={isMyth ? 'drop-shadow-[0_0_8px_hsl(348,100%,61%,0.6)]' : ''} />
    </div>
  );
};

interface InformationStormProps {
  progress: number;
  surveyData: {
    socialMediaReliance: number;
  };
}

const headlines = [
  { text: "MIGRANTS TAKING JOBS", isMyth: true },
  { text: "BORDER CRISIS WORSENS", isMyth: true },
  { text: "ECONOMIC BURDEN?", isMyth: true },
  { text: "CRIME RATES LINKED TO...", isMyth: true },
  { text: "EXPERTS DISAGREE", isMyth: false },
  { text: "NEW STUDY REVEALS...", isMyth: false },
];

const InformationStorm: React.FC<InformationStormProps> = ({ progress, surveyData }) => {
  const stormOpacity = Math.max(0, 1 - progress * 2);
  const beaconOpacity = Math.min(1, progress * 2);
  const beaconScale = 0.5 + progress * 0.5;
  
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Storm Background Gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-background via-purple-950/20 to-background"
        style={{ opacity: stormOpacity }}
      />
      
      {/* Floating Social Media Icons */}
      <div style={{ opacity: stormOpacity }} className="transition-opacity duration-500">
        <FloatingIcon delay={0} x={10} y={20} icon="twitter" />
        <FloatingIcon delay={0.5} x={25} y={40} icon="facebook" isMyth />
        <FloatingIcon delay={1} x={40} y={15} icon="instagram" />
        <FloatingIcon delay={1.5} x={55} y={50} icon="youtube" isMyth />
        <FloatingIcon delay={2} x={70} y={25} icon="message" />
        <FloatingIcon delay={2.5} x={85} y={45} icon="radio" isMyth />
        <FloatingIcon delay={0.3} x={15} y={60} icon="youtube" />
        <FloatingIcon delay={0.8} x={35} y={70} icon="twitter" isMyth />
        <FloatingIcon delay={1.3} x={60} y={65} icon="facebook" />
        <FloatingIcon delay={1.8} x={80} y={35} icon="instagram" isMyth />
      </div>
      
      {/* Floating Headlines */}
      <div style={{ opacity: stormOpacity }} className="transition-opacity duration-500">
        {headlines.map((headline, index) => (
          <div
            key={index}
            className={`absolute font-mono text-xs px-3 py-1 rounded border animate-float ${
              headline.isMyth 
                ? 'bg-destructive/10 border-destructive/30 text-destructive' 
                : 'bg-secondary/50 border-border text-muted-foreground'
            }`}
            style={{
              left: `${10 + (index * 15) % 70}%`,
              top: `${15 + (index * 20) % 60}%`,
              animationDelay: `${index * 0.7}s`,
              transform: `rotate(${(index % 2 === 0 ? 1 : -1) * (index * 3)}deg)`,
            }}
          >
            {headline.text}
          </div>
        ))}
      </div>
      
      {/* Survey Stat Card */}
      <div 
        className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 z-10"
        style={{ 
          opacity: stormOpacity > 0.5 ? 1 : stormOpacity * 2,
          transform: `translate(-50%, -50%) scale(${0.8 + stormOpacity * 0.2})`,
        }}
      >
        <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-6 max-w-md neon-border-red">
          <p className="text-sm text-muted-foreground mb-2 font-mono">SURVEY FINDING</p>
          <p className="text-2xl font-display text-foreground">
            <span className="text-destructive text-glow-red text-4xl font-bold">
              {surveyData.socialMediaReliance}%
            </span>
          </p>
          <p className="text-lg text-foreground mt-2">
            of people rely on social media for migration news
          </p>
        </div>
      </div>
      
      {/* Beacon of Truth */}
      <div 
        className="absolute right-[15%] top-1/2 -translate-y-1/2"
        style={{ 
          opacity: beaconOpacity,
          transform: `translateY(-50%) scale(${beaconScale})`,
        }}
      >
        <div className="relative">
          {/* Beacon Glow */}
          <div className="absolute inset-0 w-32 h-32 rounded-full bg-primary/20 animate-beacon blur-xl" />
          
          {/* Beacon Core */}
          <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center animate-beacon neon-border-blue">
            <div className="text-center">
              <div className="font-display text-primary-foreground text-sm font-bold">TRUTH</div>
              <div className="font-display text-primary-foreground text-xs">BEACON</div>
            </div>
          </div>
          
          {/* Light Rays */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-1 h-24 bg-gradient-to-t from-primary/40 to-transparent"
              style={{
                transform: `translate(-50%, -100%) rotate(${i * 45}deg)`,
                transformOrigin: 'bottom center',
                opacity: beaconOpacity * 0.6,
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Level Label */}
      <div className="absolute bottom-8 left-8 z-20">
        <p className="font-mono text-xs text-muted-foreground mb-1">LEVEL 01</p>
        <h2 className="font-display text-2xl text-foreground text-glow-blue">THE INFORMATION STORM</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">
          Navigate through the chaos of misinformation to find the beacon of truth
        </p>
      </div>
    </div>
  );
};

export default InformationStorm;
