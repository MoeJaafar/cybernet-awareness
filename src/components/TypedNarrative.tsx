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
    const [phase, setPhase] = useState<"type" | "hold" | "done">("type");

    useEffect(() => {
        if (phase === "done") return;
        if (lineIndex >= lines.length) {
            setPhase("done");
            return;
        }
        const line = lines[lineIndex];
        if (phase === "type") {
            if (charIndex >= line.length) {
                setPhase("hold");
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
        }
        if (phase === "hold") {
            const isLast = lineIndex === lines.length - 1;
            const holdMs = isLast ? 700 : 900;
            const t = window.setTimeout(() => {
                if (isLast) {
                    setPhase("done");
                } else {
                    setLineIndex((i) => i + 1);
                    setCharIndex(0);
                    setPhase("type");
                }
            }, holdMs);
            return () => window.clearTimeout(t);
        }
    }, [lineIndex, charIndex, phase, lines]);

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
        <div className={`min-h-[calc(100vh-61px)] w-full ${toneBg} flex flex-col items-center justify-center px-6 py-12 relative`}>
            <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{ background: toneWash }}
            />

            <div className="relative max-w-3xl w-full flex flex-col items-start gap-10">
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
                                        ? "type-display-italic text-[36px] sm:text-[52px] lg:text-[64px] leading-[1.1]"
                                        : "text-[26px] sm:text-[38px] lg:text-[44px]"
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
                                        ? "type-display-italic text-[color:var(--color-amber)] text-[36px] sm:text-[52px] lg:text-[64px] leading-[1.1]"
                                        : "text-[color:var(--color-bone)] text-[26px] sm:text-[38px] lg:text-[44px]"
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

                {phase === "done" && children && (
                    <motion.div
                        className="flex flex-col items-center gap-4 pt-4"
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

/**
 * Break a paragraph into beats at sentence boundaries. Keeps the
 * period on each beat. Used so narration types one sentence at a
 * time instead of as a wall.
 */
export function splitBeats(paragraph: string): string[] {
    return paragraph
        .split(/(?<=\.|\?|\!) +/)
        .map((s) => s.trim())
        .filter(Boolean);
}
