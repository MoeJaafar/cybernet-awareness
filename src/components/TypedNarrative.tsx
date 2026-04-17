"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";

/**
 * Centered-screen typed narrative. Used for outcome / debrief / quiz
 * beats — anywhere the story speaks directly to the player rather than
 * happening on an interactive surface.
 *
 * `lines` is played in sequence. Each line types out, holds, fades to
 * the next. After the last line, `children` (the continue CTA, quiz
 * options, etc.) are revealed.
 */

export type NarrativeTone = "default" | "breach" | "contained" | "takeaway";

export function TypedNarrative({
    lines,
    tone = "default",
    speaker,
    children,
    finalEmphasis = false,
}: {
    lines: string[];
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
                  ? 160
                  : prev === "—"
                    ? 200
                    : 28;
        const t = window.setTimeout(() => setCharIndex((c) => c + 1), delay);
        return () => window.clearTimeout(t);
    }, [lineIndex, charIndex, phase, lines]);

    // Advance handler — click anywhere (see outer handler below) or
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
            className={`min-h-screen w-full ${toneBg} flex flex-col px-6 relative ${
                phase === "done" ? "" : "cursor-pointer select-none"
            }`}
            onClick={phase === "done" ? undefined : advance}
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
            <div className="relative pt-12 pb-4 max-w-3xl w-full mx-auto">
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

            {/* Middle section: typed text. Takes remaining space, centered vertically. */}
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
                                className={`type-body leading-[1.35] invisible text-left ${
                                    useEmphasis
                                        ? "type-display-italic text-[45px] sm:text-[65px] lg:text-[80px] leading-[1.1]"
                                        : "text-[32px] sm:text-[48px] lg:text-[55px]"
                                }`}
                            >
                                {current}
                            </p>
                            {/* Visible typed text, overlaid. Left-aligned
                             *  so characters grow left-to-right rather
                             *  than the middle sliding outward. */}
                            <p
                                className={`type-body leading-[1.35] absolute inset-0 text-left ${
                                    useEmphasis
                                        ? "type-display-italic text-[color:var(--color-amber)] text-[45px] sm:text-[65px] lg:text-[80px] leading-[1.1]"
                                        : "text-[color:var(--color-bone)] text-[32px] sm:text-[48px] lg:text-[55px]"
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
             *  Always takes space (min-h) so nothing shifts above. */}
            <div
                className="relative max-w-3xl w-full mx-auto pb-12 pt-6 min-h-[175px] flex flex-col justify-end"
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
                            className="type-mono text-[color:var(--color-bone-muted)]"
                            style={{
                                animation: "pulse-dot 1.6s ease-in-out infinite",
                            }}
                        >
                            click to continue
                        </span>
                        <span
                            aria-hidden
                            className="h-px w-8 bg-[color:var(--color-bone-muted)]"
                        ></span>
                        <span
                            aria-hidden
                            className="type-mono text-[color:var(--color-bone-muted)]"
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
