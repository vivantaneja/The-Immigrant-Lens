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
                    className="absolute -top-32 left-1/2 -translate-x-1/2 w-48 bg-card/95 backdrop-blur-sm rounded-lg p-4 neon-border-blue z-10"
                    style={{
                      opacity: (buildingProgress - 0.8) * 5,
                      transform: `translateX(-50%) translateY(${(1 - (buildingProgress - 0.8) * 5) * 10}px)`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={16} className="text-primary" />
                      <p className="font-mono text-xs text-muted-foreground">{building.stat}</p>
                    </div>
                    <p className="text-2xl font-display text-primary text-glow-blue font-bold">
                      {building.getValue(surveyData)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{building.label}</p>
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
      
      {/* Animated Bar Chart Overlay */}
      <div 
        className="absolute top-8 right-8 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-6 w-80"
        style={{ opacity: Math.min(1, progress * 1.5) }}
      >
        <p className="font-mono text-xs text-muted-foreground mb-4">CONTRIBUTION METRICS</p>
        
        {[
          { label: "GDP Growth", value: 75, delay: 0 },
          { label: "Job Creation", value: 65, delay: 0.2 },
          { label: "Innovation Index", value: 85, delay: 0.4 },
          { label: "Tax Revenue", value: 70, delay: 0.6 },
        ].map((metric, i) => (
          <div key={i} className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">{metric.label}</span>
              <span className="text-primary font-mono">{metric.value}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${Math.min(metric.value, progress * 100 * (1 + metric.delay))}%`,
                  boxShadow: '0 0 10px hsl(190 100% 50% / 0.5)',
                }}
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Level Label */}
      <div className="absolute bottom-8 left-8 z-20">
        <p className="font-mono text-xs text-muted-foreground mb-1">LEVEL 03</p>
        <h2 className="font-display text-2xl text-foreground text-glow-blue">THE ECONOMIC REALITY</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">
          Explore the city and discover the economic contributions of migrants
        </p>
      </div>
    </div>
  );
};

export default EconomicReality;
