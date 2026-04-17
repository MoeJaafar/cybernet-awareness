"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

/**
 * Hidden participant counter. Not linked from anywhere, visit
 * /stats directly. No auth (anyone who knows the URL can see the
 * counts), but only aggregate numbers are exposed, not row data.
 */

type Stats = {
    totalSessions: number;
    consented: number;
    completed: number;
    avgPreAccuracy: number | null;
    avgPostAccuracy: number | null;
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

            const [sessionsRes, consentRes, endRes, pretestRes, posttestRes] =
                await Promise.all([
                    sb.from("sessions").select("id", { count: "exact", head: true }),
                    sb.from("events").select("session_id", { count: "exact", head: true }).eq("type", "consent"),
                    sb.from("events").select("session_id", { count: "exact", head: true }).eq("type", "session_end"),
                    sb.from("events").select("payload").eq("type", "pretest_summary"),
                    sb.from("events").select("payload").eq("type", "posttest_summary"),
                ]);

            const pretestAccuracies =
                (pretestRes.data ?? [])
                    .map((r) => (r.payload as { accuracy?: number })?.accuracy)
                    .filter((a): a is number => typeof a === "number");
            const posttestAccuracies =
                (posttestRes.data ?? [])
                    .map((r) => (r.payload as { accuracy?: number })?.accuracy)
                    .filter((a): a is number => typeof a === "number");

            const avg = (arr: number[]) =>
                arr.length === 0 ? null : Math.round(arr.reduce((s, v) => s + v, 0) / arr.length);

            setStats({
                totalSessions: sessionsRes.count ?? 0,
                consented: consentRes.count ?? 0,
                completed: endRes.count ?? 0,
                avgPreAccuracy: avg(pretestAccuracies),
                avgPostAccuracy: avg(posttestAccuracies),
            });
        };
        load().catch((e) => setError(String(e)));
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6">
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
                    <div className="flex flex-col gap-6">
                        <Row label="total sessions started" value={stats.totalSessions} />
                        <Row label="gave consent" value={stats.consented} />
                        <Row label="completed (reached done page)" value={stats.completed} />
                        <Row
                            label="avg pre-test accuracy"
                            value={stats.avgPreAccuracy === null ? "-" : `${stats.avgPreAccuracy}%`}
                        />
                        <Row
                            label="avg post-test accuracy"
                            value={stats.avgPostAccuracy === null ? "-" : `${stats.avgPostAccuracy}%`}
                        />
                        {stats.avgPreAccuracy !== null && stats.avgPostAccuracy !== null && (
                            <Row
                                label="avg delta (post − pre)"
                                value={`${stats.avgPostAccuracy - stats.avgPreAccuracy >= 0 ? "+" : ""}${stats.avgPostAccuracy - stats.avgPreAccuracy}%`}
                                highlight
                            />
                        )}
                    </div>
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
