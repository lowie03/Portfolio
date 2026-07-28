import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  const photo = await readFile(join(process.cwd(), "public/godwin.jpg"));
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "80px",
          background: "#fafaf7",
          color: "#16181d",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 720 }}>
          <div style={{ fontSize: 24, color: "#0d9488", letterSpacing: 4, marginBottom: 24 }}>
            GODWIN PRAISE — AI/ML ENGINEER
          </div>
          <div style={{ fontSize: 60, fontWeight: 600, lineHeight: 1.2 }}>
            I build diagnostic ML systems that know when not to guess.
          </div>
        </div>
        <img
          src={photoSrc}
          width={280}
          height={280}
          style={{
            borderRadius: "50%",
            objectFit: "cover",
            border: "6px solid #0d9488",
          }}
        />
      </div>
    ),
    size
  );
}
