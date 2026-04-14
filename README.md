# 🦑 Pokémon TCG Zorua Collection Portfolio

A **production-quality full-stack web application** for tracking and managing your Pokémon TCG Zorua-line master set collection, complete with price tracking, portfolio analytics, and real-time progress visualization.

## 🎯 Features

- **📊 Dashboard** - Overview of your collection with completion percentage, total value, and recent acquisitions
- **🎴 Collection Management** - View all cards with search, filter, and sorting capabilities
- **❌ Missing Cards** - Track cards needed to complete your master set with price sorting
- **💎 Portfolio Analysis** - Visual analytics including:
  - Pie charts for value distribution by Pokémon
  - Bar charts for set value comparison
  - Progress tracking by Pokémon
  - Detailed value breakdown tables
- **🔍 Card Details** - Edit card information including ownership, price, condition, and notes
- **📱 Responsive Design** - Works perfectly on mobile, tablet, and desktop

## 🧱 Tech Stack

- **Frontend**: Next.js 14+ with App Router & TypeScript
- **Styling**: Tailwind CSS with custom components
- **Backend**: Next.js API Routes
- **Database**: SQLite (via Prisma ORM)
- **State Management**: React Hooks (no Redux)
- **Charts**: Recharts for beautiful data visualization
- **Package Manager**: npm

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn
- Git (for version control)

## 🚀 Getting Started

### 1. Clone and Install

```bash
cd c:\repos\pokemon-tcg-zorua-master-set
npm install
```

### 2. Set Up Database

```bash
# Create SQLite database and run migrations
npm run prisma:migrate

# Seed with Zorua-line card data
npm run prisma:seed
```

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
npm start
```

## 📊 Database Schema

### Card Model

```prisma
model Card {
  id            String   @id @default(cuid())
  pokemon       String   // Zorua, Zoroark, Hisuian Zorua, etc.
  cardName      String   // Card name
  setName       String   // Set name
  cardNumber    String   // Card number (e.g., "70/114")

  // Collection fields
  owned         Boolean  @default(false)
  purchasePrice Float?   // Price paid for the card
  currentPrice  Float?   // Current market price
  condition     String?  // Mint, Near Mint, Light Play, etc.
  acquiredDate  DateTime? // When the card was acquired
  notes         String?  // Custom notes

  // Metadata
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([pokemon])
  @@index([owned])
  @@index([setName])
}
```

## 🔌 API Endpoints

### Cards

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cards` | Get all cards (supports filters: `pokemon`, `owned`, `set`, `search`) |
| POST | `/api/cards` | Create a new card |
| GET | `/api/cards/:id` | Get single card details |
| PATCH | `/api/cards/:id` | Update card information |
| DELETE | `/api/cards/:id` | Delete a card |

### Statistics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats/dashboard` | Get dashboard statistics |
| GET | `/api/stats/portfolio` | Get portfolio analytics |

### Query Examples

```bash
# Get all missing cards
curl "http://localhost:3000/api/cards?owned=false"

# Search for specific cards
curl "http://localhost:3000/api/cards?search=Zorua&set=Black+%26+White"

# Filter by Pokémon
curl "http://localhost:3000/api/cards?pokemon=Zoroark"
```

## 📁 Project Structure

