/**
 * Post-game engagement and perception survey. Likert 1–5 scale.
 * Covers perceived usefulness, ease of use, realism, self-efficacy,
 * behavioural intention (TAM / TPB), plus three presentation items
 * (narration, music, visuals) evaluated as an active design layer.
 *
 * The statement text lives in src/lib/i18n/messages/<locale>.ts. This
 * file owns only the structural metadata: question id, construct, and
 * canonical ordering. Stable IDs let DB rows compare across locales.
 */

export interface SurveyQuestionShape {
    id: string;
    construct: string;
}

export const SURVEY_QUESTIONS: SurveyQuestionShape[] = [
    { id: "ease-1", construct: "ease_of_use" },
    { id: "engage-1", construct: "engagement" },
    { id: "useful-1", construct: "perceived_usefulness" },
    { id: "learn-1", construct: "learning" },
    { id: "engage-2", construct: "engagement" },
    { id: "efficacy-1", construct: "self_efficacy" },
    { id: "intent-1", construct: "behavioural_intention" },
    { id: "intent-2", construct: "behavioural_intention" },
    { id: "present-narration", construct: "presentation_narration" },
    { id: "present-music", construct: "presentation_music" },
    { id: "present-visuals", construct: "presentation_visuals" },
];
