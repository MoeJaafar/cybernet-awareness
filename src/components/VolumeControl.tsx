"use client";

import { useAudioSettings } from "@/lib/audio-settings";

export function VolumeControl() {
    const { musicVolume, narratorVolume, setMusicVolume, setNarratorVolume } =
        useAudioSettings();

    return (
        <div className="fixed bottom-5 right-5 z-50 bg-[color:var(--color-ink-raised)] border border-[color:var(--color-edge-subtle)] rounded-lg p-4 flex flex-col gap-4 shadow-[0_12px_40px_rgba(0,0,0,0.6)] min-w-[200px]">
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
