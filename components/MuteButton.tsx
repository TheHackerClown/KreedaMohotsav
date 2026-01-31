
import { useGlobalState } from "@/services/global_state";
import { useEffect, useState } from "react";

export default function MuteButton({ className }: { className?: string }) {   

    const toggleMute = useGlobalState((state)=>state.toggleMute);
    const [isMuted, setIsMuted] = useState<boolean>(useGlobalState((state)=>!state.loopMusic));

    const onclickhandle = () => {
        toggleMute();
        setIsMuted(!isMuted);
    }
    return (
        <button
          onClick={onclickhandle}
          className={` ${className}
            px-3 sm:px-6 py-1.5 sm:py-3 font-mono text-xs sm:text-base font-bold
            transition-all duration-150 ease-in-out
            ${isMuted 
              ? 'bg-red-600 text-white border-red-800' 
              : 'bg-green-500 text-black border-green-700'}
            border-2 sm:border-4
            shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]
            hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]
            hover:translate-x-0.5
            hover:translate-y-0.5
            active:shadow-none
            active:translate-x-1
            active:translate-y-1
          `}
        >
          <div className="flex items-center gap-1.5 sm:gap-3">
            {isMuted ? (
              `🔈`
            ) : (
              `🔊`
            )}
            <span className="tracking-wider text-[10px] sm:text-base">
              {isMuted ? 'UNMUTE MUSIC' : 'MUTE MUSIC'}
            </span>
          </div>
        </button>
    );
}