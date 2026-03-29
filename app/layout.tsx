import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PulseKit — AI Workspace for Engineers & Data Scientists",
  description: "Code analysis, spec generation, and data visualization — powered by AI. Built for builders.",
  keywords: ["AI", "developer tools", "data science", "code analysis", "PRD generator", "chart builder"],
  authors: [{ name: "PulseKit Team" }],
  openGraph: {
    title: "PulseKit — AI Workspace for Engineers",
    description: "The future of engineering workflows",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};
import { LocalSessionProvider } from "@/components/providers/LocalSessionProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased font-inter">
        <LocalSessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange={false}
          >
            {children}
          </ThemeProvider>
        </LocalSessionProvider>
      </body>
    </html>
  );
}