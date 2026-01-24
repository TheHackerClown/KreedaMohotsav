"use client"
import Game from "@/components/Game";
import MainPage from "@/components/MainPage";

export default function Home() {
  return (
    <div id="root_container">
      <MainPage/>
      <Game />
    </div>
  );
}
