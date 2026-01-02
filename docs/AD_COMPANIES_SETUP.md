# Ad Companies Configuration

## Overview
This application integrates with **3 ad networks** for monetization: RollerAds, RichInfo, and a third network pending verification.

## Configured Ad Networks

### 1. RollerAds (Site ID: 2261550) ✅ ACTIVE
- **Network ID**: `rollerads`
- **Site ID**: `2261550`
- **Domain**: `www.punkcikowo.pl`
- **Status**: ✅ Active - Real ads integrated
- **Verification**: ✅ Complete

**Ad Types Integrated:**
- **Banner**: Top, bottom, and sidebar positions
- **PopUnder**: Background ads
- **InPagePush**: Push notification style ads
- **Video Slider**: Video ad format

**Implementation:**
All RollerAds scripts are loaded in the document head via `src/app/layout.tsx`. Ads load automatically on all pages.

### 2. RichInfo (PubID: 997602, SiteID: 382124) ✅ ACTIVE
- **Network ID**: `richinfo`
- **Publisher ID**: `997602`
- **Site ID**: `382124`
- **Niche**: `33`
- **Domain**: `www.punkcikowo.pl`
- **Status**: ✅ Active - Push notifications integrated
- **Type**: Push notification ads

**Ad Types Integrated:**
- **Push Notifications**: Browser push notification ads

**Implementation:**
- Script loaded via `src/components/layout/ad-scripts.tsx`
- Firebase service worker configured in `firebase-messaging-sw.js`
- Push notifications will appear to users who opt-in

**Firebase Service Worker:**
The `firebase-messaging-sw.js` file is required for RichInfo push notifications. It must be accessible at the root of your domain: `https://www.punkcikowo.pl/firebase-messaging-sw.js`

### 3. Second Ad Network (Verification Code: eeb54ab3adf7008f9233) ⏳ PENDING
- **Verification Code**: `eeb54ab3adf7008f9233dcca30c08700c093dd5e`
- **Domain**: `www.punkcikowo.pl`
- **Status**: ⏳ Verification configured, awaiting ad codes
- **Verification File**: `/public/eeb54ab3adf7008f9233.txt`
- **Meta Tag**: ✅ Automatically added to all pages

**Verification Steps:**
1. ✅ Verification file created
2. ✅ Meta tag automatically added
3. ⏳ Awaiting ad codes from network

---

## Ad Implementation Details

### Script Loading Strategy

All ad scripts are loaded using Next.js `Script` component with `afterInteractive` strategy for optimal performance:

**RollerAds Scripts (4 scripts):**
- Loaded in `src/app/layout.tsx` head section
- Banner, PopUnder, InPagePush, Video Slider
- Load after page becomes interactive

**RichInfo Script:**
- Loaded via `src/components/layout/ad-scripts.tsx`
- Module type script for push notifications
- Async loading with cfasync disabled

### File Structure

```
src/
├── app/
│   └── layout.tsx                    # RollerAds scripts in head
├── components/
│   └── layout/
│       ├── ad-scripts.tsx            # RichInfo script loader
│       └── ad-verification.tsx       # Meta tag verification
└── lib/
    └── ads.ts                        # Ad management logic

public/
├── 2261550.txt                       # RollerAds verification
├── eeb54ab3adf7008f9233.txt         # Third network verification
└── firebase-messaging-sw.js          # RichInfo service worker (root level)
```

---

## Ad Verification Implementation

### Meta Tags
The following meta tag is automatically added to all pages:
```html
<meta name="eeb54ab3adf7008f9233dcca30c08700c093dd5e" content="eeb54ab3adf7008f9233dcca30c08700c093dd5e" />
```

### Verification Files

1. **RollerAds Verification**: `/public/2261550.txt`
   - Content: `2261550`
   - URL: `https://www.punkcikowo.pl/2261550.txt`
   - Status: ✅ Ready

2. **Third Network Verification**: `/public/eeb54ab3adf7008f9233.txt`
   - Content: `eeb54ab3adf7008f9233dcca30c08700c093dd5e`
   - URL: `https://www.punkcikowo.pl/eeb54ab3adf7008f9233.txt`
   - Status: ✅ Ready

3. **RichInfo Service Worker**: `/firebase-messaging-sw.js`
   - Required for push notifications
   - URL: `https://www.punkcikowo.pl/firebase-messaging-sw.js`
   - Status: ✅ Configured

---

## Ad Positions & Types

### RollerAds Positions

| Position | Ad Type | Description |
|----------|---------|-------------|
| Top | Banner | 728x90 (desktop), 320x50 (mobile) |
| Bottom | Banner | 728x90 (desktop), 320x50 (mobile) |
| Sidebar | Banner | 300x250 (desktop only) |
| Background | PopUnder | Pop-under ads |
| In-content | InPagePush | Push notification style |
| Video | Video Slider | Video ad format |

