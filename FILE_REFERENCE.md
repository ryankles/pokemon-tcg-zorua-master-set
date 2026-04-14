# 📁 Project File Reference Guide

## Complete Directory Structure with Descriptions

### Root Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | npm dependencies and scripts |
| `tsconfig.json` | TypeScript configuration |
| `.env.local` | Environment variables (DATABASE_URL) |
| `next.config.js` | Next.js configuration |
| `tailwind.config.ts` | Tailwind CSS theme and plugins |
| `postcss.config.js` | PostCSS plugins for CSS |
| `.eslintrc.json` | ESLint rules |
| `.gitignore` | Git ignored files |

---

## Backend: API Routes (`src/app/api/`)

### Card Management Routes

**`src/app/api/cards/route.ts`**
- `GET /api/cards` - Fetch all cards with optional filters
  - Query params: `?owned=true/false`, `?pokemon=Zorua`, `?set=Black+White`, `?search=term`
  - Returns: Array of Card objects
- `POST /api/cards` - Create a new card
  - Body: `{pokemon, cardName, setName, cardNumber, ...}`
  - Returns: Created Card object

**`src/app/api/cards/[id]/route.ts`**
- `GET /api/cards/:id` - Get single card details
- `PATCH /api/cards/:id` - Update card fields
  - Body: `{owned, purchasePrice, currentPrice, condition, notes, acquiredDate}`
- `DELETE /api/cards/:id` - Remove card from database

### Statistics Routes

**`src/app/api/stats/dashboard/route.ts`**
- `GET /api/stats/dashboard` - Get dashboard statistics
- Returns: `{totalCards, ownedCards, missingCards, completionPercentage, totalValue, recentAcquisitions[]}`

**`src/app/api/stats/portfolio/route.ts`**
- `GET /api/stats/portfolio` - Get portfolio analytics
- Returns: `{totalValue, valueByPokemon{}, valueBySet{}, ownedByPokemon{}, totalByPokemon{}}`

---

## Frontend: Pages (`src/app/`)

### Layout & Styling

**`src/app/layout.tsx`** (Root Layout)
- Sets up HTML structure
- Includes Navigation component
- Wraps content in main tag with bg gradient
- Sets metadata (title, description)

**`src/app/globals.css`**
- Global Tailwind imports
- Font smoothing
- Link and heading styles

### Pages

**`src/app/page.tsx`** (Dashboard `/`)
- Displays collection overview
- Shows stat cards (total, owned, missing, value)
- Progress bar with completion %
- Recent acquisitions list
- Data from `/api/stats/dashboard`

**`src/app/collection/page.tsx`** (`/collection`)
- Table view of all cards
- SearchFilterBar component for search/filter
- Sort by column headers
- Mark owned/missing toggle
- Tracks: pokemon, cardName, setName, cardNumber, price, status

**`src/app/missing/page.tsx`** (`/missing`)
- Grid view of unowned cards only
- Sort by price (cheapest/most expensive)
- Filter by Pokémon
- Quick "Mark as Owned" action
- Data from `/api/cards?owned=false`

**`src/app/portfolio/page.tsx`** (`/portfolio`)
- Pie chart: Value distribution by Pokémon
- Bar chart: Progress tracking by Pokémon
- Stacked bar: Owned vs missing by Pokémon
- Top 10 sets bar chart
- Detailed breakdown table
- Uses Recharts for visualizations

**`src/app/card/[id]/page.tsx`** (`/card/[id]`)
- Dynamic route for individual card detail
- View card information
- Edit button toggles form mode
- Forms for: owned, purchasePrice, currentPrice, condition, notes, acquiredDate
- Quick info sidebar
- Timestamp display

---

## Frontend: Components (`src/components/`)

**`src/components/Navigation.tsx`**
- Header navigation bar
- Logo/title: "🦑 Zorua Collection"
- Links to: Dashboard, Collection, Missing, Portfolio
- Sticky top positioning

**`src/components/StatCard.tsx`**
- Display individual statistic
- Props: `label, value, icon?, color?`
- Colors: blue, green, purple, pink
- Icons on right side

**`src/components/ProgressBar.tsx`**
- Shows progress percentage
- Gradient fill (purple to pink)
- Optional percentage display
- Smooth transitions

**`src/components/SearchFilterBar.tsx`**
- Search input field
- Filter dropdowns (Pokémon, Set)
- Real-time filtering
- Responsive layout

**`src/components/CardGrid.tsx`**
- Cards in responsive grid (1-3 columns)
- Card info: name, Pokémon, set, number
- Current price display
- Owned/Missing badge
- Mark owned/missing button
- Links to detail page

**`src/components/CardTable.tsx`**
- Table with columns: Pokémon, Name, Set, Number, Price, Status, Action
- Sortable headers
- Hover effects
- Responsive horizontal scroll on mobile
- Mark owned/missing toggle

---

## Utilities & Library (`src/lib/`)

**`src/lib/prisma.ts`**
- Prisma Client singleton
- Reuses connection in development (avoids recreating)
- Exports default prisma instance
- Used by all API routes

**`src/lib/utils.ts`**
```typescript
formatCurrency(value)        // Convert to USD format
formatDate(date)             // Format date nicely
calculateCompletion(o, t)    // Calculate percentage
groupByPokemon(cards)        // Group cards by pokemon
groupBySet(cards)            // Group cards by set
```

