# Scrydex Integration - Quick Start

## TL;DR - Get Started Now

Your app now automatically fetches card images from **Scrydex.com**. Two options:

### Fresh Setup (Recommended)
```bash
npm run db:seed
```
✅ All 68 cards instantly get Scrydex image URLs

### Existing Database
```bash
node scripts/update-scrydex-images.js
```
✅ Updates all existing cards with Scrydex URLs

---

## What Changed

### Before
```
Card Data:
├─ name: "Zorua"
├─ set: "Scarlet & Violet"
├─ number: "086"
└─ imageUrl: null  ← No image
```

### After
```
Card Data:
├─ name: "Zorua"
├─ set: "Scarlet & Violet"
├─ number: "086"
└─ imageUrl: "https://scrydex.com/img/sets/SV/086.jpg" ← Image loaded!
```

---

## How It Works

**Automatic URL Generation:**
```
Set Name: "Scarlet & Violet"  →  Set Code: "SV"
Card Number: "086"            →  Padded: "086"

Final URL: https://scrydex.com/img/sets/SV/086.jpg
```

---

## Files Created/Modified

| File | Action | Purpose |
|------|--------|---------|
| `lib/scrydexImages.ts` | ✨ Created | TypeScript utility for URL generation |
| `scripts/seed.js` | 📝 Modified | Now includes Scrydex URLs when seeding |
| `scripts/update-scrydex-images.js` | ✨ Created | Update existing cards with images |
| `SCRYDEX_INTEGRATION_GUIDE.md` | ✨ Created | Full documentation |

---

## Verify It Works

1. **Run seed:**
   ```bash
   npm run db:seed
   ```

2. **Start app:**
   ```bash
   npm run dev
   ```

3. **Visit:** http://localhost:3002/collection

4. **You should see:** Card images displayed in the grid! 🎉

---

## Current Set Support

### Supported Sets
✅ Scarlet & Violet (SV)  
✅ Paldea Evolved (SV2)  
✅ Obsidian Flames (SV3)  
✅ Paradox Rift (SV3.5)  
✅ Crown Zenith (SV4.5)  
✅ Temporal Forces (SV4PT)  
✅ Sword & Shield era (15+ sets)  
✅ Older sets (Base Set, Jungle, Fossil, etc.)  

### Not Supported Yet?
If your cards show "No Image", the set might not be in the mapping. Add it to:
- `scripts/seed.js`
- `scripts/update-scrydex-images.js`
- `lib/scrydexImages.ts`

Pattern: `'Your Set Name': 'SET_CODE'`

---

## Image Display

In your app:
- ✅ If imageUrl exists → Shows card image
- ✅ If imageUrl is null → Shows placeholder

```typescript
// In CardTile.tsx
{imageUrl ? (
  <Image src={imageUrl} /> // Scrydex image
) : (
  <div>No Image</div>    // Fallback
)}
```

---

## Advanced: Programmatic Usage

```typescript
import { generateScrydexUrl } from '@/lib/scrydexImages';

// Single card
const url = generateScrydexUrl('Scarlet & Violet', '086');
// → https://scrydex.com/img/sets/SV/086.jpg

// Multiple cards
import { generateBatchScrydexUrls } from '@/lib/scrydexImages';
const urls = generateBatchScrydexUrls(cardArray);
```

---

## Troubleshooting

**Images not showing?**
1. Run `npm run build` to ensure no TypeScript errors
2. Check browser console for failed image loads
3. Verify set name is in `setCodeMap` in `seed.js`
4. Confirm card numbers are 3 digits (pad with zeros)

**Set code unknown?**
1. Visit scrydex.com and find your set
2. Note the URL pattern: `scrydex.com/img/sets/{CODE}/...`
3. Add to mapping: `'your set': 'CODE'`

---

## Next Actions

- [ ] Run `npm run db:seed`
- [ ] Start dev server: `npm run dev`
- [ ] Check collection page - cards should have images
- [ ] Enjoy your Scrydex-powered collection! 🎉

For details, see [SCRYDEX_INTEGRATION_GUIDE.md](SCRYDEX_INTEGRATION_GUIDE.md)
