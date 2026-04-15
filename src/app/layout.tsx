import type { Metadata } from "next";
import { Instrument_Serif, Newsreader, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/*
 * Typography — deliberately away from the generic Inter / Space-Grotesk
 * axis.
 *
 * Instrument Serif — editorial display serif with lots of character in
 *                    its italic. Used for hero headlines, chapter marks.
 * Newsreader       — book-style serif for long-read body. Warmer than
 *                    the common Fraunces / Playfair picks.
 * JetBrains Mono   — monospace for system labels and case numbers,
 *                    supports the slashed-zero feature we enable in CSS.
 */

const instrumentSerif = Instrument_Serif({
    subsets: ["latin"],
    weight: "400",
    style: ["normal", "italic"],
    variable: "--font-instrument-serif",
    display: "swap",
});

const newsreader = Newsreader({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600"],
    style: ["normal", "italic"],
    variable: "--font-newsreader",
    display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    weight: ["300", "400", "500"],
    variable: "--font-jetbrains-mono",
    display: "swap",
});

export const metadata: Metadata = {
    title: "CyberNet — Could you spot the attack?",
    description:
        "A web-based cybersecurity awareness game. Work through scripted attacks — phishing, USB drops, vishing — as a new SOC analyst at Riverside University.",
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html
            lang="en"
            className={`${instrumentSerif.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}
        >
            <body className="min-h-screen">
                {/* Atmosphere stack — order matters (scanlines below vignette below grain). */}
                <div aria-hidden className="atmos-scanlines" />
                <div aria-hidden className="atmos-vignette" />
                <div aria-hidden className="atmos-grain" />

                {children}
            </body>
        </html>
    );
}
