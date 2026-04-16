"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

/**
 * Phone-call mock. Three phases:
 *   1. Ringing — incoming call screen with accept/decline buttons.
 *   2. Connected — caller speaks line by line (subtitles), with an
 *      optional audio URL per line for AI-generated voice playback.
 *   3. Decision — after the caller finishes, choice buttons appear
 *      at the bottom of the call screen.
 */

export interface CallerLine {
    text: string;
    /** ms per character for the subtitle typewriter — default 32. */
    speed?: number;
    /** ms to hold after the line is fully typed — default 800. */
    hold?: number;
    /** Optional AI-gen audio file. Playback is async; the typewriter
     *  drives pacing regardless. */
    audio?: string;
}

export interface PhoneCallProps {
    callerName: string;
    callerNumber: string;
    /** Lines the caller says once the call is accepted. */
    lines: CallerLine[];
    /** Choices shown after all lines have played. */
    choices: { label: string; nextId: string }[];
    onChoice: (nextId: string) => void;
    /** Fire if the player declines the call. */
    onDecline?: (nextId: string) => void;
    /** Scene to go to if declined. */
    declineNextId?: string;
}

export function PhoneCall({
    callerName,
    callerNumber,
    lines,
    choices,
    onChoice,
    onDecline,
    declineNextId,
}: PhoneCallProps) {
    const [phase, setPhase] = useState<"ringing" | "connected" | "deciding">(
        "ringing",
    );
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
        if (lineIndex >= lines.length) {
            setPhase("deciding");
            return;
        }
        const line = lines[lineIndex];
        if (linePhase === "type") {
            if (charIndex >= line.text.length) {
                setLinePhase("hold");
                return;
            }
            const prev = line.text[charIndex - 1] ?? "";
            const delay =
                prev === "." ? 400 : prev === "," ? 200 : prev === "—" ? 260 : (line.speed ?? 32);
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

    // Audio playback per line.
    useEffect(() => {
        if (phase !== "connected") return;
        const line = lines[lineIndex];
        if (!line?.audio) return;
        const audio = new Audio(line.audio);
        audio.play().catch(() => {});
        return () => { audio.pause(); audio.currentTime = 0; };
    }, [phase, lineIndex, lines]);

    const currentLine = lines[lineIndex];
    const subtitle = currentLine?.text.slice(0, charIndex) ?? "";
    const timerStr = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;

    return (
        <div className="w-full max-w-sm mx-auto">
            {/* Phone frame. */}
            <div className="rounded-[32px] border-2 border-[color:var(--gmail-border)] bg-black overflow-hidden shadow-[0_24px_80px_-16px_rgba(0,0,0,0.8)]">
                {/* Status bar. */}
                <div className="px-6 pt-3 pb-1 flex items-center justify-between text-[11px] text-white/60">
                    <span>9:12</span>
                    <div className="flex items-center gap-1.5">
                        <span>5G</span>
                        <svg width="14" height="10" viewBox="0 0 14 10" fill="white" opacity="0.6">
                            <rect x="0" y="6" width="2" height="4" rx="0.5"/>
                            <rect x="3" y="4" width="2" height="6" rx="0.5"/>
                            <rect x="6" y="2" width="2" height="8" rx="0.5"/>
                            <rect x="9" y="0" width="2" height="10" rx="0.5"/>
                        </svg>
                        <svg width="20" height="10" viewBox="0 0 20 10" fill="none" stroke="white" strokeWidth="1" opacity="0.6">
                            <rect x="0.5" y="1.5" width="16" height="7" rx="1.5"/>
                            <rect x="17" y="3" width="2" height="4" rx="0.5" fill="white" opacity="0.4"/>
                            <rect x="2" y="3" width="10" height="4" rx="0.5" fill="white" opacity="0.6"/>
                        </svg>
                    </div>
                </div>

                {/* Call content area. */}
                <div className="px-6 pt-8 pb-6 flex flex-col items-center min-h-[480px]">
                    {/* Caller avatar. */}
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[color:var(--color-amber)]/40 to-[color:var(--color-amber)]/10 border border-white/10 flex items-center justify-center mb-4">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" opacity="0.7">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>
                    </div>

                    <p className="text-white text-xl font-medium mb-1" style={{ fontFamily: "var(--font-gmail)" }}>
                        {callerName}
                    </p>
                    <p className="text-white/50 text-sm mb-2" style={{ fontFamily: "var(--font-gmail)" }}>
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
                        <p className="text-white/40 text-sm font-mono mb-4">
                            {timerStr}
                        </p>
                    )}

                    {/* Subtitle area. */}
                    {phase === "connected" && (
                        <div className="flex-1 flex items-end w-full pb-4">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={lineIndex}
                                    className="w-full relative"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <p className="text-white/0 text-base leading-relaxed" style={{ fontFamily: "var(--font-gmail)" }}>
                                        {currentLine?.text}
                                    </p>
                                    <p className="absolute inset-0 text-white text-base leading-relaxed" style={{ fontFamily: "var(--font-gmail)" }}>
                                        {subtitle}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Decision choices after caller finishes. */}
                    {phase === "deciding" && (
                        <motion.div
                            className="flex-1 flex flex-col justify-end w-full gap-2 pb-4"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                        >
                            <p className="text-white/50 text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-gmail)" }}>
                                what do you say?
                            </p>
                            {choices.map((c, i) => (
                                <button
                                    key={c.label}
                                    type="button"
                                    onClick={() => onChoice(c.nextId)}
                                    className="group text-left border border-white/10 hover:border-[color:var(--color-amber)] bg-white/5 hover:bg-white/10 px-4 py-3 transition-colors rounded-lg"
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="text-white/30 group-hover:text-[color:var(--color-amber)] text-sm transition-colors">
                                            {String.fromCharCode(65 + i)}
                                        </span>
                                        <span className="text-white text-sm leading-snug" style={{ fontFamily: "var(--font-gmail)" }}>
                                            {c.label}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </motion.div>
                    )}

                    {/* Call buttons. */}
                    {phase === "ringing" && (
                        <div className="mt-auto flex items-center gap-12">
                            <button
                                type="button"
                                onClick={() => {
                                    if (onDecline && declineNextId) onDecline(declineNextId);
                                }}
                                className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center transition-colors shadow-[0_0_24px_rgba(239,68,68,0.4)]"
                                aria-label="Decline"
                            >
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="white" transform="rotate(135)">
                                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                                </svg>
                            </button>
                            <button
                                type="button"
                                onClick={() => setPhase("connected")}
                                className="h-16 w-16 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center transition-colors shadow-[0_0_24px_rgba(34,197,94,0.4)]"
                                aria-label="Accept"
                            >
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                                </svg>
                            </button>
                        </div>
                    )}

                    {(phase === "connected" || phase === "deciding") && (
                        <div className="mt-4 flex items-center gap-8">
                            <CallButton icon="mute" />
                            <CallButton icon="keypad" />
                            <CallButton icon="speaker" />
                            <button
                                type="button"
                                onClick={() => {
                                    if (onDecline && declineNextId) onDecline(declineNextId);
                                }}
                                className="h-14 w-14 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center transition-colors"
                                aria-label="End call"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="white" transform="rotate(135)">
                                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                                </svg>
                            </button>
                        </div>
                    )}
                </div>

                {/* Home indicator. */}
                <div className="pb-2 flex justify-center">
                    <span className="h-1 w-28 rounded-full bg-white/20"></span>
                </div>
            </div>
        </div>
    );
}

function CallButton({ icon }: { icon: "mute" | "keypad" | "speaker" }) {
    const icons = {
        mute: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
        ),
        keypad: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" opacity="0.7">
                <circle cx="6" cy="6" r="1.5"/><circle cx="12" cy="6" r="1.5"/><circle cx="18" cy="6" r="1.5"/>
                <circle cx="6" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/>
                <circle cx="6" cy="18" r="1.5"/><circle cx="12" cy="18" r="1.5"/><circle cx="18" cy="18" r="1.5"/>
            </svg>
        ),
        speaker: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
            </svg>
        ),
    };
    return (
        <button
            type="button"
            className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label={icon}
        >
            {icons[icon]}
        </button>
    );
}
