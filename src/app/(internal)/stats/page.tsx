"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

/**
 * Hidden participant counter. Not linked from anywhere, visit
 * /stats directly. No auth (anyone who knows the URL can see the
 * counts), but only aggregate numbers are exposed, not row data.
 */

type Counts = Record<string, number>;

type Stats = {
    totalSessions: number;
    consented: number;
    completed: number;
    avgPreAccuracy: number | null;
    avgPostAccuracy: number | null;
    demographicsResponses: number;
    avgSelfRating: number | null;
    ageDist: Counts;
    genderDist: Counts;
    roleDist: Counts;
    fieldDist: Counts;
    trainingDist: Counts;
};

export default function StatsPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            const sb = getSupabase();
            if (!sb) {
                setError("Supabase not configured");
                return;
            }

            const [
                sessionsRes,
                consentRes,
                endRes,
                pretestRes,
                posttestRes,
                demoRes,
            ] = await Promise.all([
                sb.from("sessions").select("id", { count: "exact", head: true }),
                sb
                    .from("events")
                    .select("session_id", { count: "exact", head: true })
                    .eq("type", "consent"),
                sb
                    .from("events")
                    .select("session_id", { count: "exact", head: true })
                    .eq("type", "session_end"),
                sb.from("events").select("payload").eq("type", "pretest_summary"),
                sb.from("events").select("payload").eq("type", "posttest_summary"),
                sb.from("events").select("payload").eq("type", "demographics"),
            ]);

            const pretestAccuracies = (pretestRes.data ?? [])
                .map((r) => (r.payload as { accuracy?: number })?.accuracy)
                .filter((a): a is number => typeof a === "number");
            const posttestAccuracies = (posttestRes.data ?? [])
                .map((r) => (r.payload as { accuracy?: number })?.accuracy)
                .filter((a): a is number => typeof a === "number");

            const avg = (arr: number[]) =>
                arr.length === 0
                    ? null
                    : Math.round(arr.reduce((s, v) => s + v, 0) / arr.length);

            // Demographics aggregation.
            const demoRows = (demoRes.data ?? []).map(
                (r) => r.payload as Record<string, unknown>,
            );
            const count = (key: string): Counts => {
                const out: Counts = {};
                for (const row of demoRows) {
                    const v = row?.[key];
                    if (typeof v === "string") {
                        out[v] = (out[v] ?? 0) + 1;
                    }
                }
                return out;
            };
            const selfRatings = demoRows
                .map((r) => r?.selfRating)
                .filter((v): v is number => typeof v === "number");

            setStats({
                totalSessions: sessionsRes.count ?? 0,
                consented: consentRes.count ?? 0,
                completed: endRes.count ?? 0,
                avgPreAccuracy: avg(pretestAccuracies),
                avgPostAccuracy: avg(posttestAccuracies),
                demographicsResponses: demoRows.length,
                avgSelfRating:
                    selfRatings.length === 0
                        ? null
                        : Math.round(
                              (selfRatings.reduce((s, v) => s + v, 0) /
                                  selfRatings.length) *
                                  10,
                          ) / 10,
                ageDist: count("age"),
                genderDist: count("gender"),
                roleDist: count("role"),
                fieldDist: count("field"),
                trainingDist: count("training"),
            });
        };
        load().catch((e) => setError(String(e)));
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center px-6 py-10">
            <div className="max-w-xl w-full flex flex-col gap-8">
                <div className="flex items-center gap-3">
                    <span className="h-px w-10 bg-[color:var(--color-amber)]" />
                    <span className="type-mono text-[color:var(--color-amber)]">
                        study stats
                    </span>
                </div>

                {error && (
                    <p className="type-mono text-[color:var(--color-signal-red)]">
                        {error}
                    </p>
                )}

                {!stats && !error && (
                    <p className="type-mono text-[color:var(--color-bone-muted)]">
                        loading…
                    </p>
                )}

                {stats && (
                    <>
                        {/* Overall funnel + accuracy. */}
                        <div className="flex flex-col gap-6">
                            <Row
                                label="total sessions started"
                                value={stats.totalSessions}
                            />
                            <Row label="gave consent" value={stats.consented} />
                            <Row
                                label="completed (reached done page)"
                                value={stats.completed}
                            />
                            <Row
                                label="avg pre-test accuracy"
                                value={
                                    stats.avgPreAccuracy === null
                                        ? "-"
                                        : `${stats.avgPreAccuracy}%`
                                }
                            />
                            <Row
                                label="avg post-test accuracy"
                                value={
                                    stats.avgPostAccuracy === null
                                        ? "-"
                                        : `${stats.avgPostAccuracy}%`
                                }
                            />
                            {stats.avgPreAccuracy !== null &&
                                stats.avgPostAccuracy !== null && (
                                    <Row
                                        label="avg delta (post − pre)"
                                        value={`${
                                            stats.avgPostAccuracy -
                                                stats.avgPreAccuracy >=
                                            0
                                                ? "+"
                                                : ""
                                        }${
                                            stats.avgPostAccuracy -
                                            stats.avgPreAccuracy
                                        }%`}
                                        highlight
                                    />
                                )}
                        </div>

                        {/* Demographics section. */}
                        <div className="pt-6 mt-4 border-t border-[color:var(--color-edge-subtle)] flex flex-col gap-6">
                            <div className="flex items-center gap-3">
                                <span className="h-px w-6 bg-[color:var(--color-amber)]/60" />
                                <span className="type-mono text-[color:var(--color-bone-muted)]">
                                    demographics
                                </span>
                            </div>
                            <Row
                                label="responses"
                                value={stats.demographicsResponses}
                            />
                            <Row
                                label="avg self-rated awareness (1–5)"
                                value={
                                    stats.avgSelfRating === null
                                        ? "-"
                                        : stats.avgSelfRating.toFixed(1)
                                }
                            />
                        </div>

                        <Breakdown title="Age" counts={stats.ageDist} />
                        <Breakdown title="Gender" counts={stats.genderDist} />
                        <Breakdown title="Role" counts={stats.roleDist} />
                        <Breakdown title="Field" counts={stats.fieldDist} />
                        <Breakdown title="Prior training" counts={stats.trainingDist} />
                    </>
                )}

                <p className="type-mono text-[color:var(--color-bone-ghost)] pt-6 border-t border-[color:var(--color-edge-subtle)]">
                    raw data in supabase dashboard → events table
                </p>
            </div>
        </div>
    );
}

