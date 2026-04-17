"use client";

import { useEffect } from "react";
import { useAudioSettings } from "@/lib/audio-settings";

let _bgAudio: HTMLAudioElement | null = null;
let _bgStarted = false;

function tryPlay(src: string, volume: number) {
    if (_bgStarted) return;
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = volume;
    audio
        .play()
        .then(() => {
            _bgStarted = true;
            _bgAudio = audio;
        })
        .catch(() => {
            // Autoplay blocked — leave _bgStarted false so fallback
            // listeners can retry on the next user gesture.
        });
}

export function startBgMusic(src: string, volume: number) {
    tryPlay(src, volume);
}

export function BgMusic({ src }: { src: string }) {
    const { musicVolume } = useAudioSettings();

    // Keep the running audio element's volume in sync with the slider.
    useEffect(() => {
        if (_bgAudio) _bgAudio.volume = musicVolume;
    }, [musicVolume]);

    // Attempt autoplay on mount + fallback on first gesture.
    useEffect(() => {
        tryPlay(src, musicVolume);

        const fallback = () => tryPlay(src, musicVolume);
        document.addEventListener("click", fallback);
        document.addEventListener("keydown", fallback);

        return () => {
            document.removeEventListener("click", fallback);
            document.removeEventListener("keydown", fallback);
            _bgAudio?.pause();
            _bgAudio = null;
            _bgStarted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [src]);

    return null;
}
