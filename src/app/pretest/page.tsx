"use client";

import { KnowledgeTest } from "@/components/KnowledgeTest";

export default function PretestPage() {
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
