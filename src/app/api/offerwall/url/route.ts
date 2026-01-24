import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getUserById } from '@/lib/db';
import crypto from 'crypto';

/**
 * API endpoint to get Offerwall URL
 * Supports multiple Offerwall providers
 * 
 * Configure your Offerwall provider in environment variables:
 * - OFFERWALL_PROVIDER: 'adgate' | 'adscend' | 'offertoro' | 'lootably' | 'cpx' | 'adgem'
 * - OFFERWALL_API_KEY: Your API key
 * - OFFERWALL_USER_ID: Optional user ID parameter
 */

interface OfferwallConfig {
  provider: string;
  apiKey?: string;
  userId?: string;
  subId?: string;
  wallId?: string;
}

function getOfferwallUrl(config: OfferwallConfig): string {
  const { provider, apiKey, userId, subId, wallId } = config;

  // Real Offerwall URLs - these will work when real API keys are provided
  const getRealUrl = (): string | null => {
    if (provider === 'dummy') return null;
    
    switch (provider) {
      case 'kiwiwall':
        // KiwiWall uses iframe URL with wall ID and sub_id
        if (!wallId) return null;
        const kiwiSubId = subId || userId || 'guest';
        return `https://www.kiwiwall.com/wall/${wallId}/${kiwiSubId}`;
      case 'adgate':
        if (!apiKey) return null;
        return `https://api.adgatemedia.com/v1/offers?api_key=${apiKey}&user_id=${userId || ''}`;
      case 'adscend':
        if (!apiKey) return null;
        return `https://api.adscendmedia.com/v1/publishers/${apiKey}/offers?user_id=${userId || ''}`;
      case 'offertoro':
        if (!apiKey) return null;
        return `https://www.offertoro.com/ifr/show/${apiKey}?uid=${userId || ''}`;
      case 'lootably':
        if (!apiKey) return null;
        return `https://lootably.com/offers?api_key=${apiKey}&user_id=${userId || ''}`;
      case 'cpx':
      case 'cpx-research':
        // CPX Research uses specific iframe URL format
        // URL will be generated dynamically with user info in POST handler
        return null; // Will be generated in POST handler with user data
      case 'adgem':
        if (!apiKey) return null;
        return `https://api.adgem.com/v1/offers?api_key=${apiKey}&user_id=${userId || ''}`;
      default:
        return null;
    }
  };

  // If real provider and API key are configured, use real URL
  const realUrl = getRealUrl();
  if (realUrl) {
    return realUrl;
  }

  // Dummy Offerwall - using a realistic demo page that looks like a real offerwall
  // This creates a professional-looking demo that can be shown to clients
  // When real credentials are added, it will automatically switch to real URLs
  const demoUrl = `data:text/html;charset=utf-8,${encodeURIComponent(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Surveys & Offers - Punkcikowo</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      min-height: 100vh;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      font-size: 28px;
      margin-bottom: 10px;
    }
    .header p {
      opacity: 0.9;
      font-size: 16px;
    }
    .offers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
      padding: 30px;
    }
    .offer-card {
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      padding: 20px;
      transition: all 0.3s ease;
      background: #f9f9f9;
    }
    .offer-card:hover {
      border-color: #667eea;
      transform: translateY(-5px);
      box-shadow: 0 5px 20px rgba(102, 126, 234, 0.3);
    }
    .offer-icon {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      margin-bottom: 15px;
    }
    .offer-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 8px;
      color: #333;
    }
    .offer-description {
      font-size: 14px;
      color: #666;
      margin-bottom: 15px;
      line-height: 1.5;
    }
    .offer-reward {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 15px;
    }
    .reward-badge {
      background: #27ae60;
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
    }
    .offer-button {
      width: 100%;
      padding: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .offer-button:hover {
      transform: scale(1.02);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }
    .demo-banner {
      background: #fff3cd;
      border: 1px solid #ffc107;
      padding: 15px;
      margin: 20px;
      border-radius: 8px;
      text-align: center;
      color: #856404;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎁 Surveys & Offers</h1>
      <p>Complete surveys and offers to earn points!</p>
    </div>
    <div class="demo-banner">
      <strong>Demo Mode:</strong> This is a preview of the Offerwall integration. Real surveys will appear here when configured with your Offerwall provider credentials.
    </div>
    <div class="offers-grid">
      <div class="offer-card">
        <div class="offer-icon">📊</div>
        <div class="offer-title">Consumer Survey</div>
        <div class="offer-description">Share your shopping preferences and help brands improve</div>
        <div class="offer-reward">
          <span class="reward-badge">+15 Points</span>
          <span style="color: #666; font-size: 12px;">5-7 min</span>
        </div>
        <button class="offer-button">Start Survey</button>
      </div>
      <div class="offer-card">
        <div class="offer-icon">💻</div>
        <div class="offer-title">Tech Usage Survey</div>
        <div class="offer-description">Help us understand technology usage patterns</div>
        <div class="offer-reward">
          <span class="reward-badge">+12 Points</span>
          <span style="color: #666; font-size: 12px;">4-5 min</span>
        </div>
        <button class="offer-button">Start Survey</button>
      </div>
      <div class="offer-card">
        <div class="offer-icon">🏃</div>
        <div class="offer-title">Health & Wellness</div>
        <div class="offer-description">Share your health and wellness habits</div>
        <div class="offer-reward">
          <span class="reward-badge">+18 Points</span>
          <span style="color: #666; font-size: 12px;">6-8 min</span>
        </div>
        <button class="offer-button">Start Survey</button>
      </div>
      <div class="offer-card">
        <div class="offer-icon">🎬</div>
        <div class="offer-title">Entertainment Survey</div>
        <div class="offer-description">Tell us about your entertainment preferences</div>
        <div class="offer-reward">
          <span class="reward-badge">+10 Points</span>
          <span style="color: #666; font-size: 12px;">3-4 min</span>
        </div>
        <button class="offer-button">Start Survey</button>
      </div>
      <div class="offer-card">
        <div class="offer-icon">✈️</div>
        <div class="offer-title">Travel Survey</div>
        <div class="offer-description">Share your travel experiences and preferences</div>
        <div class="offer-reward">
          <span class="reward-badge">+20 Points</span>
          <span style="color: #666; font-size: 12px;">7-10 min</span>
        </div>
        <button class="offer-button">Start Survey</button>
      </div>
      <div class="offer-card">
        <div class="offer-icon">🛒</div>
        <div class="offer-title">Product Review</div>
        <div class="offer-description">Review products and share your experience</div>
        <div class="offer-reward">
          <span class="reward-badge">+8 Points</span>
          <span style="color: #666; font-size: 12px;">2-3 min</span>
        </div>
        <button class="offer-button">Start Survey</button>
      </div>
    </div>
  </div>
  <script>
    // Simulate offerwall interactions
    document.querySelectorAll('.offer-button').forEach(btn => {
      btn.addEventListener('click', function() {
        alert('This is a demo. Real surveys will be available when Offerwall is configured with your provider credentials.');
      });
    });
  </script>
</body>
</html>
  `)}`;
  
  return demoUrl;
}

export async function POST(request: NextRequest) {
  let providerFromBody = 'unknown';
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    providerFromBody = body.provider;
    const userId = body.userId || currentUser?.userId || 'guest';

    // Get Offerwall configuration from environment or body
    const provider = providerFromBody || process.env.OFFERWALL_PROVIDER || 'dummy';
    const apiKey = process.env.OFFERWALL_API_KEY;
    const subId = process.env.OFFERWALL_SUB_ID || userId;

    // KiwiWall-specific configuration
    let wallId: string | undefined;
    if (provider === 'kiwiwall') {
      wallId = process.env.KIWIWALL_WALL_ID || '4oi3suf4hfah2s5clri5cgaauw6qhnk6';
    }

    // CPX Research-specific URL generation with required parameters
    if (provider === 'cpx' || provider === 'cpx-research') {
      // Get user information for CPX parameters
      const user = userId && userId !== 'guest' ? await getUserById(userId) : null;
      
      if (!user) {
        return NextResponse.json(
          { 
            error: 'Authentication required',
            message: 'Please log in to access surveys. If you are already logged in, please try refreshing the page.',
            provider: 'cpx-research',
            providerName: 'Offer 2'
          },
          { status: 401 }
        );
      }

      // CPX Research configuration
      const CPX_APP_ID = process.env.CPX_APP_ID || '31020';
      const CPX_SECURE_HASH_KEY = process.env.CPX_SECURE_HASH_KEY || '';
      
      // Generate secure_hash: MD5(ext_user_id + secure_hash_key)
      let secureHash = '';
      if (CPX_SECURE_HASH_KEY) {
        secureHash = crypto
          .createHash('md5')
          .update(`${user.id}${CPX_SECURE_HASH_KEY}`)
          .digest('hex');
      }

      // Build CPX Research iframe URL with all required parameters
      const cpxUrl = new URL('https://offers.cpx-research.com/index.php');
      cpxUrl.searchParams.set('app_id', CPX_APP_ID);
      cpxUrl.searchParams.set('ext_user_id', user.id);
      
      if (secureHash) {
        cpxUrl.searchParams.set('secure_hash', secureHash);
      }
      
      if (user.username) {
        cpxUrl.searchParams.set('username', user.username);
      }
      
      if (user.email) {
        cpxUrl.searchParams.set('email', user.email);
      }
      
      // Optional subid parameters (can be empty)
      cpxUrl.searchParams.set('subid_1', '');
      cpxUrl.searchParams.set('subid_2', '');

      return NextResponse.json({
        url: cpxUrl.toString(),
        provider: 'cpx-research',
      });
    }

    const offerwallUrl = getOfferwallUrl({
      provider,
      apiKey,
      userId,
      subId,
      wallId,
    });

    if (!offerwallUrl) {
      const providerName = provider === 'kiwiwall' ? 'Offer 1' :
                          provider === 'cpx-research' || provider === 'cpx' ? 'Offer 2' :
                          provider === 'offertoro' ? 'Offer 3' :
                          provider === 'adgate' ? 'Offer 4' :
                          provider === 'lootably' ? 'Offer 5' : 'Survey Provider';
      
      return NextResponse.json(
        { 
          error: 'Service temporarily unavailable',
          message: `We're unable to load ${providerName} at the moment. Please try again later or select a different survey provider.`,
          provider,
          providerName
        },
        { status: 400 }
      );
    }

    const providerName = provider === 'kiwiwall' ? 'Offer 1' :
                        provider === 'cpx-research' || provider === 'cpx' ? 'Offer 2' :
                        provider === 'offertoro' ? 'Offer 3' :
                        provider === 'adgate' ? 'Offer 4' :
                        provider === 'lootably' ? 'Offer 5' : 'Survey Provider';

    return NextResponse.json({
      url: offerwallUrl,
      provider,
      providerName,
    });
  } catch (error) {
    console.error('Error generating Offerwall URL:', error);
    return NextResponse.json(
      { 
        error: 'Something went wrong',
        message: 'We encountered an issue while loading surveys. Please try again in a moment.',
        provider: providerFromBody
      },
      { status: 500 }
    );
  }
}

