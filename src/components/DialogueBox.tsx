"use client";

import { motion } from "motion/react";
import { useEffect, useState, useRef, type ReactNode } from "react";

/**
 * Dialogue dock. Glass surface with an amber left accent, editorial
 * serif body type, speaker label in monospaced micro-caps. The
 * typewriter slows on periods/commas to give the text breathing room.
 */
export function DialogueBox({
    speaker,
    text,
    instant = false,
    tone = "default",
    children,
}: {
    speaker?: string;
    text: string;
    instant?: boolean;
    tone?: "default" | "breach" | "contained";
    children?: ReactNode;
}) {
    const revealed = useTypewriter(text, instant);
    const complete = revealed.length >= text.length;

    const accentClass =
        tone === "breach"
            ? "border-l-[color:var(--color-signal-red)] before:bg-[color:var(--color-signal-red)]"
            : tone === "contained"
              ? "border-l-[color:var(--color-signal-green)] before:bg-[color:var(--color-signal-green)]"
              : "border-l-[color:var(--color-amber)] before:bg-[color:var(--color-amber)]";

    const speakerColour =
        tone === "breach"
            ? "text-[color:var(--color-signal-red)]"
            : tone === "contained"
              ? "text-[color:var(--color-signal-green)]"
              : "text-[color:var(--color-amber)]";

    return (
        <motion.section
            className={`relative border-l-2 ${accentClass} bg-[color:var(--color-ink-deep)]/85 backdrop-blur-xl px-6 sm:px-8 py-6 sm:py-7 shadow-[0_24px_64px_-20px_rgba(0,0,0,0.85)]`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            {speaker && (
                <p className={`type-mono mb-3 ${speakerColour}`}>
                    {speaker}
                </p>
            )}

            <div
                className="type-body text-[17px] sm:text-[18px] leading-[1.55] text-[color:var(--color-bone)] min-h-[2.8em]"
                dangerouslySetInnerHTML={{
                    __html: revealed.replace(
                        /\*\*(.+?)\*\*/g,
                        '<em class="type-display-italic text-[color:var(--color-amber)] not-italic">$1</em>',
                    ),
                }}
            />

            {/* Continue caret , blinking when the line is finished. */}
            {complete && !children && (
                <span
                    aria-hidden
                    className="inline-block ml-1 w-[0.4em] h-[0.9em] align-middle bg-[color:var(--color-amber)]"
                    style={{ animation: "pulse-dot 1.1s ease-in-out infinite" }}
                />
            )}

            {children && (
                <div className="mt-7 flex flex-col gap-3">{children}</div>
            )}
        </motion.section>
    );
}

/**
 * Typewriter that slows at sentence boundaries. Returns a prefix of
 * `text` growing over time.
 *
 * Timings per-character:
 *   default    18 ms
 *   after ','  120 ms
 *   after '.'  260 ms
 *   after ','  180 ms
 */
function useTypewriter(text: string, instant: boolean): string {
    const [n, setN] = useState(instant ? text.length : 0);
    const lastTextRef = useRef(text);

    useEffect(() => {
        if (lastTextRef.current !== text) {
            lastTextRef.current = text;
            setN(instant ? text.length : 0);
        }
    }, [text, instant]);

    useEffect(() => {
        if (instant) return;
        if (n >= text.length) return;
        const prev = text[n - 1] ?? "";
        const delay =
            prev === "."
                ? 260
                : prev === ","
                  ? 150
                  : prev === "\n"
                    ? 260
                    : 18;
        const id = window.setTimeout(() => setN((k) => k + 1), delay);
        return () => window.clearTimeout(id);
    }, [n, text, instant]);

    return text.slice(0, n);
}
