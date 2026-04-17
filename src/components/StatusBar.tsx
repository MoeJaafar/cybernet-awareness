import Link from "next/link";

/**
 * Top bar. The "you" indicator sits here, player is an ordinary
 * university employee, not an analyst, so the metrics reflect
 * *attacks survived* and *close calls*, not analyst-flavoured
 * things like "trust score."
 */
export function StatusBar({
    survived = 0,
    total = 1,
    closeCalls = 0,
}: {
    survived?: number;
    total?: number;
    closeCalls?: number;
}) {
    return (
        <header className="sticky top-0 z-40 border-b border-[color:var(--color-edge-subtle)] bg-[color:var(--color-ink-deeper)]/85 backdrop-blur-md">
            <div className="max-w-6xl mx-auto px-6 sm:px-10 py-3.5 flex items-center justify-between gap-6">
                <Link href="/" className="flex items-center gap-3 group">
                    <span className="relative inline-flex">
                        <span className="h-2 w-2 rounded-full bg-[color:var(--color-amber)] dot-live"></span>
                        <span className="absolute inset-0 h-2 w-2 rounded-full bg-[color:var(--color-amber)] blur-[3px] opacity-80"></span>
                    </span>
                    <div className="flex items-baseline gap-3">
                        <span className="type-display text-[color:var(--color-bone)] text-lg tracking-tight group-hover:text-[color:var(--color-amber)] transition-colors">
                            Cyber<span className="type-display-italic text-[color:var(--color-amber)]">Net</span>
                        </span>
                        <span className="type-mono hidden sm:inline">
                            awareness edition
                        </span>
                    </div>
                </Link>

                <div className="flex items-center gap-6 sm:gap-10">
                    <Metric
                        label="attacks survived"
                        value={String(survived).padStart(2, "0")}
                        suffix={`/${String(total).padStart(2, "0")}`}
                    />
                    {closeCalls > 0 && (
                        <Metric
                            label="close calls"
                            value={String(closeCalls).padStart(2, "0")}
                            tone="warn"
                        />
                    )}
                </div>
            </div>
        </header>
    );
}

function Metric({
    label,
    value,
    suffix,
    tone,
}: {
    label: string;
    value: string;
    suffix?: string;
    tone?: "good" | "warn" | "bad";
}) {
    const valueColour =
        tone === "bad"
            ? "text-[color:var(--color-signal-red)]"
            : tone === "warn"
              ? "text-[color:var(--color-amber)]"
              : tone === "good"
                ? "text-[color:var(--color-signal-green)]"
                : "text-[color:var(--color-bone)]";
    return (
        <div className="flex flex-col items-end leading-none gap-1">
            <span className="type-mono text-[color:var(--color-bone-ghost)]">
                {label}
            </span>
            <span className="font-mono text-sm tabular-nums tracking-wide">
                <span className={valueColour}>{value}</span>
                {suffix && (
                    <span className="text-[color:var(--color-bone-ghost)]">
                        {suffix}
                    </span>
                )}
            </span>
        </div>
    );
}
