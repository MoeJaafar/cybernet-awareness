"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

/**
 * Phone-call mock. The phone screen is just a visual — caller info,
 * accept button, call timer, mute/speaker/hangup. Subtitles and
 * decision options render BELOW the phone in normal page flow so the
 * phone never resizes.
 */

export interface CallerLine {
    text: string;
    speed?: number;
    hold?: number;
}

export interface PhoneCallProps {
    callerName: string;
    callerNumber: string;
    lines: CallerLine[];
    choices: { label: string; nextId: string }[];
    onChoice: (nextId: string) => void;
}

export function PhoneCall({
    callerName,
    callerNumber,
    lines,
    choices,
    onChoice,
}: PhoneCallProps) {
    const [phase, setPhase] = useState<"ringing" | "connected" | "deciding">("ringing");
    const [lineIndex, setLineIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [linePhase, setLinePhase] = useState<"type" | "hold">("type");
    const [elapsed, setElapsed] = useState(0);

    // Call timer.
    useEffect(() => {
        if (phase !== "connected" && phase !== "deciding") return;
        const id = setInterval(() => setElapsed((s) => s + 1), 1000);
        return () => clearInterval(id);
    }, [phase]);

    // Subtitle typewriter.
    useEffect(() => {
        if (phase !== "connected") return;
        if (lineIndex >= lines.length) { setPhase("deciding"); return; }
        const line = lines[lineIndex];
        if (linePhase === "type") {
            if (charIndex >= line.text.length) { setLinePhase("hold"); return; }
            const prev = line.text[charIndex - 1] ?? "";
            const delay = prev === "." ? 400 : prev === "," ? 200 : prev === "—" ? 260 : (line.speed ?? 32);
            const t = setTimeout(() => setCharIndex((c) => c + 1), delay);
            return () => clearTimeout(t);
        }
        if (linePhase === "hold") {
            const t = setTimeout(() => {
                setLineIndex((i) => i + 1);
                setCharIndex(0);
                setLinePhase("type");
            }, line.hold ?? 800);
            return () => clearTimeout(t);
        }
    }, [phase, lineIndex, charIndex, linePhase, lines]);

    const currentLine = lines[lineIndex];
    const subtitle = currentLine?.text.slice(0, charIndex) ?? "";
    const timerStr = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;

    return (
        <div className="flex flex-col items-center gap-8 w-full">
            {/* ========== PHONE FRAME ========== */}
            <div className="w-full max-w-[280px]">
                <div className="rounded-[32px] border-2 border-[color:var(--gmail-border)] bg-black overflow-hidden shadow-[0_24px_80px_-16px_rgba(0,0,0,0.8)]">
                    {/* Status bar. */}
                    <div className="px-6 pt-3 pb-1 flex items-center justify-between text-[11px] text-white/60">
                        <span>9:12</span>
                        <div className="flex items-center gap-1.5">
                            <span>5G</span>
                            <svg width="14" height="10" viewBox="0 0 14 10" fill="white" opacity="0.6">
                                <rect x="0" y="6" width="2" height="4" rx="0.5"/><rect x="3" y="4" width="2" height="6" rx="0.5"/>
                                <rect x="6" y="2" width="2" height="8" rx="0.5"/><rect x="9" y="0" width="2" height="10" rx="0.5"/>
                            </svg>
                        </div>
                    </div>

                    {/* Call content — fixed height. */}
                    <div className="px-8 pt-8 pb-5 flex flex-col items-center h-[400px]">
                        {/* Avatar. */}
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[color:var(--color-amber)]/40 to-[color:var(--color-amber)]/10 border border-white/10 flex items-center justify-center mb-3">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" opacity="0.7">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                            </svg>
                        </div>

                        <p className="text-white text-lg font-medium mb-0.5" style={{ fontFamily: "var(--font-gmail)" }}>
                            {callerName}
                        </p>
                        <p className="text-white/50 text-xs mb-2" style={{ fontFamily: "var(--font-gmail)" }}>
                            {callerNumber}
                        </p>

                        {phase === "ringing" && (
                            <motion.p
                                className="text-[color:var(--color-signal-green)] text-sm mb-auto"
                                animate={{ opacity: [1, 0.4, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                incoming call...
                            </motion.p>
                        )}

                        {(phase === "connected" || phase === "deciding") && (
                            <p className="text-white/40 text-xs font-mono mb-auto">{timerStr}</p>
                        )}

                        {/* Call buttons. */}
                        {phase === "ringing" && (
                            <div className="mt-auto flex flex-col items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setPhase("connected")}
                                    className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center transition-colors shadow-[0_0_24px_rgba(34,197,94,0.4)]"
                                    aria-label="Accept"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                        <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                                    </svg>
                                </button>
                                <span className="text-white/40 text-[11px]" style={{ fontFamily: "var(--font-gmail)" }}>
                                    tap to answer
                                </span>
                            </div>
                        )}

                        {phase === "connected" && (
                            <div className="mt-auto flex items-center gap-6">
                                <CallButton icon="mute" />
                                <CallButton icon="keypad" />
                                <CallButton icon="speaker" />
                            </div>
                        )}

                        {phase === "deciding" && (
                            <div className="mt-auto flex items-center gap-6">
                                <CallButton icon="mute" />
                                <CallButton icon="keypad" />
                                <CallButton icon="speaker" />
                                <button
                                    type="button"
                                    onClick={() => onChoice(choices[choices.length - 1]?.nextId ?? choices[0]?.nextId)}
                                    className="h-11 w-11 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center transition-colors"
                                    aria-label="End call"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white" transform="rotate(135)">
                                        <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Home indicator. */}
                    <div className="pb-2 flex justify-center">
                        <span className="h-1 w-24 rounded-full bg-white/20"></span>
                    </div>
                </div>
            </div>

            {/* ========== SUBTITLES + CHOICES (below phone, always takes space) ========== */}
            <div className="w-full max-w-xl min-h-[200px] flex flex-col gap-6">
                {/* Subtitle. */}
                {phase === "connected" && currentLine && (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={lineIndex}
                            className="relative w-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <p className="type-body text-xl sm:text-2xl leading-relaxed text-left invisible">
                                {currentLine.text}
                            </p>
                            <p className="type-body text-xl sm:text-2xl leading-relaxed text-left absolute inset-0 text-[color:var(--color-bone)]">
                                {subtitle}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                )}

                {/* Choices. */}
                {phase === "deciding" && (
                    <motion.div
                        className="flex flex-col gap-2"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <span className="h-px w-6 bg-[color:var(--color-amber)]"></span>
                            <span className="type-mono text-[color:var(--color-amber)]">
                                what do you say?
                            </span>
                        </div>
                        {choices.map((c, i) => (
                            <button
                                key={c.label}
                                type="button"
                                onClick={() => onChoice(c.nextId)}
                                className="group text-left border border-[color:var(--color-edge-subtle)] hover:border-[color:var(--color-amber)] bg-[color:var(--color-ink-raised)] hover:bg-[color:var(--color-ink-higher)] px-5 py-4 transition-colors"
                            >
                                <div className="flex items-start gap-4">
                                    <span className="type-display text-xl text-[color:var(--color-bone-ghost)] group-hover:text-[color:var(--color-amber)] w-6 shrink-0">
                                        {String.fromCharCode(65 + i)}
                                    </span>
                                    <span className="type-body text-base sm:text-lg text-[color:var(--color-bone)] leading-snug flex-1">
                                        {c.label}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}

function CallButton({ icon }: { icon: "mute" | "keypad" | "speaker" }) {
    const icons = {
        mute: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
        ),
        keypad: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white" opacity="0.7">
                <circle cx="6" cy="6" r="1.5"/><circle cx="12" cy="6" r="1.5"/><circle cx="18" cy="6" r="1.5"/>
                <circle cx="6" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/>
                <circle cx="6" cy="18" r="1.5"/><circle cx="12" cy="18" r="1.5"/><circle cx="18" cy="18" r="1.5"/>
            </svg>
        ),
        speaker: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
            </svg>
        ),
    };
    return (
        <button type="button" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label={icon}>
            {icons[icon]}
        </button>
    );
}
