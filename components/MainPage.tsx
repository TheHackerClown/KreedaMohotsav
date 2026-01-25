import { useGlobalState } from "@/services/global_state";
import { useRef } from "react";
import MuteButton from "@/components/MuteButton";
import EnterButton from "@/components/EnterButton";

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
            <h1 className="text-[10px] sm:text-sm md:text-lg">Parakram Presents</h1>
            <h2 className="text-[9px] sm:text-xs md:text-base">Kreeda Mohotsav 2.0</h2>
            <EnterButton onClick={clickHandle}/>
            <MuteButton />
        </div>
    </div>);
}