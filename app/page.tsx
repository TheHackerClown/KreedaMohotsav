"use client"
import Game from "@/components/Game";
import MainPage from "@/components/MainPage";
import { useGlobalState } from "@/services/global_state";
import { useEffect } from "react";
import Countdown from "@/components/Countdown";
import { Footer } from "@/components/Footer";

export default function Home() {

  const bgWallpaper = useGlobalState((state)=>state.bgWallpaper);
  const activeGame = useGlobalState((state)=>state.startGame);
  useEffect(() => {
    new Image().src = bgWallpaper;
  }, []);

  return (
    <div id="root_container">
      <MainPage/>

      {!activeGame && (
        <Countdown 
        title="DAY 1 COMING IN" 
        destinationTime={"2026-09-20T09:00:00+05:30"}
        />
      )}
      
      <Game />
      <Footer/>
    </div>
  );
}
