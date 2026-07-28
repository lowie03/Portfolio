import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-body" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });
const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://placeholder.vercel.app"), // we'll update after deploy
  title: {
    default: "Godwin Praise — AI/ML Engineer",
    template: "%s — Godwin Praise",
  },
  description:
    "I build AI for problems I can see out the window. Gated, explained, and shipped where it's needed.",
  openGraph: {
    title: "Godwin Praise — AI/ML Engineer",
    description: "I build AI for problems I can see out the window.",
    type: "website",
  },
};

import Nav from "@/components/Nav";
import ThemeProvider from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geist.variable} ${geistMono.variable} ${grotesk.variable} antialiased`}
      >
        <ThemeProvider>
          <Nav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
