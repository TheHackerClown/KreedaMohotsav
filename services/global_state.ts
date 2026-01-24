import {create} from "zustand";

interface GlobalState {
    startGame: boolean;
    setStartGame: (value: boolean) => void;
}

export const useGlobalState = create<GlobalState>((set)=>({
    startGame: false,
    setStartGame: (value: boolean) => set({startGame: value}),
}))