```
pokemon-tcg-zorua-master-set/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── cards/
│   │   │   │   ├── route.ts          # GET /api/cards, POST /api/cards
│   │   │   │   └── [id]/route.ts     # GET, PATCH, DELETE individual cards
│   │   │   └── stats/
│   │   │       ├── dashboard/route.ts
│   │   │       └── portfolio/route.ts
│   │   ├── card/[id]/page.tsx        # Card detail view
│   │   ├── collection/page.tsx       # Collection view
│   │   ├── missing/page.tsx          # Missing cards view
│   │   ├── portfolio/page.tsx        # Portfolio analytics
│   │   ├── layout.tsx                # Root layout
│   │   ├── page jsx                  # Dashboard
│   │   └── globals.css
│   ├── components/
│   │   ├── Navigation.tsx
│   │   ├── StatCard.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── SearchFilterBar.tsx
│   │   ├── CardGrid.tsx
│   │   └── CardTable.tsx
│   └── lib/
│       ├── prisma.ts                 # Prisma client singleton
│       ├── utils.ts                  # Utility functions
│       └── types.ts                  # TypeScript types
├── prisma/
│   ├── schema.prisma                 # Database schema
│   ├── seed.ts                       # Seed script
│   └── migrations/
├── data/                             # Original checklist data (CSV, JSON, MD)
├── public/                           # Static assets
├── .env.local                        # Environment variables
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## 🌱 Seeding the Database

The database is automatically seeded with 56 verified Zorua-line Pokémon TCG cards from the `data/checklist_verified.json` file when you run:

```bash
npm run prisma:seed
```

Each card includes:
- Pokémon name
- Card name
- Set name
- Card number
- Default ownership: false (not owned)

## 🎨 UI Components

### Available Components

- **StatCard** - Displays statistics with icons and colors
- **ProgressBar** - Shows completion percentage with gradient fill
- **SearchFilterBar** - Search and filter cards by Pokémon and set
- **CardGrid** - Cards displayed in responsive grid layout
- **CardTable** - Cards in table format with sorting
- **Navigation** - Top navigation bar with links

All components are built with:
- TypeScript for type safety
- Tailwind CSS for styling
- React hooks for state management
- Responsive design (mobile-first)

## 💾 Price Tracking

Currently, prices are managed manually through the card detail editor. The system is structured to easily integrate external price APIs in the future:

1. **Purchase Price** - What you paid for the card
2. **Current Price** - Current market value
3. **Value Calculation** - Total portfolio value = sum of all owned cards' current prices

To integrate a price API:
1. Create an API route: `/api/prices/update`
2. Call external API (TCGPlayer, Pokellector, etc.)
3. Update card currentPrice field
4. Add scheduled background job (via cron)

## 🔄 Data Flow

```
User Action
    ↓
React Component (Frontend)
    ↓
API Route (/api/cards)
    ↓
Prisma Client
    ↓
SQLite Database
    ↓
Response to Frontend
    ↓
Component State Update
    ↓
UI Rendered
```

## ✨ Available Pages

| Page | Route | Purpose |
|------|-------|---------|
| Dashboard | `/` | Overview and stats |
| Collection | `/collection` | View all cards with search/filter |
| Missing | `/missing` | Cards needed to complete set |
| Portfolio | `/portfolio` | Analytics and value breakdown |
| Card Detail | `/card/[id]` | Edit individual card |

## 📈 Key Metrics

The app automatically calculates:

- **Total Cards**: Sum of all cards in database
- **Owned Cards**: Count of cards with `owned = true`
- **Missing Cards**: Count of cards with `owned = false`
- **Completion %**: (Owned / Total) × 100
- **Total Value**: Sum of `currentPrice` for all owned cards
- **Value by Pokémon**: Grouped value breakdown
- **Value by Set**: Set-wise value distribution

## 🎯 Development Workflow

### Add a New Page

1. Create directory: `src/app/your-page/`
2. Add `page.tsx` with page component
3. Build API route if needed: `src/app/api/your-route/route.ts`
4. Update Navigation.tsx with link

### Add a New Component

1. Create `src/components/YourComponent.tsx`
2. Import in pages or other components
3. Use TypeScript interfaces for props
4. Style with Tailwind classes

### Modify Database Schema

1. Update `prisma/schema.prisma`
2. Run: `npm run prisma:migrate`
3. Commit migration files to version control

## 🐛 Troubleshooting

### Database Issues

```bash
# Reset database (removes all data)
rm prisma/dev.db prisma/dev.db-journal
npm run prisma:migrate
npm run prisma:seed
```

### Module Not Found

```bash
# Reinstall dependencies
rm -r node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Check for type errors
npx tsc --noEmit
```

## 📦 Building for Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repository to Vercel
3. Set `DATABASE_URL` environment variable to SQLite file path
4. Deploy!

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Railway/Render/Fly

Follows same process as Vercel. Ensure:
- Set `NODE_ENV=production`
- Configure `DATABASE_URL`
- Run migrations: `npx prisma migrate deploy`

## 📝 Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "prisma:migrate": "prisma migrate dev",
  "prisma:seed": "tsx prisma/seed.ts",
  "db:seed": "npm run prisma:migrate && npm run prisma:seed"
}
```

