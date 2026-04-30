/**
 * Shape of every per-locale message bundle. New string? Add it here
 * first — TS will then force every locale file to provide it.
 */

export interface Messages {
    splash: {
        tagline: string;
        title: string;
        intro: string;
        scenarioCount: string;
        runtime: string;
        headphonesNote: string;
        cta: string;
    };
    consent: {
        eyebrow: string;
        heading: string;
        paragraphs: string[];
        questionsLine: string;
        agreeNote: string;
        agreeButton: string;
        startingButton: string;
        errorMessage: string;
    };
    briefing: {
        eyebrow: string;
        heading: string;
        steps: { n: string; title: string; note: string }[];
        totalTime: string;
        runtime: string;
        headphonesNote: string;
        readyHeading: string;
        cta: string;
    };
    pretest: {
        title: string;
        nextLabel: string;
    };
    posttest: {
        title: string;
        nextLabel: string;
    };
    knowledgeTest: {
        unitOf: (current: number, total: number) => string;
        confidencePrompt: string;
        confidenceLabels: readonly [string, string];
        unfinishedHint: (total: number) => string;
        savingLabel: string;
        navHeading: string;
        navHint: string;
        navOpenLabel: string;
        navCloseLabel: string;
        questionLabel: (i: number, answered: boolean) => string;
    };
    survey: {
        eyebrow: string;
        agreementLabel: string;
        chooseHint: string;
        nextLabel: string;
        finishLabel: string;
        finishingLabel: string;
        likertLabels: readonly [string, string, string, string, string];
        questions: { id: string; statement: string }[];
    };
    demographics: {
        eyebrow: string;
        heading: string;
        intro: string;
        labels: {
            age: string;
            gender: string;
            role: string;
            field: string;
            primaryLanguage: string;
            training: string;
            passwordManager: string;
            twoFactor: string;
            phishingVictim: string;
            publicWifi: string;
            riskTolerance: string;
            riskMin: string;
            riskMax: string;
            selfRating: string;
            selfRatingMin: string;
            selfRatingMax: string;
        };
        options: {
            age: readonly string[];
            gender: readonly string[];
            role: readonly string[];
            field: readonly string[];
            primaryLanguage: readonly string[];
            training: readonly string[];
            passwordManager: readonly string[];
            twoFactor: readonly string[];
            phishingVictim: readonly string[];
            publicWifi: readonly string[];
        };
        finishLabel: string;
        skipFinishLabel: string;
        finishingLabel: string;
        skipHint: string;
    };
    done: {
        eyebrow: string;
        heading: string;
        body: string;
        signature: string;
    };
    boot: { lines: { text: string; speed?: number; hold?: number; emphasis?: boolean }[]; skipLabel: string };
    narrative: {
        clickToContinue: string;
    };
    runner: {
        narrators: {
            narrator: string;
            yourMove: string;
            chooseLabel: string;
            breach: string;
            contained: string;
            takeaway: string;
            oneLastCheck: string;
            checkInstincts: string;
            debriefLessonLabel: string;
        };
        buttons: {
            continue: string;
            viewTakeaway: string;
            viewDebrief: string;
            returnToQueue: string;
            next: string;
        };
        quizFeedback: {
            right: string;
            tryAgain: string;
        };
    };
    knowledgeQuestions: KnowledgeQuestionMessage[];
    emailMockup: {
        toolbar: {
            back: string;
            archiveDefault: string;
            reportDefault: string;
            deleteDefault: string;
            markUnread: string;
            more: string;
            star: string;
            counter: string;
        };
        inboxLabel: string;
        timestamp: string;
        toMe: string;
        inspectionTip: string;
        replyLabel: string;
        forwardLabel: string;
    };
    phoneCall: {
        statusTime: string;
        ringingLabel: string;
        answerLabel: string;
        tapToAnswer: string;
        endCallLabel: string;
        whatDoYouSay: string;
    };
    wifiPicker: {
        settingsBack: string;
        wifiTitle: string;
        wifiToggle: string;
        networksHeading: string;
        orHeading: string;
        useMobileData: string;
        mobileDataNote: string;
        helperText: string;
    };
    passwordForm: {
        title: string;
        question: string;
        hoverHint: string;
        charsLabel: (n: number) => string;
    };
    passwordBuilder: {
        question: string;
        defaultHeader: string;
        defaultCaption: string;
        choices: { caption: string }[];
    };
    volumeControl: {
        music: string;
        narrator: string;
        ariaLabel: string;
    };
    localeSwitch: {
        ariaLabel: string;
        languageNames: { en: string; ar: string };
    };
    metadata: {
        title: string;
        description: string;
        ogTitle: string;
        ogDescription: string;
    };
}

export interface KnowledgeQuestionMessage {
    id: string;
    prompt: string;
    options: { key: string; label: string }[];
}
