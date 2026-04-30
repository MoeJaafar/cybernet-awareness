"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { createNarratorAudio } from "@/lib/audio-settings";
import type { Scenario, Scene, SceneId, SceneVisuals } from "@/lib/types";
import { EmailMockup } from "./EmailMockup";
import { Stage } from "./Stage";
import { Portrait } from "./Portrait";
import { DialogueBox } from "./DialogueBox";
import { Workspace } from "./Workspace";
import { TypedNarrative, splitBeats } from "./TypedNarrative";
import { buildBeatAudioPaths, feedbackAudioPath } from "@/lib/audio-paths";
import { PasswordForm } from "./PasswordForm";
import { PasswordBuilder, evaluatePassword } from "./PasswordBuilder";
import { PhoneCall } from "./PhoneCall";
import {
    VISHING_CALL_CONFIG,
    USB_STICK_CONFIG,
    PUBLIC_WIFI_PICKER_CONFIG,
} from "@/lib/scenarios";
import { UsbStick } from "./UsbStick";
import { WiFiPicker } from "./WiFiPicker";
import { useSession } from "@/lib/session";
import { useMessages } from "@/lib/i18n/use-locale";
import type { Locale } from "@/lib/i18n";
import type { Messages } from "@/lib/i18n/types";

const DEFAULT_BACKGROUND = "/art/backgrounds/office-desk.svg";

