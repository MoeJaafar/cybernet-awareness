"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { createNarratorAudio } from "@/lib/audio-settings";

/**
 * Opening story beat. Types out one line of prose at a time, fades
 * to the next. When every line has played the intro hands off to the
 * caller via onDone.
 *
 * The intro is gated behind a "tap to begin" overlay so the user has
 * made a gesture before any audio plays , this is the only reliable
 * way to unblock browser autoplay for the rest of the session.
 */

type StoryLine = {
    text: string;
    /** ms per character , default 42. */
    speed?: number;
    /** ms to hold the finished line before fading out. */
    hold?: number;
    /** soft emphasis for short lines. */
    emphasis?: boolean;
};

const SCRIPT: StoryLine[] = [
    { text: "Tuesday morning. Just another workday.", speed: 52, hold: 900 },
    { text: "Coffee in one hand. Laptop open. Five emails waiting.", speed: 42, hold: 900 },
    { text: "One of them is not what it seems.", speed: 58, hold: 1400, emphasis: true },
];

export function BootSequence({ onDone }: { onDone: () => void }) {
    const [lineIndex, setLineIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [phase, setPhase] = useState<"type" | "hold" | "done">("type");

    // Audio , one mp3 per line. Only plays once the user has armed
    // the intro with a click (required for browser autoplay policies).
    useEffect(() => {
        if (lineIndex >= SCRIPT.length) return;
        const n = String(lineIndex + 1).padStart(2, "0");
        const { audio, release } = createNarratorAudio(`/audio/boot/${n}.mp3`);
        audio.play().catch(() => {});
        return release;
    }, [lineIndex]);

    useEffect(() => {
        if (phase === "done") {
            const t = window.setTimeout(onDone, 400);
            return () => window.clearTimeout(t);
        }
        if (lineIndex >= SCRIPT.length) {
            setPhase("done");
            return;
        }
        const line = SCRIPT[lineIndex];
        if (phase === "type") {
            if (charIndex >= line.text.length) {
                setPhase("hold");
                return;
            }
            const prev = line.text[charIndex - 1] ?? "";
            const delay =
                prev === "."
                    ? 380
                    : prev === ","
                      ? 200
                      : line.speed ?? 42;
            const t = window.setTimeout(() => setCharIndex((c) => c + 1), delay);
            return () => window.clearTimeout(t);
        }
        if (phase === "hold") {
            const t = window.setTimeout(() => {
                setLineIndex((i) => i + 1);
                setCharIndex(0);
                setPhase("type");
            }, line.hold ?? 900);
            return () => window.clearTimeout(t);
        }
    }, [lineIndex, charIndex, phase, onDone]);

    const current = SCRIPT[lineIndex];
    const visible = current?.text.slice(0, charIndex) ?? "";
    const isTyping = phase === "type" && charIndex < (current?.text.length ?? 0);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 relative">
            <div className="max-w-3xl w-full flex flex-col items-start">
                <AnimatePresence mode="wait">
                    {lineIndex < SCRIPT.length && current && (
                        <motion.div
                            key={lineIndex}
                            className="relative w-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, transition: { duration: 0.5 } }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            {/* Ghost paragraph reserves final wrapped height. */}
                            <p
                                aria-hidden
                                className={`type-body leading-[1.3] text-left invisible ${
                                    current.emphasis
                                        ? "type-display-italic text-[50px] sm:text-[80px] lg:text-[100px] leading-[1.1]"
                                        : "text-[40px] sm:text-[60px] lg:text-[75px]"
                                }`}
                            >
                                {current.text}
                            </p>
                            {/* Typed overlay, writes left-to-right. */}
                            <p
                                className={`type-body leading-[1.3] text-left absolute inset-0 ${
                                    current.emphasis
                                        ? "type-display-italic text-[color:var(--color-amber)] text-[50px] sm:text-[80px] lg:text-[100px] leading-[1.1]"
                                        : "text-[color:var(--color-bone)] text-[40px] sm:text-[60px] lg:text-[75px]"
                                }`}
                            >
                                {visible}
                                {isTyping && (
                                    <span
                                        aria-hidden
                                        className={`inline-block ml-1 w-[0.12em] h-[0.8em] align-[-0.1em] ${
                                            current.emphasis
                                                ? "bg-[color:var(--color-amber)]"
                                                : "bg-[color:var(--color-bone)]"
                                        }`}
                                        style={{ animation: "pulse-dot 0.9s ease-in-out infinite" }}
                                    />
                                )}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Skip affordance. */}
            {phase !== "done" && (
                <button
                    type="button"
                    onClick={() => setPhase("done")}
                    className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 type-mono text-[color:var(--color-bone-ghost)] hover:text-[color:var(--color-amber)] transition-colors"
                >
                    skip →
                </button>
            )}
        </div>
    );
}