### RichInfo

| Type | Description |
|------|-------------|
| Push Notifications | Browser push notifications (requires user opt-in) |

---

## Testing

### Local Testing
```bash
# Start development server
npm run dev

# Visit pages
http://localhost:3000
```

### Production Testing

After deployment, verify:

1. **RollerAds Scripts Loading:**
   - Open browser DevTools → Network tab
   - Look for requests to `mushyyoung.com` and `affectionate-spray.com`
   - Scripts should load successfully

2. **RichInfo Script Loading:**
   - Check Network tab for `richinfo.co` requests
   - Push notification prompt may appear (user opt-in required)

3. **Verification Files:**
   - `https://www.punkcikowo.pl/2261550.txt` → Should show `2261550`
   - `https://www.punkcikowo.pl/eeb54ab3adf7008f9233.txt` → Should show verification code
   - `https://www.punkcikowo.pl/firebase-messaging-sw.js` → Should load service worker

4. **Browser Console:**
   - Check for any JavaScript errors
   - Ad scripts should load without errors

---

## Troubleshooting

### Ads Not Showing

**Possible Causes:**
1. Ad scripts blocked by ad blocker
2. Scripts not loaded yet (check Network tab)
3. Ad network needs time to approve site
4. Browser privacy settings blocking ads

**Solutions:**
1. Disable ad blocker for testing
2. Check browser console for errors
3. Verify scripts are loading in Network tab
4. Wait 24-48 hours for ad network approval
5. Test in incognito mode

### Push Notifications Not Working

**Possible Causes:**
1. User hasn't granted permission
2. Service worker not registered
3. Browser doesn't support push notifications

**Solutions:**
1. Check if push permission prompt appears
2. Verify `firebase-messaging-sw.js` is accessible
3. Test in supported browsers (Chrome, Firefox, Edge)
4. Check browser console for service worker errors

---

## Monitoring & Performance

### What to Monitor

**RollerAds:**
- Check RollerAds dashboard for impressions and revenue
- Monitor ad load times
- Track click-through rates

**RichInfo:**
- Monitor push notification opt-in rates
- Track notification impressions and clicks
- Check RichInfo dashboard for performance

**Third Network:**
- Once integrated, monitor similarly to RollerAds

### Performance Optimization

- All scripts load asynchronously (non-blocking)
- Scripts load after page becomes interactive
- Minimal impact on page load speed
- Service worker caches for offline support

---

## Next Steps

### Immediate
- ✅ RollerAds ads are live
- ✅ RichInfo push notifications active
- ⏳ Deploy to production
- ⏳ Verify all ad networks in dashboards
- ⏳ Monitor performance

### After Third Network Provides Codes
- Integrate third network ad codes
- Test third network ads
- Update documentation

---

## Support

**For Ad Performance:**
- RollerAds: Check dashboard at rollerads.com
- RichInfo: Check dashboard at richinfo.co
- Monitor browser console for errors

**For Technical Issues:**
- Check Network tab for script loading
- Verify service worker registration
- Test in different browsers
- Check for ad blocker interference

---

**Last Updated:** January 2, 2026  
**Status:** RollerAds Active ✅ | RichInfo Active ✅ | Third Network Pending ⏳

## Ad Positions
- **Top**: Banner ads at the top of pages (728x90 desktop, 320x50 mobile)
- **Bottom**: Banner ads at the bottom of pages (728x90 desktop, 320x50 mobile)
- **Sidebar Left/Right**: Sidebar ads (300x250) - Desktop only (xl+ screens)
- **Interstitial**: Full-screen ads between content
- **Result Page**: Ads shown on survey/quiz result pages

## Configuration via Database

To configure ads, insert records into the `adconfigs` collection:

```javascript
{
  network: "adsterra", // or "propellerads" or "admaven"
  type: "banner",
  position: "top",
  code: "<div>Your ad code here</div>",
  isActive: true,
  priority: 10 // Higher priority = shown first
}
```

## Offerwall Surveys API

**Status**: ⏳ Pending

The offerwall surveys API integration is currently pending. Once available:
- External survey providers will be integrated
- Users can complete surveys from partner networks
- Points will be automatically credited upon completion

## Ad Rotation Logic

The system uses survey-based rotation:
- Same survey always shows the same ad (better for tracking)
- Ads are selected based on survey ID hash
- Priority determines which ad network is preferred
- Falls back to dummy ads if no active configs found

## Testing

Currently using realistic dummy ads for testing. Replace with real ad codes from your ad networks when ready.

