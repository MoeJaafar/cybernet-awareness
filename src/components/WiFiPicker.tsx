"use client";

import { motion } from "motion/react";

/**
 * OS-style Wi-Fi picker. The network list IS the decision — tapping
 * a row advances the scenario. One entry is deliberately tempting
 * (open + full bars), one is the legitimate venue network, and one
 * is your phone's tether.
 */

export interface WiFiNetwork {
    ssid: string;
    /** Signal strength 1..4. */
    bars: 1 | 2 | 3 | 4;
    locked: boolean;
    /** Visible caption beneath the SSID. */
    note?: string;
    /** Renders with the tether icon instead of a standard AP icon. */
    kind?: "wifi" | "tether";
    /** Scene to advance to when this network is picked. */
    nextId: string;
}

export interface WiFiPickerProps {
    /** Contextual location shown above the picker ("Café Brew, 3:12 PM"). */
    location: string;
    networks: WiFiNetwork[];
    onPick: (nextId: string) => void;
}

export function WiFiPicker({ location, networks, onPick }: WiFiPickerProps) {
    return (
        <div className="flex flex-col items-center gap-8 w-full">
            <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-[420px] rounded-xl overflow-hidden border border-white/10 bg-[#121316] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)]"
            >
                {/* Title bar. */}
                <div className="px-4 py-3 flex items-center justify-between bg-gradient-to-b from-[#1a1c20] to-[#121316] border-b border-white/5">
                    <div className="flex items-center gap-2.5">
                        <WifiGlyph bars={4} />
                        <span
                            className="text-white text-sm font-medium"
                            style={{ fontFamily: "var(--font-gmail)" }}
                        >
                            Wi-Fi
                        </span>
                    </div>
                    <span className="text-white/30 text-[11px] type-mono">
                        {location}
                    </span>
                </div>

                {/* Network list. */}
                <ul role="listbox" aria-label="Available networks" className="divide-y divide-white/5">
                    {networks.map((n, i) => (
                        <motion.li
                            key={n.ssid}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.35, delay: 0.15 + i * 0.08 }}
                        >
                            <button
                                type="button"
                                onClick={() => onPick(n.nextId)}
                                className="group w-full text-left px-4 py-3 flex items-center gap-4 hover:bg-white/[0.04] transition-colors"
                            >
                                {/* Leading icon. */}
                                <span className="shrink-0 text-white/70 group-hover:text-[color:var(--color-amber)] transition-colors">
                                    {n.kind === "tether" ? (
                                        <TetherGlyph />
                                    ) : (
                                        <WifiGlyph bars={n.bars} />
                                    )}
                                </span>
                                {/* SSID + note. */}
                                <span className="flex-1 min-w-0">
                                    <span
                                        className="block text-white text-[15px] leading-tight truncate"
                                        style={{ fontFamily: "var(--font-gmail)" }}
                                    >
                                        {n.ssid}
                                    </span>
                                    {n.note && (
                                        <span className="block text-white/40 text-[11px] mt-0.5 truncate type-mono">
                                            {n.note}
                                        </span>
                                    )}
                                </span>
                                {/* Lock / chevron. */}
                                <span className="shrink-0 flex items-center gap-2 text-white/40 group-hover:text-[color:var(--color-amber)] transition-colors">
                                    {n.locked && <LockGlyph />}
                                    <span aria-hidden className="type-mono text-sm">
                                        →
                                    </span>
                                </span>
                            </button>
                        </motion.li>
                    ))}
                </ul>
            </motion.div>

            {/* Hint strip. */}
            <p className="type-mono text-[color:var(--color-bone-muted)] text-center max-w-md text-[13px]">
                pick a network to connect and send the report
            </p>
        </div>
    );
}

function WifiGlyph({ bars }: { bars: 1 | 2 | 3 | 4 }) {
    const activeFill = "currentColor";
    const dimFill = "rgba(255,255,255,0.15)";
    const arcFill = (idx: number) => (bars >= idx ? activeFill : dimFill);
    return (
        <svg width="18" height="14" viewBox="0 0 24 18" fill="none" aria-hidden>
            <path
                d="M12 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
                fill={arcFill(1)}
            />
            <path
                d="M5.64 10.64a8 8 0 0 1 12.72 0l-1.5 1.5a6 6 0 0 0-9.72 0l-1.5-1.5z"
                fill={arcFill(2)}
            />
            <path
                d="M2 7a14 14 0 0 1 20 0l-1.5 1.5a12 12 0 0 0-17 0L2 7z"
                fill={arcFill(3)}
            />
            <path
                d="M-0.5 4a17.5 17.5 0 0 1 25 0l-1.5 1.5a15.5 15.5 0 0 0-22 0L-0.5 4z"
                fill={arcFill(4)}
            />
        </svg>
    );
}

function LockGlyph() {
    return (
        <svg width="11" height="13" viewBox="0 0 11 13" fill="none" aria-hidden>
            <rect x="1" y="5.5" width="9" height="7" rx="1" stroke="currentColor" strokeWidth="1.1" />
            <path
                d="M3 5.5V3.5a2.5 2.5 0 1 1 5 0v2"
                stroke="currentColor"
                strokeWidth="1.1"
            />
        </svg>
    );
}

function TetherGlyph() {
    return (
        <svg width="16" height="14" viewBox="0 0 20 18" fill="none" aria-hidden>
            <rect
                x="7"
                y="1"
                width="8"
                height="14"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.2"
            />
            <circle cx="11" cy="13" r="0.9" fill="currentColor" />
            <path
                d="M3 5c0 2 1.2 3.3 3 3.3M3 9c0 .8.4 1.3 1 1.3"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
            />
        </svg>
    );
}
