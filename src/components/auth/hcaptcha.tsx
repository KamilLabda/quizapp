'use client';

import { useRef, useEffect } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

interface HCaptchaComponentProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: (error: any) => void;
}

export function HCaptchaComponent({ onVerify, onExpire, onError }: HCaptchaComponentProps) {
  const captchaRef = useRef<HCaptcha>(null);
  const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY || '';

  useEffect(() => {
    if (!siteKey) {
      console.warn('hCaptcha site key is not configured');
    }
  }, [siteKey]);

  if (!siteKey) {
    return null;
  }

  return (
    <div className="flex justify-center">
      <HCaptcha
        ref={captchaRef}
        sitekey={siteKey}
        onVerify={onVerify}
        onExpire={onExpire}
        onError={onError}
        theme="light"
        size="normal"
      />
    </div>
  );
}
