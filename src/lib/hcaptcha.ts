/**
 * hCaptcha server-side verification utility
 */

const HCAPTCHA_SECRET = process.env.HCAPTCHA_SECRET;
const HCAPTCHA_VERIFY_URL = 'https://hcaptcha.com/siteverify';

export interface HCaptchaVerifyResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
}

/**
 * Verify hCaptcha token on the server
 */
export async function verifyHCaptcha(
  token: string,
  remoteip?: string
): Promise<{ success: boolean; error?: string }> {
  if (!HCAPTCHA_SECRET) {
    console.warn('HCAPTCHA_SECRET is not configured');
    return { success: false, error: 'hCaptcha is not configured' };
  }

  if (!token) {
    return { success: false, error: 'hCaptcha token is required' };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', HCAPTCHA_SECRET);
    formData.append('response', token);
    if (remoteip) {
      formData.append('remoteip', remoteip);
    }

    const response = await fetch(HCAPTCHA_VERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const data: HCaptchaVerifyResponse = await response.json();

    if (data.success) {
      return { success: true };
    } else {
      const errorCodes = data['error-codes'] || ['unknown-error'];
      return {
        success: false,
        error: `hCaptcha verification failed: ${errorCodes.join(', ')}`,
      };
    }
  } catch (error) {
    console.error('hCaptcha verification error:', error);
    return {
      success: false,
      error: 'Failed to verify hCaptcha. Please try again.',
    };
  }
}
