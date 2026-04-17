"use client";

import { useEffect } from "react";
import { unlockAudio, useAudioSettings, wireAudioToChannel } from "@/lib/audio-settings";

let _bgAudio: HTMLAudioElement | null = null;
let _bgStarted = false;

function tryPlay(src: string, volume: number) {
    if (_bgStarted) return;
    // Lock IMMEDIATELY to prevent concurrent calls from each creating
    // their own Audio, on mobile, a tap can fire several handlers in
    // the same tick, and without this lock we'd get doubled playback.
    _bgStarted = true;
    // Unlock and wire first so the audio plays through the gain node,
    // not the default destination. iOS Safari ignores audio.volume but
    // honours GainNode.gain.
    unlockAudio();
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = volume;
    wireAudioToChannel(audio, "music");
    audio
        .play()
        .then(() => {
            _bgAudio = audio;
        })
        .catch(() => {
            // Autoplay was blocked, release the lock so the next user
            // gesture can retry.
            _bgStarted = false;
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
