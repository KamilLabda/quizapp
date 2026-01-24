import { PageWithAds } from '@/components/layout/page-with-ads';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Mail, MessageSquare, HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'Contact Us - Punkcikowo',
  description: 'Get in touch with Punkcikowo support team for assistance, questions, or business inquiries.',
};

export default function ContactPage() {
  return (
    <PageWithAds showSidebar={false}>
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">Contact Us</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Have questions, need support, or want to get in touch? We're here to help.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">General Support</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                For questions about your account, points, surveys, or technical issues.
              </p>
              <a
                href="mailto:support@punkcikowo.pl"
                className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
              >
                <Mail className="h-4 w-4" />
                support@punkcikowo.pl
              </a>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Business Inquiries</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                For partnership opportunities, advertising, or corporate inquiries.
              </p>
              <a
                href="mailto:contact@punkcikowo.pl"
                className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
              >
                <Mail className="h-4 w-4" />
                contact@punkcikowo.pl
              </a>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <HelpCircle className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm md:text-base text-muted-foreground">
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-foreground mb-1">How do I earn points?</h3>
                <p>
                  Complete surveys and watch video ads to earn points. Each completed activity
                  awards points that are added to your account balance.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">How do I redeem my points?</h3>
                <p>
                  Point redemption options are available in your account dashboard. Check the
                  available rewards and follow the redemption process.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Why was my account suspended?</h3>
                <p>
                  Accounts may be suspended for violations of our regulations, such as creating
                  multiple accounts, using bots, or providing false information. Contact support if
                  you believe this was done in error.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">How long does support take to respond?</h3>
                <p>
                  We aim to respond to all inquiries within 24-48 hours during business days. For
                  urgent matters, please include "URGENT" in your subject line.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm md:text-base text-muted-foreground">
            <p>
              We typically respond to emails within <strong>24-48 hours</strong> during business
              days (Monday-Friday). For urgent matters, please mark your email as urgent and we will
              prioritize your request.
            </p>
            <p>
              If you haven't received a response within 48 hours, please check your spam folder or
              try sending your inquiry again.
            </p>
          </CardContent>
        </Card>
      </div>
    </PageWithAds>
  );
}
