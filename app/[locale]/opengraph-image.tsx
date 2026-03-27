import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Israël Oriadé — Mentor Business Digital";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#060B2E",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Gold grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(212,175,55,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.12) 1px, transparent 1px)",
            backgroundSize: "140px 140px",
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(245,194,0,0.12)",
            border: "1px solid rgba(245,194,0,0.4)",
            borderRadius: "999px",
            padding: "6px 16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#F5C200",
            }}
          />
          <span style={{ color: "#F5C200", fontSize: "14px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            The Growth Mentor
          </span>
        </div>

        {/* Title */}
        <div style={{ color: "#ffffff", fontSize: "72px", fontWeight: 800, lineHeight: 1.1, marginBottom: "24px", maxWidth: "700px" }}>
          Construis ton{" "}
          <span style={{ color: "rgba(255,255,255,0.6)" }}>business digital.</span>
        </div>

        {/* Subtitle */}
        <div style={{ color: "rgba(147,197,253,0.8)", fontSize: "24px", maxWidth: "600px", lineHeight: 1.5 }}>
          Formations, ressources et accompagnement personnalisé
        </div>

        {/* Domain */}
        <div style={{ position: "absolute", bottom: "60px", right: "80px", color: "rgba(255,255,255,0.3)", fontSize: "18px" }}>
          israeloriade.com
        </div>
      </div>
    ),
    { ...size }
  );
}
