"use client";

import { useEffect, useState } from "react";

/**
 * Boot-up typewriter. Plays a sequence of terminal-like lines, then
 * hands off to the caller via onDone. The caller reveals the rest of
 * the page once the boot completes.
 */

type Line = {
    text: string;
    /** milliseconds between characters during this line. */
    speed?: number;
    /** milliseconds to wait AFTER this line finishes before starting next. */
    pauseAfter?: number;
    /** visual tone for this line. */
    tone?: "muted" | "primary" | "ok" | "warn";
};

const SCRIPT: Line[] = [
    { text: "> riverside university", tone: "muted", speed: 22 },
    { text: "> tuesday, 09:12", tone: "muted", speed: 22, pauseAfter: 220 },
    { text: "", speed: 0, pauseAfter: 160 },
    { text: "> coffee. laptop open. five emails waiting.", tone: "primary", speed: 28, pauseAfter: 320 },
    { text: "> one of them is not what it seems.", tone: "warn", speed: 34 },
];

export function BootSequence({ onDone }: { onDone: () => void }) {
    const [lineIndex, setLineIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [done, setDone] = useState(false);

    useEffect(() => {
        if (done) return;
        if (lineIndex >= SCRIPT.length) {
            setDone(true);
            const t = window.setTimeout(onDone, 500);
            return () => window.clearTimeout(t);
        }
        const line = SCRIPT[lineIndex];
        if (line.speed === 0 || charIndex >= line.text.length) {
            const pause = line.pauseAfter ?? 60;
            const t = window.setTimeout(() => {
                setLineIndex((i) => i + 1);
                setCharIndex(0);
            }, pause);
            return () => window.clearTimeout(t);
        }
        const t = window.setTimeout(
            () => setCharIndex((c) => c + 1),
            line.speed ?? 22,
        );
        return () => window.clearTimeout(t);
    }, [lineIndex, charIndex, onDone, done]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6">
            <div className="max-w-4xl w-full text-center">
                {SCRIPT.slice(0, lineIndex).map((line, i) => (
                    <Row key={i} line={line} text={line.text} />
                ))}
                {lineIndex < SCRIPT.length && (
                    <Row
                        line={SCRIPT[lineIndex]}
                        text={SCRIPT[lineIndex].text.slice(0, charIndex)}
                        caret
                    />
                )}
            </div>

            {/* Skip affordance. */}
            {!done && (
                <button
                    type="button"
                    onClick={() => {
                        setDone(true);
                        onDone();
                    }}
                    className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 type-mono text-[color:var(--color-bone-ghost)] hover:text-[color:var(--color-amber)] transition-colors"
                >
                    skip →
                </button>
            )}
        </div>
    );
}

function Row({
    line,
    text,
    caret,
}: {
    line: Line;
    text: string;
    caret?: boolean;
}) {
    const colour =
        line.tone === "primary"
            ? "text-[color:var(--color-bone)]"
            : line.tone === "ok"
              ? "text-[color:var(--color-signal-green)]"
              : line.tone === "warn"
                ? "text-[color:var(--color-amber)]"
                : "text-[color:var(--color-bone-muted)]";
    return (
        <div
            className={`font-mono text-lg sm:text-2xl lg:text-3xl leading-[1.6] tracking-wide ${colour}`}
            style={{ minHeight: "1.6em" }}
        >
            {text}
            {caret && (
                <span
                    aria-hidden
                    className="inline-block ml-1 w-[0.55em] h-[1em] translate-y-[2px] bg-[color:var(--color-amber)]"
                    style={{ animation: "pulse-dot 0.9s ease-in-out infinite" }}
                />
            )}
        </div>
    );
}
