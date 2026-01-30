import {create} from "zustand";
import {Howl} from "howler";
import { getBGTime } from "@/services/utils";
interface GlobalState {
    startGame: boolean;
    setStartGame: (value: boolean) => void;
    loopMusic: boolean;
    bgWallpaper: string;
    BGMusic: Howl;
    toggleMute: () => void;
    MobileControls: boolean;
    setShowMobileControls: (value: boolean) => void;

}

export const useGlobalState = create<GlobalState>((set)=>({
    startGame: false,
    setStartGame: (value: boolean) => set({startGame: value}),
    loopMusic: true,
    bgWallpaper: `/cloudscapes/${getBGTime()}/orig.png`,
    BGMusic: new Howl({
            src: ["/bgm.mp3"],
            loop: true,
            volume: 1,
            html5: true,
            preload: true,
        }),
    toggleMute: () => set((state) => {
        if (state.BGMusic.mute()) {
            state.BGMusic.mute(false);
            state.BGMusic.play();
            state.loopMusic = false;
        } else {
            state.BGMusic.mute(true);
            state.BGMusic.pause();
            state.loopMusic = true;
        }
        return {};
    }),
    MobileControls: false,
    setShowMobileControls: (value: boolean) => set({MobileControls: value})


}))