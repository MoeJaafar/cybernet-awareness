import Link from "next/link";

/**
 * Persistent top bar. Sets the SOC-dashboard tone — system label, role
 * card, score / progress widgets — even on routes that don't yet read
 * a real game state. For v1 the score and progress are placeholders;
 * a later commit wires them to per-session state.
 */
export function StatusBar({
    score = 100,
    completed = 0,
    total = 1,
}: {
    score?: number;
    completed?: number;
    total?: number;
}) {
    return (
        <header className="border-b border-[color:var(--color-border-soft)] bg-[color:var(--color-bg-panel)]/80 backdrop-blur-sm sticky top-0 z-10">
            <div className="max-w-5xl mx-auto px-5 sm:px-8 py-3 flex items-center justify-between gap-4">
                <Link href="/" className="flex items-center gap-3 group">
                    <span className="relative inline-flex">
                        <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-good)] dot-pulse"></span>
                        <span className="absolute inset-0 h-2.5 w-2.5 rounded-full bg-[color:var(--color-good)] blur-sm opacity-60"></span>
                    </span>
                    <div className="flex flex-col leading-tight">
                        <span className="mono-tag">CyberNet · v1.0</span>
                        <span className="text-sm font-semibold text-[color:var(--color-text-primary)] group-hover:text-[color:var(--color-accent)] transition-colors">
                            SOC Console — Riverside University
                        </span>
                    </div>
                </Link>
                <div className="flex items-center gap-3 sm:gap-5">
                    <ScoreWidget score={score} />
                    <ProgressWidget completed={completed} total={total} />
                </div>
            </div>
        </header>
    );
}

function ScoreWidget({ score }: { score: number }) {
    const tone =
        score >= 80
            ? "text-[color:var(--color-good)]"
            : score >= 50
              ? "text-[color:var(--color-warn)]"
              : "text-[color:var(--color-bad)]";
    return (
        <div className="flex flex-col items-end leading-tight">
            <span className="mono-tag">trust score</span>
            <span className={`text-base font-semibold tabular-nums ${tone}`}>
                {score}
                <span className="text-[color:var(--color-text-dim)] text-xs ml-0.5">/100</span>
            </span>
        </div>
    );
}

function ProgressWidget({
    completed,
    total,
}: {
    completed: number;
    total: number;
}) {
    return (
        <div className="flex flex-col items-end leading-tight">
            <span className="mono-tag">scenarios</span>
            <span className="text-base font-semibold text-[color:var(--color-text-primary)] tabular-nums">
                {completed}
                <span className="text-[color:var(--color-text-dim)] text-xs ml-0.5">/{total}</span>
            </span>
        </div>
    );
}
