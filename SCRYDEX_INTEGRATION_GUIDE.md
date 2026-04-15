# Scrydex Image Integration Guide

## Overview

Your Pokemon TCG collection app now integrates with **Scrydex.com** to automatically fetch and display high-quality Pokemon card images.

**What Changed:**
- ✅ Automatic image URL generation for all cards
- ✅ Images now display immediately when seeding
- ✅ Script to update existing cards with Scrydex URLs
- ✅ Fallback support for unmapped card sets

---

## How It Works

### Scrydex URL Pattern

Scrydex.com serves Pokemon card images via a predictable URL pattern:

```
https://scrydex.com/img/sets/{SET_CODE}/{CARD_NUMBER}.jpg
```

**Examples:**
- Scarlet & Violet card #1: `https://scrydex.com/img/sets/SV/001.jpg`
- Paldea Evolved card #42: `https://scrydex.com/img/sets/SV2/042.jpg`
- Crown Zenith card #123: `https://scrydex.com/img/sets/SV4.5/123.jpg`

### Set Code Mapping

The system includes a mapping of set names to Scrydex codes:

| Set Name | Code | Generation |
|----------|------|-----------|
| Scarlet & Violet | SV | Gen 9 |
| Paldea Evolved | SV2 | Gen 9 |
| Obsidian Flames | SV3 | Gen 9 |
| Paradox Rift | SV3.5 | Gen 9 |
| Crown Zenith | SV4.5 | Gen 9 |
| Temporal Forces | SV4PT | Gen 9 |
| Sword & Shield | SSH | Gen 8 |
| And 15+ others | ... | Gen 8 & earlier |

**Note**: If your card set isn't in the mapping, images won't load. Add it to `setCodeMap` in:
- `scripts/seed.js`
- `scripts/update-scrydex-images.js`
- `lib/scrydexImages.ts`

---

## Usage

### Option 1: Fresh Seed (Recommended)

When seeding the database for the first time, images are automatically fetched from Scrydex:

```bash
npm run db:seed
```

This will:
1. Clear existing cards
2. Read from `checklist.json`
3. Generate Scrydex URLs for each card
4. Create cards with image URLs populated

**Output:**
```
✅ Seed Summary:
   Created: 68 card(s)
   Skipped (duplicates): 0
   Failed: 0
```

All 68 cards will now have Scrydex image URLs and display in the app immediately.

---

### Option 2: Update Existing Cards

If you already have cards seeded without images, run this script to populate Scrydex URLs:

```bash
node scripts/update-scrydex-images.js
```

This will:
1. Find all cards in the database
2. Generate Scrydex URLs based on set name and card number
3. Update `imageUrl` field for each card
4. Report successes, skipped, and failures

**Output Example:**
```
🖼️  Starting Scrydex image URL update...

Found 68 card(s) to process

✅ UPDATED: Zorua (Scarlet & Violet #086)
   → https://scrydex.com/img/sets/SV/086.jpg

✅ UPDATED: Zoroark (Scarlet & Violet #091)
   → https://scrydex.com/img/sets/SV/091.jpg

⏭️  SKIPPED: Mystery Card (Unknown Set) - Unknown set

═══════════════════════════════════════════════
📊 Update Summary:
✅ Updated: 67
⏭️  Skipped: 1
❌ Failed: 0
📈 Total: 68
═══════════════════════════════════════════════

🎉 Image URLs successfully updated!
```

---

### Option 3: Programmatic Usage

Import the utility in your code:

```typescript
import { generateScrydexUrl } from '@/lib/scrydexImages';

// Generate URL for a single card
const imageUrl = generateScrydexUrl('Scarlet & Violet', '86');
// Returns: https://scrydex.com/img/sets/SV/086.jpg

// Generate URLs for multiple cards
import { generateBatchScrydexUrls } from '@/lib/scrydexImages';

const cards = [
  { setName: 'Scarlet & Violet', cardNumber: '1' },
  { setName: 'Paldea Evolved', cardNumber: '42' },
];

const withUrls = generateBatchScrydexUrls(cards);
// Returns cards array with scrydexUrl property added
```

---

## Implementation Details

### Files Modified

#### 1. `scripts/seed.js`
- Added `setCodeMap` object for set code mapping
- Added `generateScrydexUrl()` function
- Modified card creation to include `imageUrl: generateScrydexUrl(...)`

**Key change:**
```javascript
// BEFORE
imageUrl: null,

// AFTER
imageUrl: generateScrydexUrl(item.set, item.number),
```

