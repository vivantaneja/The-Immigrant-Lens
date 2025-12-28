import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import WalkingCharacter from '@/components/WalkingCharacter';
import ParallaxBackground from '@/components/ParallaxBackground';
import ProgressIndicator from '@/components/ProgressIndicator';
import InformationStorm from '@/components/levels/InformationStorm';
import DefinitionZone from '@/components/levels/DefinitionZone';
import EconomicReality from '@/components/levels/EconomicReality';
import HumanRightsLab from '@/components/levels/HumanRightsLab';
import InformedCitizen from '@/components/levels/InformedCitizen';
import { ChevronDown, Mouse } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Survey data - Replace with your actual data
const surveyData = {
  socialMediaReliance: 73,
  knowledgeGap: 68,
  healthcareWorkforce: 18,
  economicImpact: "€12.6B",
  taxContribution: "€4.2B",
  businessOwnership: 23,
};

const LEVEL_COUNT = 5;
const LEVEL_HEIGHT = 100; // vh per level

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [levelProgress, setLevelProgress] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isWalking, setIsWalking] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Main scroll trigger for the entire experience
    const mainTrigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        setScrollProgress(progress);
        
        // Calculate current level and progress within level
        const totalLevels = LEVEL_COUNT;
        const levelIndex = Math.min(Math.floor(progress * totalLevels), totalLevels - 1);
        const withinLevelProgress = (progress * totalLevels) - levelIndex;
        
        setCurrentLevel(levelIndex + 1);
        setLevelProgress(withinLevelProgress);
        
        // Check if user is actively scrolling
        setIsWalking(self.isActive && self.direction !== 0);
        
        // Hide scroll hint after first scroll
        if (progress > 0.02) {
          setShowScrollHint(false);
        }
      },
    });
    
    // Character animation - walks across each section
    if (characterRef.current) {
      gsap.to(characterRef.current, {
        x: () => window.innerWidth * 0.6,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      });
    }
    
    return () => {
      mainTrigger.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);
  
  // Stop walking animation after scroll stops
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsWalking(false);
    }, 150);
    
    return () => clearTimeout(timeout);
  }, [scrollProgress]);
  
  return (
    <div 
      ref={containerRef}
      className="relative w-full"
      style={{ height: `${LEVEL_COUNT * LEVEL_HEIGHT}vh` }}
    >
      {/* Parallax Background */}
      <ParallaxBackground scrollProgress={scrollProgress} currentLevel={currentLevel} />
      
      {/* Progress Indicator */}
      <ProgressIndicator currentLevel={currentLevel} progress={levelProgress} />
      
      {/* Walking Character - Fixed position */}
      <div 
        ref={characterRef}
        className="fixed bottom-[15%] left-[10%] z-40"
      >
        <WalkingCharacter isWalking={isWalking} />
      </div>
      
      {/* Ground Line */}
      <div className="fixed bottom-[12%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent z-30" />
      
      {/* Scroll Hint */}
      {showScrollHint && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Mouse size={24} className="text-primary" />
            <ChevronDown size={20} className="text-primary animate-pulse" />
            <span className="font-mono text-xs">SCROLL TO EXPLORE</span>
          </div>
        </div>
      )}
      
      {/* Level Sections */}
      <div className="relative z-20">
        {/* Level 1: Information Storm */}
        <section 
          className="h-screen w-full sticky top-0"
          style={{ 
            opacity: currentLevel === 1 ? 1 : Math.max(0, 1 - (currentLevel - 1) * 2),
            pointerEvents: currentLevel === 1 ? 'auto' : 'none',
          }}
        >
          <InformationStorm 
            progress={currentLevel === 1 ? levelProgress : currentLevel > 1 ? 1 : 0} 
            surveyData={surveyData}
          />
        </section>
        
        {/* Level 2: Definition Zone */}
        <section 
          className="h-screen w-full sticky top-0"
          style={{ 
            opacity: currentLevel === 2 ? 1 : currentLevel === 1 ? levelProgress : Math.max(0, 1 - (currentLevel - 2) * 2),
            pointerEvents: currentLevel === 2 ? 'auto' : 'none',
          }}
        >
          <DefinitionZone 
            progress={currentLevel === 2 ? levelProgress : currentLevel > 2 ? 1 : 0} 
            surveyData={surveyData}
          />
        </section>
        
        {/* Level 3: Economic Reality */}
        <section 
          className="h-screen w-full sticky top-0"
          style={{ 
            opacity: currentLevel === 3 ? 1 : currentLevel === 2 ? levelProgress : Math.max(0, 1 - (currentLevel - 3) * 2),
            pointerEvents: currentLevel === 3 ? 'auto' : 'none',
          }}
        >
          <EconomicReality 
            progress={currentLevel === 3 ? levelProgress : currentLevel > 3 ? 1 : 0} 
            surveyData={surveyData}
          />
        </section>
        
        {/* Level 4: Human Rights Lab */}
        <section 
          className="h-screen w-full sticky top-0"
          style={{ 
            opacity: currentLevel === 4 ? 1 : currentLevel === 3 ? levelProgress : Math.max(0, 1 - (currentLevel - 4) * 2),
            pointerEvents: currentLevel === 4 ? 'auto' : 'none',
          }}
        >
          <HumanRightsLab 
            progress={currentLevel === 4 ? levelProgress : currentLevel > 4 ? 1 : 0} 
          />
        </section>
        
        {/* Level 5: Informed Citizen */}
        <section 
          className="h-screen w-full sticky top-0"
          style={{ 
            opacity: currentLevel === 5 ? 1 : currentLevel === 4 ? levelProgress : 0,
            pointerEvents: currentLevel === 5 ? 'auto' : 'none',
          }}
        >
          <InformedCitizen 
            progress={currentLevel === 5 ? levelProgress : 0} 
            surveyData={surveyData}
          />
        </section>
      </div>
      
      {/* Title Overlay - Only visible at start */}
      <div 
        className="fixed top-1/4 left-1/2 -translate-x-1/2 z-30 text-center transition-opacity duration-500"
        style={{ opacity: scrollProgress < 0.05 ? 1 : 0, pointerEvents: 'none' }}
      >
        <h1 className="font-display text-5xl md:text-7xl text-foreground text-glow-blue mb-4">
          THE IMMIGRANT LENS
        </h1>
        <p className="font-mono text-sm text-primary tracking-widest">
          A FACT-FINDING JOURNEY
        </p>
      </div>
    </div>
  );
};

export default Index;
