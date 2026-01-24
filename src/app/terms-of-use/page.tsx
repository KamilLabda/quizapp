import { PageWithAds } from '@/components/layout/page-with-ads';
import { Accordion, AccordionItem } from '@/components/ui/accordion';

export const metadata = {
  title: 'Terms of Use - Punkcikowo',
  description: 'Terms of Use for punkcikowo.pl - Read our terms and conditions for using the platform.',
};

export default function TermsOfUsePage() {
  return (
    <PageWithAds showSidebar={false}>
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">Terms of Use</h1>
          <div className="space-y-2 text-sm md:text-base text-muted-foreground">
            <p><strong className="text-black dark:text-white">Effective Date:</strong> December 2025</p>
            <p><strong className="text-black dark:text-white">Owner:</strong> Kamil Labda</p>
            <p><strong className="text-black dark:text-white">Email:</strong> <a href="mailto:kamillabda151@gmail.com" className="text-primary hover:underline">kamillabda151@gmail.com</a></p>
            <p><strong className="text-black dark:text-white">Website:</strong> <a href="https://punkcikowo.pl" className="text-primary hover:underline">https://punkcikowo.pl</a></p>
          </div>
        </header>

        <Accordion defaultOpenIndex={0}>
          <AccordionItem title="1. Acceptance of Terms" index={0}>
            <p>
              By accessing or using punkcikowo.pl, you agree to be bound by these Terms of Use. If you do not agree, please do not use the site.
            </p>
          </AccordionItem>

          <AccordionItem title="2. Use of the Site" index={1}>
            <p>
              You may use the site for personal, non-commercial purposes. You agree not to misuse the platform, attempt to manipulate systems, or engage in fraudulent behavior.
            </p>
          </AccordionItem>

          <AccordionItem title="3. Points System" index={2}>
            <p>
              punkcikowo.pl allows users to earn points by performing specific actions (e.g., watching videos, completing tasks, engaging with content). These points are for engagement tracking only and have no monetary or redeemable value.
            </p>
          </AccordionItem>

          <AccordionItem title="4. User Conduct" index={3}>
            <p className="mb-4">You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Use bots, scripts, or automation to interact with the site</li>
              <li>Attempt to exploit or manipulate the platform</li>
              <li>Post or share offensive, illegal, or harmful content</li>
            </ul>
          </AccordionItem>

          <AccordionItem title="5. Account Termination" index={4}>
            <p>
              We reserve the right to suspend or terminate accounts that violate these terms or engage in suspicious activity.
            </p>
          </AccordionItem>

          <AccordionItem title="6. Disclaimer" index={5}>
            <p>
              The site is provided "as is" without warranties. We do not guarantee uninterrupted access or error-free functionality.
            </p>
          </AccordionItem>

          <AccordionItem title="7. Changes to Terms" index={6}>
            <p>
              We may update these Terms of Use at any time. Continued use of the site after changes constitutes acceptance of the new terms.
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
