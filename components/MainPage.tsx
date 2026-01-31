import { useGlobalState } from "@/services/global_state";
import { useRef } from "react";
import MuteButton from "@/components/MuteButton";
import EnterButton from "@/components/EnterButton";
import RuleBookButton from "@/components/RuleBook";
import AboutUsButton from "@/components/AboutUs";
import Countdown from "@/components/Countdown";


export default function MainPage() {
    const mainPageRef = useRef<HTMLDivElement | null>(null);
    const changeToGame = useGlobalState((state)=>state.setStartGame);
    const bgWallpaper = useGlobalState((state)=>state.bgWallpaper);
    
    const clickHandle = () => {
      //Tab Change
        changeToGame(true); 
        //Fading Effect on Main Page
        mainPageRef.current?.classList.add("animate__fadeOut");
        setTimeout(() => {
            mainPageRef.current?.classList.remove("animate__fadeOut");
            if (mainPageRef.current) mainPageRef.current.style.display = "none";
        }, 800);
    }

    return (<div ref={mainPageRef} className="animate__animated text-white border-2 border-black flex flex-column items-center justify-around overflow-hidden z-3 w-full h-full bg-no-repeat bg-cover bg-center px-2 sm:px-4" style={{backgroundImage: `url("${bgWallpaper}")`}}>
        <div className="flex flex-col items-center justify-center gap-1 sm:gap-2">
            <h1 className="text-[12px] sm:text-s md:text-3xl">Parakram Presents</h1>
            <h2 className="text-[12px] sm:text-s md:text-2xl">Kreeda Mohotsav 2.0</h2>
            <br />
            <Countdown targetUtc="2026-02-10T17:00:00Z" className="text-xs sm:text-s md:text-xl m-4 border-red-600 border p-4 bg-black" />
            <br />
            <EnterButton onClick={clickHandle} className="w-1/2 flex justify-center-safe" />
            <br />
            <MuteButton className="w-1/2 flex justify-center-safe" />
            <br />
            <RuleBookButton className="w-1/2 flex justify-center-safe" />
            <br />
            <AboutUsButton  className="w-1/2 flex justify-center-safe" />
            </div>
        {/* Developer credits */}
      <div className="fixed bottom-2 right-2 text-right text-xs sm:text-sm text-gray-500 z-10" style={{ fontFamily: '"Press Start 2P", monospace' }}>
        <p>Developed by <a href="https://github.com/TheHackerClown" className="text-red-600">TheHackerClown</a> & <a href="https://github.com/Aditya-Dahiya-007" className="text-red-600">Aditya-Dahiya-007</a></p>
      </div>
    </div>) 
}