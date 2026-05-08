import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/app/components/providers";
import CursorGlow from "@/app/components/cursor-glow";
import LoadingBar from "@/app/components/loading-bar";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CflatMinor — AI Music Analysis Platform",
  description:
    "Upload songs and discover the instruments within them using AI-powered audio analysis. Detect piano, guitar, drums, vocals, and more.",
  keywords: [
    "music analysis",
    "instrument detection",
    "AI",
    "audio analysis",
    "CflatMinor",
    "Mercury band",
  ],
  authors: [{ name: "Abhay Navaneeth" }],
  openGraph: {
    title: "CflatMinor — AI Music Analysis",
    description: "Discover the instruments in any song with AI",
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
      className={cn("h-full", "antialiased", inter.variable, geistMono.variable, "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>
          <LoadingBar />
          <CursorGlow />
          {children}
        </Providers>
      </body>
    </html>
  );
}
