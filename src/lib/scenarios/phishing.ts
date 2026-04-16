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
                "An email from IT Helpdesk is at the top of your inbox. Subject: URGENT: account verification required within 24 hours. You open it.",
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
                    label: "Report spam",
                    nextId: "outcome-reported",
                    location: "toolbar-report",
                },
                {
                    label: "Delete",
                    nextId: "outcome-deleted",
                    location: "toolbar-delete",
                },
            ],
        },

        /* -------- Outcomes: three branches -------- */

        "outcome-clicked": {
            type: "outcome",
            id: "outcome-clicked",
            background: "/art/backgrounds/office-desk.svg",
            portrait: { role: "player", expression: "alarmed" },
            speaker: "what happened next",
            attackerWon: true,
            narration:
                "You click. A login page that looks exactly like your company's Microsoft sign-in opens. You enter your username and password. The page spins, then redirects you to the real company homepage — so you assume everything worked. It didn't. The attacker already has your credentials and is logging into your mailbox from a residential IP in another country.",
            nextId: "pov-breach",
        },
        "outcome-reported": {
            type: "outcome",
            id: "outcome-reported",
            background: "/art/backgrounds/office-desk.svg",
            portrait: { role: "player", expression: "neutral" },
            speaker: "what happened next",
            attackerWon: false,
            narration:
                "You forward the email to IT as a phishing report. Within an hour they confirm that portal-secure-verify.com is a typosquat domain registered last week, block it at the gateway, and warn everyone else. Three colleagues had already received the same message but hadn't clicked yet. The campaign is contained because you spoke up.",
            nextId: "pov-contained",
        },
        "outcome-deleted": {
            type: "outcome",
            id: "outcome-deleted",
            background: "/art/backgrounds/office-desk.svg",
            portrait: { role: "player", expression: "neutral" },
            speaker: "what happened next",
            attackerWon: false,
            narration:
                "You delete the email. Your account is safe — for now. But you didn't tell IT, so the same campaign continues to land in other people's inboxes, and one of them is less cautious than you. Three days later, a payroll spreadsheet leaves the building.",
            nextId: "pov-delete",
        },

        /* -------- Attacker POV cutaways -------- */

        "pov-breach": {
            type: "stimulus",
            id: "pov-breach",
            background: "/art/backgrounds/attacker-workspace.svg",
            portrait: { role: "attacker", expression: "smug" },
            speaker: "somewhere else · the attacker",
            content:
                "*\"Another one in. Same template always works. I'll forward anything marked 'contract' and 'invoice' to my own mailbox, then try these credentials on the VPN. If the VPN's single sign-on, I'm in the file server too. Give me an hour.\"*",
            nextId: "debrief",
        },
        "pov-contained": {
            type: "stimulus",
            id: "pov-contained",
            background: "/art/backgrounds/attacker-workspace.svg",
            portrait: { role: "attacker", expression: "smug" },
            speaker: "somewhere else · the attacker",
            content:
                "*\"Domain got blocked. Someone must've reported. I've still got the mailing list — I'll switch to a new look-alike domain by tonight and send round two with a different subject line. Most people won't bother to check twice.\"*",
            nextId: "debrief",
        },
        "pov-delete": {
            type: "stimulus",
            id: "pov-delete",
            background: "/art/backgrounds/attacker-workspace.svg",
            portrait: { role: "attacker", expression: "smug" },
            speaker: "somewhere else · the attacker",
            content:
                "*\"One fewer target, but no heat. The domain's still live, the mailing list's still good. I just need one careless person out of fifty to bite. Patience.\"*",
            nextId: "debrief",
        },

        /* -------- Debrief + quiz -------- */

        "debrief": {
            type: "debrief",
            id: "debrief",
            background: "/art/backgrounds/office-desk.svg",
            speaker: "the takeaway",
            takeaway:
                "Spear phishing leans on URGENCY, AUTHORITY, and LOOK-ALIKE DOMAINS to push you past your normal caution.",
            lesson:
                "Three signals were in plain sight: the sender domain (portal-secure-verify.com, not your company's real IT domain), the artificial 24-hour deadline, and a request IT would never make (re-verifying an account via a one-off link). When two of those three signals are present, treat the email as malicious by default.",
            nextId: "quiz",
        } as Scenario["scenes"][string],
        "quiz": {
            type: "quiz",
            id: "quiz",
            background: "/art/backgrounds/office-desk.svg",
            speaker: "one last check",
            prompt:
                "Which single signal should have made you suspicious before you even opened the email?",
            options: [
                {
                    label: "The 24-hour deadline in the subject line.",
                    correct: false,
                    feedback:
                        "Close — urgency is a red flag, but it was inside the email. Look for something visible in the inbox itself, before you open anything.",
                },
                {
                    label: "The sender's domain didn't match your company's real IT domain.",
                    correct: true,
                    feedback:
                        "Exactly. The sender line in the inbox shows the domain. A mismatched domain is visible before you open the email, before you read the urgency, before you're ever tempted to click.",
                },
                {
                    label: "The request to re-verify the account.",
                    correct: false,
                    feedback:
                        "An unusual request is a red flag, but you only see it after opening. The domain mismatch is visible at the inbox level — that's the earliest warning.",
                },
            ],
            nextId: "done",
        } as Scenario["scenes"][string],
    },
};

/*
 * Note on the final `nextId: "done"` — the quiz is the last scene,
 * and "done" doesn't resolve to anything in the scenes map. The
 * runner treats that as "show the return-to-queue button," which
 * the QuizPanel handles natively via onAdvance -> router.push('/').
 * We keep the field populated so the type stays consistent.
 */
