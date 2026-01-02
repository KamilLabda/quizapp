# Ad Network Verification Guide

## Quick Summary

✅ **RollerAds (Site ID: 2261550)** - Ads are now LIVE and integrated  
✅ **Second Ad Network** - Verification files ready, awaiting verification

---

## RollerAds Status: ✅ ACTIVE

### What's Done:
- ✅ All ad codes integrated (Banner, PopUnder, InPagePush, Video Slider)
- ✅ Ads are live and serving on the website
- ✅ Verification file ready at `/public/2261550.txt`

### Next Steps:
1. Deploy application to production
2. Verify site in RollerAds dashboard (if not already done)
3. Monitor performance in RollerAds dashboard

---

## Second Ad Network: ⏳ PENDING VERIFICATION

### Verification Code: eeb54ab3adf7008f9233dcca30c08700c093dd5e

### What's Done:
- ✅ Verification file created: `/public/eeb54ab3adf7008f9233.txt`
- ✅ Meta tag automatically added to all pages
- ✅ Ready for verification

### Verification Methods Available:

**Method 1: File Upload (Recommended)**
1. Deploy application to production
2. File will be accessible at: `https://www.punkcikowo.pl/eeb54ab3adf7008f9233.txt`
3. Click "Verify" in ad network dashboard

**Method 2: Meta Tag (Already Implemented)**
1. Deploy application to production
2. Meta tag is automatically on all pages
3. Click "Verify" in ad network dashboard

**Method 3: DNS Record (If Needed)**
1. Add TXT record to DNS: `eeb54ab3adf7008f9233dcca30c08700c093dd5e`
2. Wait 24 hours for propagation
3. Click "Verify" in ad network dashboard

---

## Deployment Checklist

- [ ] Deploy application to production
- [ ] Test RollerAds verification URL: `https://www.punkcikowo.pl/2261550.txt`
- [ ] Test second network verification URL: `https://www.punkcikowo.pl/eeb54ab3adf7008f9233.txt`
- [ ] Verify RollerAds in dashboard (if needed)
- [ ] Verify second ad network in dashboard
- [ ] Monitor ad performance

---

## Testing URLs

After deployment, test these URLs:

**RollerAds:**
```
https://www.punkcikowo.pl/2261550.txt
```
Expected: `2261550`

**Second Ad Network:**
```
https://www.punkcikowo.pl/eeb54ab3adf7008f9233.txt
```
Expected: `eeb54ab3adf7008f9233dcca30c08700c093dd5e`

**Meta Tag:**
1. Visit: `https://www.punkcikowo.pl`
2. View page source (Ctrl+U)
3. Search for: `eeb54ab3adf7008f9233`
4. Should see the meta tag in `<head>`

---

## Support

**RollerAds Issues:**
- Check RollerAds dashboard for statistics
- Contact RollerAds support if needed

**Second Ad Network Issues:**
- Verify file is accessible
- Check meta tag in page source
- Try DNS method if file/meta tag fails

---

**Status:** RollerAds Active ✅ | Second Network Ready for Verification ⏳
