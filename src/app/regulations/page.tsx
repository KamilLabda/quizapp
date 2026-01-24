import { PageWithAds } from '@/components/layout/page-with-ads';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export const metadata = {
  title: 'Regulations - Punkcikowo',
  description:
    'Official regulations and terms of use for the Punkcikowo rewards platform.',
};

export default function RegulationsPage() {
  return (
    <PageWithAds showSidebar={false}>
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">Platform Regulations</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Please read these regulations carefully before using Punkcikowo. By using our platform,
            you agree to comply with these terms.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Terms of Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm md:text-base text-muted-foreground">
            <p>
              Punkcikowo is a rewards platform that allows users to earn points by completing
              surveys and selected partner offers. By using the website, you agree to follow these
              rules:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                You must provide accurate and truthful information when registering and in surveys.
              </li>
              <li>
                Each person may only maintain one account. Creating multiple or fake accounts is
                strictly prohibited.
              </li>
              <li>
                Any attempt to manipulate surveys, use bots, VPNs/proxies to hide your identity, or
                abuse the system may result in account suspension and loss of accumulated points.
              </li>
              <li>
                Points are a virtual reward within Punkcikowo and do not represent cash until they
                are redeemed according to the rules agreed with you.
              </li>
              <li>
                We reserve the right to adjust points, block specific offers, or suspend accounts in
                case of suspected fraud, abuse, or violation of these regulations.
              </li>
              <li>
                We may update these regulations from time to time. Any important changes will be
                communicated on the website.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privacy & Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm md:text-base text-muted-foreground">
            <p>
              We take security and protection of your data seriously. The platform uses several
              safeguards, including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong>hCaptcha protection</strong> on login and registration to reduce automated
                and bot traffic.
              </li>
              <li>
                <strong>Login via Google (OAuth 2.0)</strong> to avoid storing plain text passwords
                and leverage Google's secure authentication.
              </li>
              <li>
                <strong>IP and device/fingerprint checks</strong> to detect suspicious or abusive
                activity and protect the platform from fraud.
              </li>
              <li>
                <strong>Session security</strong> with HTTP-only cookies and regular validation of
                active sessions.
              </li>
              <li>
                <strong>Activity and fraud monitoring</strong> via internal logs and analytics to
                quickly detect and block suspicious behaviour.
              </li>
            </ul>
            <p>
              Detailed technical information about our security and anti-fraud measures is described
              in our internal security documentation and can be shared with partners on request.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Suspension & Appeals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm md:text-base text-muted-foreground">
            <p>
              If your account is suspended due to suspected violations, you may contact us to appeal
              the decision. We will review your case and respond within a reasonable timeframe.
            </p>
            <p>
              Suspended accounts may lose access to accumulated points if the violation is confirmed.
              We reserve the right to take legal action in cases of severe fraud or abuse.
            </p>
          </CardContent>
        </Card>

        <div className="text-xs md:text-sm text-muted-foreground text-center pt-4 border-t">
          <p>
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </PageWithAds>
  );
}
