import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Prompt It — Smarter Prompts. Better Results.",
  description:
    "Your AI Prompt Engineering Hub. Generate optimized prompts for ChatGPT, Claude, Gemini, Perplexity, Sora, and Copilot. One Platform. Every AI Prompt.",
  keywords: [
    "AI prompts",
    "prompt engineering",
    "ChatGPT",
    "Claude",
    "Gemini",
    "Copilot",
    "Sora",
    "Perplexity",
    "AI tools",
    "prompt generator",
  ],
  authors: [{ name: "Prompt It" }],
  openGraph: {
    title: "Prompt It — Smarter Prompts. Better Results.",
    description:
      "Your AI Prompt Engineering Hub. Generate optimized prompts for ChatGPT, Claude, Gemini, Perplexity, Sora, and Copilot.",
    type: "website",
  },
};

import AuthProvider from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-bg-primary text-text-primary font-sans antialiased">
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
