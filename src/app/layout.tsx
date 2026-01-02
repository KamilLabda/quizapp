import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { AdVerification } from "@/components/layout/ad-verification";
import { AdScripts } from "@/components/layout/ad-scripts";
import Script from "next/script";

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
      <head>
        {/* RollerAds Banner Script */}
        <Script
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(ax){var d = document,s = d.createElement('script'),l = d.scripts[d.scripts.length - 1];s.settings = ax || {};s.src = "//mushyyoung.com/bHXBVhs.d/GElf0_YRWVcv/-eAmk9FuSZlUKlMkePaTcY/3cMwz/ki1OOITnc/tAN_jhcZzUO/TkUJ5vOmAI";s.async = true;s.referrerPolicy = 'no-referrer-when-downgrade';l.parentNode.insertBefore(s, l);})({})`
          }}
        />
        {/* RollerAds PopUnder Script */}
        <Script
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(ppjmpsp){var d = document,s = d.createElement('script'),l = d.scripts[d.scripts.length - 1];s.settings = ppjmpsp || {};s.src = "//affectionate-spray.com/c.D/9K6Ybk2/5yl/SkWfQx9ANRjVcqzKODTKYpw/Mdyl0/2/Ngz/M/5mNMjWAM0V";s.async = true;s.referrerPolicy = 'no-referrer-when-downgrade';l.parentNode.insertBefore(s, l);})({})`
          }}
        />
        {/* RollerAds InPagePush Script */}
        <Script
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(vbl){var d = document,s = d.createElement('script'),l = d.scripts[d.scripts.length - 1];s.settings = vbl || {};s.src = "//mushyyoung.com/b.XuVpsmdkGRle0dYiWKcI/qebmP9JuzZcUdlpkVPyTzYJ3PMbzhkZ2RMeDbU/tNNHjRcIzWOAT/Y/wENfg_";s.async = true;s.referrerPolicy = 'no-referrer-when-downgrade';l.parentNode.insertBefore(s, l);})({})`
          }}
        />
        {/* RollerAds Video Slider Script */}
        <Script
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(aljd){var d = document,s = d.createElement('script'),l = d.scripts[d.scripts.length - 1];s.settings = aljd || {};s.src = "//mushyyoung.com/baXkV.sPdtGVll0OYhWgcX/reZmr9/uIZ/Uzlmk/PwTQY/3jMQz/kR2AMBTREEtLN/j/czz/OvTQY/xXM/gG";s.async = true;s.referrerPolicy = 'no-referrer-when-downgrade';l.parentNode.insertBefore(s, l);})({})`
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AdVerification />
        <AdScripts />
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
