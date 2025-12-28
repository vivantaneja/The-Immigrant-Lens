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
    <div className="fixed top-8 right-8 z-50">
      <div className="bg-card/80 backdrop-blur-md rounded-lg p-4 border border-border">
        <p className="font-mono text-xs text-muted-foreground mb-3">PROGRESS</p>
        
        <div className="space-y-2">
          {levels.map((level) => {
            const isActive = level.id === currentLevel;
            const isCompleted = level.id < currentLevel;
            const levelProgress = isActive ? progress : isCompleted ? 1 : 0;
            
            return (
              <div key={level.id} className="flex items-center gap-3">
                {/* Level Number */}
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-primary text-primary-foreground' 
                      : isActive 
                        ? 'bg-primary/20 text-primary neon-border-blue' 
                        : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  {level.id}
                </div>
                
                {/* Progress Bar */}
                <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ 
                      width: `${levelProgress * 100}%`,
                      boxShadow: levelProgress > 0 ? '0 0 8px hsl(190 100% 50% / 0.5)' : 'none',
                    }}
                  />
                </div>
                
                {/* Level Name (only show for active) */}
                {isActive && (
                  <span className="text-xs text-primary font-mono whitespace-nowrap">
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
