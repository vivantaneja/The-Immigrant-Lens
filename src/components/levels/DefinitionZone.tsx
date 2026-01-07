import React from 'react';
import { Monitor, Users, Shield, Globe } from 'lucide-react';

interface DefinitionZoneProps {
  progress: number;
  surveyData: {
    knowledgeGap: number;
  };
}

const definitions = [
  {
    term: "MIGRANT",
    icon: Globe,
    definition: "A person who moves from one place to another, especially to find work or better living conditions.",
    legalNote: "Voluntary movement, not fleeing persecution",
    color: "primary",
  },
  {
    term: "REFUGEE",
    icon: Shield,
    definition: "A person who has been forced to leave their country to escape war, persecution, or natural disaster.",
    legalNote: "Protected under the 1951 Refugee Convention",
    color: "neon-blue",
  },
  {
    term: "ASYLUM SEEKER",
    icon: Users,
    definition: "A person who has left their country and is seeking protection but whose claim for refugee status has not yet been determined.",
    legalNote: "Right to seek asylum is protected under international law",
    color: "neon-purple",
  },
];

const DefinitionZone: React.FC<DefinitionZoneProps> = ({ progress, surveyData }) => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Tech Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(190 100% 50% / 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(190 100% 50% / 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>
      
      {/* Data Terminals */}
      <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 px-4 md:px-16 overflow-y-auto py-20 md:py-0">
        {definitions.map((def, index) => {
          const terminalProgress = Math.max(0, Math.min(1, (progress - index * 0.25) * 2));
          const isActive = terminalProgress > 0.3;
          const Icon = def.icon;
          
          return (
            <div
              key={def.term}
              className={`relative bg-card/80 backdrop-blur-sm rounded-lg p-4 md:p-6 w-full max-w-sm md:w-80 transition-all duration-700 ${
                isActive ? 'neon-border-blue' : 'border border-border/50'
              }`}
              style={{
                opacity: 0.3 + terminalProgress * 0.7,
                transform: `translateY(${(1 - terminalProgress) * 30}px)`,
              }}
            >
              {/* Terminal Header */}
              <div className={`flex items-center gap-3 mb-4 pb-3 border-b ${
                isActive ? 'border-primary/50' : 'border-border/30'
              }`}>
                <div className={`p-2 rounded ${isActive ? 'bg-primary/20' : 'bg-secondary'}`}>
                  <Icon 
                    size={24} 
                    className={isActive ? 'text-primary' : 'text-muted-foreground'} 
                  />
                </div>
                <div>
                  <p className="font-mono text-xs text-muted-foreground">TERMINAL {String(index + 1).padStart(2, '0')}</p>
                  <h3 className={`font-display text-lg ${
                    isActive ? 'text-primary text-glow-blue' : 'text-foreground'
                  }`}>
                    {def.term}
                  </h3>
                </div>
                
                {/* Status Indicator */}
                <div className={`ml-auto w-3 h-3 rounded-full ${
                  isActive ? 'bg-primary animate-pulse' : 'bg-muted-foreground/30'
                }`} />
              </div>
              
              {/* Definition */}
              <p className={`text-sm leading-relaxed mb-4 transition-colors duration-500 ${
                isActive ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {def.definition}
              </p>
              
              {/* Legal Note */}
              <div className={`p-3 rounded text-xs font-mono ${
                isActive ? 'bg-primary/10 text-primary' : 'bg-secondary/50 text-muted-foreground'
              }`}>
                <Monitor size={12} className="inline mr-2" />
                {def.legalNote}
              </div>
              
              {/* Scan Lines Effect */}
              {isActive && (
                <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none scanline opacity-30" />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Knowledge Gap Stat */}
      <div 
        className="absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 w-full px-4"
        style={{ opacity: Math.min(1, progress * 2) }}
      >
        <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-4 md:p-6 text-center max-w-md mx-auto">
          <p className="font-mono text-xs text-muted-foreground mb-2">COMPARISON DATA</p>
          <div className="flex items-center gap-4 md:gap-6 justify-center">
            <div>
              <p className="text-2xl md:text-3xl font-display text-destructive text-glow-red font-bold">
                {surveyData.knowledgeGap}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">Couldn't distinguish<br/>these terms</p>
            </div>
            <div className="w-px h-10 md:h-12 bg-border" />
            <div>
              <p className="text-2xl md:text-3xl font-display text-primary text-glow-blue font-bold">
                {100 - surveyData.knowledgeGap}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">Correctly identified<br/>differences</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Level Label */}
      <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 z-20 max-w-[calc(100%-2rem)] md:max-w-md">
        <p className="font-mono text-xs text-muted-foreground mb-1">LEVEL 02</p>
        <h2 className="font-display text-lg md:text-2xl text-foreground text-glow-blue">THE DEFINITION ZONE</h2>
        <p className="text-xs md:text-sm text-muted-foreground mt-1 md:mt-2">
          Access the data terminals to learn the legal distinctions between migration terms
        </p>
      </div>
    </div>
  );
};

export default DefinitionZone;
