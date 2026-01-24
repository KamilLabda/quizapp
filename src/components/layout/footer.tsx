import Link from 'next/link';
import { ClipboardList } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/40 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 md:py-16 pb-6 md:pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 mb-4">
            {/* Brand */}
            <div className="space-y-4">
              <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group">
                <ClipboardList className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
                <span className="text-xl font-bold text-foreground">Punkcikowo</span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                Complete surveys and earn rewards. Share your opinions and get rewarded with points
                for every survey you finish.
              </p>
            </div>

            {/* Navigation */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-5">
                Navigation
              </h3>
              <nav className="flex flex-col space-y-3">
                <Link
                  href="/surveys"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 hover:translate-x-1 inline-block"
                >
                  Surveys
                </Link>
                <Link
                  href="/video-ads"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 hover:translate-x-1 inline-block"
                >
                  Video Ads
                </Link>
                <Link
                  href="/login"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 hover:translate-x-1 inline-block"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 hover:translate-x-1 inline-block"
                >
                  Sign Up
                </Link>
              </nav>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-5">
                Legal
              </h3>
              <nav className="flex flex-col space-y-3">
                <Link
                  href="/regulations"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 hover:translate-x-1 inline-block"
                >
                  Regulations
                </Link>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 hover:translate-x-1 inline-block"
                >
                  Contact
                </Link>
              </nav>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-3 border-t border-border/60">
            <div className="flex justify-center items-center">
              <p className="text-sm text-muted-foreground">
                © {currentYear} Punkcikowo. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
