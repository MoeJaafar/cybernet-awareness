"use client";

import { KnowledgeTest } from "@/components/KnowledgeTest";
import { useRequireSession } from "@/lib/require-session";

export default function PretestPage() {
    useRequireSession();
    return (
        <KnowledgeTest
            title="pre-test"
            seed="pre"
            eventType="pretest"
            nextRoute="/play"
            nextLabel="Start the game"
        />
    );
}
