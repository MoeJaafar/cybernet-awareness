"use client";

import { motion } from "motion/react";

/**
 * iOS-style Wi-Fi settings screen rendered inside a phone frame. The
 * network list IS the decision, tapping a row advances the scenario.
 * One entry is deliberately tempting (open, full bars, no lock), one
 * is the legitimate venue network (captive portal hint), and one is
 * "Mobile Data", turning Wi-Fi off entirely.
 */

export interface WiFiNetwork {
    ssid: string;
    /** Signal strength 1..4. */
    bars: 1 | 2 | 3 | 4;
    locked: boolean;
    /** Visible caption beneath the SSID (e.g. "requires sign-in"). */
    note?: string;
    /** Renders with the cellular-data icon instead of a Wi-Fi icon. */
    kind?: "wifi" | "tether";
    /** Scene to advance to when this network is picked. */
    nextId: string;
}

export interface WiFiPickerProps {
    /** Time-of-day caption shown in the phone's status bar. */
    location: string;
    networks: WiFiNetwork[];
    onPick: (nextId: string) => void;
}

export function WiFiPicker({ location, networks, onPick }: WiFiPickerProps) {
    // "Café Brew · 3:12 PM" → status-bar time is the part after the bullet.
    const statusTime = location.includes("·")
        ? location.split("·").pop()?.trim() ?? "3:12"
        : location;

    const wifiNetworks = networks.filter((n) => n.kind !== "tether");
    const tether = networks.find((n) => n.kind === "tether");

    return (
        <div className="flex flex-col items-center gap-8 w-full">
            {/* ========== PHONE FRAME ========== */}
            <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-[min(350px,90vw)]"
            >
                <div className="rounded-[40px] border-2 border-[color:var(--gmail-border)] bg-black overflow-hidden shadow-[0_24px_80px_-16px_rgba(0,0,0,0.8)]">
                    {/* Status bar. */}
                    <div className="px-6 pt-3 pb-1 flex items-center justify-between text-[14px] text-white/70">
                        <span className="tabular-nums">{statusTime}</span>
                        <div className="flex items-center gap-1.5">
                            <span>5G</span>
                            <svg width="14" height="10" viewBox="0 0 14 10" fill="white" opacity="0.8">
                                <rect x="0" y="6" width="2" height="4" rx="0.5" />
                                <rect x="3" y="4" width="2" height="6" rx="0.5" />
                                <rect x="6" y="2" width="2" height="8" rx="0.5" />
                                <rect x="9" y="0" width="2" height="10" rx="0.5" />
                            </svg>
                        </div>
                    </div>

                    {/* Settings screen, fixed height so phone doesn't resize between choices. */}
                    <div className="px-0 pt-3 pb-4 flex flex-col h-[525px] bg-[#0a0a0b]">
                        {/* Header with "< Settings" back arrow + centered "Wi-Fi" title. */}
                        <div className="px-4 pb-3 flex items-center">
                            <span className="text-[#0a84ff] text-[16px] flex items-center gap-0.5" style={{ fontFamily: "var(--font-gmail)" }}>
                                <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
                                    <path d="M8 2 3 7l5 5" stroke="#0a84ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Settings
                            </span>
                            <span
                                className="flex-1 text-center text-white text-[19px] font-semibold -ml-[90px]"
                                style={{ fontFamily: "var(--font-gmail)" }}
                            >
                                Wi-Fi
                            </span>
                        </div>

                        {/* Wi-Fi toggle row. */}
                        <div className="mx-4 mt-2 rounded-xl bg-[#1c1c1e] px-4 py-3 flex items-center justify-between">
                            <span className="text-white text-[18px]" style={{ fontFamily: "var(--font-gmail)" }}>
                                Wi-Fi
                            </span>
                            <span className="relative inline-block w-[42px] h-[25px] rounded-full bg-[#30d158]">
                                <span className="absolute right-[3px] top-[3px] w-[20px] h-[20px] rounded-full bg-white shadow-sm"></span>
                            </span>
                        </div>

                        {/* Section header. */}
                        <p className="px-5 pt-5 pb-1.5 text-white/40 text-[14px] tracking-[0.06em]" style={{ fontFamily: "var(--font-gmail)" }}>
                            NETWORKS
                        </p>

                        {/* Network rows (the two Wi-Fi options). */}
                        <ul role="listbox" aria-label="Available networks" className="mx-4 rounded-xl bg-[#1c1c1e] divide-y divide-white/[0.06]">
                            {wifiNetworks.map((n) => (
                                <li key={n.ssid}>
                                    <button
                                        type="button"
                                        onClick={() => onPick(n.nextId)}
                                        className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-white/[0.03] transition-colors"
                                    >
                                        <span className="flex-1 min-w-0">
                                            <span
                                                className="block text-white text-[18px] leading-tight truncate"
                                                style={{ fontFamily: "var(--font-gmail)" }}
                                            >
                                                {n.ssid}
                                            </span>
                                            {n.note && (
                                                <span
                                                    className="block text-white/45 text-[13px] mt-0.5 truncate"
                                                    style={{ fontFamily: "var(--font-gmail)" }}
                                                >
                                                    {n.note}
                                                </span>
                                            )}
                                        </span>
                                        <span className="shrink-0 flex items-center gap-1.5 text-white/80">
                                            {n.locked && <LockGlyph />}
                                            <WifiBars bars={n.bars} />
                                            <InfoGlyph />
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>

                        {/* Mobile-data / tether option, shown as a separate control below the
                         *  network list. Realistic: choosing it is "turn off Wi-Fi, use cellular". */}
                        {tether && (
                            <>
                                <p className="px-5 pt-5 pb-1.5 text-white/40 text-[14px] tracking-[0.06em]" style={{ fontFamily: "var(--font-gmail)" }}>
                                    OR
                                </p>
                                <button
                                    type="button"
                                    onClick={() => onPick(tether.nextId)}
                                    className="mx-4 rounded-xl bg-[#1c1c1e] hover:bg-white/[0.03] px-4 py-3 flex items-center gap-3 text-left transition-colors"
                                >
                                    <span className="shrink-0 text-white/80">
                                        <CellularGlyph />
                                    </span>
                                    <span className="flex-1 min-w-0">
                                        <span
                                            className="block text-white text-[18px] leading-tight truncate"
                                            style={{ fontFamily: "var(--font-gmail)" }}
                                        >
                                            Use Mobile Data
                                        </span>
                                        <span
                                            className="block text-white/45 text-[13px] mt-0.5 truncate"
                                            style={{ fontFamily: "var(--font-gmail)" }}
                                        >
                                            turn off Wi-Fi, use 5G
                                        </span>
                                    </span>
                                    <span aria-hidden className="shrink-0 text-white/40">›</span>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Home indicator. */}
                    <div className="pb-2 flex justify-center bg-[#0a0a0b]">
                        <span className="h-1 w-24 rounded-full bg-white/20"></span>
                    </div>
                </div>
            </motion.div>

            {/* Hint strip below phone. */}
            <motion.p
                className="type-mono text-[color:var(--color-bone-muted)] text-center max-w-md text-[16px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                tap a network to send the report
            </motion.p>
        </div>
    );
}

function WifiBars({ bars }: { bars: 1 | 2 | 3 | 4 }) {
    const on = "currentColor";
    const off = "rgba(255,255,255,0.18)";
    return (
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none" aria-hidden>
            <path d="M7.5 10.5a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2z" fill={bars >= 1 ? on : off} />
            <path
                d="M3.5 6.5a5.7 5.7 0 0 1 8 0l-1.1 1.1a4.1 4.1 0 0 0-5.8 0L3.5 6.5z"
                fill={bars >= 2 ? on : off}
            />
            <path
                d="M1.2 4.2a9 9 0 0 1 12.6 0l-1 1a7.4 7.4 0 0 0-10.6 0l-1-1z"
                fill={bars >= 3 ? on : off}
            />
            <path
                d="M-0.5 2.2a12 12 0 0 1 16 0l-1 1a10.4 10.4 0 0 0-14 0l-1-1z"
                fill={bars >= 4 ? on : off}
            />
        </svg>
    );
}

function LockGlyph() {
    return (
        <svg width="9" height="11" viewBox="0 0 11 13" fill="none" aria-hidden>
            <rect x="1" y="5.5" width="9" height="7" rx="1" stroke="currentColor" strokeWidth="1.1" />
            <path d="M3 5.5V3.5a2.5 2.5 0 1 1 5 0v2" stroke="currentColor" strokeWidth="1.1" />
        </svg>
    );
}

function InfoGlyph() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <circle cx="7" cy="7" r="6" stroke="#0a84ff" strokeWidth="1.2" opacity="0.9" />
            <rect x="6.4" y="5.9" width="1.2" height="3.4" rx="0.4" fill="#0a84ff" />
            <circle cx="7" cy="4.3" r="0.7" fill="#0a84ff" />
        </svg>
    );
}

function CellularGlyph() {
    return (
        <svg width="15" height="12" viewBox="0 0 15 12" fill="none" aria-hidden>
            <rect x="0" y="8" width="2.2" height="3.5" rx="0.4" fill="currentColor" />
            <rect x="3.5" y="6" width="2.2" height="5.5" rx="0.4" fill="currentColor" />
            <rect x="7" y="3.5" width="2.2" height="8" rx="0.4" fill="currentColor" />
            <rect x="10.5" y="1" width="2.2" height="10.5" rx="0.4" fill="currentColor" />
        </svg>
    );
}
