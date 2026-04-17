/**
 * Post-game engagement and perception survey. Likert 1–5 scale.
 * Covers perceived usefulness, ease of use, realism, self-efficacy,
 * behavioural intention (TAM / TPB), plus three presentation items
 * (narration, music, visuals) evaluated as an active design layer.
 */

export interface SurveyQuestion {
    id: string;
    construct: string;
    statement: string;
}

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
    {
        id: "ease-1",
        construct: "ease_of_use",
        statement: "The game was easy to use and navigate.",
    },
    {
        id: "engage-1",
        construct: "engagement",
        statement: "I found the scenarios realistic and believable.",
    },
    {
        id: "useful-1",
        construct: "perceived_usefulness",
        statement:
            "I learned something new about cybersecurity from this experience.",
    },
    {
        id: "learn-1",
        construct: "learning",
        statement:
            "The outcomes helped me understand why my choices mattered.",
    },
    {
        id: "engage-2",
        construct: "engagement",
        statement:
            "The game made cybersecurity threats feel more real to me.",
    },
    {
        id: "efficacy-1",
        construct: "self_efficacy",
        statement:
            "I feel more confident recognising cybersecurity threats after playing.",
    },
    {
        id: "intent-1",
        construct: "behavioural_intention",
        statement:
            "I intend to apply what I learned to my everyday online behaviour.",
    },
    {
        id: "intent-2",
        construct: "behavioural_intention",
        statement: "I would recommend this game to someone else.",
    },
    {
        id: "present-narration",
        construct: "presentation_narration",
        statement:
            "The narrated voice made it easier to follow what was happening.",
    },
    {
        id: "present-music",
        construct: "presentation_music",
        statement:
            "The background music made the scenarios feel more immersive.",
    },
    {
        id: "present-visuals",
        construct: "presentation_visuals",
        statement:
            "The visual style of the game kept me engaged while I played.",
    },
];

export const LIKERT_LABELS = [
    "Strongly disagree",
    "Disagree",
    "Neutral",
    "Agree",
    "Strongly agree",
] as const;
