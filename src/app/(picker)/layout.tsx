import type { Metadata } from "next";
import { Instrument_Serif, IBM_Plex_Sans_Arabic, JetBrains_Mono } from "next/font/google";
import "../globals.css";

/**
 * Root layout for the language picker at `/`. Lives in its own route
 * group so it has its own <html> independent of the locale layouts;
 * Next.js allows parallel root layouts when each branch is wrapped in
 * a route group.
 *
 * Loads Latin + Arabic display faces so the picker can render both
 * "English" and "العربية" at brand quality without FOUC.
 */

const instrumentSerif = Instrument_Serif({
    subsets: ["latin"],
    weight: "400",
    style: ["normal", "italic"],
    variable: "--font-instrument-serif",
    display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    weight: ["300", "400", "500"],
    variable: "--font-jetbrains-mono",
    display: "swap",
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
    subsets: ["arabic"],
    weight: ["300", "400", "500", "600"],
    variable: "--font-ibm-plex-arabic",
    display: "swap",
});

export const metadata: Metadata = {
    title: "CyberNet",
    description: "Choose your language — اختر لغتك",
};

export default function PickerLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const fontVars = `${instrumentSerif.variable} ${jetbrainsMono.variable} ${ibmPlexSansArabic.variable}`;
    return (
        <html lang="en" dir="ltr" className={fontVars}>
            <body className="min-h-screen">
                <div aria-hidden className="atmos-grid" />
                <div aria-hidden className="atmos-sheen" />
                <div aria-hidden className="atmos-sweep" />
                <div aria-hidden className="atmos-scanlines" />
                <div aria-hidden className="atmos-vignette" />
                <div aria-hidden className="atmos-grain" />
                {children}
            </body>
        </html>
    );
}