## 🎨 Color Scheme

- **Primary**: `#7c3aed` (Purple)
- **Secondary**: `#ec4899` (Pink)
- **Success**: `#10b981` (Green)
- **Error**: `#ef4444` (Red)
- **Background**: Gradient from purple-50 to pink-50

## 💡 Future Enhancements

- [ ] CSV import/export functionality
- [ ] Dark mode toggle
- [ ] Local storage sync fallback
- [ ] Card images from APIs
- [ ] Price API integration (TCGPlayer, etc.)
- [ ] User authentication & multiple collections
- [ ] Email notifications for price drops
- [ ] Advanced analytics (ROI, trends)
- [ ] Mobile app (React Native)
- [ ] Social features (compare collections)

## 📄 License

This project is part of the Pokémon TCG Zorua Master Set collection tracking initiative.

## 🤝 Contributing

To contribute:

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## 📧 Support

For issues or questions, create an issue on GitHub.

---

**Built with ❤️ for Pokémon TCG collectors**

Last updated: April 14, 2026
# Pokémon TCG Species Master Set Checklist - Zorua Line
## Complete Collection Summary

---

## OVERVIEW
This is a **complete, deduplicated master checklist** of all unique English Pokémon TCG cards featuring the Zorua evolutionary line.

- **Total Unique Cards: 58**
- **Data Source:** Serebii.net Card Dex (https://www.serebii.net/card/dex/) - Verified & Cleaned
- **Deduplication Method:** One entry per unique combination of (Pokémon, Card Name, Set, Card Number)
- **Contains:** English cards only. Japanese-only sets (Journey Friends, Everyones Exciting Battle, Tag All Stars, White Flare) have been removed.

---

## COLLECTION BREAKDOWN

### Card Count by Pokémon:
| Pokémon | Count |
|---------|-------|
| Zorua | 21 |
| Hisuian Zorua | 1 |
| Zoroark | 27 |
| Hisuian Zoroark | 8 |
| N's Zorua | 1 |
| **TOTAL** | **58** |

---

## ZORUA (21 cards)

1. Zorua - Black & White #70/114
2. Zorua - McDonald's Promos 2011 #9/12
3. Zorua - Emerging Powers #66/98
4. Zorua - Dark Explorers #69/108
5. Zorua - Dark Explorers #70/108
6. Zorua - Legendary Treasures #89/113
7. Zorua - BW Promo #BW12
8. Zorua - BW Promo #32/BW-P
9. Zorua - BW Promo #116/BW-P
10. Zorua - XY #72/146
11. Zorua - BREAKThrough #89/162
12. Zorua - BREAKThrough #90/162
13. Zorua - Shining Legends #52/73
14. Zorua - Team Up #90/181
15. Zorua - Hidden Fates #SV25/SV94
16. Zorua - SM Promo #SM83
17. Zorua - Evolving Skies #102/225
18. Zorua - Fusion Strike #170/264
19. Zorua - Shrouded Fable #31/64
20. Zorua - Shrouded Fable #75/64
21. N's Zorua - Journey Together #97/159

---

## HISUIAN ZORUA (1 card)

1. Hisuian Zorua - Lost Origin #75/196

---

## ZOROARK (27 cards)

1. Zoroark - BREAKThrough #91/162
2. Zoroark BREAK - BREAKThrough #92/162
3. Zoroark - BW Promo #BW9
4. Zoroark - BW Promo #BW19
5. Zoroark - Black & White #71/114
6. Zoroark - Dark Explorers #71/108
7. Zoroark - Emerging Powers #67/98
8. Zoroark - Evolving Skies #103/225
9. Zoroark - Fusion Strike #171/264
10. Zoroark ex - Journey Together #98/159
11. Zoroark ex - Journey Together #175/159
12. Zoroark ex - Journey Together #185/159
13. Zoroark ex - Journey Together #189/159
14. Zoroark - Legendary Treasures #90/113
15. Zoroark - Next Destinies #102/99
16. Zoroark GX - Shining Legends #53/73
17. Zoroark GX - Shining Legends #77/73
18. Zoroark - Shrouded Fable #32/64
19. Zoroark - SM Promo #SM89
20. Zoroark GX - SM Promo #SM84
21. Zoroark - Team Up #91/181
22. Greninja & Zoroark GX - Unbroken Bonds #107/214
23. Greninja & Zoroark GX - Unbroken Bonds #200/214
24. Greninja & Zoroark GX - Unbroken Bonds #201/214
25. Greninja & Zoroark GX - Unbroken Bonds #222/214
26. Zoroark - XY #73/146

---

## HISUIAN ZOROARK (8 cards)

1. Hisuian Zoroark V - Lost Origin #146/196
2. Hisuian Zoroark VSTAR - Lost Origin #147/196
3. Hisuian Zoroark VSTAR - Lost Origin #203/196
4. Hisuian Zoroark VSTAR - Lost Origin #213/196
5. Hisuian Zoroark - Lost Origin #76/196
6. Hisuian Zoroark VSTAR - Crown Zenith #GG56/GG70
7. Hisuian Zoroark V - SWSH Promo #SWSH297
8. Hisuian Zoroark VSTAR - SWSH Promo #SWSH298

---

## KEY STATS

### Sets Represented:
- **Black White Era:** Black White, Emerging Powers, Dark Explorers, Next Destinies, Legendary Treasures
- **XY Era:** XY, BREAKThrough, Everyones Exciting Battle, Shining Legends
- **Sun & Moon Era:** Team Up, Hidden Fates, SM Promos
- **Sword & Shield Era:** Fusion Strike, Evolving Skies, SWSH Promos, Lost Origin
- **Scarlet & Violet Era:** Shrouded Fable
- **Other:** Journey Friends, Journey Together, Ascended Heroes, Crown Zenith, Tag All Stars, Unbroken Bonds, White Flare, McDonalds Promos 2011

### Card Variants Referenced:
- Regular forms
- PROMO cards
- GX cards
- V cards
- VSTAR cards
- BREAK cards
- ex cards
- Special tags (Greninja & Zoroark combinations)

---

## NOTES & METHODOLOGY

### What's Included:
✓ English language cards only  
✓ All unique card appearances  
✓ Card variants (V, VSTAR, BREAK, GX, etc.) counted as separate entries  
✓ Promo cards included  
✓ Both standard and Hisuian forms  

### What's Excluded:
✗ Reverse holo variations  
✗ Alternate printings of the same card with same number  
✗ Grading, condition, or language differences  
✗ Non-English cards  

### Deduplication Logic:
A card is considered unique based on:
- **Pokémon Name** (e.g., "Zoroark" vs "Hisuian Zoroark")
- **Set Name** (e.g., "Lost Origin")
- **Card Number** (e.g., "75/196")

If a card has the same Pokémon, Set, and Card Number regardless of other variants, it is counted only once.

---

## EXPORT FORMATS

This checklist is available in multiple formats:

1. **CSV** (`Zorua_Line_Master_Checklist.csv`)
   - Machine-readable format
   - Columns: Pokémon, Card Name, Set, Card Number
   - Perfect for spreadsheets and databases

2. **Markdown** (`Zorua_Line_Master_Checklist.md`)
   - Human-readable format  
   - Organized tables by Pokémon form
   - Easy to view and share

3. **JSON** (if generated)
   - Structured data format
   - Suitable for applications and APIs

---

## DATA SOURCE & ATTRIBUTION
- **Source:** Serebii.net - Pokémon Card Database (https://www.serebii.net/card/)
- **Extraction Date:** 2026
- **Data Accuracy:** Based on public Serebii listings at time of extraction

---

**Happy collecting! 🎴**
