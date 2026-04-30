/**
 * Pre/post-test, 10 scenario-based MCQ with 4 options each.
 * Two items per scenario topic (phishing, password, vishing, USB, Wi-Fi).
 *
 * The English text lives in src/lib/i18n/messages/en.ts (and Arabic in
 * messages/ar.ts) keyed by `id`/`options[].key`. This module owns only
 * the structural metadata: which options are correct, which concept the
 * item belongs to, and the canonical ordering. Stable IDs let DB rows
 * compare across locales.
 */

export interface KnowledgeQuestionShape {
    id: string;
    concept: string;
    options: { key: string; correct: boolean }[];
}

export const KNOWLEDGE_QUESTIONS: KnowledgeQuestionShape[] = [
    {
        id: "phish-1",
        concept: "phishing",
        options: [
            { key: "a", correct: true },
            { key: "b", correct: false },
            { key: "c", correct: false },
            { key: "d", correct: false },
        ],
    },
    {
        id: "phish-2",
        concept: "phishing",
        options: [
            { key: "a", correct: false },
            { key: "b", correct: false },
            { key: "c", correct: true },
            { key: "d", correct: false },
        ],
    },
    {
        id: "pw-1",
        concept: "password",
        options: [
            { key: "a", correct: false },
            { key: "b", correct: true },
            { key: "c", correct: false },
            { key: "d", correct: false },
        ],
    },
    {
        id: "pw-2",
        concept: "password",
        options: [
            { key: "a", correct: false },
            { key: "b", correct: false },
            { key: "c", correct: false },
            { key: "d", correct: true },
        ],
    },
    {
        id: "vish-1",
        concept: "vishing",
        options: [
            { key: "a", correct: false },
            { key: "b", correct: false },
            { key: "c", correct: true },
            { key: "d", correct: false },
        ],
    },
    {
        id: "vish-2",
        concept: "vishing",
        options: [
            { key: "a", correct: true },
            { key: "b", correct: false },
            { key: "c", correct: false },
            { key: "d", correct: false },
        ],
    },
    {
        id: "usb-1",
        concept: "usb",
        options: [
            { key: "a", correct: false },
            { key: "b", correct: true },
            { key: "c", correct: false },
            { key: "d", correct: false },
        ],
    },
    {
        id: "usb-2",
        concept: "usb",
        options: [
            { key: "a", correct: false },
            { key: "b", correct: false },
            { key: "c", correct: false },
            { key: "d", correct: true },
        ],
    },
    {
        id: "wifi-1",
        concept: "wifi",
        options: [
            { key: "a", correct: false },
            { key: "b", correct: true },
            { key: "c", correct: false },
            { key: "d", correct: false },
        ],
    },
    {
        id: "wifi-2",
        concept: "wifi",
        options: [
            { key: "a", correct: true },
            { key: "b", correct: false },
            { key: "c", correct: false },
            { key: "d", correct: false },
        ],
    },
];

export function shuffleQuestions(
    seed: "pre" | "post",
): KnowledgeQuestionShape[] {
    const copy = [...KNOWLEDGE_QUESTIONS];
    if (seed === "post") copy.reverse();
    return copy;
}
