import type { Metadata } from "next";
import { Instrument_Serif, Newsreader, JetBrains_Mono, Roboto } from "next/font/google";
import "./globals.css";
import { AudioSettingsProvider } from "@/lib/audio-settings";
import { BgMusic } from "@/components/BgMusic";
import { VolumeControl } from "@/components/VolumeControl";

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

// Roboto for the Gmail-accurate email mock. Gmail's real font is
// Google Sans (licensed); Roboto is the open equivalent and is very
// close visually.
const roboto = Roboto({
    subsets: ["latin"],
    weight: ["300", "400", "500", "700"],
    variable: "--font-roboto",
    display: "swap",
});

export const metadata: Metadata = {
    title: "CyberNet — Could you spot the attack?",
    description:
        "A web-based cybersecurity awareness game. Short scenarios where you face everyday attacks — phishing, USB drops, vishing, password pressure — and see what would have happened next.",
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html
            lang="en"
            className={`${instrumentSerif.variable} ${newsreader.variable} ${jetbrainsMono.variable} ${roboto.variable}`}
        >
            <body className="min-h-screen">
                <AudioSettingsProvider>
                    {/* Atmosphere stack — order matters (scanlines below vignette below grain). */}
                    <div aria-hidden className="atmos-scanlines" />
                    <div aria-hidden className="atmos-vignette" />
                    <div aria-hidden className="atmos-grain" />

                    <BgMusic src="/audio/bg-music.mp3" />
                    <VolumeControl />
                    {children}
                </AudioSettingsProvider>
            </body>
        </html>
    );
}
