import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_HOSTS = [
  'youradexchange.com',
  'www.youradexchange.com',
  'envious-concept.com',
  'www.envious-concept.com',
];

function isAllowedVastUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ALLOWED_HOSTS.includes(parsed.hostname);
  } catch {
    return false;
  }
}

/**
 * Proxies VAST tag requests server-side to avoid CORS and to allow parsing.
 * GET /api/video-ads/vast?url=https://example.com/vast.xml
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }
  if (!isAllowedVastUrl(url)) {
    return NextResponse.json({ error: 'URL not allowed' }, { status: 400 });
  }
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/xml, text/xml, */*' },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `VAST fetch failed: ${res.status}` },
        { status: 502 }
      );
    }
    const xml = await res.text();
    return new NextResponse(xml, {
      headers: { 'Content-Type': res.headers.get('Content-Type') || 'application/xml' },
    });
  } catch (error) {
    console.error('VAST proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch VAST tag' },
      { status: 502 }
    );
  }
}
