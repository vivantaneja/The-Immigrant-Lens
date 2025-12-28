import React from 'react';

interface WalkingCharacterProps {
  isWalking?: boolean;
  className?: string;
}

const WalkingCharacter: React.FC<WalkingCharacterProps> = ({ 
  isWalking = true,
  className = "" 
}) => {
  return (
    <div className={`relative ${isWalking ? 'animate-walk-bounce' : ''} ${className}`}>
      <svg 
        width="80" 
        height="120" 
        viewBox="0 0 80 120" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_10px_hsl(190,100%,50%,0.5)]"
      >
        {/* Head */}
        <circle 
          cx="40" 
          cy="20" 
          r="16" 
          fill="hsl(35, 80%, 70%)" 
          stroke="hsl(35, 60%, 50%)" 
          strokeWidth="2"
        />
        
        {/* Hair */}
        <path 
          d="M24 18 C24 8, 56 8, 56 18 C56 12, 50 6, 40 6 C30 6, 24 12, 24 18Z" 
          fill="hsl(25, 50%, 30%)"
        />
        
        {/* Eyes */}
        <circle cx="34" cy="18" r="3" fill="hsl(222, 47%, 6%)" />
        <circle cx="46" cy="18" r="3" fill="hsl(222, 47%, 6%)" />
        <circle cx="35" cy="17" r="1" fill="white" />
        <circle cx="47" cy="17" r="1" fill="white" />
        
        {/* Smile */}
        <path 
          d="M35 26 Q40 30, 45 26" 
          stroke="hsl(348, 70%, 50%)" 
          strokeWidth="2" 
          fill="none" 
          strokeLinecap="round"
        />
        
        {/* Body/Shirt */}
        <path 
          d="M28 36 L28 65 Q28 70, 33 70 L47 70 Q52 70, 52 65 L52 36 Q52 32, 40 32 Q28 32, 28 36Z" 
          fill="hsl(190, 100%, 42%)" 
          stroke="hsl(190, 100%, 35%)" 
          strokeWidth="2"
        />
        
        {/* Shirt glow effect */}
        <path 
          d="M28 36 L28 65 Q28 70, 33 70 L47 70 Q52 70, 52 65 L52 36 Q52 32, 40 32 Q28 32, 28 36Z" 
          fill="none"
          className="box-glow-blue"
          opacity="0.3"
        />
        
        {/* Left Arm */}
        <g className={isWalking ? 'animate-arm-left' : ''} style={{ transformOrigin: '28px 40px' }}>
          <rect 
            x="18" 
            y="38" 
            width="10" 
            height="25" 
            rx="5" 
            fill="hsl(35, 80%, 70%)" 
            stroke="hsl(35, 60%, 50%)" 
            strokeWidth="2"
          />
        </g>
        
        {/* Right Arm */}
        <g className={isWalking ? 'animate-arm-right' : ''} style={{ transformOrigin: '52px 40px' }}>
          <rect 
            x="52" 
            y="38" 
            width="10" 
            height="25" 
            rx="5" 
            fill="hsl(35, 80%, 70%)" 
            stroke="hsl(35, 60%, 50%)" 
            strokeWidth="2"
          />
        </g>
        
        {/* Pants */}
        <rect 
          x="30" 
          y="68" 
          width="20" 
          height="8" 
          fill="hsl(222, 50%, 25%)" 
          stroke="hsl(222, 50%, 20%)" 
          strokeWidth="1"
        />
        
        {/* Left Leg */}
        <g className={isWalking ? 'animate-leg-left' : ''} style={{ transformOrigin: '35px 76px' }}>
          <rect 
            x="30" 
            y="76" 
            width="10" 
            height="30" 
            rx="4" 
            fill="hsl(222, 50%, 25%)" 
            stroke="hsl(222, 50%, 20%)" 
            strokeWidth="1"
          />
          {/* Left Shoe */}
          <rect 
            x="28" 
            y="104" 
            width="14" 
            height="8" 
            rx="3" 
            fill="hsl(190, 100%, 35%)" 
            stroke="hsl(190, 100%, 30%)" 
            strokeWidth="1"
          />
        </g>
        
        {/* Right Leg */}
        <g className={isWalking ? 'animate-leg-right' : ''} style={{ transformOrigin: '45px 76px' }}>
          <rect 
            x="40" 
            y="76" 
            width="10" 
            height="30" 
            rx="4" 
            fill="hsl(222, 50%, 25%)" 
            stroke="hsl(222, 50%, 20%)" 
            strokeWidth="1"
          />
          {/* Right Shoe */}
          <rect 
            x="38" 
            y="104" 
            width="14" 
            height="8" 
            rx="3" 
            fill="hsl(190, 100%, 35%)" 
            stroke="hsl(190, 100%, 30%)" 
            strokeWidth="1"
          />
        </g>
        
        {/* Backpack/Tech Device */}
        <rect 
          x="26" 
          y="40" 
          width="4" 
          height="20" 
          rx="2" 
          fill="hsl(270, 60%, 50%)" 
          stroke="hsl(270, 60%, 40%)" 
          strokeWidth="1"
        />
      </svg>
    </div>
  );
};

export default WalkingCharacter;
