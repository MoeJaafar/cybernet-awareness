import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CyberNet, A cybersecurity awareness game";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#0a0806",
                    backgroundImage:
                        "radial-gradient(ellipse 80% 60% at 50% 110%, rgba(255,153,51,0.08), transparent 60%)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "28px",
                    }}
                >
                    <div
                        style={{
                            fontSize: 128,
                            fontFamily: "Georgia, serif",
                            fontWeight: 400,
                            color: "#ede4d3",
                            letterSpacing: "-0.02em",
                            lineHeight: 1,
                        }}
                    >
                        CyberNet
                    </div>
                    <div
                        style={{
                            width: 96,
                            height: 1,
                            backgroundColor: "rgba(255,153,51,0.6)",
                        }}
                    />
                    <div
                        style={{
                            fontSize: 26,
                            fontFamily: "Georgia, serif",
                            color: "#b8ab96",
                            letterSpacing: "0.05em",
                        }}
                    >
                        A cybersecurity awareness game
                    </div>
                    <div
                        style={{
                            display: "flex",
                            gap: "16px",
                            fontSize: 18,
                            fontFamily: "monospace",
                            color: "#726857",
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            marginTop: 12,
                        }}
                    >
                        <span>5 scenarios</span>
                        <span>·</span>
                        <span>~20 minutes</span>
                        <span>·</span>
                        <span>audio narration</span>
                    </div>
                </div>
            </div>
        ),
        { ...size },
    );
}
