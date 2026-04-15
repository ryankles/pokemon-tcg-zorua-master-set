# Pokémon TCG Zorua Collection Portfolio

A modern, visually-rich web application for managing and analyzing your Pokémon TCG Zorua-line master set collection.

## 🎯 Features

- **📊 Dashboard**: Real-time overview of your collection with completion percentage, total value, and visual analytics
- **🖼️ Collection Gallery**: Browse all cards with image-first design, filtering, sorting, and multiple view modes
- **💝 Missing Cards Page**: Specialized view for cards you still need to acquire, organized by priority and price
- **📈 Portfolio Analytics**: Deep dive into collection value with charts grouped by Pokémon and Set
- **🃏 Card Details**: Large image view, price history charts, ownership tracking, and condition management
- **✨ Core Features**:
  - Own/Missing status tracking
  - Star favorites
  - Purchase and market price tracking
  - Condition recording
  - Wishlist priority assignments
  - Personal notes on cards
  - Price history tracking

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript + React 19
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes + Server Actions
- **Database**: SQLite with Prisma ORM
- **Charts**: Recharts
- **Images**: Next.js Image component with optimization

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Git

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Set Up Database

```bash
# Push Prisma schema to SQLite
npm run db:push

# Seed database with Zorua-line checklist
npm run db:seed
```

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

### 4. (Optional) Explore Database

```bash
npm run db:studio
```

This opens Prisma Studio at `http://localhost:5555` for visual database management.

## 📁 Project Structure

```
app/
  ├── layout.tsx              # Root layout with navigation
  ├── page.tsx                # Dashboard home page
  ├── globals.css             # Global Tailwind styles
  ├── api/
  │   └── cards/
  │       ├── route.ts        # GET /api/cards (list with filtering)
  │       └── [id]/
  │           ├── route.ts    # GET/PATCH /api/cards/:id
  │           └── history/
  │               └── route.ts # Price history endpoints
  ├── collection/
  │   └── page.tsx            # Collection gallery page
  ├── missing/
  │   └── page.tsx            # Missing cards page
  ├── portfolio/
  │   └── page.tsx            # Analytics page
  └── card/
      └── [id]/
          └── page.tsx        # Card detail page

components/
  ├── dashboard/
  │   └── Dashboard.tsx       # Dashboard component
  ├── pages/
  │   ├── CollectionPage.tsx
  │   ├── MissingPage.tsx
  │   ├── PortfolioPage.tsx
  │   └── CardDetailPage.tsx
  ├── charts/
  │   └── Charts.tsx          # All chart components
  └── cards/
      ├── StatCard.tsx        # Stat cards & progress
      ├── CardTile.tsx        # Card grid tile component
      └── CollectionFilters.tsx # Filtering & sorting

lib/
  └── prisma.ts              # Prisma client configuration

prisma/
  └── schema.prisma          # Database schema

scripts/
  └── seed.js                # Database seed script

public/
  └── checklist.json         # Zorua-line master set data
```

## 🎨 Design Highlights

- **Dark Mode**: Premium dark theme optimized for card imagery
- **Card-First Design**: Images are prominently featured throughout
- **Responsive Grid**: Auto-adjusts from 1 col (mobile) → 4 cols (desktop)
- **Smooth Transitions**: Polished hover effects and animations
- **Accessible**: High contrast, clear visual hierarchy
- **Fast**: Optimized images with Next.js Image component

## 📊 API Routes

### Cards

#### `GET /api/cards`
Fetch cards with filtering, sorting, and pagination.

**Query Parameters:**
- `pokemon` - Filter by Pokémon name
- `owned` - Filter by owned status (true/false)
- `set` - Filter by set name
- `minPrice` / `maxPrice` - Filter by price range
- `sort` - Sort field (cardName, currentPrice, etc.)
- `order` - Sort order (asc/desc)
- `skip` - Pagination offset (default: 0)
- `take` - Items per page (default: 100)

**Response:**
```json
{
  "cards": [...],
  "total": 68,
  "skip": 0,
  "take": 100
}
```

