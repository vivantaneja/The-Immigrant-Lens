import React from 'react';
import { Building2, TrendingUp, Heart, Briefcase, GraduationCap } from 'lucide-react';

interface EconomicRealityProps {
  progress: number;
  surveyData: {
    healthcareWorkforce: number;
    economicImpact: string;
    taxContribution: string;
    businessOwnership: number;
  };
}

const buildings = [
  { 
    height: 200, 
    width: 60, 
    x: 5,
    icon: Heart,
    stat: "Healthcare",
    getValue: (data: EconomicRealityProps['surveyData']) => `${data.healthcareWorkforce}%`,
    label: "of healthcare workforce"
  },
  { 
    height: 280, 
    width: 80, 
    x: 20,
    icon: TrendingUp,
    stat: "Economic Impact",
    getValue: (data: EconomicRealityProps['surveyData']) => data.economicImpact,
    label: "annual contribution"
  },
  { 
    height: 240, 
    width: 70, 
    x: 40,
    icon: Briefcase,
    stat: "Tax Revenue",
    getValue: (data: EconomicRealityProps['surveyData']) => data.taxContribution,
    label: "in taxes paid"
  },
  { 
    height: 180, 
    width: 55, 
    x: 60,
    icon: GraduationCap,
    stat: "Business Owners",
    getValue: (data: EconomicRealityProps['surveyData']) => `${data.businessOwnership}%`,
    label: "higher rate than natives"
  },
  { 
    height: 220, 
    width: 65, 
    x: 78,
    icon: Building2,
    stat: "Innovation",
    getValue: () => "40%",
    label: "of Fortune 500 founded by immigrants"
  },
];

const EconomicReality: React.FC<EconomicRealityProps> = ({ progress, surveyData }) => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* City Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background to-secondary/20" />
      
      {/* Stars/Particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 40}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
      
      {/* City Skyline */}
      <div className="absolute bottom-0 left-0 right-0 h-[70%]">
        {buildings.map((building, index) => {
          const buildingProgress = Math.max(0, Math.min(1, (progress - index * 0.12) * 2.5));
          const isActive = buildingProgress > 0.5;
          const Icon = building.icon;
          
          return (
            <div
              key={index}
              className="absolute bottom-0 transition-all duration-700"
              style={{
                left: `${building.x}%`,
                width: building.width,
              }}
            >
              {/* Building Structure */}
              <div
                className={`relative transition-all duration-1000 ${
                  isActive ? 'animate-building' : ''
                }`}
                style={{
                  height: building.height * buildingProgress,
                  background: isActive 
                    ? 'linear-gradient(180deg, hsl(190 100% 42% / 0.3) 0%, hsl(222 47% 14%) 100%)'
                    : 'linear-gradient(180deg, hsl(222 47% 20%) 0%, hsl(222 47% 10%) 100%)',
                  borderTop: isActive ? '2px solid hsl(190 100% 50%)' : '2px solid hsl(222 47% 25%)',
                  boxShadow: isActive ? '0 -20px 40px hsl(190 100% 50% / 0.2)' : 'none',
                }}
              >
                {/* Windows */}
                <div className="absolute inset-2 grid grid-cols-3 gap-1">
                  {[...Array(Math.floor(building.height / 20))].map((_, wi) => (
                    <div
                      key={wi}
                      className={`h-3 rounded-sm transition-colors duration-300 ${
                        isActive && Math.random() > 0.3 
                          ? 'bg-primary/40' 
                          : 'bg-muted/20'
                      }`}
                      style={{ animationDelay: `${wi * 0.1}s` }}
                    />
                  ))}
                </div>
                
                {/* Stat Overlay */}
                {isActive && buildingProgress > 0.8 && (
                  <div 
                    className="absolute -top-28 md:-top-32 left-1/2 -translate-x-1/2 w-40 md:w-48 bg-card/95 backdrop-blur-sm rounded-lg p-3 md:p-4 neon-border-blue z-10"
                    style={{
                      opacity: (buildingProgress - 0.8) * 5,
                      transform: `translateX(-50%) translateY(${(1 - (buildingProgress - 0.8) * 5) * 10}px)`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1 md:mb-2">
                      <Icon size={14} className="md:w-4 md:h-4 text-primary" />
                      <p className="font-mono text-[10px] md:text-xs text-muted-foreground">{building.stat}</p>
                    </div>
                    <p className="text-xl md:text-2xl font-display text-primary text-glow-blue font-bold">
                      {building.getValue(surveyData)}
                    </p>
                    <p className="text-[10px] md:text-xs text-muted-foreground mt-1">{building.label}</p>
                  </div>
                )}
              </div>
              
              {/* Building Base Glow */}
              {isActive && (
                <div 
                  className="absolute -bottom-2 left-0 right-0 h-4 bg-primary/20 blur-lg"
                />
              )}
            </div>
          );
        })}
        
        {/* Ground Line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      </div>
      
      {/* Level Label */}
      <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 z-20 max-w-[calc(100%-2rem)] md:max-w-md">
        <p className="font-mono text-xs text-muted-foreground mb-1">LEVEL 03</p>
        <h2 className="font-display text-lg md:text-2xl text-foreground text-glow-blue">THE ECONOMIC REALITY</h2>
        <p className="text-xs md:text-sm text-muted-foreground mt-1 md:mt-2">
          Explore the city and discover the economic contributions of migrants
        </p>
      </div>
    </div>
  );
};

export default EconomicReality;
