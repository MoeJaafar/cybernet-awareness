"use client";

import { useEffect, useRef } from "react";

let _bgAudio: HTMLAudioElement | null = null;
let _bgStarted = false;

/**
 * Start the background music. Safe to call from any component — only
 * the first call does anything. Exposed as a module-level function so
 * BootSequence (or any future component) can trigger it directly
 * inside a click handler, guaranteeing the browser treats it as a
 * user-gesture-initiated playback.
 */
export function startBgMusic(src: string, volume: number) {
    if (_bgStarted) return;
    _bgStarted = true;
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = volume;
    audio.play().catch(() => {});
    _bgAudio = audio;
}

/**
 * Global background music. Renders nothing visible. Also listens for
 * any click/keypress as a fallback trigger in case the component that
 * should call startBgMusic() doesn't.
 */
export function BgMusic({ src, volume = 0.10 }: { src: string; volume?: number }) {
    const srcRef = useRef(src);
    const volRef = useRef(volume);
    srcRef.current = src;
    volRef.current = volume;

    useEffect(() => {
        // Attempt autoplay immediately — works on repeat visits where
        // the browser's Media Engagement Index remembers this origin.
        // First visit: silently rejected, fallback listeners below.
        startBgMusic(srcRef.current, volRef.current);

        const fallback = () => startBgMusic(srcRef.current, volRef.current);
        document.addEventListener("click", fallback);
        document.addEventListener("keydown", fallback);

        return () => {
            document.removeEventListener("click", fallback);
            document.removeEventListener("keydown", fallback);
            _bgAudio?.pause();
            _bgAudio = null;
            _bgStarted = false;
        };
    }, []);

    return null;
}
