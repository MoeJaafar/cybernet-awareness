/**
 * Core types for the scenario engine.
 *
 * A Scenario is a small directed graph of Scenes. The player starts at
 * `startSceneId` and walks the graph; each Scene either presents
 * narrative text and advances automatically (`stimulus`, `outcome`),
 * branches on the player's choice (`decision`), or ends the scenario
 * with a teaching moment (`debrief`).
 *
 * For v1 the narrator text is hard-coded into Scene definitions. A
 * later commit will replace selected `narration` strings with calls to
 * an LLM that generates context-aware narration based on the player's
 * choice history.
 */

export type ScenarioId = string;
export type SceneId = string;

export interface Scenario {
    id: ScenarioId;
    title: string;
    /** One-paragraph framing shown before the scenario starts. */
    setup: string;
    /** The Scene the scenario opens on. */
    startSceneId: SceneId;
    /** All scenes keyed by their id. */
    scenes: Record<SceneId, Scene>;
    /**
     * Underlying cybersecurity concept the scenario teaches. Surfaced in
     * the debrief and (later) in the post-test mapping.
     */
    concept: string;
}

export type Scene =
    | StimulusScene
    | DecisionScene
    | OutcomeScene
    | DebriefScene
    | QuizScene;

/** Common visual-layer fields shared across scene types. */
export interface SceneVisuals {
    /** Path under /public, e.g. "/art/backgrounds/office-desk.svg". */
    background?: string;
    /** Which character portrait (if any) is on-stage this scene. */
    portrait?: {
        role: "player" | "attacker" | "maya" | "priya" | "tom";
        expression?:
            | "neutral"
            | "alarmed"
            | "pleased"
            | "concerned"
            | "smug";
    };
    /** Optional speaker label shown at the top of the dialogue box. */
    speaker?: string;
}

export interface StimulusScene extends SceneVisuals {
    type: "stimulus";
    id: SceneId;
    /** Markdown-friendly text (rendered as paragraphs for now). */
    content: string;
    /** Optional inline mock-up (e.g. an email card). */
    mock?: EmailMock;
    nextId: SceneId;
}

export interface DecisionScene extends SceneVisuals {
    type: "decision";
    id: SceneId;
    prompt: string;
    /** Optional email mock shown above the prompt. */
    mock?: EmailMock;
    /** Optional password-change form mock. The scene uses the first
     *  mock it finds (email wins if both are set). */
    passwordForm?: PasswordFormMock;
    /** 2–4 explicit choices. May be empty when the only interactions
     *  live inside a mock (e.g. picking a password option fires the
     *  scene advance directly). */
    choices: Choice[];
}

export interface OutcomeScene extends SceneVisuals {
    type: "outcome";
    id: SceneId;
    /** What happened, narrated. Static for v1, LLM-driven later. */
    narration: string;
    /** Did this choice succeed for the attacker (true) or the defender (false)? */
    attackerWon: boolean;
    nextId: SceneId;
}

export interface DebriefScene extends SceneVisuals {
    type: "debrief";
    id: SceneId;
    /** The lesson. Always shown at the end. */
    lesson: string;
    /**
     * The cybersecurity concept name, repeated for emphasis (e.g. "Spear
     * phishing relies on personalised lures"). Distinct from `lesson`,
     * which is the narrative-flavoured retelling.
     */
    takeaway: string;
    /** Optional onward scene (usually a quiz). If omitted, the
     *  scenario ends and the player returns to the queue. */
    nextId?: SceneId;
}

export interface Choice {
    /** Button label shown to the player. */
    label: string;
    /** Scene to advance to when this choice is picked. */
    nextId: SceneId;
    /**
     * Where the choice lives. Default is a standalone button row below
     * the mock. 'toolbar-report' and 'toolbar-delete' put the choice
     * inside the Gmail mock's toolbar for a fully immersive decision.
     */
    location?: "button" | "toolbar-report" | "toolbar-delete" | "toolbar-archive";
}

/**
 * Quiz scene, single multi-choice question with try-again on wrong
 * answers. Used at the end of a debrief to test the takeaway.
 */
export interface QuizScene extends SceneVisuals {
    type: "quiz";
    id: SceneId;
    prompt: string;
    options: QuizOption[];
    nextId: SceneId;
}

export interface QuizOption {
    label: string;
    correct: boolean;
    /** Shown after selection; lands or nudges back to retry. */
    feedback: string;
}

/**
 * Inspectable hotspot attached to an email mock. When the player
 * clicks the target element, the caption surfaces inline.
 */
export interface EmailHotspot {
    target: "from" | "subject" | "link";
    caption: string;
}

/**
 * Password-change form. A decision scene can carry a `passwordForm`
 * mock instead of an `email` mock; the Workspace picks the right
 * renderer.
 */
export interface PasswordFormMock {
    /** What the user sees at the top of the form (system message). */
    header: string;
    /** Optional subtitle / caption, e.g. "your current password
     *  expires in 2 hours." */
    caption?: string;
    /** Pre-built password options to pick from. */
    options: PasswordOption[];
}

export interface PasswordOption {
    /** The literal password text shown to the user. */
    value: string;
    /**
     * A one-line label describing the trade-off the player is making
     * ("short, easy to remember, similar to your last one").
     */
    label: string;
    /**
     * Subjective strength bucket used for visual representation,
     * drives the strength bar. 1..5 where 5 is strongest.
     */
    strength: 1 | 2 | 3 | 4 | 5;
    /** Scene to advance to when this option is picked. */
    nextId: SceneId;
}

/** Stylised email shown alongside a stimulus or decision scene. */
export interface EmailMock {
    from: string;
    to: string;
    subject: string;
    body: string;
    /** Optional sender display name; if omitted, `from` is shown raw. */
    fromName?: string;
    /** Extracted link preview shown as a chip in the body. If
     *  `trapsTo` is set, clicking the link advances directly to that
     *  scene, usually an outcome scene. The link becomes a real
     *  in-world trap instead of just a decoration. */
    link?: { label: string; url: string; trapsTo?: SceneId };
    /** Inspectable red-flag hotspots. When present, the mock renders
     *  clickable targets whose captions surface inline. */
    hotspots?: EmailHotspot[];
}
