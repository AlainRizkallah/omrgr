import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "white",
          color: "hsl(30 10% 12%)",
          fontSize: 48,
          fontWeight: 700,
          letterSpacing: "0.02em",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        OMRGR
      </div>
    ),
    { ...size }
  );
}
