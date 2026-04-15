"use client";

import { useState } from "react";
import Link from "next/link";
import type { Scenario, Scene, SceneId } from "@/lib/types";
import { EmailMockup } from "./EmailMockup";
import { StatusBar } from "./StatusBar";

/**
 * Drives the player through a scenario by walking the Scene graph.
 * Tracks a per-session trust score so the StatusBar reflects the
 * outcome of the player's most-recent choice. State is local to this
 * component for v1 — when we add per-session logging for the user
 * study we'll lift it to a context or persist to URL state.
 */
export function ScenarioRunner({ scenario }: { scenario: Scenario }) {
    const [started, setStarted] = useState(false);
    const [sceneId, setSceneId] = useState<SceneId>(scenario.startSceneId);
    const [trust, setTrust] = useState(100);

    const scene = scenario.scenes[sceneId];

    const goTo = (next: SceneId) => {
        const target = scenario.scenes[next];
        if (target?.type === "outcome") {
            // Apply a trust delta when an outcome resolves.
            setTrust((t) => Math.max(0, Math.min(100, t + (target.attackerWon ? -35 : +5))));
        }
        setSceneId(next);
    };

    return (
        <>
            <StatusBar score={trust} completed={0} total={1} />
            <main className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
                <Link
                    href="/"
                    className="mono-tag hover:text-[color:var(--color-accent)] transition-colors inline-flex items-center gap-1.5 mb-6"
                >
                    ← back to queue
                </Link>

                {!started ? (
                    <SetupCard scenario={scenario} onStart={() => setStarted(true)} />
                ) : !scene ? (
                    <ErrorCard
                        message={`Scene "${sceneId}" not found in scenario "${scenario.id}".`}
                    />
                ) : (
                    <SceneView key={sceneId} scene={scene} onAdvance={goTo} />
                )}
            </main>
        </>
    );
}

function SetupCard({
    scenario,
    onStart,
}: {
    scenario: Scenario;
    onStart: () => void;
}) {
    return (
        <article className="scene-enter flex flex-col gap-6">
            <header className="flex flex-col gap-3">
                <p className="mono-tag text-[color:var(--color-accent)]">
                    case file · briefing
                </p>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[color:var(--color-text-primary)] leading-tight">
                    {scenario.title}
                </h1>
            </header>

            <div className="rounded-xl border border-[color:var(--color-border-soft)] bg-[color:var(--color-bg-panel)] p-6">
                <p className="mono-tag mb-3">scenario brief</p>
                <p className="text-base leading-relaxed text-[color:var(--color-text-primary)]/90">
                    {scenario.setup}
                </p>
            </div>

            <button
                type="button"
                onClick={onStart}
                className="self-start group inline-flex items-center gap-2 rounded-lg bg-[color:var(--color-accent)] text-[color:var(--color-bg-base)] px-5 py-3 text-sm font-semibold hover:brightness-110 transition-all shadow-[0_0_24px_var(--color-accent-glow)]"
            >
                Begin shift
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </button>
        </article>
    );
}

