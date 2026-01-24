import { PageWithAds } from '@/components/layout/page-with-ads';
import { Accordion, AccordionItem } from '@/components/ui/accordion';

export const metadata = {
  title: 'Privacy Policy - Punkcikowo',
  description: 'Privacy Policy for punkcikowo.pl - Learn how we collect, use, and protect your personal data.',
};

export default function PrivacyPolicyPage() {
  return (
    <PageWithAds showSidebar={false}>
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
          <div className="space-y-2 text-sm md:text-base text-muted-foreground">
            <p><strong className="text-black dark:text-white">Effective Date:</strong> December 2025</p>
            <p><strong className="text-black dark:text-white">Owner:</strong> Kamil Labda</p>
            <p><strong className="text-black dark:text-white">Email:</strong> <a href="mailto:kamillabda151@gmail.com" className="text-primary hover:underline">kamillabda151@gmail.com</a></p>
            <p><strong className="text-black dark:text-white">Website:</strong> <a href="https://punkcikowo.pl" className="text-primary hover:underline">https://punkcikowo.pl</a></p>
          </div>
        </header>

        <Accordion defaultOpenIndex={0}>
          <AccordionItem title="1. Introduction" index={0}>
            <p className="mb-4">
              This Privacy Policy explains how we collect, use, and protect your personal data when you use punkcikowo.pl. By accessing or using our website, you agree to the terms of this policy.
            </p>
          </AccordionItem>

          <AccordionItem title="2. Data We Collect" index={1}>
            <p className="mb-4">We may collect the following types of information:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Email address (if you register or contact us)</li>
              <li>IP address and browser/device information</li>
              <li>Usage data (e.g., pages visited, time spent, interactions)</li>
              <li>Cookies and tracking data (for analytics and advertising)</li>
            </ul>
          </AccordionItem>

          <AccordionItem title="3. How We Use Your Data" index={2}>
            <p className="mb-4">We use collected data to:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Operate and improve our platform</li>
              <li>Track user activity for internal analytics</li>
              <li>Serve relevant advertising and measure performance</li>
              <li>Prevent fraud and abuse</li>
            </ul>
          </AccordionItem>

          <AccordionItem title="4. Points System" index={3}>
            <p>
              Users may earn points by engaging with content and completing actions on the site (e.g., watching videos, playing games, answering quizzes). These points are for internal engagement purposes only. They do not represent any monetary value and cannot be exchanged, redeemed, or withdrawn.
            </p>
          </AccordionItem>

          <AccordionItem title="5. Data Sharing" index={4}>
            <p>
              We may share anonymized or aggregated data with third-party partners for analytics and advertising purposes. We do not sell your personal data.
            </p>
          </AccordionItem>

          <AccordionItem title="6. Cookies" index={5}>
            <p>
              We use cookies and similar technologies to enhance your experience and analyze traffic. You can manage cookie preferences through your browser settings.
            </p>
          </AccordionItem>

          <AccordionItem title="7. Your Rights" index={6}>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Access, correct, or delete your personal data</li>
              <li>Withdraw consent at any time</li>
              <li>Contact us regarding data concerns at <a href="mailto:kamillabda151@gmail.com" className="text-primary hover:underline">kamillabda151@gmail.com</a></li>
            </ul>
          </AccordionItem>

          <AccordionItem title="8. Changes to This Policy" index={7}>
            <p>
              We may update this policy from time to time. Changes will be posted on this page with an updated effective date.
            </p>
          </AccordionItem>
        </Accordion>

        <div className="text-xs md:text-sm text-muted-foreground text-center pt-6 border-t">
          <p>Last updated: December 2025</p>
        </div>
      </div>
    </PageWithAds>
  );
}
