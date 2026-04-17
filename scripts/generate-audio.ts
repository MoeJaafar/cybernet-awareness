/**
 * Audio generation — ElevenLabs.
 *
 * Walks every narrated beat in the game (boot intro, decision prompts,
 * outcomes, debriefs, quizzes, and the vishing caller lines) and
 * produces one mp3 per beat under public/audio/. Beat-splitting uses
 * the same splitBeats() the game uses at runtime, so the audio and
 * the typed text stay aligned by construction.
 *
 * Usage:
 *   npm run gen:audio -- --dry       list what would be generated
 *   npm run gen:audio                generate missing mp3s only
 *   npm run gen:audio -- --force     regenerate everything
 *
 * Env (read from .env.local):
 *   ELEVENLABS_API_KEY
 *   ELEVENLABS_NARRATOR_VOICE_ID
 *   ELEVENLABS_DAVID_VOICE_ID
 *   ELEVENLABS_MODEL_ID              optional, default eleven_multilingual_v2
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { config as loadEnv } from "dotenv";
import { splitBeats } from "../src/lib/beats";
import { ALL_SCENARIOS } from "../src/lib/scenarios";
import { vishingCallConfig } from "../src/lib/scenarios/vishing";

loadEnv({ path: ".env.local" });

type Voice = "narrator" | "david";

type Job = {
    text: string;
    voice: Voice;
    outputPath: string;
};

// Keep in sync with src/components/BootSequence.tsx SCRIPT.
const BOOT_LINES = [
    "Tuesday morning. Just another workday.",
    "Coffee in one hand. Laptop open. Five emails waiting.",
    "One of them is not what it seems.",
];

const OUT_ROOT = "public/audio";

function pad(n: number, width = 2): string {
    return String(n).padStart(width, "0");
}

function scenarioFolder(scenarioId: string): string {
    return join(OUT_ROOT, scenarioId);
}

function buildManifest(): Job[] {
    const jobs: Job[] = [];

    // Boot intro (Narrator, one mp3 per typed line).
    BOOT_LINES.forEach((text, i) => {
        jobs.push({
            text,
            voice: "narrator",
            outputPath: join(OUT_ROOT, "boot", `${pad(i + 1)}.mp3`),
        });
    });

    // Vishing caller lines (David, one mp3 per caller line).
    vishingCallConfig.lines.forEach((line, i) => {
        jobs.push({
            text: line.text,
            voice: "david",
            outputPath: join(
                scenarioFolder("vishing-helpdesk"),
                `caller-${pad(i + 1)}.mp3`,
            ),
        });
    });

    // Every narrated beat in every scene of every scenario.
    //
    // Decision-scene prompts are intentionally NOT narrated — every
    // decision scene in the game ships with a dedicated visual
    // (Gmail mock, phone call, password builder, USB stick, Wi-Fi
    // picker) and the prompt reads as a caption for that visual.
    // Voicing it over the interactive UI is distracting; the player
    // reads it while studying the screen. Outcomes, debriefs, and
    // quiz prompts DO get narrated — those are typed beats the
    // player reads while the narrator speaks.
    for (const scenario of ALL_SCENARIOS) {
        const folder = scenarioFolder(scenario.id);
        for (const scene of Object.values(scenario.scenes)) {
            if (scene.type === "outcome") {
                splitBeats(scene.narration).forEach((text, i) => {
                    jobs.push({
                        text,
                        voice: "narrator",
                        outputPath: join(
                            folder,
                            `${scene.id}-${pad(i + 1)}.mp3`,
                        ),
                    });
                });
            }
            if (scene.type === "debrief") {
                jobs.push({
                    text: scene.takeaway,
                    voice: "narrator",
                    outputPath: join(folder, `${scene.id}-takeaway.mp3`),
                });
                splitBeats(scene.lesson).forEach((text, i) => {
                    jobs.push({
                        text,
                        voice: "narrator",
                        outputPath: join(
                            folder,
                            `${scene.id}-lesson-${pad(i + 1)}.mp3`,
                        ),
                    });
                });
            }
            if (scene.type === "quiz") {
                jobs.push({
                    text: scene.prompt,
                    voice: "narrator",
                    outputPath: join(folder, `${scene.id}-prompt.mp3`),
                });
                scene.options.forEach((opt, i) => {
                    jobs.push({
                        text: opt.feedback,
                        voice: "narrator",
                        outputPath: join(
                            folder,
                            `${scene.id}-fb-${String.fromCharCode(97 + i)}.mp3`,
                        ),
                    });
                });
            }
        }
    }

    return jobs;
}

async function generate(
    job: Job,
    voiceIds: Record<Voice, string>,
    apiKey: string,
    modelId: string,
): Promise<void> {
    const voiceId = voiceIds[job.voice];
    const res = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
            method: "POST",
            headers: {
                "xi-api-key": apiKey,
                "Content-Type": "application/json",
                Accept: "audio/mpeg",
            },
            body: JSON.stringify({
                text: job.text,
                model_id: modelId,
                voice_settings:
                    job.voice === "david"
                        ? {
                              stability: 0.6,
                              similarity_boost: 0.7,
                              style: 0.4,
                              use_speaker_boost: true,
                          }
                        : {
                              stability: 0.5,
                              similarity_boost: 0.75,
                              style: 0.2,
                              use_speaker_boost: true,
                          },
            }),
        },
    );
    if (!res.ok) {
        throw new Error(
            `ElevenLabs ${res.status}: ${await res.text().catch(() => "")}`,
        );
    }
    const buf = Buffer.from(await res.arrayBuffer());
    mkdirSync(dirname(job.outputPath), { recursive: true });
    writeFileSync(job.outputPath, buf);
}

async function main() {
    const argv = process.argv.slice(2);
    const args = new Set(argv);
    const dry = args.has("--dry");
    const force = args.has("--force");
    const limitIdx = argv.indexOf("--limit");
    const limit =
        limitIdx >= 0 && argv[limitIdx + 1]
            ? Math.max(1, Number(argv[limitIdx + 1]))
            : Infinity;

    let jobs = buildManifest();
    if (Number.isFinite(limit)) jobs = jobs.slice(0, limit);

    if (dry) {
        let existing = 0;
        let toGen = 0;
        let charBudget = 0;
        for (const j of jobs) {
            const ex = existsSync(j.outputPath);
            if (ex) existing++;
            else toGen++;
            if (force || !ex) charBudget += j.text.length;
            const flag = ex ? "skip" : "gen ";
            const voiceTag = j.voice.padEnd(8);
            console.log(
                `${flag}  ${voiceTag}  ${j.outputPath.padEnd(56)}  ${j.text.slice(0, 90)}`,
            );
        }
        console.log();
        console.log(
            `${jobs.length} beats total   ${existing} existing   ${toGen} to generate`,
        );
        console.log(
            `Character budget for next run: ${charBudget.toLocaleString()} (ElevenLabs free tier ≈ 10,000 /month)`,
        );
        return;
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    const narratorVoice = process.env.ELEVENLABS_NARRATOR_VOICE_ID;
    const davidVoice = process.env.ELEVENLABS_DAVID_VOICE_ID;
    const modelId =
        process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2";

    if (!apiKey || !narratorVoice || !davidVoice) {
        console.error(
            "Missing env. Add ELEVENLABS_API_KEY, ELEVENLABS_NARRATOR_VOICE_ID, ELEVENLABS_DAVID_VOICE_ID to .env.local.",
        );
        process.exit(1);
    }

    const voiceIds: Record<Voice, string> = {
        narrator: narratorVoice,
        david: davidVoice,
    };

    let made = 0;
    let skipped = 0;
    for (const job of jobs) {
        if (!force && existsSync(job.outputPath)) {
            skipped++;
            continue;
        }
        process.stdout.write(`… ${job.outputPath}`);
        try {
            await generate(job, voiceIds, apiKey, modelId);
            process.stdout.write("  ✓\n");
            made++;
        } catch (err) {
            process.stdout.write("  ✗\n");
            console.error(err);
            process.exit(1);
        }
        // gentle rate-limit cushion
        await new Promise((r) => setTimeout(r, 120));
    }
    console.log(`\nDone. Generated ${made}, skipped ${skipped}.`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
