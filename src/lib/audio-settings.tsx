"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

/**
 * Global audio volume settings. Two independent channels:
 *   music      background track (one looping Audio element)
 *   narrator   all speech (boot, outcomes, debriefs, caller lines, quiz feedback)
 *
 * Active narrator Audio elements register themselves so the volume
 * slider updates them LIVE mid-playback. Without this, dragging the
 * slider only affects the next clip.
 */

// Module-level mirrors. Read by audio-playing code via getters.
let _musicVol = 0.10;
let _narratorVol = 1.0;

// Currently-playing narrator audio elements. When narrator volume
// changes, every entry gets its .volume updated in place.
const _narratorAudios = new Set<HTMLAudioElement>();

export function getMusicVolume(): number {
    return _musicVol;
}
export function getNarratorVolume(): number {
    return _narratorVol;
}

/**
 * Create a narrator Audio element that stays in sync with the
 * narrator slider. Component should call the returned `release`
 * cleanup to stop playback and deregister.
 */
export function createNarratorAudio(
    src: string,
    opts?: { loop?: boolean; multiplier?: number },
): { audio: HTMLAudioElement; release: () => void } {
    const audio = new Audio(src);
    if (opts?.loop) audio.loop = true;
    const mult = opts?.multiplier ?? 1;
    audio.volume = _narratorVol * mult;
    // Track the multiplier so live updates respect it (e.g. ringtone = 0.7x).
    (audio as HTMLAudioElement & { _mult?: number })._mult = mult;
    _narratorAudios.add(audio);
    return {
        audio,
        release: () => {
            _narratorAudios.delete(audio);
            audio.pause();
            audio.currentTime = 0;
        },
    };
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
        // Live-update every currently-playing narrator Audio.
        _narratorAudios.forEach((audio) => {
            const mult = (audio as HTMLAudioElement & { _mult?: number })._mult ?? 1;
            audio.volume = v * mult;
        });
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
