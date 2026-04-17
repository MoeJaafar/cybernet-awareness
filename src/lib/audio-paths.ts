import type { Scene } from "@/lib/types";
import { splitBeats } from "@/lib/beats";

/**
 * Derive the audio URL for each typed beat in a scene. Paths match
 * the layout produced by `scripts/generate-audio.ts` so no manual
 * per-file wiring is needed.
 *
 *   outcome beat N   →  /audio/<scenarioId>/<sceneId>-<NN>.mp3
 *   debrief takeaway →  /audio/<scenarioId>/<sceneId>-takeaway.mp3
 *   debrief lesson N →  /audio/<scenarioId>/<sceneId>-lesson-<NN>.mp3
 *   quiz prompt      →  /audio/<scenarioId>/<sceneId>-prompt.mp3
 *
 * `undefined` entries render silently (used for scene types we don't
 * narrate, e.g. decision prompts).
 */
export function buildBeatAudioPaths(
    scenarioId: string,
    scene: Scene,
): (string | undefined)[] {
    const base = `/audio/${scenarioId}/${scene.id}`;
    switch (scene.type) {
        case "outcome":
            return splitBeats(scene.narration).map(
                (_, i) => `${base}-${pad(i + 1)}.mp3`,
            );
        case "debrief":
            return [
                `${base}-takeaway.mp3`,
                ...splitBeats(scene.lesson).map(
                    (_, i) => `${base}-lesson-${pad(i + 1)}.mp3`,
                ),
            ];
        case "quiz":
            return [`${base}-prompt.mp3`];
        default:
            return [];
    }
}

/** Path for quiz feedback option (0 → a, 1 → b, …). */
export function feedbackAudioPath(
    scenarioId: string,
    sceneId: string,
    optionIndex: number,
): string {
    const letter = String.fromCharCode(97 + optionIndex);
    return `/audio/${scenarioId}/${sceneId}-fb-${letter}.mp3`;
}

function pad(n: number): string {
    return String(n).padStart(2, "0");
}
