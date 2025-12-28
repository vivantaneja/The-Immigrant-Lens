import React, { useState } from 'react';
import { Download, Share2, CheckCircle, Sparkles, FileText, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface InformedCitizenProps {
  progress: number;
  surveyData: {
    socialMediaReliance: number;
    knowledgeGap: number;
    healthcareWorkforce: number;
    economicImpact: string;
  };
}

const InformedCitizen: React.FC<InformedCitizenProps> = ({ progress, surveyData }) => {
  const [pledged, setPledged] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number }>>([]);
  
  const factsDiscovered = [
    { icon: Sparkles, text: `${surveyData.socialMediaReliance}% rely on social media for migration news`, category: "Media Literacy" },
    { icon: FileText, text: "Legal distinctions between Migrant, Refugee, and Asylum Seeker", category: "Definitions" },
    { icon: CheckCircle, text: `Migrants contribute ${surveyData.economicImpact} to the economy`, category: "Economics" },
    { icon: Heart, text: "Article 14: The right to seek asylum is universal", category: "Human Rights" },
  ];
  
  const handlePledge = () => {
    setPledged(true);
    
    // Create upload particles animation
    const newParticles = [...Array(20)].map((_, i) => ({
      id: Date.now() + i,
      x: 30 + Math.random() * 40,
      delay: Math.random() * 0.5,
    }));
    setParticles(newParticles);
    
    toast({
      title: "Thank you for your pledge!",
      description: "Together, we can combat misinformation about migration.",
    });
    
    setTimeout(() => setParticles([]), 2000);
  };
  
  const handleDownload = () => {
    toast({
      title: "Fact Sheet Ready",
      description: "Your fact sheet is being prepared for download.",
    });
  };
  
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
      
      {/* Upload Particles Animation */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 bg-primary rounded-full"
          style={{
            left: `${particle.x}%`,
            bottom: '30%',
            animation: `upload-particles 1s ease-out forwards`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
      
      {/* Scoreboard */}
      <div 
        className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-4xl px-8"
        style={{ 
          opacity: Math.min(1, progress * 2),
          transform: `translateX(-50%) translateY(${(1 - Math.min(1, progress * 2)) * 30}px)`,
        }}
      >
        <div className="text-center mb-8">
          <p className="font-mono text-sm text-primary mb-2">JOURNEY COMPLETE</p>
          <h2 className="font-display text-4xl text-foreground text-glow-blue">
            YOU ARE NOW INFORMED
          </h2>
        </div>
        
        {/* Facts Summary Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
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
        
        {/* Action Buttons */}
        <div 
          className="flex justify-center gap-6"
          style={{ opacity: progress > 0.6 ? 1 : 0 }}
        >
          <Button
            onClick={handleDownload}
            className="bg-secondary hover:bg-secondary/80 text-foreground gap-2 px-6 py-6 text-lg"
          >
            <Download size={20} />
            Download Fact-Sheet
          </Button>
          
          <Button
            onClick={handlePledge}
            disabled={pledged}
            className={`gap-2 px-6 py-6 text-lg transition-all duration-500 ${
              pledged 
                ? 'bg-primary/50 text-primary-foreground' 
                : 'bg-primary hover:bg-primary/90 text-primary-foreground box-glow-blue'
            }`}
          >
            {pledged ? (
              <>
                <CheckCircle size={20} />
                Pledge Recorded
              </>
            ) : (
              <>
                <Share2 size={20} />
                Pledge to Share Truth
              </>
            )}
          </Button>
        </div>
        
        {/* Pledge Success Message */}
        {pledged && (
          <div className="mt-8 text-center animate-fade-in">
            <div className="inline-block bg-primary/10 rounded-lg px-6 py-4 neon-border-blue">
              <p className="text-primary font-display text-lg">
                🌍 Thank you for joining the movement against misinformation
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Share what you've learned with others
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Level Label */}
      <div className="absolute bottom-8 left-8 z-20">
        <p className="font-mono text-xs text-muted-foreground mb-1">LEVEL 05</p>
        <h2 className="font-display text-2xl text-foreground text-glow-blue">THE INFORMED CITIZEN</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">
          Review your discoveries and pledge to share verified information
        </p>
      </div>
    </div>
  );
};

export default InformedCitizen;