#### 2. Created `scripts/update-scrydex-images.js`
- New script to update existing cards
- Run independently: `node scripts/update-scrydex-images.js`
- Non-destructive (won't delete or modify other data)

#### 3. Created `lib/scrydexImages.ts`
- TypeScript utility module
- Functions for URL generation
- Set code mapping (reusable)
- Batch processing support

### How Images Display

In `components/cards/CardTile.tsx`, images are displayed with Next.js `Image` component:

```typescript
{imageUrl ? (
  <Image
    src={imageUrl}
    alt={cardName}
    fill
    className="object-cover group-hover:scale-105 transition-transform duration-300"
  />
) : (
  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-dark-700 to-dark-900">
    <div className="text-center">
      <div className="text-3xl opacity-20 mb-2">🃏</div>
      <p className="text-xs text-dark-400">No Image</p>
    </div>
  </div>
)}
```

- If `imageUrl` exists → displays Scrydex image
- If `imageUrl` is null → shows placeholder ("No Image")

---

## Troubleshooting

### Images Not Loading?

**1. Verify Scrydex URL format:**
```
https://scrydex.com/img/sets/SV/086.jpg
     ↑                          ↑   ↑ 
  domain                    code  card#
```

**2. Check set code mapping:**
```bash
# Open lib/scrydexImages.ts
# Verify your set name is in setCodeMap
# If missing, add it:
'your set name': 'SET_CODE',
```

**3. Verify card numbers are padded:**
```javascript
// Card #1 should become 001
// Card #42 should become 042
// Card #123 stays 123
const paddedNumber = String(cardNumber).padStart(3, '0');
```

### How to Test Manually

In your browser's developer console:

```javascript
// Check if imageUrl is set
fetch('/api/cards').then(r => r.json()).then(cards => {
  console.log('Sample card:', cards[0]);
  console.log('Image URL:', cards[0].imageUrl);
});

// Test if Scrydex URL loads
fetch('https://scrydex.com/img/sets/SV/001.jpg')
  .then(r => console.log('Scrydex response:', r.status));
```

---

## Adding New Sets

To add support for a new card set:

1. **Find the Scrydex set code** - Check `scrydex.com` or the filename pattern
2. **Update all three locations:**

   **`scripts/seed.js`:**
   ```javascript
   const setCodeMap = {
     // ... existing entries ...
     'your new set': 'NEW_CODE',
   };
   ```

   **`scripts/update-scrydex-images.js`:**
   ```javascript
   const setCodeMap = {
     // ... existing entries ...
     'your new set': 'NEW_CODE',
   };
   ```

   **`lib/scrydexImages.ts`:**
   ```typescript
   const setCodeMap: Record<string, string> = {
     // ... existing entries ...
     'your new set': 'NEW_CODE',
   };
   ```

3. **Test with new cards:**
   ```bash
   npm run db:seed
   # or
   node scripts/update-scrydex-images.js
   ```

---

## Benefits

✅ **Automatic Image Discovery** - No manual URL entry needed  
✅ **High Quality** - Professional card images from Scrydex  
✅ **Consistent Format** - All images are in standard URL format  
✅ **Batch Processing** - Update all cards at once  
✅ **Typesafe** - TypeScript utility with proper types  
✅ **Fallback Support** - Shows placeholder if image not found  

---

## API Reference

### `generateScrydexUrl(setName, cardNumber)`

```typescript
function generateScrydexUrl(
  setName: string,           // e.g., "Scarlet & Violet"
  cardNumber: string | number // e.g., "1" or 1
): string | null             // URL or null if set unmapped
```

**Returns:** Full Scrydex image URL or `null` if set not found

---

### `generateBatchScrydexUrls(cards)`

```typescript
function generateBatchScrydexUrls(
  cards: Array<{ setName: string; cardNumber: string | number }>
): Array<{...card, scrydexUrl: string | null}>
```

**Returns:** Array with `scrydexUrl` property added to each card

---

## Next Steps

1. **Verify Images Load:**
   ```bash
   npm run dev
   # Visit http://localhost:3002/collection
   ```

2. **Check Database:**
   ```bash
   # View card with image URL in browser console
   fetch('/api/cards/1').then(r => r.json()).then(c => console.log(c.imageUrl))
   ```

3. **Customize Display** (optional):
   - Modify image sizes in `CardTile.tsx`
   - Change placeholder in `CardTile.tsx`
   - Add image lazy-loading: Add `loading="lazy"` to `<Image>`

---

## Reference Links

- **Scrydex.com**: https://scrydex.com/
- **TypeScript Utility**: `lib/scrydexImages.ts`
- **Component Usage**: `components/cards/CardTile.tsx`
- **Seed Script**: `scripts/seed.js`
- **Update Script**: `scripts/update-scrydex-images.js`
