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
  manifest: "/manifest.json",
  openGraph: {
    title: "Prompt It — Smarter Prompts. Better Results.",
    description:
      "Your AI Prompt Engineering Hub. Generate optimized prompts for ChatGPT, Claude, Gemini, Perplexity, Sora, and Copilot.",
    type: "website",
  },
};

import AuthProvider from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import ServiceWorkerRegister from "@/components/providers/ServiceWorkerRegister";
import InstallPrompt from "@/components/ui/InstallPrompt";

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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Prompt It" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#3b82f6" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
      </head>
      <body className="min-h-screen bg-bg-primary text-text-primary font-sans antialiased">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <ServiceWorkerRegister />
            <InstallPrompt />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