**`src/lib/types.ts`**
- `CardWithStats` - Card with statistics
- `DashboardStats` - Dashboard data shape
- `PortfolioStats` - Portfolio analytics shape

---

## Database (`prisma/`)

**`prisma/schema.prisma`**
```prisma
model Card {
  id            String   @id @default(cuid())
  pokemon       String   // Zorua, Zoroark, etc.
  cardName      String   // Card name
  setName       String   // Set name
  cardNumber    String   // Card number
  
  owned         Boolean  @default(false)
  purchasePrice Float?   // Purchase price
  currentPrice  Float?   // Market price
  condition     String?  // Mint, NM, LP, MP, HP
  acquiredDate  DateTime?// When acquired
  notes         String?  // Custom notes
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@index([pokemon])
  @@index([owned])
  @@index([setName])
}
```

**`prisma/seed.ts`**
- Reads `data/checklist_verified.json`
- Creates Card record for each entry
- Sets `owned: false` by default
- Clears existing cards before seeding

**`prisma/dev.db`**
- SQLite database file
- Contains 56 seeded Zorua-line cards
- Auto-created by Prisma
- Safe to delete and recreate

**`prisma/migrations/`**
- Migration history
- `20260414213051_init/` - Initial schema setup
- Can be version controlled

---

## Data Files (`data/`)

| File | Purpose |
|------|---------|
| `checklist_verified.json` | 56 verified Zorua-line cards (source for seeding) |
| `checklist_cleaned.json` | Cleaned duplicates removed |
| `checklist.json` | Original raw data |
| `checklist.csv` | CSV format of checklist |
| `checklist_cleaned.csv` | Cleaned CSV |
| `CHECKLIST_CORRECTED.md` | Markdown with corrections |
| `CHECKLIST.md` | Original markdown |

---

## Documentation Files

**`README.md`**
- Comprehensive project documentation
- Features overview
- Tech stack details
- Database schema explanation
- API endpoint reference
- Project structure diagram
- Setup instructions
- Troubleshooting guide
- Deployment instructions
- Future enhancement ideas

**`QUICKSTART.md`**
- Fast-track getting started guide
- Available commands
- Page URLs and purposes
- API testing examples
- Customization tips
- Troubleshooting tips

**`PROJECT_SUMMARY.md`**
- Completion status checklist
- Project structure summary
- Key metrics and highlights
- Quality checklist
- Feature overview

**`FILE_REFERENCE.md`** (This file)
- Detailed file purposes
- Code structure explanation
- Function signatures
- Data flow

---

## Key Integrations

### Tailwind CSS
- Color tokens: primary (#7c3aed), secondary (#ec4899)
- Responsive classes: `sm:`, `md:`, `lg:`
- Used in every component for styling

### Recharts
- PieChart, BarChart components
- Used in Portfolio page
- Tooltip and Legend built-in
- No external SVG needed

### Prisma
- ORM for database access
- Type-safe queries
- Automatic migrations
- Prisma Studio for UI

### Next.js
- App Router (v14+)
- API routes in `app/api/`
- File-based routing
- Built-in optimizations

---

## Development Workflow

### Adding a Feature

1. **Update Schema** (if needed)
   - Edit `prisma/schema.prisma`
   - Run `npm run prisma:migrate`

2. **Create API** (if needed)
   - Add route in `src/app/api/`
   - Export GET/POST/PATCH/DELETE functions

3. **Create Component** (if needed)
   - Add `src/components/YourComponent.tsx`
   - Export and use in pages

4. **Create Page** (if needed)
   - Create `src/app/your-page/page.tsx`
   - Import components
   - Add link to Navigation

5. **Test**
   - Manual testing in browser
   - Check API endpoints
   - Review in different browsers

6. **Deploy**
   - Run `npm run build`
   - Test with `npm start`
   - Push to Git/Deploy to hosting

---

## Common Tasks

### Reset Database
```bash
del prisma\dev.db
npm run prisma:migrate
npm run prisma:seed
```

### View Database
```bash
npx prisma studio
```

### Build Project
```bash
npm run build
```

### Start Production Server
```bash
npm run start
```

### Add New Card Manually
```bash
npx prisma db push  # After schema change
```

---

## File Sizes (Approximate)

| Component | Size | Lines |
|-----------|------|-------|
| API routes | 300 bytes each | ~50 |
| Pages | 2-4 KB each | 100-200 |
| Components | 500-1500 bytes | 20-60 |
| Config files | 100-500 bytes | 5-30 |
| **Total** | **~150 KB** | **~2000** |

---

## Deployment Checklist

- [ ] Run `npm run build`
- [ ] Test with `npm start`
- [ ] Set `NODE_ENV=production`
- [ ] Set `DATABASE_URL` in production
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] Test all pages
- [ ] Test all API endpoints
- [ ] Check for console errors
- [ ] Verify database backups

---

## Security Notes

- ✓ No sensitive data in code
- ✓ API validates inputs
- ✓ TypeScript catches type errors
- ✓ Database indexed for performance
- ✓ No SQL injection risks (Prisma)
- ✓ CORS not needed (same-origin)
- Consider adding authentication for future multi-user

---

**This guide helps navigate and maintain the entire codebase.**

