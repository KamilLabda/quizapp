# Ad Networks Integration Setup

## ✅ Completed Integration

### 1. **Autotag (aclib)** - Zone ID: `0z4zktony9`
- **Status**: ✅ Integrated
- **Location**: Script placed in both `<head>` (via AdScripts component) and before `</body>` tag
- **Implementation**: `aclib.runAutoTag({ zoneId: '0z4zktony9' })`
- **Note**: If this ad network requires a base library script URL, please provide it and we'll add it.

### 2. **HighPerformanceFormat** - Key: `063b0f69e6d6f3c70c71f435e4ae050c`
- **Status**: ✅ Integrated
- **Format**: 300x250 iframe banner
- **Implementation**: Configuration script + invoke.js loader
- **Location**: Loaded via AdScripts component

## ❌ Removed Networks

### RichInfo (RichAds)
- **Status**: ❌ Removed per client request
- **Removed from**: `src/components/layout/ad-scripts.tsx`
- **Note**: Firebase messaging service worker file kept but disabled

### RollerAds
- **Status**: ❌ Disabled (adult content issue)
- **Note**: Scripts remain commented out in `src/app/layout.tsx` for future re-enablement

## ⏳ Pending Integration

### 3. **HilltopAds**
- **Status**: ⏳ Awaiting script
- **Location**: Placeholder created in `src/components/layout/ad-scripts.tsx`
- **Note**: HilltopAds typically uses an API, but if you have a publisher script, we can integrate it.

### 4-6. **Additional Ad Networks (3 remaining)**
- **Status**: ⏳ Awaiting scripts
- **Location**: Placeholders created in `src/components/layout/ad-scripts.tsx`
- **Action Required**: Please provide the script code for each of the remaining 3 ad networks

## 📋 What You Need to Provide

To complete the integration, please provide:

1. **HilltopAds Script** (if available):
   - Script URL or inline code
   - Any configuration parameters

2. **Ad Network 4 Script**:
   - Script code or URL
   - Configuration details

3. **Ad Network 5 Script**:
   - Script code or URL
   - Configuration details

4. **Ad Network 6 Script**:
   - Script code or URL
   - Configuration details

5. **Autotag Base Library** (if required):
   - If the autotag script needs a base library URL to be loaded first, please provide it.

## 🔧 Configuration

All ad scripts are managed in:
- **File**: `src/components/layout/ad-scripts.tsx`
- **Loading Strategy**: `afterInteractive` (loads after page becomes interactive)
- **Error Handling**: Silent in production, warnings in development

## 📝 Service Worker

The service worker file (`public/sw.js`) is configured for domain `3nbf4.com` with zone ID `10528154`. This appears to be for one of your ad networks.

## ✅ Current Status

**Integrated**: 2/6 ad networks
**Pending**: 4/6 ad networks (including HilltopAds)

Once you provide the remaining scripts, they can be quickly added to the existing structure.
