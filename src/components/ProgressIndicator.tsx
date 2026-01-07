import React from 'react';

interface ProgressIndicatorProps {
  currentLevel: number;
  progress: number;
}

const levels = [
  { id: 1, name: "Information Storm" },
  { id: 2, name: "Definition Zone" },
  { id: 3, name: "Economic Reality" },
  { id: 4, name: "Human Rights Lab" },
  { id: 5, name: "Informed Citizen" },
];

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentLevel, progress }) => {
  return (
    <div className="fixed top-4 right-4 md:top-8 md:right-8 z-50">
      <div className="bg-card/60 backdrop-blur-sm rounded-lg p-2 md:p-3 border border-border/50 shadow-lg">
        {/* Compact view - only show numbers on mobile */}
        <div className="hidden md:block">
          <p className="font-mono text-[10px] text-muted-foreground mb-2">PROGRESS</p>
        </div>
        
        <div className="flex md:flex-col gap-1 md:gap-1.5">
          {levels.map((level) => {
            const isActive = level.id === currentLevel;
            const isCompleted = level.id < currentLevel;
            const levelProgress = isActive ? progress : isCompleted ? 1 : 0;
            
            return (
              <div key={level.id} className="flex items-center gap-1.5 md:gap-2">
                {/* Level Number - smaller on mobile */}
                <div 
                  className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[10px] md:text-xs font-mono transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-primary/80 text-primary-foreground' 
                      : isActive 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-secondary/50 text-muted-foreground'
                  }`}
                >
                  {level.id}
                </div>
                
                {/* Progress Bar - smaller and more subtle */}
                <div className="w-12 md:w-20 h-1 md:h-1.5 bg-secondary/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary/70 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${levelProgress * 100}%`,
                    }}
                  />
                </div>
                
                {/* Level Name - only show on desktop and when active */}
                {isActive && (
                  <span className="hidden lg:block text-[10px] text-primary/80 font-mono whitespace-nowrap">
                    {level.name}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
