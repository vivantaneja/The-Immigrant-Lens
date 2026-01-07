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
  const [visitCount, setVisitCount] = useState(0);
  const [userVisitNumber, setUserVisitNumber] = useState(0);
  
  // Visit counter - starts at 200, increments by 1 for each visitor
  useEffect(() => {
    // Clear old cached values that might be from the old system
    const clearOldCache = () => {
      const oldCount = localStorage.getItem('websiteVisits');
      const sessionCount = sessionStorage.getItem('userVisitNumber');
      
      // If count is suspiciously high (likely from old system where we added 200 each time), clear it
      // Reset if count is > 250 (more than 50 visitors seems unlikely for a fresh start)
      // This catches old cached values from the previous system
      if (oldCount) {
        const parsed = parseInt(oldCount, 10);
        if (parsed > 250 || parsed < 200) {
          localStorage.removeItem('websiteVisits');
        }
      }
      
      if (sessionCount) {
        const parsed = parseInt(sessionCount, 10);
        if (parsed > 250 || parsed < 200) {
          sessionStorage.removeItem('userVisitNumber');
          sessionStorage.removeItem('visitCountedThisSession');
        }
      }
    };
    
    clearOldCache();
    
    // Check if we've already incremented in this session
    const sessionKey = 'visitCountedThisSession';
    if (sessionStorage.getItem(sessionKey)) {
      // Already counted this session, just read the value
      const storedCount = sessionStorage.getItem('userVisitNumber');
      if (storedCount) {
        const count = parseInt(storedCount, 10);
        // Validate count is reasonable (200-250 range for now to catch old data)
        if (count >= 200 && count <= 250) {
          setUserVisitNumber(count);
          setVisitCount(count);
        } else {
          // Invalid count, clear and fetch fresh
          sessionStorage.removeItem(sessionKey);
          sessionStorage.removeItem('userVisitNumber');
          // Fetch from server
          fetch('/.netlify/functions/increment-visits')
            .then(res => res.json())
            .then(data => {
              // If server count is too high (old data), reset to 200
              const serverCount = (data.count >= 200 && data.count <= 250) ? data.count : 200;
              setVisitCount(serverCount);
              setUserVisitNumber(serverCount);
              sessionStorage.setItem('userVisitNumber', serverCount.toString());
            })
            .catch(() => {
              // Fallback: start at 200
              setVisitCount(200);
              setUserVisitNumber(200);
            });
        }
      } else {
        // Fetch current count from server
        fetch('/.netlify/functions/increment-visits')
          .then(res => res.json())
          .then(data => {
            // If server count is too high (old data), reset to 200
            const serverCount = (data.count >= 200 && data.count <= 250) ? data.count : 200;
            setVisitCount(serverCount);
            setUserVisitNumber(serverCount);
            sessionStorage.setItem('userVisitNumber', serverCount.toString());
          })
          .catch(() => {
            // Fallback: start at 200
            setVisitCount(200);
            setUserVisitNumber(200);
          });
      }
      return;
    }
    
    // First visit in this session - increment on server
    fetch('/.netlify/functions/increment-visits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        // If server count is too high (old data), reset to 200, otherwise use it
        let newCount = 200;
        if (data.count >= 200 && data.count <= 250) {
          newCount = data.count;
        }
        setVisitCount(newCount);
        setUserVisitNumber(newCount);
        sessionStorage.setItem(sessionKey, 'true');
        sessionStorage.setItem('userVisitNumber', newCount.toString());
        // Store count in localStorage for fallback
        localStorage.setItem('websiteVisits', newCount.toString());
      })
      .catch(() => {
        // Fallback if function not available (local development)
        const storedVisits = localStorage.getItem('websiteVisits');
        let currentCount = 200; // Start at 200
        if (storedVisits) {
          const parsed = parseInt(storedVisits, 10);
          // Only use if it's a valid count (200-250 range to catch old data)
          if (parsed >= 200 && parsed <= 250) {
            currentCount = parsed;
          }
        }
        const newCount = currentCount + 1;
        localStorage.setItem('websiteVisits', newCount.toString());
        sessionStorage.setItem(sessionKey, 'true');
        sessionStorage.setItem('userVisitNumber', newCount.toString());
        setVisitCount(newCount);
        setUserVisitNumber(newCount);
      });
  }, []);
  
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
        className="fixed bottom-[15%] left-[5%] md:left-[10%] z-40 scale-75 md:scale-100"
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
            opacity: currentLevel === 1 
              ? 1 
              : currentLevel === 2 
                ? Math.max(0, 1 - levelProgress * 1.5) // Slower fade-out when Level 2 appears
                : 0,
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
            opacity: currentLevel === 2 
              ? 1 
              : currentLevel === 1 
                ? levelProgress 
                : currentLevel === 3 
                  ? Math.max(0, 1 - levelProgress * 1.5) // Slower fade-out when Level 3 appears
                  : 0,
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
            opacity: currentLevel === 3 
              ? 1 
              : currentLevel === 2 
                ? Math.max(0, (levelProgress - 0.3) * 1.43) // Start fading in later (at 30% of Level 2)
                : currentLevel === 4 
                  ? Math.max(0, 1 - levelProgress * 1.5) // Slower fade-out when Level 4 appears
                  : Math.max(0, 1 - (currentLevel - 3) * 2),
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
            opacity: currentLevel === 4 
              ? 1 
              : currentLevel === 3 
                ? Math.max(0, (levelProgress - 0.3) * 1.43) // Start fading in later (at 30% of Level 3)
                : currentLevel === 5 
                  ? Math.max(0, 1 - levelProgress * 1.5) // Slower fade-out when Level 5 appears
                  : Math.max(0, 1 - (currentLevel - 4) * 2),
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
            opacity: currentLevel === 5 
              ? 1 
              : currentLevel === 4 
                ? Math.max(0, (levelProgress - 0.3) * 1.43) // Start fading in later (at 30% of Level 4)
                : 0,
            pointerEvents: currentLevel === 5 ? 'auto' : 'none',
          }}
        >
          <InformedCitizen 
            progress={currentLevel === 5 ? levelProgress : 0} 
            surveyData={surveyData}
            visitCount={visitCount}
            userVisitNumber={userVisitNumber}
          />
        </section>
      </div>
      
      {/* Title Overlay - Only visible at start */}
      <div 
        className="fixed top-1/4 left-1/2 -translate-x-1/2 z-30 text-center transition-opacity duration-500 px-4"
        style={{ opacity: scrollProgress < 0.05 ? 1 : 0, pointerEvents: 'none' }}
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
