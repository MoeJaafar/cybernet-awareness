"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { createNarratorAudio } from "@/lib/audio-settings";

/**
 * Centered-screen typed narrative. Used for outcome / debrief / quiz
 * beats, anywhere the story speaks directly to the player rather than
 * happening on an interactive surface.
 *
 * `lines` is played in sequence. Each line types out, holds, fades to
 * the next. After the last line, `children` (the continue CTA, quiz
 * options, etc.) are revealed.
 */

export type NarrativeTone = "default" | "breach" | "contained" | "takeaway";

export function TypedNarrative({
    lines,
    audioPaths,
    tone = "default",
    speaker,
    children,
    finalEmphasis = false,
}: {
    lines: string[];
    /** One audio URL per beat, aligned to `lines`. Missing entries
     *  render silently. Plays when the beat starts typing. */
    audioPaths?: (string | undefined)[];
    tone?: NarrativeTone;
    speaker?: string;
    /** Revealed after the last line is typed. */
    children?: ReactNode;
    /** If true, the last line is rendered in italic amber for punch. */
    finalEmphasis?: boolean;
}) {
    const [lineIndex, setLineIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    /**
     * Phases:
     *   type : typewriter is in motion
     *   wait : line finished typing, waiting for the player to click
     *   done : every line is shown, CTA children revealed
     */
    const [phase, setPhase] = useState<"type" | "wait" | "done">("type");

    // Audio playback, fires when lineIndex changes. Held in a ref so
    // a new audioPaths reference (from parent render) doesn't restart
    // playback; only actual beat changes do.
    const audioPathsRef = useRef(audioPaths);
    audioPathsRef.current = audioPaths;
    useEffect(() => {
        const path = audioPathsRef.current?.[lineIndex];
        if (!path) return;
        const { audio, release } = createNarratorAudio(path);
        audio.play().catch(() => {});
        return release;
    }, [lineIndex]);

    // Typewriter drive: only active during "type". When the line
    // finishes, move to "wait" (player click advances) instead of
    // auto-advancing on a timer.
    useEffect(() => {
        if (phase !== "type") return;
        if (lineIndex >= lines.length) return;
        const line = lines[lineIndex];
        if (charIndex >= line.length) {
            setPhase("wait");
            return;
        }
        const prev = line[charIndex - 1] ?? "";
        const delay =
            prev === "."
                ? 320
                : prev === ","
                  ? 180
                  : 28;
        const t = window.setTimeout(() => setCharIndex((c) => c + 1), delay);
        return () => window.clearTimeout(t);
    }, [lineIndex, charIndex, phase, lines]);

    // Advance handler, click anywhere (see outer handler below) or
    // Enter/Space/ArrowRight. Two behaviours:
    //   - during "type": skip to end of current line
    //   - during "wait": move on to the next line, or finish
    const advance = () => {
        if (phase === "type") {
            const line = lines[lineIndex];
            setCharIndex(line?.length ?? 0);
            setPhase("wait");
            return;
        }
        if (phase === "wait") {
            const isLast = lineIndex === lines.length - 1;
            if (isLast) {
                setPhase("done");
            } else {
                setLineIndex((i) => i + 1);
                setCharIndex(0);
                setPhase("type");
            }
            return;
        }
    };

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (phase === "done") return;
            if (
                e.key === "Enter" ||
                e.key === " " ||
                e.key === "ArrowRight"
            ) {
                e.preventDefault();
                advance();
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase, lineIndex, charIndex]);

    const current = lines[lineIndex];
    const visible = phase === "done" ? lines[lines.length - 1] : current?.slice(0, charIndex) ?? "";
    const isTyping = phase === "type" && charIndex < (current?.length ?? 0);
    const isLast = lineIndex === lines.length - 1 || phase === "done";
    const useEmphasis = finalEmphasis && isLast;

    const toneBg =
        tone === "breach"
            ? "bg-[color:var(--color-ink-deep)]"
            : tone === "contained"
              ? "bg-[color:var(--color-ink-deep)]"
              : "bg-[color:var(--color-ink-base)]";

    const toneWash =
        tone === "breach"
            ? "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(214,69,69,0.12), transparent 70%)"
            : tone === "contained"
              ? "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(122,148,100,0.11), transparent 70%)"
              : tone === "takeaway"
                ? "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(255,153,51,0.09), transparent 70%)"
                : "none";

    const speakerColour =
        tone === "breach"
            ? "text-[color:var(--color-signal-red)]"
            : tone === "contained"
              ? "text-[color:var(--color-signal-green)]"
              : "text-[color:var(--color-amber)]";

    return (
        <div
            className={`min-h-[100dvh] sm:min-h-screen w-full ${toneBg} flex flex-col px-4 sm:px-6 relative ${
                phase === "done" ? "" : "cursor-pointer select-none"
            }`}
            onClick={phase === "done" ? undefined : advance}
            onKeyDown={
                phase === "done"
                    ? undefined
                    : (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              advance();
                          }
                      }
            }
            role={phase === "done" ? undefined : "button"}
            tabIndex={phase === "done" ? undefined : 0}
            aria-label={
                phase === "type"
                    ? "skip to end of line"
                    : phase === "wait"
                      ? "continue"
                      : undefined
            }
        >
            <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{ background: toneWash }}
            />

            {/* Top section: speaker label. Fixed position at top. */}
            <div className="relative pt-4 sm:pt-12 pb-1 sm:pb-4 max-w-3xl w-full mx-auto">
                {speaker && (
                    <motion.div
                        className="flex items-center gap-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        <span
                            className={`h-px w-6 ${speakerColour.replace("text", "bg")}`}
                        ></span>
                        <span className={`type-mono ${speakerColour}`}>
                            {speaker}
                        </span>
                        <span
                            className={`h-px w-6 ${speakerColour.replace("text", "bg")}`}
                        ></span>
                    </motion.div>
                )}
            </div>

            {/* Middle section: typed text. Takes remaining vertical
             *  space on every screen size and centers the text inside
             *  it so the narration reads as cinematic rather than
             *  stacked at the top. */}
            <div className="relative flex-1 flex items-center max-w-3xl w-full mx-auto">

                <AnimatePresence mode="wait">
                    {lineIndex < lines.length && (
                        <motion.div
                            key={lineIndex}
                            className="relative w-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, transition: { duration: 0.4 } }}
                            transition={{ duration: 0.5 }}
                        >
                            {/*
                             * Ghost paragraph reserves the FINAL height so
                             * the layout doesn't jump as new lines of text
                             * wrap in. It must use identical font, size,
                             * and leading to the visible overlay so the
                             * wrap points match.
                             */}
                            <p
                                aria-hidden
                                className={`invisible text-left ${
                                    useEmphasis
                                        ? "type-display-italic text-[24px] sm:text-[65px] lg:text-[80px] leading-[1.15]"
                                        : "type-narrator text-[28px] sm:text-[60px] lg:text-[72px] leading-[1.05]"
                                }`}
                            >
                                {current}
                            </p>
                            {/* Visible typed text, overlaid. Left-aligned
                             *  so characters grow left-to-right rather
                             *  than the middle sliding outward. */}
                            <p
                                className={`absolute inset-0 text-left ${
                                    useEmphasis
                                        ? "type-display-italic text-[color:var(--color-amber)] text-[28px] sm:text-[65px] lg:text-[80px] leading-[1.15]"
                                        : "type-narrator text-[color:var(--color-bone)] text-[28px] sm:text-[60px] lg:text-[72px] leading-[1.05]"
                                }`}
                            >
                                {visible}
                                {isTyping && (
                                    <span
                                        aria-hidden
                                        className={`inline-block ml-1 w-[0.08em] h-[0.75em] align-[-0.08em] ${
                                            useEmphasis
                                                ? "bg-[color:var(--color-amber)]"
                                                : "bg-[color:var(--color-bone)]"
                                        }`}
                                        style={{
                                            animation:
                                                "pulse-dot 0.9s ease-in-out infinite",
                                        }}
                                    />
                                )}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom dock: continue hint / CTA / quiz options.
             *  Anchored to the bottom of the viewport so the centered
             *  narration in the middle section has room to breathe. */}
            <div
                className="relative max-w-3xl w-full mx-auto pb-6 sm:pb-12 pt-3 sm:pt-6 min-h-[100px] sm:min-h-[175px] flex flex-col justify-end"
                onClick={(e) => e.stopPropagation()}
            >
                {phase === "wait" && (
                    <motion.div
                        className="flex items-center gap-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <span
                            className="type-mono text-[color:var(--color-amber)]"
                            style={{
                                animation: "soft-pulse 1.8s ease-in-out infinite",
                            }}
                        >
                            click to continue
                        </span>
                        <span
                            aria-hidden
                            className="h-px w-8 bg-[color:var(--color-amber)]/60"
                        ></span>
                        <span
                            aria-hidden
                            className="type-mono text-[color:var(--color-amber)]"
                        >
                            ↵
                        </span>
                    </motion.div>
                )}

                {phase === "done" && children && (
                    <motion.div
                        className="flex flex-col items-start gap-4 w-full"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        {children}
                    </motion.div>
                )}
            </div>
        </div>
    );
}

// splitBeats moved to src/lib/beats.ts so the audio-gen script can
// import it without pulling React. Re-exported here for any callers
// that import from the component file.
export { splitBeats } from "@/lib/beats";
