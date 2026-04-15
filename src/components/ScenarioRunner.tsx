"use client";

import { useState } from "react";
import Link from "next/link";
import type { Scenario, Scene, SceneId, SceneVisuals } from "@/lib/types";
import { EmailMockup } from "./EmailMockup";
import { StatusBar } from "./StatusBar";
import { Stage } from "./Stage";
import { Portrait } from "./Portrait";
import { DialogueBox } from "./DialogueBox";

const DEFAULT_BACKGROUND = "/art/backgrounds/office-desk.svg";

/**
 * Drives the player through a scenario by walking the Scene graph.
 * Composes the visual layer — Stage + Portrait + DialogueBox — from
 * the per-scene visual hints carried in SceneVisuals.
 */
export function ScenarioRunner({ scenario }: { scenario: Scenario }) {
    const [started, setStarted] = useState(false);
    const [sceneId, setSceneId] = useState<SceneId>(scenario.startSceneId);
    const [trust, setTrust] = useState(100);

    const scene = scenario.scenes[sceneId];

    const goTo = (next: SceneId) => {
        const target = scenario.scenes[next];
        if (target?.type === "outcome") {
            setTrust((t) =>
                Math.max(0, Math.min(100, t + (target.attackerWon ? -35 : +5))),
            );
        }
        setSceneId(next);
    };

    if (!started) {
        return (
            <>
                <StatusBar score={trust} completed={0} total={1} />
                <SetupScreen
                    scenario={scenario}
                    onStart={() => setStarted(true)}
                />
            </>
        );
    }

    if (!scene) {
        return (
            <>
                <StatusBar score={trust} completed={0} total={1} />
                <div className="max-w-xl mx-auto p-8 mt-10 rounded-xl border-2 border-[color:var(--color-bad)] bg-[color:var(--color-bg-panel)]">
                    <p className="mono-tag text-[color:var(--color-bad)] mb-2">error</p>
                    <p>Scene &quot;{sceneId}&quot; not found in scenario &quot;{scenario.id}&quot;.</p>
                </div>
            </>
        );
    }

    const visuals: SceneVisuals = scene;
    const background = visuals.background ?? DEFAULT_BACKGROUND;
    const portraitNode = visuals.portrait ? (
        <Portrait
            role={visuals.portrait.role}
            expression={visuals.portrait.expression}
        />
    ) : undefined;

    return (
        <>
            <StatusBar score={trust} completed={0} total={1} />
            <Stage
                sceneKey={scene.id}
                background={background}
                portrait={portraitNode}
            >
                <SceneDialogue scene={scene} onAdvance={goTo} />
            </Stage>
        </>
    );
}

function SetupScreen({
    scenario,
    onStart,
}: {
    scenario: Scenario;
    onStart: () => void;
}) {
    return (
        <Stage
            sceneKey="setup"
            background="/art/backgrounds/office-desk.svg"
            portrait={<Portrait role="player" expression="neutral" />}
        >
            <DialogueBox speaker={`case file · ${scenario.title}`} text={scenario.setup}>
                <div className="flex gap-3 flex-wrap">
                    <button
                        type="button"
                        onClick={onStart}
                        className="group inline-flex items-center gap-2 rounded-lg bg-[color:var(--color-accent)] text-[color:var(--color-bg-base)] px-5 py-2.5 text-sm font-semibold hover:brightness-110 transition-all shadow-[0_0_24px_var(--color-accent-glow)]"
                    >
                        Begin shift
                        <span className="transition-transform group-hover:translate-x-0.5">→</span>
                    </button>
                    <Link
                        href="/"
                        className="inline-flex items-center rounded-lg border border-[color:var(--color-border-hard)] bg-[color:var(--color-bg-panel)] hover:bg-[color:var(--color-bg-panel-2)] hover:text-[color:var(--color-accent)] text-[color:var(--color-text-muted)] px-5 py-2.5 text-sm font-medium transition-all"
                    >
                        Back to queue
                    </Link>
                </div>
            </DialogueBox>
        </Stage>
    );
}

function SceneDialogue({
    scene,
    onAdvance,
}: {
    scene: Scene;
    onAdvance: (next: SceneId) => void;
}) {
    switch (scene.type) {
        case "stimulus":
            return (
                <DialogueBox speaker={scene.speaker ?? "incoming"} text={scene.content}>
                    {scene.mock && <EmailMockup email={scene.mock} />}
                    <PrimaryButton label="Continue" onClick={() => onAdvance(scene.nextId)} />
                </DialogueBox>
            );
        case "decision":
            return (
                <div className="flex flex-col gap-3">
                    {scene.mock && (
                        <div className="max-h-[42vh] overflow-hidden rounded-xl">
                            <EmailMockup email={scene.mock} />
                        </div>
                    )}
                    <DialogueBox
                        speaker={scene.speaker ?? "decision required"}
                        text={scene.prompt}
                        instant={true}
                    >
                        <div className="flex flex-col gap-2">
                            {scene.choices.map((c, i) => (
                                <button
                                    key={c.label}
                                    type="button"
                                    onClick={() => onAdvance(c.nextId)}
                                    className="group text-left rounded-lg border border-[color:var(--color-border-soft)] bg-[color:var(--color-bg-panel-2)]/70 hover:border-[color:var(--color-accent)] hover:bg-[color:var(--color-bg-panel)] px-4 py-3 transition-all"
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
                    </DialogueBox>
                </div>
            );
        case "outcome":
            return (
                <DialogueBox
                    speaker={scene.speaker ?? (scene.attackerWon ? "BREACH" : "CONTAINED")}
                    text={scene.narration}
                >
                    <PrimaryButton
                        label="View debrief"
                        onClick={() => onAdvance(scene.nextId)}
                    />
                </DialogueBox>
            );
        case "debrief":
            return (
                <DialogueBox speaker={scene.speaker ?? "debrief"} text={scene.takeaway} instant={true}>
                    <p className="text-sm text-[color:var(--color-text-muted)] leading-relaxed">
                        {scene.lesson}
                    </p>
                    <div className="pt-2">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--color-accent)] text-[color:var(--color-bg-base)] px-5 py-2.5 text-sm font-semibold hover:brightness-110 transition-all shadow-[0_0_24px_var(--color-accent-glow)]"
                        >
                            Return to queue
                        </Link>
                    </div>
                </DialogueBox>
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
