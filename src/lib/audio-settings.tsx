"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

/**
 * Global audio volume settings — two independent channels:
 *   • music      (background track)
 *   • narrator   (all speech: typed beats, boot, caller, quiz feedback)
 *
 * React state drives the UI sliders. Module-level variables are kept
 * in sync so any `new Audio()` call anywhere in the app can read the
 * current volume without needing context access.
 */

// Module-level mirrors — read by audio-playing code via getters.
let _musicVol = 0.10;
let _narratorVol = 1.0;

export function getMusicVolume(): number {
    return _musicVol;
}
export function getNarratorVolume(): number {
    return _narratorVol;
}

type Settings = {
    musicVolume: number;
    narratorVolume: number;
    setMusicVolume: (v: number) => void;
    setNarratorVolume: (v: number) => void;
};

const Ctx = createContext<Settings>({
    musicVolume: 0.10,
    narratorVolume: 1.0,
    setMusicVolume: () => {},
    setNarratorVolume: () => {},
});

export function AudioSettingsProvider({ children }: { children: ReactNode }) {
    const [musicVolume, _setMusic] = useState(0.10);
    const [narratorVolume, _setNarrator] = useState(1.0);

    const setMusicVolume = useCallback((v: number) => {
        _musicVol = v;
        _setMusic(v);
    }, []);

    const setNarratorVolume = useCallback((v: number) => {
        _narratorVol = v;
        _setNarrator(v);
    }, []);

    return (
        <Ctx.Provider value={{ musicVolume, narratorVolume, setMusicVolume, setNarratorVolume }}>
            {children}
        </Ctx.Provider>
    );
}

export function useAudioSettings() {
    return useContext(Ctx);
}
