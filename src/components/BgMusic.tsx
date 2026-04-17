"use client";

import { useEffect, useRef } from "react";

/**
 * Global background music. Renders nothing visible. Waits for the
 * first user gesture (any click/tap anywhere on the page), then
 * starts a looping ambient track at low volume. Persists across
 * Next.js client-side navigations because it lives in the root layout.
 */
export function BgMusic({ src, volume = 0.18 }: { src: string; volume?: number }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const startedRef = useRef(false);

    useEffect(() => {
        const start = () => {
            if (startedRef.current) return;
            startedRef.current = true;

            const audio = new Audio(src);
            audio.loop = true;
            audio.volume = volume;
            audio.play().catch(() => {});
            audioRef.current = audio;

            document.removeEventListener("click", start);
            document.removeEventListener("keydown", start);
        };

        document.addEventListener("click", start, { once: false });
        document.addEventListener("keydown", start, { once: false });

        return () => {
            document.removeEventListener("click", start);
            document.removeEventListener("keydown", start);
            audioRef.current?.pause();
            audioRef.current = null;
        };
    }, [src, volume]);

    return null;
}
