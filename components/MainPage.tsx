import { useGlobalState } from "@/services/global_state";
import { useRef } from "react";
import { getBGTime } from "@/services/utils";

export default function MainPage() {
    const mainPageRef = useRef<HTMLDivElement>(null);
    const changeToGame = useGlobalState((state)=>state.setStartGame);

    return (<div ref={mainPageRef} className="animate__animated" style={{backgroundImage: `url("/cloudscapes/${getBGTime()}/orig.png")`}} id="main_page">
        <h1>Welcome to Parakram!</h1>
        <button onClick={() =>{ mainPageRef.current?.classList.add("hidden"); changeToGame(true)} }>Go to Game</button>
    </div>);
}