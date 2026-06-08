import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Space_Mono, Dancing_Script } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-space-mono",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
});

import { ClerkProvider } from "@clerk/nextjs";

import { Header } from "@/components/layouts/Header";
import { Footer } from "@/components/layouts/Footer";

export const metadata: Metadata = {
  title: "LifeBack | Evidence-Based Mental Health Assessment",
  description: "A private, evidence-based platform for screening mental health using the clinically-validated PHQ-9 standard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${inter.variable} ${plusJakartaSans.variable} ${spaceMono.variable} ${dancingScript.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        <body suppressHydrationWarning className="min-h-full flex flex-col font-body bg-background text-foreground">
          <Header />
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
