import type { Scenario } from "@/lib/types";

/**
 * Scenario 1 — Spear phishing email impersonating IT.
 *
 * End-to-end structure per docs/PHISHING.md:
 *   setup  →  stimulus (arrival)
 *          →  decision (inspection + 3 choices, email has hotspots)
 *          →  outcome (branched: clicked / reported / deleted)
 *          →  attacker-pov (stimulus from attacker's workspace)
 *          →  debrief (takeaway + lesson)
 *          →  quiz (one question, try-again on wrong)
 *          →  return to queue
 *
 * Narration is hard-coded for now. LLM narration is the mode switch
 * that lands in phase 5 of PLAN.md.
 */
export const phishing: Scenario = {
    id: "phishing-it-helpdesk",
    title: "Urgent: account verification required",
    concept:
        "Spear phishing — recognising urgency, mismatched senders, and look-alike domains.",
    setup:
        "You're at your desk. Five emails are waiting this morning. Three are meeting invites, one is payroll, and one is asking you to act fast.",
    startSceneId: "show-email",
    scenes: {
        "show-email": {
            type: "decision",
            id: "show-email",
            background: "/art/backgrounds/inbox-closeup.svg",
            portrait: { role: "player", expression: "alarmed" },
            speaker: "your inbox",
            prompt:
                "An email from IT Helpdesk sits at the top of your inbox. Subject: URGENT: account verification required within 24 hours. You open it.",
            mock: {
                fromName: "IT Helpdesk",
                from: "helpdesk@portal-secure-verify.com",
                to: "you@work.com",
                subject: "URGENT: account verification required within 24 hours",
                body:
                    "Dear staff member,\n\nOur records indicate your account has not been verified in line with the new Microsoft 365 security policy. Failure to verify within 24 hours will result in your account being suspended and all unsaved work being lost.\n\nKind regards,\nIT Helpdesk Team",
                link: {
                    label: "verify",
                    url: "https://portal-secure-verify.com/verify",
                    trapsTo: "outcome-clicked",
                },
                hotspots: [
                    {
                        target: "from",
                        caption:
                            "Sender domain is portal-secure-verify.com — your real IT team sends from your own work domain, not a look-alike.",
                    },
                    {
                        target: "subject",
                        caption:
                            "URGENT + a 24-hour deadline is a classic pressure tactic. Real IT policy changes are announced in advance, not via a countdown.",
                    },
                    {
                        target: "link",
                        caption:
                            "The link goes to the same look-alike domain, not your company's actual login page. Hover over any link before clicking.",
                    },
                ],
            },
            choices: [
                {
                    label: "Click the link in the email and verify your account.",
                    nextId: "outcome-clicked",
                },
                {
                    label: "Report the email to IT as a phishing attempt.",
                    nextId: "outcome-reported",
                },
                {
                    label: "Delete the email and move on.",
                    nextId: "outcome-deleted",
                },
            ],
        },

        /* -------- Outcomes: three branches -------- */

        "outcome-clicked": {
            type: "outcome",
            id: "outcome-clicked",
            speaker: "what happened next",
            attackerWon: true,
            narration:
                "You click. A login page that looks exactly like your company's Microsoft sign-in opens. You enter your username and password. The page spins, then redirects you to the real homepage. You assume it worked. It didn't. The attacker already has your credentials.",
            nextId: "debrief",
        },
        "outcome-reported": {
            type: "outcome",
            id: "outcome-reported",
            speaker: "what happened next",
            attackerWon: false,
            narration:
                "You forward the email to IT as a phishing report. Within an hour they confirm the domain is a typosquat registered last week, block it at the gateway, and warn everyone else. Three colleagues had already received it but hadn't clicked yet. The campaign is contained because you spoke up.",
            nextId: "debrief",
        },
        "outcome-deleted": {
            type: "outcome",
            id: "outcome-deleted",
            speaker: "what happened next",
            attackerWon: false,
            narration:
                "You delete the email. Your account is safe for now. But you didn't tell IT. The same campaign keeps landing in other inboxes, and three days later a payroll spreadsheet leaves the building.",
            nextId: "debrief",
        },

        /* -------- Debrief + quiz -------- */

        "debrief": {
            type: "debrief",
            id: "debrief",
            speaker: "the takeaway",
            takeaway:
                "Spear phishing leans on URGENCY, AUTHORITY, and LOOK-ALIKE DOMAINS to push you past your normal caution.",
            lesson:
                "Three signals were in plain sight — a look-alike sender domain, an artificial 24-hour deadline, and a request IT would never make. When two of those three are present, treat the email as malicious by default.",
            nextId: "quiz",
        },
        "quiz": {
            type: "quiz",
            id: "quiz",
            speaker: "one last check",
            prompt:
                "Which single signal should have made you suspicious before you even opened the email?",
            options: [
                {
                    label: "The 24-hour deadline in the subject line.",
                    correct: false,
                    feedback:
                        "Urgency is a red flag, but this one was inside the email. Look for a signal visible in the inbox before you open anything.",
                },
                {
                    label: "The sender's domain didn't match your company's real IT domain.",
                    correct: true,
                    feedback:
                        "Exactly. The domain shows in the inbox — visible before you open, before you read, before you're ever tempted to click.",
                },
                {
                    label: "The request to re-verify the account.",
                    correct: false,
                    feedback:
                        "An unusual request is a red flag, but only after opening. The domain mismatch is the earliest warning — visible at the inbox level.",
                },
            ],
            nextId: "done",
        },
    },
};

/*
 * Note on the final `nextId: "done"` — the quiz is the last scene,
 * and "done" doesn't resolve to anything in the scenes map. The
 * runner treats that as "show the return-to-queue button," which
 * the QuizPanel handles natively via onAdvance -> router.push('/').
 * We keep the field populated so the type stays consistent.
 */
