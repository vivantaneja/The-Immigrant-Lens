import React, { useState } from 'react';
import { CheckCircle, Sparkles, FileText, Heart } from 'lucide-react';

// Helper function to get ordinal suffix (1st, 2nd, 3rd, etc.)
const getOrdinalSuffix = (n: number): string => {
  const j = n % 10;
  const k = n % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
};

interface InformedCitizenProps {
  progress: number;
  surveyData: {
    socialMediaReliance: number;
    knowledgeGap: number;
    healthcareWorkforce: number;
    economicImpact: string;
  };
  visitCount: number;
  userVisitNumber: number;
}

const InformedCitizen: React.FC<InformedCitizenProps> = ({ progress, surveyData, visitCount, userVisitNumber }) => {
  const factsDiscovered = [
    { icon: Sparkles, text: `${surveyData.socialMediaReliance}% rely on social media for migration news`, category: "Media Literacy" },
    { icon: FileText, text: "Legal distinctions between Migrant, Refugee, and Asylum Seeker", category: "Definitions" },
    { icon: CheckCircle, text: `Migrants contribute ${surveyData.economicImpact} to the economy`, category: "Economics" },
    { icon: Heart, text: "Article 14: The right to seek asylum is universal", category: "Human Rights" },
  ];
  
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Celebratory Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background"
          style={{ opacity: progress }}
        />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full animate-float"
            style={{
              left: `${5 + (i * 5) % 90}%`,
              top: `${10 + (i * 7) % 60}%`,
              animationDelay: `${i * 0.3}s`,
              opacity: progress,
            }}
          />
        ))}
      </div>
      
      {/* Scoreboard */}
      <div 
        className="absolute top-8 md:top-12 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 md:px-8 overflow-y-auto max-h-[90vh] pb-20"
        style={{ 
          opacity: Math.min(1, progress * 2),
          transform: `translateX(-50%) translateY(${(1 - Math.min(1, progress * 2)) * 30}px)`,
        }}
      >
        <div className="text-center mb-4 md:mb-8">
          <p className="font-mono text-xs md:text-sm text-primary mb-1 md:mb-2">JOURNEY COMPLETE</p>
          <h2 className="font-display text-2xl md:text-4xl text-foreground text-glow-blue">
            YOU ARE NOW INFORMED
          </h2>
        </div>
        
        {/* Facts Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-8">
          {factsDiscovered.map((fact, index) => {
            const Icon = fact.icon;
            return (
              <div
                key={index}
                className="bg-card/90 backdrop-blur-sm rounded-lg p-4 border border-border hover:neon-border-blue transition-all duration-300"
                style={{
                  opacity: Math.min(1, (progress - 0.2 - index * 0.1) * 5),
                  transform: `translateY(${Math.max(0, (1 - (progress - 0.2 - index * 0.1) * 5)) * 20}px)`,
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-primary/10">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-mono text-xs text-primary mb-1">{fact.category}</p>
                    <p className="text-sm text-foreground">{fact.text}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Visit Counter */}
        <div 
          className="flex flex-col sm:flex-row justify-center gap-3 md:gap-6"
          style={{ opacity: progress > 0.6 ? 1 : 0 }}
        >
          <div className="inline-block bg-card/90 backdrop-blur-sm rounded-lg px-4 md:px-6 py-3 md:py-4 border border-border max-w-full mx-4">
            <p className="font-display text-lg md:text-2xl text-foreground text-glow-blue mb-1 md:mb-2">
              You are the {userVisitNumber.toLocaleString()}{getOrdinalSuffix(userVisitNumber)} visitor!
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">
              Share to reach more
            </p>
          </div>
        </div>
      </div>
      
      {/* Level Label */}
      <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 z-20 max-w-[calc(100%-2rem)] md:max-w-md">
        <p className="font-mono text-xs text-muted-foreground mb-1">LEVEL 05</p>
        <h2 className="font-display text-lg md:text-2xl text-foreground text-glow-blue">THE INFORMED CITIZEN</h2>
        <p className="text-xs md:text-sm text-muted-foreground mt-1 md:mt-2">
          Review your discoveries and pledge to share verified information
        </p>
      </div>
    </div>
  );
};

export default InformedCitizen;
