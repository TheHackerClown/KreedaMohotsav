"use client"

import React, { useEffect, useState } from 'react';

interface InfoBoardsProps {
    containerRef: React.RefObject<HTMLDivElement> | null;
    onExitGame: () => void;
}

// 📺 STADIUM JUMBOTRON SCREEN COMPONENT (Visuals Same as before)
const StadiumScreen = ({ left, title, date, items, isEndScreen = false, onRegister }: any) => (
    <div 
        className="absolute top-0 flex flex-col items-center z-30" 
        style={{ left: `${left}px` }}
    >
        {/* Support Cables (Fading into the sky) */}
        <div className="relative w-full flex justify-between px-4 sm:px-10 -mb-2">
            <div className="w-1 h-16 sm:h-32 bg-gradient-to-b from-transparent via-gray-700 to-gray-900 opacity-90"></div>
            <div className="w-1 h-16 sm:h-32 bg-gradient-to-b from-transparent via-gray-700 to-gray-900 opacity-90"></div>
        </div>

        {/* The Screen Frame */}
        <div className="bg-gray-900 p-2 sm:p-4 rounded-b-xl border-x-4 border-b-4 border-gray-800 shadow-[0px_10px_30px_rgba(0,0,0,0.4)] relative z-10">
            {/* The LED Display Area */}
            <div className={`
                bg-black border-2 border-gray-700 rounded-lg p-4 sm:p-6 text-center
                ${isEndScreen ? 'w-[300px] sm:w-[550px]' : 'w-[280px] sm:w-[450px]'}
                shadow-[inset_0px_0px_15px_rgba(0,0,0,0.8)]
                bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 to-black
            `}>
                
                <h1 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500 uppercase tracking-widest drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]">
                    {title}
                </h1>
                
                {date && (
                    <p className="text-gray-400 font-mono text-xs sm:text-sm mt-1 sm:mt-2 border-b border-gray-700 pb-2 sm:pb-3 mb-2 sm:mb-4 font-bold">
                        {date}
                    </p>
                )}

                {!isEndScreen && (
                    <div className="grid grid-cols-2 gap-x-2 gap-y-3 text-left mt-2 relative">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 pointer-events-none background-size-[100%_2px,3px_100%]"></div>
                        
                        {items.map((item: string, index: number) => (
                            <div key={index} className="flex items-start gap-2 text-yellow-300 font-mono text-[10px] sm:text-xs font-bold leading-tight z-30">
                                <span className="text-yellow-500 mt-0.5">▶</span> {item}
                            </div>
                        ))}
                    </div>
                )}

                {isEndScreen && (
                    <div className="mt-4 sm:mt-6 flex flex-col items-center gap-3 relative z-30">
                        <p className="text-cyan-200 font-mono text-sm sm:text-lg animate-pulse font-bold">
                            READY FOR GLORY?
                        </p>
                        <button 
                            onClick={onRegister}
                            className="pointer-events-auto bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-black py-2 px-6 sm:py-3 sm:px-8 rounded-lg text-lg sm:text-xl transition-all hover:scale-105 shadow-[0_0_25px_rgba(255,0,0,0.5)] border-2 border-red-500/50"
                        >
                            REGISTER NOW
                        </button>
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center mt-2 px-1">
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></div>
                    <span className="text-[8px] sm:text-[9px] text-red-400/80 font-mono tracking-wider">LIVE FEED // CAM 1</span>
                </div>
                <div className="text-[8px] sm:text-[9px] text-gray-600 font-black tracking-widest">KREEDA STADIUM SYSTEMS</div>
            </div>
        </div>
    </div>
);

export default function InfoBoards({ containerRef, onExitGame }: InfoBoardsProps) {
  // STATE TO DETECT MOBILE
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
        // Agar width 768px se kam hai toh Mobile maano
        setIsMobile(window.innerWidth < 768);
    };

    // Check on initial load
    handleResize();

    // Listen for resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- POSITION CONFIGURATION ---
  // PC: Wahi purane distances (No touch)
  const pcPositions = [200, 1500, 3000, 4500, 6000];

  // MOBILE: Closer distances (600-700px gap instead of 1500px)
  const mobilePositions = [50, 650, 1250, 1850, 2450];

  // Decide which array to use
  const pos = isMobile ? mobilePositions : pcPositions;

  return (
    <div 
      ref={containerRef}
      className="absolute top-0 left-0 w-full pointer-events-none z-30"
      style={{ willChange: 'transform' }} 
    >
        {/* SCREEN 1: TUTORIAL */}
        <StadiumScreen 
            left={pos[0]}
            title="WELCOME"
            items={[
                "PC: Arrow Keys / WASD",
                "Mobile: Tilt Phone",
                "Objective: Explore Events",
                "Sound: Recommended"
            ]}
        />

        {/* SCREEN 2: DAY 1 */}
        <StadiumScreen 
            left={pos[1]}
            title="DAY 1 ARENA"
            date="Feb 18, 2026"
            items={[
                "Athletics", "Shot Put",
                "Javelin Throw", "Futsal (5v5)",
                "Kho-Kho (Girls)", "Kabaddi (Boys)",
                "Relay 4x200m", "Discus Throw"
            ]}
        />

        {/* SCREEN 3: DAY 2 */}
        <StadiumScreen 
            left={pos[2]}
            title="DAY 2"
            date="Feb 19, 2026"
            items={[
                "Badminton", "Chess",
                "Volleyball", "Arm Wrestling",
                "E-Sports", "Tug of War", "Table Tennis", "Carrom",
            ]}
        />

        {/* SCREEN 4: DAY 3 */}
        <StadiumScreen 
            left={pos[3]}
            title="DAY 3"
            date="Feb 20, 2026"
            items={[
                "Prize Distribution", "Closing Ceremony",
            ]}
        />

        {/* SCREEN 5: END */}
        <StadiumScreen 
            left={pos[4]}
            title="JOIN THE FEST"
            isEndScreen={true}
            onRegister={onExitGame}
        />
        
        {/* Buffer to allow scrolling past last element */}
        <div className="absolute top-0 w-10 h-1" style={{ left: isMobile ? '3000px' : '7000px' }}></div>
    </div>
  );
}
