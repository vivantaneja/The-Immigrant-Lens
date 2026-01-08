import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import WalkingCharacter from '@/components/WalkingCharacter';
import ParallaxBackground from '@/components/ParallaxBackground';
import InformationStorm from '@/components/levels/InformationStorm';
import DefinitionZone from '@/components/levels/DefinitionZone';
import EconomicReality from '@/components/levels/EconomicReality';
import HumanRightsLab from '@/components/levels/HumanRightsLab';
import InformedCitizen from '@/components/levels/InformedCitizen';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement[]>([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [isWalking, setIsWalking] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [visitCount, setVisitCount] = useState(0);
  const [userVisitNumber, setUserVisitNumber] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Visit counter - increments on each page load/refresh and shows live count
  useEffect(() => {
    const incrementVisit = async () => {
      // Fallback to localStorage for local development
      const useLocalStorage = () => {
        try {
          const stored = localStorage.getItem('visitCount');
          const currentCount = stored ? parseInt(stored, 10) : 0;
          if (isNaN(currentCount)) {
            localStorage.setItem('visitCount', '0');
            setVisitCount(0);
            setUserVisitNumber(0);
            return;
          }
          const newCount = currentCount + 1;
          localStorage.setItem('visitCount', newCount.toString());
          console.log('Visit count (localStorage):', currentCount, '->', newCount);
          setVisitCount(newCount);
          setUserVisitNumber(newCount);
        } catch (e) {
          console.error('localStorage error:', e);
          setVisitCount(0);
          setUserVisitNumber(0);
        }
      };

      try {
        // Add cache-busting timestamp to ensure fresh request on every refresh
        const timestamp = Date.now();
        const url = `/.netlify/functions/increment-visits?_t=${timestamp}`;
        
        console.log('Attempting to increment visit count via API...');
        
        // POST increments the count and returns the new value
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
          },
          cache: 'no-store',
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to increment visit count`);
        }
        
        const data = await response.json();
        const newCount = data.count ?? 0;
        
        console.log('Visit count incremented to:', newCount);
        
        // Update with the new incremented count
        setVisitCount(newCount);
        setUserVisitNumber(newCount);
      } catch (error) {
        console.warn('API call failed, using localStorage fallback:', error);
        
        // Fallback to localStorage for local dev
        useLocalStorage();
      }
    };
    
    // Increment on every page load/refresh
    incrementVisit();
  }, []);
  
  // Use ref to track current level for navigation callbacks
  const currentLevelRef = useRef(currentLevel);
  useEffect(() => {
    currentLevelRef.current = currentLevel;
  }, [currentLevel]);
  
  // Navigate to a specific slide with smooth transition
  const navigateToSlide = useCallback((targetLevel: number) => {
    if (isTransitioning || targetLevel < 1 || targetLevel > LEVEL_COUNT) return;
    
    const prevLevel = currentLevelRef.current;
    setIsTransitioning(true);
    setIsWalking(true);
    
    // Calculate character position based on slide
    const characterTargetX = (targetLevel / LEVEL_COUNT) * window.innerWidth * 0.6;
    
    // Animate character movement
    if (characterRef.current) {
      gsap.to(characterRef.current, {
        x: characterTargetX,
        duration: 0.8,
        ease: 'power2.inOut',
      });
    }
    
    // Animate slide transitions
    slidesRef.current.forEach((slide, index) => {
      if (slide) {
        const slideLevel = index + 1;
        if (slideLevel === targetLevel) {
          // Fade in target slide
          gsap.to(slide, {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.inOut',
            onComplete: () => {
              setIsTransitioning(false);
              setIsWalking(false);
            },
          });
        } else if (slideLevel === prevLevel) {
          // Fade out current slide
          gsap.to(slide, {
            opacity: 0,
            duration: 0.8,
            ease: 'power2.inOut',
          });
        }
      }
    });
    
    setCurrentLevel(targetLevel);
    
    // Hide hint after first navigation
    setShowHint((prev) => prev ? false : prev);
  }, [isTransitioning]);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) return;
      
      const level = currentLevelRef.current;
      
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (level < LEVEL_COUNT) {
          navigateToSlide(level + 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (level > 1) {
          navigateToSlide(level - 1);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTransitioning, navigateToSlide]);
  
  // Initialize character position and slide opacity
  useEffect(() => {
    if (characterRef.current) {
      const initialX = (1 / LEVEL_COUNT) * window.innerWidth * 0.6; // Start at level 1
      gsap.set(characterRef.current, { x: initialX });
    }
    
    // Initialize slide opacity - first slide visible, others hidden
    slidesRef.current.forEach((slide, index) => {
      if (slide) {
        gsap.set(slide, { opacity: index === 0 ? 1 : 0 });
      }
    });
  }, []);
  
  // Calculate scroll progress for parallax (based on current level)
  const scrollProgress = (currentLevel - 1) / (LEVEL_COUNT - 1);
  
  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden"
    >
      {/* Parallax Background */}
      <ParallaxBackground scrollProgress={scrollProgress} currentLevel={currentLevel} />
      
      {/* Walking Character - Fixed position */}
      <div 
        ref={characterRef}
        className="fixed bottom-[15%] left-[5%] md:left-[10%] z-40 scale-75 md:scale-100"
      >
        <WalkingCharacter isWalking={isWalking} />
      </div>
      
      {/* Ground Line */}
      <div className="fixed bottom-[12%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent z-30" />
      
      {/* Navigation Hint */}
      {showHint && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <div className="flex items-center gap-4">
              <ChevronLeft size={20} className="text-primary animate-pulse" />
              <span className="font-mono text-xs">USE ARROWS TO NAVIGATE</span>
              <ChevronRight size={20} className="text-primary animate-pulse" />
            </div>
          </div>
        </div>
      )}
      
      {/* Navigation Buttons */}
      <div className="fixed bottom-8 right-8 z-50 flex gap-2">
        <button
          onClick={() => navigateToSlide(currentLevel - 1)}
          disabled={currentLevel === 1 || isTransitioning}
          className="p-2 rounded-full bg-background/80 backdrop-blur-sm border border-primary/30 hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} className="text-primary" />
        </button>
        <button
          onClick={() => navigateToSlide(currentLevel + 1)}
          disabled={currentLevel === LEVEL_COUNT || isTransitioning}
          className="p-2 rounded-full bg-background/80 backdrop-blur-sm border border-primary/30 hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Next slide"
        >
          <ChevronRight size={20} className="text-primary" />
        </button>
      </div>
      
      {/* Level Sections - Stacked with absolute positioning */}
      <div className="relative z-20 w-full h-full">
        {/* Level 1: Information Storm */}
        <section 
          ref={(el) => { if (el) slidesRef.current[0] = el; }}
          className="absolute inset-0 w-full h-full"
          style={{ 
            opacity: currentLevel === 1 ? 1 : 0,
            pointerEvents: currentLevel === 1 ? 'auto' : 'none',
          }}
        >
          <InformationStorm 
            progress={currentLevel === 1 ? 1 : 0} 
            surveyData={surveyData}
          />
        </section>
        
        {/* Level 2: Definition Zone */}
        <section 
          ref={(el) => { if (el) slidesRef.current[1] = el; }}
          className="absolute inset-0 w-full h-full"
          style={{ 
            opacity: currentLevel === 2 ? 1 : 0,
            pointerEvents: currentLevel === 2 ? 'auto' : 'none',
          }}
        >
          <DefinitionZone 
            progress={currentLevel === 2 ? 1 : 0} 
            surveyData={surveyData}
          />
        </section>
        
        {/* Level 3: Economic Reality */}
        <section 
          ref={(el) => { if (el) slidesRef.current[2] = el; }}
          className="absolute inset-0 w-full h-full"
          style={{ 
            opacity: currentLevel === 3 ? 1 : 0,
            pointerEvents: currentLevel === 3 ? 'auto' : 'none',
          }}
        >
          <EconomicReality 
            progress={currentLevel === 3 ? 1 : 0} 
            surveyData={surveyData}
          />
        </section>
        
        {/* Level 4: Human Rights Lab */}
        <section 
          ref={(el) => { if (el) slidesRef.current[3] = el; }}
          className="absolute inset-0 w-full h-full"
          style={{ 
            opacity: currentLevel === 4 ? 1 : 0,
            pointerEvents: currentLevel === 4 ? 'auto' : 'none',
          }}
        >
          <HumanRightsLab 
            progress={currentLevel === 4 ? 1 : 0} 
          />
        </section>
        
        {/* Level 5: Informed Citizen */}
        <section 
          ref={(el) => { if (el) slidesRef.current[4] = el; }}
          className="absolute inset-0 w-full h-full"
          style={{ 
            opacity: currentLevel === 5 ? 1 : 0,
            pointerEvents: currentLevel === 5 ? 'auto' : 'none',
          }}
        >
          <InformedCitizen 
            progress={currentLevel === 5 ? 1 : 0} 
            surveyData={surveyData}
            visitCount={visitCount}
            userVisitNumber={userVisitNumber}
          />
        </section>
      </div>
      
      {/* Title Overlay - Only visible at start */}
      <div 
        className="fixed top-1/4 left-1/2 -translate-x-1/2 z-30 text-center transition-opacity duration-500 px-4"
        style={{ opacity: currentLevel === 1 && showHint ? 1 : 0, pointerEvents: 'none' }}
      >
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-foreground text-glow-blue mb-2 md:mb-4">
          THE IMMIGRANT LENS
        </h1>
        <p className="font-mono text-xs sm:text-sm text-primary tracking-widest">
          A FACT-FINDING JOURNEY
        </p>
      </div>
    </div>
  );
};

export default Index;