#### `GET /api/cards/:id`
Get single card with price history.

#### `PATCH /api/cards/:id`
Update card properties.

**Body:**
```json
{
  "owned": true,
  "favorite": false,
  "purchasePrice": 15.99,
  "currentPrice": 24.99,
  "condition": "Near Mint",
  "acquiredDate": "2024-01-15",
  "notes": "Graded copy",
  "wishlistPriority": 3
}
```

#### `GET /api/cards/:id/history`
Get price history for a card.

#### `POST /api/cards/:id/history`
Record new price for a card.

## 💾 Database Schema

### Card Model
```prisma
model Card {
  id               String   @id @default(cuid())
  pokemon          String
  cardName         String
  setName          String
  cardNumber       String   @unique

  imageUrl         String?
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
}
```

### PriceHistory Model
```prisma
model PriceHistory {
  id        String   @id @default(cuid())
  cardId    String
  price     Float
  recordedAt DateTime @default(now())

  card      Card     @relation(...)
}
```

## 🔧 Extending the App

### Adding Card Images
1. Update the `imageUrl` field for cards via the Card Detail page or API
2. Supports any valid image URL
3. Images are automatically optimized with Next.js Image component

### Automatic Price Updates
Create a cron job or scheduled task that:
```typescript
// Example: Update prices daily
const cards = await prisma.card.findMany({ where: { owned: true } });
for (const card of cards) {
  const newPrice = await fetchMarketPrice(card);
  await prisma.card.update({
    where: { id: card.id },
    data: { currentPrice: newPrice }
  });
  await prisma.priceHistory.create({
    data: { cardId: card.id, price: newPrice }
  });
}
```

### Adding More Analytics
The Portfolio page can easily be extended with:
- Acquisition timeline heatmap
- Price trend predictions
- Rarity-based grouping
- Grade/condition distribution
- Set completion heatmap

## 🎮 Usage Guide

### Dashboard
- Get an at-a-glance view of your collection
- See completion percentage with visual ring
- Track total collection value
- Browse recent acquisitions and favorites

### Collection Gallery
1. Browse all cards in a beautiful grid
2. Stack filters (Pokémon + Status + Set + Price)
3. Sort by Name, Price, Recently Acquired, etc.
4. Toggle between Gallery and List views
5. Click any card to view details
6. Star favorites on hover

### Missing Cards
1. See all cards you don't yet own
2. Organized by cheapest, highest priority, and most expensive
3. Set wishlist priorities (1-10) on individual cards
4. Quick purchase decision helpers

### Portfolio Analytics
1. Deep-dive into your collection value
2. See value breakdown by Pokémon
3. View value distribution across sets
4. Track top valuable owned cards
5. Review acquisition timeline

### Card Details
1. Large card image (if available)
2. Edit everything: ownership, prices, condition, notes
3. View price history with chart
4. See all related cards from same Pokémon/set
5. Track purchase vs market price

## 🌟 Future Enhancements

- [ ] Dark mode toggle (currently always dark)
- [ ] CSV/JSON export of collection
- [ ] Batch image upload
- [ ] Automatic price fetching from TCGPlayer API
- [ ] Collection sharing/compare with friends
- [ ] Mobile app with PWA support
- [ ] Collection insurance calculator
- [ ] Set goals and completion milestones
- [ ] Card grading integration
- [ ] Duplicate detection and alerts

## 📱 Responsive Design

- **Mobile**: 1-column grid, stacked navigation
- **Tablet**: 2-column grid, sidebar filters
- **Desktop**: 3-4 column grid, side-by-side layouts
- **Large Screens**: Full-width optimized content

## 🐛 Troubleshooting

### Database errors
```bash
# Reset database completely
rm prisma/dev.db
npm run db:push
npm run db:seed
```

### Port 3000 in use
```bash
npm run dev -- -p 3001
```

### Prisma schema out of sync
```bash
npm run db:push
```

## 📞 Support

For issues or feature requests, refer to your project's issue tracker.

## 📄 License

See LICENSE file in the repository.

---

**Happy collecting!** 🃏✨
