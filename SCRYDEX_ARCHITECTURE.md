# Scrydex Integration Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Pokemon TCG Collection App                │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
    ┌────────┐        ┌──────────┐      ┌─────────┐
    │ Seed   │        │ Update   │      │ Runtime │
    │ Script │        │ Script   │      │ (useage)│
    └────┬───┘        └────┬─────┘      └────┬────┘
         │                 │                  │
         │ reads           │ scans          │ queries
         │                 │                  │
         ▼                 ▼                  ▼
    ┌──────────────────────────────────────────────┐
    │         checklist.json (cards to add)       │
    │         SQLite Database (existing cards)     │
    └──────────────────┬───────────────────────────┘
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
    ┌─────────────────┐     ┌────────────────────┐
    │  scrydexImages  │     │   CardTile.tsx     │
    │  utility module │     │   (display layer)  │
    │  (TS/JS)        │     │                    │
    │                 │────▶│ Renders images     │
    │ • Map set names │     │ from imageUrl      │
    │ • Generate URLs │     │                    │
    │ • Batch process │     │ Falls back if null │
    └────────┬────────┘     └────────────────────┘
             │
             │ generates URLs
             │
             ▼
    ┌──────────────────────────────────┐
    │   Scrydex.com Image Server       │
    │                                  │
    │ https://scrydex.com/img/sets/    │
    │ {SET_CODE}/{CARD_NUMBER}.jpg     │
    │                                  │
    │ Examples:                        │
    │ - SV/086.jpg (Zorua)            │
    │ - SV2/042.jpg (Paldea)          │
    │ - SV3.5/123.jpg (Paradox)       │
    └──────────────────────────────────┘
```

---

## Data Flow

### When Seeding Database

```
checklist.json
    │
    ├─ read by scripts/seed.js
    │
    ├─ for each card: {pokemon, card_name, set, number}
    │
    ├─ call generateScrydexUrl(set, number)
    │    ├─ normalize set name ("Scarlet & Violet" → lowercase)
    │    ├─ lookup set code (→ "SV")
    │    ├─ pad card number ("86" → "086")
    │    └─ return "https://scrydex.com/img/sets/SV/086.jpg"
    │
    ├─ create card with imageUrl populated
    │
    └─ save to SQLite database
         Card {
           id: "...",
           pokemon: "Zorua",
           cardName: "Zorua",
           setName: "Scarlet & Violet",
           cardNumber: "086",
           imageUrl: "https://scrydex.com/img/sets/SV/086.jpg",
           owned: false,
           ...
         }
```

### When Displaying Cards

```
User visits /collection
    │
    └─ CollectionPage fetches /api/cards
         │
         ├─ returns array of Card objects with imageUrl
         │
         └─ CardTile component receives imageUrl
              │
              ├─ if imageUrl exists:
              │   └─ <Image src={imageUrl} /> → loads from Scrydex
              │
              └─ if imageUrl is null:
                  └─ show placeholder ("🃏 No Image")
```

### When Updating Existing Cards

```
npm run scripts/update-scrydex-images.js
    │
    ├─ query database for all cards
    │
    └─ for each card:
         ├─ call generateScrydexUrl(setName, cardNumber)
         ├─ update card with new imageUrl
         ├─ report: ✅ Updated / ⏭️ Skipped / ❌ Failed
         └─ continue to next card
```

---

## Code Structure

### File Hierarchy

```
project-root/
│
├── lib/
│   └── scrydexImages.ts           ← Core utility
│       ├─ generateScrydexUrl()    ← Generate single URL
│       ├─ generateBatchScrydexUrls() ← Generate many
│       ├─ searchScrydexCard()     ← API placeholder
│       └─ setCodeMap {}           ← Set name → code mapping
│
├── scripts/
│   ├── seed.js                    ← Create fresh database
│   │   └─ now includes generateScrydexUrl()
│   │
│   └── update-scrydex-images.js   ← Update existing database
│       └─ scans all cards and populates URLs
│
├── components/
│   └── cards/
│       └── CardTile.tsx           ← Display component
│           └─ renders Image from imageUrl
│
├── prisma/
│   └── schema.prisma
│       └─ Card.imageUrl: String?
│
└── documentation/
    ├── SCRYDEX_INTEGRATION_GUIDE.md  ← Full reference
    ├── SCRYDEX_QUICK_START.md       ← Quick start
    └── SCRYDEX_ARCHITECTURE.md      ← This file
