"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { createNarratorAudio } from "@/lib/audio-settings";
import { useLocale, useMessages } from "@/lib/i18n/use-locale";
import { bootAudioPath } from "@/lib/audio-paths";

/**
 * Opening story beat. Types out one line of prose at a time, fades
 * to the next. When every line has played the intro hands off to the
 * caller via onDone.
 *
 * The intro is gated behind a "tap to begin" overlay so the user has
 * made a gesture before any audio plays, this is the only reliable
 * way to unblock browser autoplay for the rest of the session.
 */

export function BootSequence({ onDone }: { onDone: () => void }) {
    const locale = useLocale();
    const m = useMessages();
    const SCRIPT = m.boot.lines;

    const [lineIndex, setLineIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [phase, setPhase] = useState<"type" | "hold" | "done">("type");
    const currentReleaseRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        if (lineIndex >= SCRIPT.length) return;
        const { audio, release } = createNarratorAudio(
            bootAudioPath(locale, lineIndex + 1),
        );
        currentReleaseRef.current = release;
        audio.play().catch(() => {});
        return () => {
            currentReleaseRef.current = null;
            release();
        };
    }, [lineIndex, locale, SCRIPT.length]);

    useEffect(() => {
        if (phase === "done") {
            currentReleaseRef.current?.();
            currentReleaseRef.current = null;
        }
    }, [phase]);

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
                prev === "." || prev === "؟"
                    ? 380
                    : prev === "," || prev === "،"
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
    }, [lineIndex, charIndex, phase, onDone, SCRIPT]);

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
                            <p
                                aria-hidden
                                className={`text-start invisible ${
                                    current.emphasis
                                        ? "type-display-italic text-[34px] sm:text-[80px] lg:text-[100px] leading-[1.1]"
                                        : "type-narrator text-[32px] sm:text-[72px] lg:text-[90px] leading-[1.05]"
                                }`}
                            >
                                {current.text}
                            </p>
                            <p
                                className={`text-start absolute inset-0 ${
                                    current.emphasis
                                        ? "type-display-italic text-[color:var(--color-amber)] text-[50px] sm:text-[80px] lg:text-[100px] leading-[1.1]"
                                        : "type-narrator text-[color:var(--color-bone)] text-[32px] sm:text-[72px] lg:text-[90px] leading-[1.05]"
                                }`}
                            >
                                {visible}
                                {isTyping && (
                                    <span
                                        aria-hidden
                                        className={`inline-block ms-1 w-[0.12em] h-[0.8em] align-[-0.1em] ${
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

            {phase !== "done" && (
                <button
                    type="button"
                    onClick={() => setPhase("done")}
                    className="absolute bottom-6 end-6 sm:bottom-10 sm:end-10 type-mono text-[color:var(--color-bone-ghost)] hover:text-[color:var(--color-amber)] transition-colors"
                >
                    {m.boot.skipLabel}
                </button>
            )}
        </div>
    );
}
