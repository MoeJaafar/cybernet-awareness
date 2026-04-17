"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAudioSettings } from "@/lib/audio-settings";

export function VolumeControl() {
    const [open, setOpen] = useState(false);
    const { musicVolume, narratorVolume, setMusicVolume, setNarratorVolume } =
        useAudioSettings();

    return (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="bg-[color:var(--color-ink-raised)] border border-[color:var(--color-edge-subtle)] rounded-lg p-4 flex flex-col gap-4 shadow-[0_12px_40px_rgba(0,0,0,0.6)] min-w-[200px]"
                    >
                        <Slider
                            label="Music"
                            value={musicVolume}
                            onChange={setMusicVolume}
                        />
                        <Slider
                            label="Narrator"
                            value={narratorVolume}
                            onChange={setNarratorVolume}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="h-10 w-10 rounded-full bg-[color:var(--color-ink-raised)] border border-[color:var(--color-edge-subtle)] hover:border-[color:var(--color-amber)] flex items-center justify-center transition-colors shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
                aria-label="Volume settings"
            >
                <SpeakerIcon />
            </button>
        </div>
    );
}

function Slider({
    label,
    value,
    onChange,
}: {
    label: string;
    value: number;
    onChange: (v: number) => void;
}) {
    const pct = Math.round(value * 100);
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
                <span className="type-mono text-[color:var(--color-bone-muted)]">
                    {label}
                </span>
                <span className="type-mono text-[color:var(--color-bone-dim)] tabular-nums text-[11px]">
                    {pct}%
                </span>
            </div>
            <input
                type="range"
                min={0}
                max={100}
                value={pct}
                onChange={(e) => onChange(Number(e.target.value) / 100)}
                className="w-full h-1 appearance-none bg-[color:var(--color-bone-ghost)] rounded-full outline-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:h-3
                    [&::-webkit-slider-thumb]:w-3
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-[color:var(--color-amber)]
                    [&::-webkit-slider-thumb]:shadow-[0_0_8px_var(--amber-glow)]
                    [&::-moz-range-thumb]:h-3
                    [&::-moz-range-thumb]:w-3
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:border-0
                    [&::-moz-range-thumb]:bg-[color:var(--color-amber)]"
            />
        </div>
    );
}

function SpeakerIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--bone-dim)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
    );
}
