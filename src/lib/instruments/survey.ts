/**
 * Post-game engagement and perception survey. Likert 1–5 scale.
 * Covers perceived usefulness, ease of use, realism, self-efficacy,
 * and behavioural intention — aligned with TAM and TPB constructs
 * cited in the thesis literature review.
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
            "I feel more confident recognising phishing emails after playing.",
    },
    {
        id: "intent-1",
        construct: "behavioural_intention",
        statement:
            "I would change my behaviour at work based on what I learned.",
    },
    {
        id: "intent-2",
        construct: "behavioural_intention",
        statement: "I would recommend this game to a colleague.",
    },
];

export const LIKERT_LABELS = [
    "Strongly disagree",
    "Disagree",
    "Neutral",
    "Agree",
    "Strongly agree",
] as const;
