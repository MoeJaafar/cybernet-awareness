"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

/**
 * Global audio volume settings. Two independent channels:
 *   music      background track (one looping Audio element)
 *   narrator   all speech (boot, outcomes, debriefs, caller lines, quiz feedback)
 *
 * Volume is controlled through Web Audio GainNodes rather than
 * HTMLAudioElement.volume. iOS Safari ignores audio.volume entirely,
 * so the slider would appear to do nothing on an iPhone. Gain on a
 * GainNode is honoured on every platform. HTMLAudioElement.volume is
 * kept in sync as a fallback for browsers that block MediaElementSource
 * or where the AudioContext failed to initialise.
 */

// Module-level mirrors. Read by audio-playing code via getters.
let _musicVol = 0.10;
let _narratorVol = 1.0;

// Currently-playing narrator audio elements. When narrator volume
// changes, every entry gets its .volume updated in place.
const _narratorAudios = new Set<HTMLAudioElement>();

// Web Audio graph. Created lazily on first unlock, then reused.
let _audioCtx: AudioContext | null = null;
let _musicGain: GainNode | null = null;
let _narratorGain: GainNode | null = null;
// Elements already wired to a MediaElementSource. A given audio element
// can only be wired once; subsequent calls throw InvalidStateError.
const _wired = new WeakSet<HTMLAudioElement>();

function ensureAudioCtx(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (_audioCtx) return _audioCtx;
    type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };
    const AC =
        window.AudioContext ??
        (window as WebkitWindow).webkitAudioContext;
    if (!AC) return null;
    try {
        _audioCtx = new AC();
        _musicGain = _audioCtx.createGain();
        _musicGain.gain.value = _musicVol;
        _musicGain.connect(_audioCtx.destination);
        _narratorGain = _audioCtx.createGain();
        _narratorGain.gain.value = _narratorVol;
        _narratorGain.connect(_audioCtx.destination);
    } catch {
        _audioCtx = null;
    }
    return _audioCtx;
}

/**
 * Resume the AudioContext. Must be called inside a user-gesture
 * handler on iOS Safari or the context stays suspended and no audio
 * plays through Web Audio. Safe to call repeatedly.
 */
export function unlockAudio(): void {
    const ctx = ensureAudioCtx();
    if (ctx && ctx.state === "suspended") {
        ctx.resume().catch(() => {});
    }
}

/**
 * Route an Audio element through the given channel's gain node. Idempotent
 * per element; safe to call even if the audio is already playing.
 */
export function wireAudioToChannel(
    audio: HTMLAudioElement,
    channel: "music" | "narrator",
): void {
    if (_wired.has(audio)) return;
    const ctx = ensureAudioCtx();
    const gain = channel === "music" ? _musicGain : _narratorGain;
    if (!ctx || !gain) return;
    try {
        const source = ctx.createMediaElementSource(audio);
        source.connect(gain);
        _wired.add(audio);
    } catch {
        // Already wired by a previous call on the same element, or the
        // browser rejected the source. Fall back to audio.volume which
        // is already set by the caller.
    }
}

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
    wireAudioToChannel(audio, "narrator");
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
        if (_musicGain) _musicGain.gain.value = v;
    }, []);

    const setNarratorVolume = useCallback((v: number) => {
        _narratorVol = v;
        _setNarrator(v);
        if (_narratorGain) _narratorGain.gain.value = v;
        // Fallback: also push to HTMLAudioElement.volume for browsers
        // where Web Audio wiring failed or isn't available.
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
