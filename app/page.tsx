"use client"
import Game from "@/components/Game";
import MainPage from "@/components/MainPage";
import { useGlobalState } from "@/services/global_state";
import { useEffect } from "react";

export default function Home() {

  const bgWallpaper = useGlobalState((state)=>state.bgWallpaper);
  const setShowMobileControls = useGlobalState((state)=>state.setShowMobileControls);
  useEffect(() => {
    
        // Mobile Check
        const ua = typeof navigator !== "undefined" ? navigator.userAgent : ""
        const isTouch = typeof window !== "undefined" && "ontouchstart" in window
        if (/Android|iPhone|iPad|iPod|Mobile/i.test(ua) || isTouch) setShowMobileControls(true);

      }, []);
  
  useEffect(() => {
    new Image().src = bgWallpaper;
  }, [bgWallpaper]);

  return (
    <div id="root_container">
      <MainPage/>      
      <Game />
    </div>
  );
}
