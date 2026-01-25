import React, { useState, useEffect } from 'react';


function TimeBlock({ value, label }: { value: number; label: string }) {
 return (
 <div className="flex flex-col items-center">
      <div className="bg-black border border-cyan-400 px-1 py-0.5 sm:px-2 sm:py-1 min-w-5 sm:min-w-10 shadow-[1px_1px_0px_0px_rgba(34,211,238,0.5)] sm:shadow-[2px_2px_0px_0px_rgba(34,211,238,0.5)]">
        <div className="text-[10px] sm:text-xl font-bold font-mono text-cyan-400 tabular-nums leading-none">
          {String(value).padStart(2, '0')}
        </div>
      </div>
      <div className="mt-0.5 sm:mt-1 text-cyan-300 font-mono text-[7px] sm:text-[10px] tracking-wider">
        {label}
      </div>
    </div>
    )
};

export default function Countdown({ title, destinationTime } : { title: string; destinationTime: string }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0
  });
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const destination = new Date(destinationTime).getTime();
      const now = new Date().getTime();
      const difference = destination - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
          total: difference
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [destinationTime]);
  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragOffset({
      x: clientX - position.x,
      y: clientY - position.y
    });
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (isDragging) {
      setPosition({
        x: clientX - dragOffset.x,
        y: clientY - dragOffset.y
      });
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMouseDown = (e: any) => handleStart(e.clientX, e.clientY);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTouchStart = (e: any) => handleStart(e.touches[0].clientX, e.touches[0].clientY);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMouseMove = (e: any) => handleMove(e.clientX, e.clientY);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTouchMove = (e: any) => handleMove(e.touches[0].clientX, e.touches[0].clientY);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchend', handleEnd);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('mouseup', handleEnd);
        window.removeEventListener('touchend', handleEnd);
      };
    }
  }, [isDragging, dragOffset]);



  return (
    <div className=" bg-gray-900 p-2 sm:p-4 z-10 h-5/12">
      <div
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="select-none origin-top-left scale-[.7] sm:scale-100"
      >
        <div className="border border-cyan-400 sm:border-2 bg-gray-900 p-1 sm:p-2 shadow-[1px_1px_0px_0px_rgba(34,211,238,0.5)] sm:shadow-[3px_3px_0px_0px_rgba(34,211,238,0.5)] hover:shadow-[1.5px_1.5px_0px_0px_rgba(34,211,238,0.7)] sm:hover:shadow-[4px_4px_0px_0px_rgba(34,211,238,0.7)] transition-shadow">
          <div className="mb-1 sm:mb-2 text-center">
            <h2 className="text-[9px] sm:text-sm font-bold text-cyan-400 font-mono tracking-wide">
              {title}
            </h2>
          </div>

          {timeLeft.total > 0 ? (
            <div className="flex justify-center gap-0.5 sm:gap-2">
              {timeLeft.days > 0 && <TimeBlock value={timeLeft.days} label="D" />}
              <TimeBlock value={timeLeft.hours} label="H" />
              <TimeBlock value={timeLeft.minutes} label="M" />
              <TimeBlock value={timeLeft.seconds} label="S" />
            </div>
          ) : (
            <div className="border border-green-400 sm:border-2 bg-black px-1 sm:px-3 py-0.5 sm:py-2 shadow-[1px_1px_0px_0px_rgba(74,222,128,0.5)] sm:shadow-[2px_2px_0px_0px_rgba(74,222,128,0.5)]">
              <div className="text-[9px] sm:text-sm font-bold text-green-400 font-mono tracking-wide animate-pulse">
                ALREADY STARTED!!!
              </div>
            </div>
          )}

          <div className="mt-1 sm:mt-2 text-center">
            <div className="text-cyan-400 text-[7px] sm:text-[10px] font-mono opacity-50">
              ⠿ DRAGGABLE ⠿
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
