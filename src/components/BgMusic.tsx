"use client";

import { useEffect } from "react";
import { unlockAudio, useAudioSettings, wireAudioToChannel } from "@/lib/audio-settings";

let _bgAudio: HTMLAudioElement | null = null;
let _bgStarted = false;
let _bgSrc: string | null = null;

function tryPlay(src: string, volume: number) {
    // Already playing this track? do nothing. The locale switcher
    // remounts the [locale] layout, which remounts BgMusic — without
    // this short-circuit, every switch would spawn another concurrent
    // piano loop (the bug we're fixing).
    if (_bgStarted && _bgSrc === src) return;
    _bgStarted = true;
    _bgSrc = src;
    unlockAudio();
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = volume;
    wireAudioToChannel(audio, "music");
    // Hold the reference SYNCHRONOUSLY so a second tryPlay (or a
    // cleanup) can see what we just created. Previous version waited
    // for the play() promise to resolve, which left a window where the
    // audio existed but no reference was held to it.
    _bgAudio = audio;
    audio.play().catch(() => {
        // Autoplay was blocked. Release the lock so the next user
        // gesture can retry from a clean slate.
        if (_bgAudio === audio) {
            _bgAudio = null;
            _bgStarted = false;
            _bgSrc = null;
        }
    });
}

export function startBgMusic(src: string, volume: number) {
    tryPlay(src, volume);
}

export function BgMusic({ src }: { src: string }) {
    const { musicVolume } = useAudioSettings();

    // Fallback only: GainNode already tracks musicVolume via the
    // context setter. This covers browsers where MediaElementSource
    // didn't wire (older Safari on cross-origin assets, etc.).
    useEffect(() => {
        if (_bgAudio) _bgAudio.volume = musicVolume;
    }, [musicVolume]);

    // Attempt autoplay on mount + fallback on first gesture.
    //
    // Critically, do NOT pause _bgAudio on unmount: when the user
    // toggles the locale switch, the [locale] layout remounts and
    // this component unmounts/remounts. _bgAudio is module-level and
    // survives that cycle — pausing it here would silence the music
    // every time the user switches language, and the new mount would
    // start a fresh loop, leaving N copies playing at once.
    useEffect(() => {
        tryPlay(src, musicVolume);

        const fallback = () => tryPlay(src, musicVolume);
        document.addEventListener("click", fallback);
        document.addEventListener("keydown", fallback);

        return () => {
            document.removeEventListener("click", fallback);
            document.removeEventListener("keydown", fallback);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [src]);

    return null;
}
