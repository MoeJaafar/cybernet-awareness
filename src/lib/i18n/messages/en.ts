import type { Messages } from "../types";

export const en: Messages = {
    splash: {
        tagline: "a cybersecurity awareness game",
        title: "CyberNet",
        intro:
            "Five short scenarios. A phishing email, a suspicious call, a USB on the floor. You make the choices, and each outcome shows you what an attacker would have done with the one you picked.",
        scenarioCount: "5 scenarios",
        runtime: "~20 minutes",
        headphonesNote: "headphones recommended for the best experience",
        cta: "tap to begin",
    },
    consent: {
        eyebrow: "informed consent",
        heading: "Before we begin",
        paragraphs: [
            "You are about to play a short cybersecurity awareness game as part of a bachelor’s thesis study. The session takes approximately 20 minutes.",
            "You will answer a brief knowledge quiz, play through five interactive scenarios, answer the same quiz again, and complete a short feedback survey. No directly identifying information (name, email, IP address) is collected. Each session is linked only by a random identifier so pre- and post-test answers can be paired for analysis.",
            "Participation is voluntary. You may stop at any time by closing the browser tab; partial data collected up to that point may be retained for analysis. Because sessions are anonymous, data cannot be retrieved or deleted after submission. Data will be stored for up to two years after thesis submission, used for academic analysis only, and not shared with third parties.",
        ],
        questionsLine: "Questions about the study can be sent to ",
        agreeNote:
            "By tapping below, you confirm that you have read the above and agree to participate.",
        agreeButton: "I agree, begin",
        startingButton: "Starting…",
        errorMessage:
            "Something went wrong starting the session. Check your internet and try again.",
    },
    briefing: {
        eyebrow: "how this works",
        heading: "How this works.",
        steps: [
            {
                n: "01",
                title: "A quick knowledge quiz",
                note: "10 short multiple-choice questions about everyday cybersecurity. No trick questions, no right to prove, this is your baseline.",
            },
            {
                n: "02",
                title: "Five interactive scenarios",
                note: "A phishing email, a suspicious call, a USB drop, and more. You make the decisions. Each outcome shows what an attacker would have done with your choice.",
            },
            {
                n: "03",
                title: "The same quiz again",
                note: "So we can see what, if anything, changed between your first attempt and your last.",
            },
            {
                n: "04",
                title: "A short feedback survey",
                note: "Eleven quick questions about how the experience felt, plus a handful of optional background questions at the end.",
            },
        ],
        totalTime: "total time",
        runtime: "~20 minutes",
        headphonesNote: "headphones recommended",
        readyHeading: "Are you ready to start?",
        cta: "I’m ready, begin",
    },
    pretest: {
        title: "pre-test",
        nextLabel: "Start the game",
    },
    posttest: {
        title: "post-test",
        nextLabel: "One last thing",
    },
    knowledgeTest: {
        unitOf: (current, total) => `${current} / ${total}`,
        confidencePrompt: "how confident? (optional)",
        confidenceLabels: ["Not sure", "Sure"],
        unfinishedHint: (total) => `answer all ${total} questions to continue`,
        savingLabel: "Saving…",
        navHeading: "questions",
        navHint: "tap a number to jump. press Esc or tap outside to close.",
        navOpenLabel: "Open question navigation",
        navCloseLabel: "Close navigation",
        questionLabel: (i, answered) =>
            `Question ${i + 1}${answered ? ", answered" : ", unanswered"}`,
    },
    survey: {
        eyebrow: "feedback survey",
        agreementLabel: "Agreement scale",
        chooseHint: "pick a value to continue",
        nextLabel: "Next",
        finishLabel: "Finish",
        finishingLabel: "Finishing…",
        likertLabels: [
            "Strongly disagree",
            "Disagree",
            "Neutral",
            "Agree",
            "Strongly agree",
        ],
        questions: [
            {
                id: "ease-1",
                statement: "The game was easy to use and navigate.",
            },
            {
                id: "engage-1",
                statement: "I found the scenarios realistic and believable.",
            },
            {
                id: "useful-1",
                statement:
                    "I learned something new about cybersecurity from this experience.",
            },
            {
                id: "learn-1",
                statement:
                    "The outcomes helped me understand why my choices mattered.",
            },
            {
                id: "engage-2",
                statement:
                    "The game made cybersecurity threats feel more real to me.",
            },
            {
                id: "efficacy-1",
                statement:
                    "I feel more confident recognising cybersecurity threats after playing.",
            },
            {
                id: "intent-1",
                statement:
                    "I intend to apply what I learned to my everyday online behaviour.",
            },
            {
                id: "intent-2",
                statement: "I would recommend this game to someone else.",
            },
            {
                id: "present-narration",
                statement:
                    "The narrated voice made it easier to follow what was happening.",
            },
            {
                id: "present-music",
                statement:
                    "The background music made the scenarios feel more immersive.",
            },
            {
                id: "present-visuals",
                statement:
                    "The visual style of the game kept me engaged while I played.",
            },
        ],
    },
    demographics: {
        eyebrow: "a little about you",
        heading: "One last step.",
        intro:
            "This helps me describe who participated. Every question is optional, and nothing here can be used to identify you.",
        labels: {
            age: "Your age",
            gender: "Gender",
            role: "What best describes you right now?",
            field: "Your field of study or work",
            primaryLanguage:
                "What language do you use day-to-day on your devices?",
            training: "Prior cybersecurity training",
            passwordManager:
                "Do you use a password manager (1Password, Bitwarden, the one built into your browser, etc.)?",
            twoFactor:
                "Do you use two-factor authentication (codes from an app or SMS) on your accounts?",
            phishingVictim:
                "Have you ever been the target of a phishing or scam message that almost worked, or that did?",
            publicWifi:
                "How often do you connect to public Wi-Fi in cafés, airports, or hotels?",
            riskTolerance:
                "In everyday choices, how cautious or open-to-risk would you say you are?",
            riskMin: "very cautious",
            riskMax: "open to risk",
            selfRating:
                "Overall, how would you rate your cybersecurity awareness?",
            selfRatingMin: "beginner",
            selfRatingMax: "expert",
        },
        options: {
            age: [
                "Under 18",
                "18–24",
                "25–34",
                "35–44",
                "45–54",
                "55+",
                "Prefer not to say",
            ],
            gender: ["Female", "Male", "Prefer not to say"],
            role: [
                "Student",
                "IT professional",
                "Non-IT professional",
                "Other",
                "Prefer not to say",
            ],
            field: [
                "STEM (science, tech, engineering, maths)",
                "Non-STEM",
                "No formal field",
                "Prefer not to say",
            ],
            primaryLanguage: [
                "English",
                "Russian",
                "Arabic",
                "Italian",
                "Spanish",
                "Other",
                "Prefer not to say",
            ],
            training: [
                "None",
                "Informal (articles, videos, work emails)",
                "Formal course or module",
                "Certification (CompTIA, CEH, CISSP, etc.)",
                "Prefer not to say",
            ],
            passwordManager: [
                "Yes",
                "No",
                "Not sure what that means",
                "Prefer not to say",
            ],
            twoFactor: [
                "None",
                "Some accounts",
                "Most or all accounts",
                "Not sure what that means",
                "Prefer not to say",
            ],
            phishingVictim: ["Yes", "No", "Not sure", "Prefer not to say"],
            publicWifi: [
                "Never",
                "Occasionally",
                "Regularly",
                "Prefer not to say",
            ],
        },
        finishLabel: "Finish",
        skipFinishLabel: "Skip and finish",
        finishingLabel: "Finishing…",
        skipHint: "leave everything blank to skip",
    },
    done: {
        eyebrow: "session complete",
        heading: "Thank you.",
        body: "Your responses have been recorded anonymously and will be used for academic analysis only. You may now close this tab.",
        signature: "CyberNet, a cybersecurity awareness game",
    },
    boot: {
        lines: [
            { text: "Tuesday morning. Just another workday.", speed: 52, hold: 900 },
            {
                text: "Coffee in one hand. Laptop open. Five emails waiting.",
                speed: 42,
                hold: 900,
            },
            {
                text: "One of them is not what it seems.",
                speed: 58,
                hold: 1400,
                emphasis: true,
            },
        ],
        skipLabel: "skip →",
    },
    narrative: {
        clickToContinue: "click to continue",
    },
    runner: {
        narrators: {
            narrator: "narrator",
            yourMove: "your move",
            chooseLabel: "choose",
            breach: "breach",
            contained: "contained",
            takeaway: "the takeaway",
            oneLastCheck: "one last check",
            checkInstincts: "check your instincts",
            debriefLessonLabel: "debrief · the lesson",
        },
        buttons: {
            continue: "Continue",
            viewTakeaway: "View the takeaway",
            viewDebrief: "View debrief",
            returnToQueue: "Return to queue",
            next: "Next",
        },
        quizFeedback: {
            right: "right",
            tryAgain: "not quite, try again",
        },
    },
    knowledgeQuestions: [
        {
            id: "phish-1",
            prompt:
                "You're in the middle of work when an email from \"IT Helpdesk\" says your account password expires in two hours and links to a reset page. The sender name and the logo look right. What do you do?",
            options: [
                {
                    key: "a",
                    label:
                        "Open a new browser tab, go to the company login page directly, and reset it from there.",
                },
                {
                    key: "b",
                    label: "Click the link in the email and reset through that page.",
                },
                { key: "c", label: "Reply to the email to ask if it's genuine." },
                {
                    key: "d",
                    label:
                        "Forward it to a colleague to see if they received one too.",
                },
            ],
        },
        {
            id: "phish-2",
            prompt:
                "You get an urgent message that looks like it's from a close family member, saying they're stranded and need you to send money right away. The name and photo are familiar. What do you do?",
            options: [
                {
                    key: "a",
                    label: "Send a smaller amount first to check it's really them.",
                },
                {
                    key: "b",
                    label: "Reply on the same app to ask if they really sent it.",
                },
                {
                    key: "c",
                    label:
                        "Call or message them on a number you already have saved before doing anything.",
                },
                { key: "d", label: "Send the money; they can pay you back later." },
            ],
        },
        {
            id: "pw-1",
            prompt:
                "You need a new password for an account you use every day. Which would you choose?",
            options: [
                {
                    key: "a",
                    label:
                        "Tr0ub4d0r&3, because it's a familiar word with substitutions and a symbol.",
                },
                {
                    key: "b",
                    label:
                        "sunset-piano-bicycle, because three unrelated words give length without being hard to remember.",
                },
                {
                    key: "c",
                    label: "Jessica1987!, because a personal name and year are easy to recall.",
                },
                {
                    key: "d",
                    label: "aX9$kL2!, because a short fully-random string feels secure.",
                },
            ],
        },
        {
            id: "pw-2",
            prompt:
                "A friend tells you her password is March2026!. She says it's easy to remember and the site accepted it, so it must be fine. What do you think?",
            options: [
                {
                    key: "a",
                    label:
                        "If the site accepted it, it probably meets the strength rules.",
                },
                {
                    key: "b",
                    label:
                        "The mix of letters, a number, and a symbol makes it reasonably secure.",
                },
                {
                    key: "c",
                    label:
                        "Adding another symbol at the end would make it strong enough.",
                },
                {
                    key: "d",
                    label:
                        "Month-and-year patterns are among the first combinations attackers try.",
                },
            ],
        },
        {
            id: "vish-1",
            prompt:
                "Your phone rings. The caller knows your full name, address, and the last four digits of your bank card. They say they're from your bank's fraud team and ask you to confirm your online-banking password \"for security.\" What do you do?",
            options: [
                { key: "a", label: "Give it to them; they clearly know who you are." },
                {
                    key: "b",
                    label: "Ask them to prove it by telling you your current balance first.",
                },
                {
                    key: "c",
                    label:
                        "Tell them you'll call the bank back on the number printed on your card.",
                },
                {
                    key: "d",
                    label:
                        "Give a slightly wrong version of the password to see how they react.",
                },
            ],
        },
        {
            id: "vish-2",
            prompt:
                "A caller says he's from Microsoft Support, reads your operating system back to you, and claims \"we've detected errors on your computer.\" What do you do?",
            options: [
                {
                    key: "a",
                    label: "Hang up — Microsoft doesn't cold-call users about errors.",
                },
                {
                    key: "b",
                    label: "Let him connect remotely; the errors could be serious.",
                },
                {
                    key: "c",
                    label:
                        "Ask which department he's from and call Microsoft back to verify.",
                },
                {
                    key: "d",
                    label: "Tell him you're not the account owner and end the call.",
                },
            ],
        },
        {
            id: "usb-1",
            prompt:
                "You find a USB stick on your desk labelled \"HR — Bonuses\" with no note. What do you do?",
            options: [
                { key: "a", label: "Plug it in to find out whose it is." },
                { key: "b", label: "Hand it to IT with a short note about where you found it." },
                { key: "c", label: "Leave it on a colleague's desk in case it's theirs." },
                {
                    key: "d",
                    label: "Take it home and check it on your personal laptop first.",
                },
            ],
        },
        {
            id: "usb-2",
            prompt:
                "A colleague finds a labelled USB stick in the car park and wants to check it on a spare laptop that isn't connected to the internet. What do you think?",
            options: [
                { key: "a", label: "Fine — being offline means nothing bad can happen." },
                { key: "b", label: "Fine as long as the spare laptop has antivirus up to date." },
                {
                    key: "c",
                    label:
                        "Fine as long as he only looks at the file list without opening anything.",
                },
                {
                    key: "d",
                    label:
                        "Any hidden program on the stick could still run on that laptop, online or not.",
                },
            ],
        },
        {
            id: "wifi-1",
            prompt:
                "You open an incognito window before connecting to a café's Wi-Fi, because you want your browsing to stay private. What does incognito actually do for you here?",
            options: [
                {
                    key: "a",
                    label:
                        "It encrypts your traffic so other people on the Wi-Fi can't read it.",
                },
                {
                    key: "b",
                    label:
                        "It only stops your browser saving your history; the network still sees your traffic.",
                },
                {
                    key: "c",
                    label: "It hides your browsing from the café's Wi-Fi provider.",
                },
                {
                    key: "d",
                    label: "It gives you similar protection to a VPN for casual browsing.",
                },
            ],
        },
        {
            id: "wifi-2",
            prompt:
                "You're in a café and want to log into your bank account. You can use the café's password-protected Wi-Fi, or tether to your phone's mobile data. Which is safer, and why?",
            options: [
                {
                    key: "a",
                    label:
                        "Mobile data — the connection is between your phone and your mobile network, not shared with other café users.",
                },
                {
                    key: "b",
                    label:
                        "The café's Wi-Fi — the password gives each person their own protected channel.",
                },
                {
                    key: "c",
                    label:
                        "Either is fine — banking sites are encrypted regardless of the network.",
                },
                {
                    key: "d",
                    label:
                        "The café's Wi-Fi — a familiar café is safer than a mobile connection.",
                },
            ],
        },
    ],
    emailMockup: {
        toolbar: {
            back: "Back",
            archiveDefault: "Archive",
            reportDefault: "Report spam",
            deleteDefault: "Delete",
            markUnread: "Mark as unread",
            more: "More",
            star: "Star",
            counter: "1 of 127",
        },
        inboxLabel: "Inbox",
        timestamp: "09:12 (0 min ago)",
        toMe: "to me ▾",
        inspectionTip:
            "tip: click underlined parts to inspect without clicking. the link in the body is a real link.",
        replyLabel: "Reply",
        forwardLabel: "Forward",
    },
    phoneCall: {
        statusTime: "3:42",
        ringingLabel: "incoming call...",
        answerLabel: "Accept",
        tapToAnswer: "tap to answer",
        endCallLabel: "End call",
        whatDoYouSay: "what do you say?",
    },
    wifiPicker: {
        settingsBack: "Settings",
        wifiTitle: "Wi-Fi",
        wifiToggle: "Wi-Fi",
        networksHeading: "NETWORKS",
        orHeading: "OR",
        useMobileData: "Use Mobile Data",
        mobileDataNote: "turn off Wi-Fi, use 5G",
        helperText: "tap a network to send the report",
    },
    passwordForm: {
        title: "Set a new password",
        question: "Which password would you use?",
        hoverHint: "Hover an option to see the actual password.",
        charsLabel: (n) => `${n} chars`,
    },
    passwordBuilder: {
        question: "Which password would you use?",
        defaultHeader:
            "This site requires you to set a new password before continuing.",
        defaultCaption:
            "Pick the one you'd actually use. The outcome will show how it fares against a real attacker.",
        choices: [
            { caption: "11 characters, symbol substitutions" },
            { caption: "20 characters, three plain words" },
            { caption: "8 characters, fully random" },
            { caption: "12 characters, name + year + symbol" },
        ],
    },
    volumeControl: {
        music: "Music",
        narrator: "Narrator",
        ariaLabel: "Volume settings",
    },
    localeSwitch: {
        ariaLabel: "Language",
        languageNames: { en: "EN", ar: "عربي" },
    },
    metadata: {
        title: "CyberNet",
        description:
            "A web-based cybersecurity awareness game. Short scenarios where you face everyday attacks, phishing, USB drops, vishing, password pressure, and see what would have happened next.",
        ogTitle: "CyberNet, Could you spot the attack?",
        ogDescription:
            "Five interactive cybersecurity scenarios. You make the choices, the outcome shows you what an attacker would have done.",
    },
};