function Row({
    label,
    value,
    highlight,
}: {
    label: string;
    value: string | number;
    highlight?: boolean;
}) {
    return (
        <div className="flex items-baseline justify-between border-b border-[color:var(--color-edge-subtle)] pb-3">
            <span className="type-mono text-[color:var(--color-bone-muted)]">
                {label}
            </span>
            <span
                className={`type-display text-3xl tabular-nums ${
                    highlight
                        ? "text-[color:var(--color-amber)]"
                        : "text-[color:var(--color-bone)]"
                }`}
            >
                {value}
            </span>
        </div>
    );
}

function Breakdown({
    title,
    counts,
}: {
    title: string;
    counts: Record<string, number>;
}) {
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const total = entries.reduce((s, [, n]) => s + n, 0);
    if (total === 0) return null;
    return (
        <div className="flex flex-col gap-2">
            <p className="type-mono text-[color:var(--color-bone-muted)]">{title}</p>
            <div className="flex flex-col gap-1.5 border-l-2 border-[color:var(--color-amber)]/40 pl-4">
                {entries.map(([label, n]) => {
                    const pct = Math.round((n / total) * 100);
                    return (
                        <div
                            key={label}
                            className="flex items-center justify-between gap-3"
                        >
                            <span className="type-ui text-[color:var(--color-bone)] text-[15px]">
                                {label}
                            </span>
                            <span className="type-mono text-[color:var(--color-bone-dim)] tabular-nums text-[12px]">
                                {n} · {pct}%
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
