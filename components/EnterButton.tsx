import { useState } from 'react';

export default function EnterButton({ onClick }: { onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => { setIsPressed(true); setIsHovered(true); }}
      onTouchEnd={() => { setIsPressed(false); setIsHovered(false); }}
      className={`
        group relative px-3 sm:px-6 py-1.5 sm:py-3 font-mono text-[10px] sm:text-base font-bold
        transition-all duration-150 ease-in-out
        bg-cyan-500 text-black border-2 sm:border-4 border-cyan-300
        shadow-[3px_3px_0px_0px_rgba(34,211,238,1)] sm:shadow-[6px_6px_0px_0px_rgba(34,211,238,1)]
        ${isPressed 
          ? 'translate-x-1.5 translate-y-1.5 shadow-none' 
          : isHovered 
            ? 'translate-x-0.75 translate-y-0.75 shadow-[2px_2px_0px_0px_rgba(34,211,238,1)]'
            : ''}
      `}
    >
      <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-50 blur-[6px] sm:blur-xl transition-opacity duration-300" />
      
      <div className="relative flex items-center gap-1.5 sm:gap-3">
        <span className="tracking-wider text-[10px] sm:text-base">ENTER THE EXPERIENCE</span>
        <span className="text-base sm:text-xl animate-pulse">▶</span>
      </div>

    </button>
  );
}