import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#060606",
          borderRadius: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* "L" letterform */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            color: "#F0EEE9",
            lineHeight: 1,
            letterSpacing: "-0.04em",
            fontFamily: "sans-serif",
            display: "flex",
            marginBottom: 10,
          }}
        >
          L
        </div>
        {/* Blue accent dot */}
        <div
          style={{
            position: "absolute",
            bottom: 38,
            right: 38,
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "#74a8ed",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
