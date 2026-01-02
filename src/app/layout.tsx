import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { AdVerification } from "@/components/layout/ad-verification";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Punkcikowo - Complete Surveys & Earn Rewards",
  description: "Share your opinions and get rewarded. Complete surveys from leading companies and earn points for every survey you finish with Punkcikowo!",
  verification: {
    other: {
      'eeb54ab3adf7008f9233dcca30c08700c093dd5e': 'eeb54ab3adf7008f9233dcca30c08700c093dd5e',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AdVerification />
        <ScrollToTop />
        <Header />
        <main className="container mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-8 min-h-[calc(100vh-4rem)]">
          <div className="w-full">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
