"use client"
import Game from "@/components/Game";
import Loading from "@/components/Loading";
import { useState } from "react";

export default function Home() {
  const [activeTab, SetActiveTab] = useState<string>("Loading");

  return (
    <div>
      {activeTab === "Loading" ? <Loading/> : <Game/>}
    </div>
  );
}
