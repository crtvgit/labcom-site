import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "LAB.COM — Laboratórios de Comunicação UCB";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#F0EEE9",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top-left UCB label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 3,
              height: 20,
              background: "#74a8ed",
              borderRadius: 2,
            }}
          />
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#9d9d9d",
            }}
          >
            Universidade Católica de Brasília
          </span>
        </div>

        {/* Centre — main logotype area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* LAB.COM wordmark */}
          <div
            style={{
              fontSize: 120,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              color: "#060606",
              display: "flex",
            }}
          >
            LAB
            <span style={{ color: "#74a8ed" }}>.</span>
            COM
          </div>

          {/* Thin rule */}
          <div
            style={{
              width: 80,
              height: 2,
              background: "#cccccc",
            }}
          />

          {/* Subtitle */}
          <div
            style={{
              fontSize: 24,
              fontWeight: 400,
              color: "#9d9d9d",
              letterSpacing: "0.01em",
              lineHeight: 1.4,
              display: "flex",
            }}
          >
            Laboratórios de Comunicação
          </div>
        </div>

        {/* Bottom-right decorative large dot cluster */}
        <div
          style={{
            position: "absolute",
            right: 56,
            bottom: 56,
            display: "flex",
            gap: 10,
            alignItems: "flex-end",
          }}
        >
          {[40, 28, 18].map((size, i) => (
            <div
              key={i}
              style={{
                width: size,
                height: size,
                borderRadius: "50%",
                background: "#74a8ed",
                opacity: 0.12 + i * 0.06,
              }}
            />
          ))}
        </div>

        {/* Large background watermark */}
        <div
          style={{
            position: "absolute",
            right: -40,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 400,
            fontWeight: 700,
            letterSpacing: "-0.06em",
            lineHeight: 1,
            color: "#74a8ed",
            opacity: 0.04,
            display: "flex",
          }}
        >
          L
        </div>
      </div>
    ),
    { ...size }
  );
}