export function ScenarioRunner({
    scenario,
    locale,
    nextScenarioId,
}: {
    scenario: Scenario;
    locale: Locale;
    nextScenarioId?: string;
}) {
    const [sceneId, setSceneId] = useState<SceneId>(scenario.startSceneId);
    const { logEvent } = useSession();
    const m = useMessages();

    const scene = scenario.scenes[sceneId];

    const goTo = (next: SceneId) => {
        const target = scenario.scenes[next];
        if (target?.type === "outcome") {
            logEvent("choice", {
                scenarioId: scenario.id,
                sceneId: next,
                attackerWon: target.attackerWon,
            });
        }
        setSceneId(next);
    };

    if (!scene) {
        return (
            <>
                <div className="max-w-xl mx-auto p-8 mt-10 border-s-2 border-[color:var(--color-signal-red)] bg-[color:var(--color-ink-raised)]">
                    <p className="type-mono text-[color:var(--color-signal-red)] mb-2">error</p>
                    <p className="type-body">Scene &quot;{sceneId}&quot; not found.</p>
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

    const tone: "default" | "breach" | "contained" =
        scene.type === "outcome"
            ? scene.attackerWon
                ? "breach"
                : "contained"
            : "default";

    const sceneWithMock = scene as {
        mock?: unknown;
        passwordForm?: unknown;
    };
    const hasMock =
        sceneWithMock.mock !== undefined ||
        sceneWithMock.passwordForm !== undefined;
    const isBuilderScene = scene.type === "decision" && scene.id === "build";
    const isPhoneScene = scene.type === "decision" && scene.id === "phone-ring";
    const isUsbScene = scene.type === "decision" && scene.id === "found-usb";
    const isWiFiScene = scene.type === "decision" && scene.id === "choose-wifi";
    const usesWorkspace =
        ((scene.type === "decision" || scene.type === "stimulus") && hasMock) ||
        isBuilderScene ||
        isPhoneScene ||
        isUsbScene ||
        isWiFiScene;
    const usesNarrative =
        !usesWorkspace &&
        (scene.type === "stimulus" ||
            scene.type === "outcome" ||
            scene.type === "debrief" ||
            scene.type === "quiz" ||
            scene.type === "decision");

    return (
        <>
            <AnimatePresence mode="wait">
                <motion.div
                    key={scene.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    {usesWorkspace ? (
                        <WorkspaceScene
                            scene={scene}
                            locale={locale}
                            messages={m}
                            onAdvance={goTo}
                        />
                    ) : usesNarrative ? (
                        <NarrativeScene
                            scenarioId={scenario.id}
                            scene={scene}
                            locale={locale}
                            messages={m}
                            onAdvance={goTo}
                            nextScenarioId={nextScenarioId}
                        />
                    ) : (
                        <Stage
                            sceneKey={scene.id}
                            background={background}
                            portrait={portraitNode}
                            tone={tone}
                        >
                            <SceneDialogue
                                scene={scene}
                                messages={m}
                                onAdvance={goTo}
                            />
                        </Stage>
                    )}
                </motion.div>
            </AnimatePresence>
        </>
    );
}

function NarrativeScene({
    scenarioId,
    scene,
    locale,
    messages,
    onAdvance,
    nextScenarioId,
}: {
    scenarioId: string;
    scene: Scene;
    locale: Locale;
    messages: Messages;
    onAdvance: (next: SceneId) => void;
    nextScenarioId?: string;
}) {
    const audioPaths = buildBeatAudioPaths(locale, scenarioId, scene);
    const { narrators, buttons } = messages.runner;

    switch (scene.type) {
        case "stimulus":
            return (
                <TypedNarrative
                    speaker={scene.speaker ?? narrators.narrator}
                    lines={splitBeats(scene.content)}
                >
                    <PrimaryButton
                        label={buttons.continue}
                        onClick={() => onAdvance(scene.nextId)}
                    />
                </TypedNarrative>
            );

        case "decision":
            return (
                <TypedNarrative
                    speaker={scene.speaker ?? narrators.yourMove}
                    lines={splitBeats(scene.prompt)}
                >
                    <div className="flex flex-col gap-0 border border-[color:var(--color-edge-subtle)] bg-[color:var(--color-ink-raised)] overflow-hidden w-full max-w-2xl">
                        {scene.choices.map((c, i) => (
                            <ChoiceRow
                                key={c.label}
                                index={i}
                                label={c.label}
                                onClick={() => onAdvance(c.nextId)}
                            />
                        ))}
                    </div>
                </TypedNarrative>
            );

        case "outcome": {
            const tone = scene.attackerWon ? "breach" : "contained";
            return (
                <TypedNarrative
                    tone={tone}
                    speaker={
                        scene.speaker ??
                        (scene.attackerWon ? narrators.breach : narrators.contained)
                    }
                    lines={splitBeats(scene.narration)}
                    audioPaths={audioPaths}
                >
                    <PrimaryButton
                        label={buttons.viewTakeaway}
                        onClick={() => onAdvance(scene.nextId)}
                        variant={scene.attackerWon ? "breach" : "contained"}
                    />
                </TypedNarrative>
            );
        }

        case "debrief": {
            const lessonBeats = splitBeats(scene.lesson);
            // When the debrief has no in-scenario quiz to advance to,
            // fall through to the next scenario in the queue, or the
            // posttest if this was the last one.
            const onwardHref = nextScenarioId
                ? `/${locale}/scenario/${nextScenarioId}`
                : `/${locale}/posttest`;
            const onwardLabel = nextScenarioId
                ? buttons.next
                : buttons.continue;
            return (
                <TypedNarrative
                    tone="takeaway"
                    speaker={scene.speaker ?? narrators.takeaway}
                    lines={[scene.takeaway, ...lessonBeats]}
                    audioPaths={audioPaths}
                    finalEmphasis={false}
                >
                    {scene.nextId ? (
                        <PrimaryButton
                            label={buttons.continue}
                            onClick={() => onAdvance(scene.nextId!)}
                        />
                    ) : (
                        <Link
                            href={onwardHref}
                            className="inline-flex items-center gap-3 bg-[color:var(--color-amber)] text-[color:var(--color-ink-deep)] px-6 py-3.5 type-display text-lg hover:brightness-110 transition-all shadow-[0_0_32px_var(--amber-glow)]"
                        >
                            {onwardLabel}
                            <span aria-hidden className="text-xl rtl:rotate-180">→</span>
                        </Link>
                    )}
                </TypedNarrative>
            );
        }

        case "quiz":
            return (
                <TypedNarrative
                    speaker={scene.speaker ?? narrators.oneLastCheck}
                    lines={[scene.prompt]}
                    audioPaths={audioPaths}
                >
                    <QuizOptions
                        scenarioId={scenarioId}
                        scene={scene}
                        locale={locale}
                        messages={messages}
                        nextScenarioId={nextScenarioId}
                    />
                </TypedNarrative>
            );
    }
    return null;
}

function QuizOptions({
    scenarioId,
    scene,
    locale,
    messages,
    nextScenarioId,
}: {
    scenarioId: string;
    scene: import("@/lib/types").QuizScene;
    locale: Locale;
    messages: Messages;
    nextScenarioId?: string;
}) {
    const [pickedIdx, setPickedIdx] = useState<number | null>(null);
    const picked = pickedIdx === null ? null : scene.options[pickedIdx];
    const currentReleaseRef = useRef<(() => void) | null>(null);

    const handlePick = (i: number) => {
        setPickedIdx(i);
        currentReleaseRef.current?.();
        const { audio, release } = createNarratorAudio(
            feedbackAudioPath(locale, scenarioId, scene.id, i),
        );
        currentReleaseRef.current = release;
        audio.play().catch(() => {});
    };

    useEffect(() => {
        return () => {
            currentReleaseRef.current?.();
            currentReleaseRef.current = null;
        };
    }, []);

    const fb = messages.runner.quizFeedback;

    return (
        <div className="w-full max-w-2xl flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                {scene.options.map((opt, i) => {
                    const isPicked = pickedIdx === i;
                    const colourClass = !isPicked
                        ? "border-[color:var(--color-edge-subtle)] hover:border-[color:var(--color-amber)]"
                        : opt.correct
                          ? "border-[color:var(--color-signal-green)]"
                          : "border-[color:var(--color-signal-red)]";
                    return (
                        <button
                            key={opt.label}
                            type="button"
                            onClick={() => handlePick(i)}
                            disabled={picked?.correct}
                            className={`group text-start border ${colourClass} bg-[color:var(--color-ink-raised)] hover:bg-[color:var(--color-ink-higher)] px-4 py-3 transition-colors disabled:opacity-70 disabled:cursor-default`}
                        >
                            <div className="flex items-start gap-4">
                                <span className="type-display text-xl text-[color:var(--color-bone-ghost)] group-hover:text-[color:var(--color-amber)] w-6 shrink-0">
                                    {String.fromCharCode(65 + i)}
                                </span>
                                <span className="type-body text-[16px] text-[color:var(--color-bone)] flex-1">
                                    {opt.label}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
            {picked && (
                <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border-s-2 ps-4 py-1 text-start ${
                        picked.correct
                            ? "border-[color:var(--color-signal-green)]"
                            : "border-[color:var(--color-signal-red)]"
                    }`}
                >
                    <p
                        className={`type-mono mb-1 ${
                            picked.correct
                                ? "text-[color:var(--color-signal-green)]"
                                : "text-[color:var(--color-signal-red)]"
                        }`}
                    >
                        {picked.correct ? fb.right : fb.tryAgain}
                    </p>
                    <p className="type-body text-[14px] text-[color:var(--color-bone-dim)] leading-relaxed">
                        {picked.feedback}
                    </p>
                </motion.div>
            )}
            {picked?.correct && (
                <div className="pt-2">
                    <Link
                        href={
                            nextScenarioId
                                ? `/${locale}/scenario/${nextScenarioId}`
                                : `/${locale}/posttest`
                        }
                        className="inline-flex items-center gap-3 bg-[color:var(--color-amber)] text-[color:var(--color-ink-deep)] px-6 py-3.5 type-display text-lg hover:brightness-110 transition-all shadow-[0_0_32px_var(--amber-glow)]"
                    >
                        {nextScenarioId
                            ? messages.runner.buttons.next
                            : messages.runner.buttons.continue}
                        <span aria-hidden className="text-xl rtl:rotate-180">→</span>
                    </Link>
                </div>
            )}
        </div>
    );
}

function WorkspaceScene({
    scene,
    locale,
    messages,
    onAdvance,
}: {
    scene: Scene;
    locale: Locale;
    messages: Messages;
    onAdvance: (next: SceneId) => void;
}) {
    const { narrators, buttons } = messages.runner;
    const vishingCallConfig = VISHING_CALL_CONFIG[locale];
    const usbStickConfig = USB_STICK_CONFIG[locale];
    const publicWiFiPickerConfig = PUBLIC_WIFI_PICKER_CONFIG[locale];

    if (scene.type === "stimulus" && scene.mock) {
        return (
            <Workspace
                narrator={scene.speaker ?? narrators.narrator}
                prompt={scene.content}
            >
                <EmailMockup email={scene.mock} onTrap={onAdvance} />
                <div className="pt-2">
                    <PrimaryButton
                        label={buttons.continue}
                        onClick={() => onAdvance(scene.nextId)}
                    />
                </div>
            </Workspace>
        );
    }
    if (scene.type === "decision") {
        if (scene.mock) {
            const toolbarChoices = scene.choices.filter((c) =>
                c.location && c.location.startsWith("toolbar-"),
            );
            const buttonChoices = scene.choices.filter(
                (c) => !c.location || c.location === "button",
            );
            return (
                <Workspace
                    narrator={scene.speaker ?? narrators.yourMove}
                    prompt={scene.prompt}
                >
                    <EmailMockup
                        email={scene.mock}
                        toolbarChoices={toolbarChoices}
                        onTrap={onAdvance}
                        onChoice={(c) => onAdvance(c.nextId)}
                    />
                    {buttonChoices.length > 0 && (
                        <div className="flex flex-col gap-0 border border-[color:var(--color-edge-subtle)] bg-[color:var(--color-ink-raised)] overflow-hidden mt-4">
                            {buttonChoices.map((c, i) => (
                                <ChoiceRow
                                    key={c.label}
                                    index={i}
                                    label={c.label}
                                    onClick={() => onAdvance(c.nextId)}
                                />
                            ))}
                        </div>
                    )}
                </Workspace>
            );
        }
        if (scene.passwordForm) {
            return (
                <Workspace
                    narrator={scene.speaker ?? narrators.yourMove}
                    prompt={scene.prompt}
                >
                    <PasswordForm form={scene.passwordForm} onPick={onAdvance} />
                </Workspace>
            );
        }
        if (scene.id === "phone-ring") {
            return (
                <Workspace narrator={scene.speaker} prompt={scene.prompt}>
                    <PhoneCall
                        callerName={vishingCallConfig.callerName}
                        callerNumber={vishingCallConfig.callerNumber}
                        lines={vishingCallConfig.lines}
                        choices={vishingCallConfig.choices}
                        onChoice={(nextId) => onAdvance(nextId)}
                    />
                </Workspace>
            );
        }
        if (scene.id === "found-usb") {
            return (
                <Workspace narrator={scene.speaker} prompt={scene.prompt}>
                    <UsbStick
                        label={usbStickConfig.label}
                        context={usbStickConfig.context}
                        choices={usbStickConfig.choices}
                        onChoice={(nextId) => onAdvance(nextId)}
                    />
                </Workspace>
            );
        }
        if (scene.id === "choose-wifi") {
            return (
                <Workspace narrator={scene.speaker} prompt={scene.prompt}>
                    <WiFiPicker
                        location={publicWiFiPickerConfig.location}
                        networks={publicWiFiPickerConfig.networks}
                        onPick={(nextId) => onAdvance(nextId)}
                    />
                </Workspace>
            );
        }
        if (scene.id === "build" && !scene.mock && !scene.passwordForm) {
            return (
                <Workspace
                    narrator={scene.speaker ?? narrators.yourMove}
                    prompt={scene.prompt}
                >
                    <PasswordBuilder
                        header={messages.passwordBuilder.defaultHeader}
                        caption={messages.passwordBuilder.defaultCaption}
                        onSubmit={(result) => {
                            const outcomeId = evaluatePassword(result);
                            onAdvance(outcomeId);
                        }}
                    />
                </Workspace>
            );
        }
    }
    return null;
}

function SceneDialogue({
    scene,
    messages,
    onAdvance,
}: {
    scene: Scene;
    messages: Messages;
    onAdvance: (next: SceneId) => void;
}) {
    const { narrators, buttons } = messages.runner;
    switch (scene.type) {
        case "stimulus":
            return (
                <DialogueBox
                    speaker={scene.speaker ?? narrators.narrator}
                    text={scene.content}
                >
                    {scene.mock && (
                        <div className="max-h-[40vh] overflow-hidden">
                            <EmailMockup email={scene.mock} onTrap={onAdvance} />
                        </div>
                    )}
                    <PrimaryButton
                        label={buttons.continue}
                        onClick={() => onAdvance(scene.nextId)}
                    />
                </DialogueBox>
            );

        case "decision": {
            const toolbarChoices = scene.choices.filter((c) =>
                c.location && c.location.startsWith("toolbar-"),
            );
            const buttonChoices = scene.choices.filter(
                (c) => !c.location || c.location === "button",
            );
            const allInToolbar =
                toolbarChoices.length > 0 && buttonChoices.length === 0;
            return (
                <div className="flex flex-col gap-4">
                    {scene.mock && (
                        <div className="max-h-[72vh] overflow-auto">
                            <EmailMockup
                                email={scene.mock}
                                toolbarChoices={toolbarChoices}
                                onTrap={onAdvance}
                                onChoice={(c) => onAdvance(c.nextId)}
                            />
                        </div>
                    )}
                    {!allInToolbar && (
                        <DialogueBox
                            speaker={scene.speaker ?? narrators.chooseLabel}
                            text={scene.prompt}
                            instant={true}
                        >
                            {buttonChoices.length > 0 && (
                                <div className="flex flex-col gap-0 border-t border-[color:var(--color-edge-subtle)]">
                                    {buttonChoices.map((c, i) => (
                                        <ChoiceRow
                                            key={c.label}
                                            index={i}
                                            label={c.label}
                                            onClick={() => onAdvance(c.nextId)}
                                        />
                                    ))}
                                </div>
                            )}
                        </DialogueBox>
                    )}
                </div>
            );
        }

        case "outcome":
            return (
                <DialogueBox
                    speaker={
                        scene.speaker ??
                        (scene.attackerWon ? narrators.breach : narrators.contained)
                    }
                    text={scene.narration}
                    tone={scene.attackerWon ? "breach" : "contained"}
                >
                    <PrimaryButton
                        label={buttons.viewDebrief}
                        onClick={() => onAdvance(scene.nextId)}
                        variant={scene.attackerWon ? "breach" : "contained"}
                    />
                </DialogueBox>
            );

        case "debrief":
            return (
                <DialogueBox
                    speaker={scene.speaker ?? narrators.debriefLessonLabel}
                    text={scene.takeaway}
                    instant={true}
                >
                    <p className="type-body text-[15px] text-[color:var(--color-bone-dim)] leading-relaxed border-s border-[color:var(--color-edge-subtle)] ps-4">
                        {scene.lesson}
                    </p>
                    <div className="pt-3">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-3 bg-[color:var(--color-amber)] text-[color:var(--color-ink-deep)] px-6 py-3.5 type-display text-lg hover:brightness-110 transition-all shadow-[0_0_32px_var(--amber-glow)]"
                        >
                            {buttons.returnToQueue}
                            <span aria-hidden className="text-xl rtl:rotate-180">→</span>
                        </Link>
                    </div>
                </DialogueBox>
            );

        case "quiz":
            return (
                <QuizPanel
                    scene={scene}
                    messages={messages}
                    onAdvance={() => onAdvance(scene.nextId)}
                />
            );
    }
}

function QuizPanel({
    scene,
    messages,
    onAdvance,
}: {
    scene: import("@/lib/types").QuizScene;
    messages: Messages;
    onAdvance: () => void;
}) {
    const [pickedIdx, setPickedIdx] = useState<number | null>(null);
    const picked = pickedIdx === null ? null : scene.options[pickedIdx];
    const fb = messages.runner.quizFeedback;
    const { narrators, buttons } = messages.runner;

    return (
        <DialogueBox
            speaker={scene.speaker ?? narrators.checkInstincts}
            text={scene.prompt}
            instant={true}
        >
            <div className="flex flex-col gap-2">
                {scene.options.map((opt, i) => {
                    const isPicked = pickedIdx === i;
                    const correctnessColour = !isPicked
                        ? "border-[color:var(--color-edge-subtle)]"
                        : opt.correct
                          ? "border-[color:var(--color-signal-green)]"
                          : "border-[color:var(--color-signal-red)]";
                    return (
                        <button
                            key={opt.label}
                            type="button"
                            onClick={() => setPickedIdx(i)}
                            disabled={picked?.correct}
                            className={`group text-start border ${correctnessColour} bg-[color:var(--color-ink-deep)] hover:bg-[color:var(--color-ink-raised)] px-4 py-3 transition-colors disabled:opacity-70 disabled:cursor-default`}
                        >
                            <div className="flex items-start gap-4">
                                <span className="type-display text-xl text-[color:var(--color-bone-ghost)] group-hover:text-[color:var(--color-amber)] w-6 shrink-0">
                                    {String.fromCharCode(65 + i)}
                                </span>
                                <span className="type-body text-[16px] text-[color:var(--color-bone)] flex-1">
                                    {opt.label}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
            {picked && (
                <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-2 border-s-2 ps-4 py-1 ${
                        picked.correct
                            ? "border-[color:var(--color-signal-green)]"
                            : "border-[color:var(--color-signal-red)]"
                    }`}
                >
                    <p
                        className={`type-mono mb-1 ${
                            picked.correct
                                ? "text-[color:var(--color-signal-green)]"
                                : "text-[color:var(--color-signal-red)]"
                        }`}
                    >
                        {picked.correct ? fb.right : fb.tryAgain}
                    </p>
                    <p className="type-body text-[14px] text-[color:var(--color-bone-dim)] leading-relaxed">
                        {picked.feedback}
                    </p>
                </motion.div>
            )}
            {picked?.correct && (
                <div className="pt-3">
                    <button
                        type="button"
                        onClick={onAdvance}
                        className="inline-flex items-center gap-3 bg-[color:var(--color-amber)] text-[color:var(--color-ink-deep)] px-6 py-3.5 type-display text-lg hover:brightness-110 transition-all shadow-[0_0_32px_var(--amber-glow)]"
                    >
                        {buttons.continue}
                        <span aria-hidden className="text-xl rtl:rotate-180">→</span>
                    </button>
                </div>
            )}
        </DialogueBox>
    );
}

function ChoiceRow({
    index,
    label,
    onClick,
}: {
    index: number;
    label: string;
    onClick: () => void;
}) {
    const letter = String.fromCharCode(65 + index);
    return (
        <button
            type="button"
            onClick={onClick}
            className="group text-start border-b border-[color:var(--color-edge-subtle)] py-3.5 sm:py-5 px-2 flex items-start gap-3 sm:gap-5 hover:bg-[color:var(--color-amber-wash,rgba(255,153,51,0.05))] transition-colors"
        >
            <span className="type-display text-xl sm:text-2xl text-[color:var(--color-bone-ghost)] group-hover:text-[color:var(--color-amber)] transition-colors w-6 sm:w-8 shrink-0 mt-0.5 tabular-nums">
                {letter}
            </span>
            <span className="type-body text-[15px] sm:text-[18px] text-[color:var(--color-bone)] leading-snug flex-1 group-hover:text-[color:var(--color-bone)]">
                {label}
            </span>
            <span
                aria-hidden
                className="type-mono self-center text-[color:var(--color-bone-ghost)] group-hover:text-[color:var(--color-amber)] transition-colors translate-x-[-4px] group-hover:translate-x-0 duration-300 rtl:rotate-180"
            >
                →
            </span>
        </button>
    );
}

function PrimaryButton({
    label,
    onClick,
    variant = "default",
}: {
    label: string;
    onClick: () => void;
    variant?: "default" | "breach" | "contained";
}) {
    const borderColour =
        variant === "breach"
            ? "border-[color:var(--color-signal-red)] hover:text-[color:var(--color-signal-red)]"
            : variant === "contained"
              ? "border-[color:var(--color-signal-green)] hover:text-[color:var(--color-signal-green)]"
              : "border-[color:var(--color-amber)] hover:text-[color:var(--color-amber)]";
    return (
        <button
            type="button"
            onClick={onClick}
            className={`self-start group inline-flex items-center gap-3 border ${borderColour} bg-transparent hover:bg-[color:var(--color-ink-higher)] text-[color:var(--color-bone)] px-5 py-2.5 type-display text-lg transition-all`}
        >
            {label}
            <span
                aria-hidden
                className="transition-transform group-hover:translate-x-1 rtl:rotate-180"
            >
                →
            </span>
        </button>
    );
}
