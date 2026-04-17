"use client";

import { useRouter } from "next/navigation";
import { BootSequence } from "@/components/BootSequence";
import { listScenarios } from "@/lib/scenarios";

/**
 * Boot intro → first scenario. Reached after the pre-test completes.
 * The typed "Tuesday morning…" lines play here, then auto-routes to
 * the first scenario.
 */
export default function PlayPage() {
    const router = useRouter();
    const first = listScenarios()[0];
    return <BootSequence onDone={() => router.push(`/scenario/${first.id}`)} />;
}