function SceneView({
    scene,
    onAdvance,
}: {
    scene: Scene;
    onAdvance: (next: SceneId) => void;
}) {
    switch (scene.type) {
        case "stimulus":
            return (
                <section className="scene-enter flex flex-col gap-6">
                    <p className="mono-tag">incoming</p>
                    <Markdown text={scene.content} />
                    {scene.mock && <EmailMockup email={scene.mock} />}
                    <PrimaryButton label="Continue" onClick={() => onAdvance(scene.nextId)} />
                </section>
            );
        case "decision":
            return (
                <section className="scene-enter flex flex-col gap-6">
                    {scene.mock && (
                        <>
                            <p className="mono-tag">incoming</p>
                            <EmailMockup email={scene.mock} />
                        </>
                    )}
                    <div className="flex flex-col gap-4">
                        <p className="mono-tag text-[color:var(--color-accent)]">
                            decision required
                        </p>
                        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)] leading-snug">
                            {scene.prompt}
                        </h2>
                        <div className="flex flex-col gap-2.5">
                            {scene.choices.map((c, i) => (
                                <button
                                    key={c.label}
                                    type="button"
                                    onClick={() => onAdvance(c.nextId)}
                                    className="group text-left rounded-lg border border-[color:var(--color-border-soft)] bg-[color:var(--color-bg-panel)] hover:border-[color:var(--color-accent)] hover:bg-[color:var(--color-bg-panel-2)] px-4 py-3.5 transition-all"
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="mono-tag text-[color:var(--color-text-dim)] group-hover:text-[color:var(--color-accent)] mt-0.5 shrink-0">
                                            {String.fromCharCode(65 + i)}
                                        </span>
                                        <span className="text-sm text-[color:var(--color-text-primary)] leading-snug">
                                            {c.label}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            );
        case "outcome": {
            const tone = scene.attackerWon
                ? {
                      label: "breach",
                      color: "var(--color-bad)",
                      glow: "var(--color-bad-glow)",
                  }
                : {
                      label: "contained",
                      color: "var(--color-good)",
                      glow: "var(--color-good-glow)",
                  };
            return (
                <section className="scene-enter flex flex-col gap-6">
                    <div
                        className="rounded-xl border-2 p-6 transition-all"
                        style={{
                            borderColor: tone.color,
                            backgroundColor: "var(--color-bg-panel)",
                            boxShadow: `0 0 32px ${tone.glow}`,
                        }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <span
                                className="h-2.5 w-2.5 rounded-full dot-pulse"
                                style={{ backgroundColor: tone.color }}
                            ></span>
                            <span
                                className="mono-tag"
                                style={{ color: tone.color }}
                            >
                                {tone.label}
                            </span>
                        </div>
                        <p className="text-base leading-relaxed text-[color:var(--color-text-primary)]">
                            {scene.narration}
                        </p>
                    </div>
                    <PrimaryButton
                        label="View debrief"
                        onClick={() => onAdvance(scene.nextId)}
                    />
                </section>
            );
        }
        case "debrief":
            return (
                <section className="scene-enter flex flex-col gap-6">
                    <div className="rounded-xl border border-[color:var(--color-accent)]/40 bg-gradient-to-b from-[color:var(--color-bg-panel)] to-[color:var(--color-bg-panel-2)] p-6">
                        <p className="mono-tag text-[color:var(--color-accent)] mb-3">
                            takeaway
                        </p>
                        <p className="text-lg font-semibold text-[color:var(--color-text-primary)] leading-snug">
                            {scene.takeaway}
                        </p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <p className="mono-tag">debrief notes</p>
                        <p className="text-base leading-relaxed text-[color:var(--color-text-muted)]">
                            {scene.lesson}
                        </p>
                    </div>
                    <Link
                        href="/"
                        className="self-start inline-flex items-center gap-2 rounded-lg bg-[color:var(--color-accent)] text-[color:var(--color-bg-base)] px-5 py-3 text-sm font-semibold hover:brightness-110 transition-all shadow-[0_0_24px_var(--color-accent-glow)]"
                    >
                        Return to queue
                    </Link>
                </section>
            );
    }
}

function PrimaryButton({
    label,
    onClick,
}: {
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="self-start group inline-flex items-center gap-2 rounded-lg border border-[color:var(--color-border-hard)] bg-[color:var(--color-bg-panel)] hover:bg-[color:var(--color-bg-panel-2)] hover:border-[color:var(--color-accent)] text-[color:var(--color-text-primary)] hover:text-[color:var(--color-accent)] px-5 py-2.5 text-sm font-medium transition-all"
        >
            {label}
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </button>
    );
}

function ErrorCard({ message }: { message: string }) {
    return (
        <div className="rounded-xl border-2 border-[color:var(--color-bad)] bg-[color:var(--color-bg-panel)] p-5">
            <p className="mono-tag text-[color:var(--color-bad)] mb-2">error</p>
            <p className="text-sm text-[color:var(--color-text-primary)]">{message}</p>
        </div>
    );
}

/** Minimal Markdown — bold + paragraph splitting. No XSS risk; static text. */
function Markdown({ text }: { text: string }) {
    const paragraphs = text.split("\n\n");
    return (
        <div className="flex flex-col gap-3">
            {paragraphs.map((p, i) => (
                <p
                    key={i}
                    className="text-base leading-relaxed text-[color:var(--color-text-primary)]"
                    dangerouslySetInnerHTML={{
                        __html: p.replace(/\*\*(.+?)\*\*/g, '<strong class="text-[color:var(--color-accent)]">$1</strong>'),
                    }}
                />
            ))}
        </div>
    );
}
