import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          fontSize: 10,
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
