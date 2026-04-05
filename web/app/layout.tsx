import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Unforce Make — Modular AI Blocks, Reimagined",
  description:
    "Unforce Make is a modular IoT blocks platform: magnetic-plug hardware, a Python Host that routes MQTT / UDP / WebSocket traffic, and an AI Agent that understands the whole room.",
  openGraph: {
    title: "Unforce Make — Modular AI Blocks",
    description:
      "Snap the blocks together. We handle Wi-Fi, protocols, and intent. You talk to the room.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full relative">
        <div className="noise" aria-hidden />
        {children}
      </body>
    </html>
  );
}
