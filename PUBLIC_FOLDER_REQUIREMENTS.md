# Public Folder Requirements for Ad Networks

## ✅ Already Present Files

### Verification Files (Existing)
1. **`2261550.txt`** - RollerAds verification (Site ID: 2261550)
   - Content: `2261550`
   - Status: ✅ Present (RollerAds is disabled but file kept)

2. **`eeb54ab3adf7008f9233.txt`** - Ad network verification
   - Content: `eeb54ab3adf7008f9233dcca30c08700c093dd5e`
   - Status: ✅ Present (matches meta tag in `layout.tsx`)

3. **`aa5d778159bd248f6b0f44caed784dcc.html`** - Verification file
   - Content: `aa5d778159bd248f6b0f44caed784dcc`
   - Status: ✅ Present

4. **`Bqjw6qHn5.js`** - Verification file
   - Content: `this is a verification file`
   - Status: ✅ Present

### Service Workers
1. **`sw.js`** - Service worker for 3nbf4.com
   - Domain: `3nbf4.com`
   - Zone ID: `10528154`
   - Status: ✅ Present (likely for one of your ad networks)

2. **`firebase-messaging-sw.js`** - RichInfo push notifications
   - Status: ⚠️ Disabled (RichInfo removed per client request)

## ⏳ What Might Be Needed for New Ad Networks

### 1. Autotag (aclib) - Zone ID: `0z4zktony9`
- **Verification Files**: Check with the ad network if they require:
  - HTML verification file
  - TXT verification file
  - Meta tag (already handled in code)

### 2. HighPerformanceFormat - Key: `063b0f69e6d6f3c70c71f435e4ae050c`
- **Verification Files**: Check with the ad network if they require:
  - HTML verification file
  - TXT verification file
  - Meta tag verification

### 3. HilltopAds
- **Verification Files**: Check with HilltopAds dashboard
- **Service Worker**: May require a service worker file

### 4-6. Additional Ad Networks
- **Verification Files**: Each network may require specific files
- **Service Workers**: Some networks require service worker files

## 📋 How to Check What's Needed

1. **Check Each Ad Network Dashboard:**
   - Log into each ad network's publisher dashboard
   - Look for "Domain Verification" or "Site Verification" section
   - They will tell you exactly what files to upload

2. **Common Verification File Types:**
   - `verification-code.html` - HTML file with verification code
   - `verification-code.txt` - TXT file with verification code
   - `verification-code.js` - JS file with verification code
   - Service worker files (like `sw.js`)

3. **Where to Place Files:**
   - All verification files go in the `public/` folder
   - They will be accessible at: `https://www.punkcikowo.pl/filename`
   - Service workers must be in `public/` root

## 🔍 Current Status

**Service Worker**: ✅ `sw.js` is already configured for `3nbf4.com`

**Verification Files**: ✅ 4 verification files already present

**Action Required**: 
- Check each new ad network's dashboard for specific verification requirements
- Add any required verification files to the `public/` folder
- Update service worker if additional networks require it

## 💡 Note

The `sw.js` file for `3nbf4.com` (zone ID 10528154) is already present. This might be for one of your new ad networks. If the other networks require service workers, you may need to:
- Combine multiple service workers into one
- Or create separate service worker files if the networks support it
