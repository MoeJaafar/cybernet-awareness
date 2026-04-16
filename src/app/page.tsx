"use client";

import { useRouter } from "next/navigation";
import { BootSequence } from "@/components/BootSequence";
import { listScenarios } from "@/lib/scenarios";

/**
 * Landing = the story's cold open. A few lines of typed narrative,
 * then the first scenario starts automatically. No title card, no
 * queue, no "press start" — you're just in the moment.
 */
export default function Home() {
    const router = useRouter();
    const first = listScenarios()[0];
    return <BootSequence onDone={() => router.push(`/scenario/${first.id}`)} />;
}