```

---

## Database Schema

```prisma
model Card {
  id               String   @id @default(cuid())
  pokemon          String
  cardName         String
  setName          String
  cardNumber       String   @unique

  imageUrl         String?  ← Scrydex URL stored here
  
  owned            Boolean  @default(false)
  favorite         Boolean  @default(false)
  wishlistPriority Int?

  purchasePrice    Float?
  currentPrice     Float?
  condition        String?  @default("Near Mint")
  acquiredDate     DateTime?
  notes            String?

  priceHistory     PriceHistory[]

  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  @@unique([pokemon, setName, cardNumber])
  @@index([pokemon])
  @@index([setName])
  @@index([owned])
  @@index([favorite])
}
```

Note: `imageUrl` can be:
- Full Scrydex URL: `"https://scrydex.com/img/sets/SV/086.jpg"`
- Any other image URL (supports custom CDNs)
- `null` if no image available

---

## Set Code Mapping Reference

### Current Mappings (50+ sets)

```javascript
const setCodeMap = {
  // Generation 9 (Scarlet & Violet)
  'scarlet & violet': 'SV',
  'paldea evolved': 'SV2',
  'obsidian flames': 'SV3',
  'paradox rift': 'SV3.5',
  'crown zenith': 'SV4.5',
  'temporal forces': 'SV4PT',
  
  // Generation 8 (Sword & Shield)
  'sword & shield': 'SSH',
  'rebel clash': 'RCL',
  'darkness ablaze': 'DAA',
  'vivid voltage': 'VIV',
  'shining fates': 'SHF',
  // ... and 15 more
  
  // Older Generations
  'base set': 'BS',
  'jungle': 'JU',
  'fossil': 'FO',
  // ... expandable
};
```

### How to Add a New Set

1. Find set code from Scrydex: `https://scrydex.com/img/sets/{CODE}/001.jpg`
2. Add to mapping: `'Your Set Name': 'CODE'`
3. Update in 3 places:
   - `scripts/seed.js` (line ~7)
   - `scripts/update-scrydex-images.js` (line ~4)
   - `lib/scrydexImages.ts` (line ~13)
4. Reseed or update: `npm run db:seed` or `node scripts/update-scrydex-images.js`

---

## Error Handling

### Missing Set Code
```
Input: cardName="Zorua", setName="Unknown Set 2024"
       cardNumber="001"

generateScrydexUrl("Unknown Set 2024", "001")
  ├─ lookup in setCodeMap
  ├─ NOT FOUND
  └─ return null

Result: Card created with imageUrl: null
         UI shows placeholder: "🃏 No Image"
```

### Invalid Card Number
```
Input: setName="Scarlet & Violet", cardNumber="5"

generateScrydexUrl(...)
  ├─ lookup set code → "SV"
  ├─ pad number "5" → "005"
  └─ return "https://scrydex.com/img/sets/SV/005.jpg"

Result: Correct URL generated ✅
```

---

## API Integration Points

### Current Integration Points

1. **GET /api/cards** returns card array with `imageUrl`
   ```json
   {
     "id": "...",
     "cardName": "Zorua",
     "imageUrl": "https://scrydex.com/img/sets/SV/086.jpg"
   }
   ```

2. **PATCH /api/cards/[id]** can update imageUrl
   ```json
   {
     "imageUrl": "https://scrydex.com/img/sets/SV/086.jpg"
   }
   ```

### Future Enhancement Options

- Scrydex API integration (if they provide one)
- Batch image URL sync endpoint
- Image fallback/retry logic
- CDN proxying for images

---

## Performance Considerations

### Image Loading
- ✅ Next.js `<Image>` component optimizes delivery
- ✅ Images cached by browser (CDN headers from Scrydex)
- ✅ Lazy loading optional (add `loading="lazy"`)
- ✅ WebP conversion available

### Database
- ✅ URL stored as `String?` (no download/processing)
- ✅ URLs generated at seed time (not runtime)
- ✅ No additional queries needed for images

### Scrydex Server
- ✅ Stable CDN with good uptime
- ✅ Images served with proper cache headers
- ✅ Global delivery network

---

## Related Documentation

- [SCRYDEX_INTEGRATION_GUIDE.md](SCRYDEX_INTEGRATION_GUIDE.md) - Complete reference
- [SCRYDEX_QUICK_START.md](SCRYDEX_QUICK_START.md) - Quick start
- [lib/scrydexImages.ts](lib/scrydexImages.ts) - TypeScript source
- [scripts/seed.js](scripts/seed.js) - Seed implementation
- [components/cards/CardTile.tsx](components/cards/CardTile.tsx) - Display implementation
