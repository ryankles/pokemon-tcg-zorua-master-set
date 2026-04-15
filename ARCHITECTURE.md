# 🏗️ Architecture & System Design

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser / Client                          │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Dashboard    │  │ Collection   │  │ Card Detail  │      │
│  │ /            │  │ /collection  │  │ /card/[id]   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Missing      │  │ Portfolio    │  │ Navigation   │      │
│  │ /missing     │  │ /portfolio   │  │ Header       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────┐
│               Next.js Server (Node.js)                       │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                App Router Pages                       │  │
│  │ (layout, page.tsx, collection/page, etc)             │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              API Routes Handler                       │  │
│  │  GET    /api/cards                                   │  │
│  │  GET    /api/cards/:id                               │  │
│  │  PATCH  /api/cards/:id                               │  │
│  │  GET    /api/cards/:id/history                       │  │
│  │  POST   /api/cards/:id/history                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Components & React Logic                    │  │
│  │ - Recharts visualizations                             │  │
│  │ - Card tiles & grids                                 │  │
│  │ - Filters & sorting                                  │  │
│  │ - Form editing                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │        Prisma ORM Client                             │  │
│  │    (Database query builder)                          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ SQLite Protocol
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   SQLite Database                            │
│                  (prisma/dev.db)                             │
│                                                               │
│  ┌──────────────┐      ┌──────────────┐                    │
│  │   Card       │      │ PriceHistory │                    │
│  │              │      │              │                    │
│  │ - id         │      │ - id         │                    │
│  │ - pokemon    │──────│ - cardId ────┼── cards.id        │
│  │ - cardName   │      │ - price      │                    │
│  │ - setName    │      │ - recordedAt │                    │
│  │ - imageUrl   │      └──────────────┘                    │
│  │ - owned      │                                           │
│  │ - currentPrice                                          │
│  │ - ... (28 fields total)                               │
│  └──────────────┘                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### User Views Dashboard
```
1. Browser requests GET /
2. Next.js server calls page.tsx
3. page.tsx queries Prisma for stats
4. Prisma executes SQL queries on SQLite
5. Database returns card counts, values, recent cards
6. Server renders Dashboard component with data
7. HTML + JavaScript sent to browser
8. React hydrates interactive elements
9. Browser displays dashboard
```

### User Browses Collection
```
1. Click "Collection" → GET /collection
2. page.tsx fetches all cards via Prisma
3. Returns cards + filter/sort options
4. Browser renders CollectionPage component
5. User selects filter (e.g., "Zoroark")
6. CollectionPage component calls fetch(/api/cards?pokemon=Zoroark)
7. API route queries database with filters
8. Results returned as JSON
9. React updates UI with filtered cards
10. User sees filtered gallery
```

### User Edits Card
```
1. Click card → GET /card/[id]
2. Fetch card data + price history
3. Display card with edit form
4. User edits values and clicks "Save Changes"
5. Browser sends PATCH /api/cards/:id with new data
6. API route validates and updates Prisma
7. Prisma updates database record
8. If price changed, PriceHistory record created
9. Updated card returned to browser
10. UI updates immediately
11. User sees changes
```

---

## Component Architecture

```
App (Root Layout)
│
├── Header/Navigation
│   └── Links to all pages
│
└── Pages
    │
    ├── Dashboard (/)
    │   ├── StatCard (x4)
    │   ├── CompletionRing
    │   ├── OwnedMissingChart
    │   ├── ValueByPokemonChart
    │   ├── ValueBySetChart
    │   └── CardGrid
    │       └── CardTile (x6 recent, x4 favorites)
    │
    ├── Collection (/collection)
    │   ├── CollectionFilters
    │   │   ├── Pokemon dropdown
    │   │   ├── Status dropdown
    │   │   ├── Set dropdown
    │   │   └── Price range inputs
    │   ├── SortOptions
    │   ├── View mode toggle
    │   └── CardGrid
    │       └── CardTile (x68 or filtered)
    │
    ├── Missing (/missing)
    │   ├── StatCard (x4)
    │   ├── CardGrid (cheapest 3)
    │   ├── CardGrid (high priority)
    │   ├── CardGrid (most expensive 3)
    │   └── CardGrid (all missing)
    │
    ├── Portfolio (/portfolio)
    │   ├── StatCard (x4)
    │   ├── CompletionRing
    │   ├── OwnedMissingChart
    │   ├── ValueByPokemonChart
    │   ├── ValueBySetChart
    │   ├── Top Valuable Cards Table
    │   └── Recent Acquisitions
    │
    └── Card Detail (/card/[id])
        ├── Card Image (sticky)
        ├── Card Info Section
        ├── Edit Form
        ├── LineChart (Price History)
        └── CardGrid (Related Cards)
```

---

## State Management

### No Global State Manager
Uses React hooks only:
- `useState` - Local component state
- `useCallback` - Memoized functions
- `useMemo` - Memoized values
- `useEffect` - Side effects (not used in this design)

### Data Flow Patterns

**Server Component (page.tsx)**
- Fetches data at request time
- Renders initially on server
- Passes data to Client Component as props

**Client Component (components/**)**
- Receives server data as props
- Manages local UI state
- Handles user interactions
- Fetches additional data if needed

### Fetching Strategy
```typescript
// Server-side (pages)
const data = await prisma.card.findMany(...)

// Client-side (components)
const [cards, setCards] = useState(initialCards)
const handleFilter = async () => {
  const response = await fetch(`/api/cards?...`)
  const data = await response.json()
  setCards(data.cards)
}
```

---

## Database Schema

### Card Table
```prisma
model Card {
  // Identifiers
  id               String   @id @default(cuid())
  
  // Card Info
  pokemon          String
  cardName         String
  setName          String
  cardNumber       String   @unique
  
  // Media
  imageUrl         String?
  
  // Ownership
  owned            Boolean  @default(false)
  favorite         Boolean  @default(false)
  
  // Pricing
  purchasePrice    Float?
  currentPrice     Float?
  
  // Details
  condition        String?  @default("Near Mint")
  acquiredDate     DateTime?
  notes            String?
  wishlistPriority Int?
  
  // Relations
  priceHistory     PriceHistory[]
  
  // Timestamps
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  
  // Indexes
  @@index([pokemon])
  @@index([setName])
  @@index([owned])
  @@index([favorite])
}
```

### PriceHistory Table
```prisma
model PriceHistory {
  id        String   @id @default(cuid())
  cardId    String
  price     Float
  recordedAt DateTime @default(now())
  
  card      Card     @relation(fields: [cardId], references: [id])
  
  @@index([cardId])
}
```

---

## API Design

### REST Endpoints

| Method | Endpoint | Purpose | Filters |
|--------|----------|---------|---------|
| GET | `/api/cards` | List cards | pokemon, owned, set, minPrice, maxPrice, sort, order |
| GET | `/api/cards/:id` | Get single card + history | none |
| PATCH | `/api/cards/:id` | Update card | none (entire object in body) |
| GET | `/api/cards/:id/history` | Get price history | none |
| POST | `/api/cards/:id/history` | Record price | none (price in body) |

### Request/Response Examples

**GET /api/cards?pokemon=Zoroark&owned=true**
```json
{
  "cards": [
    {
      "id": "cuid123",
      "pokemon": "Zoroark",
      "cardName": "Zoroark ex",
      "setName": "Lost Origin",
      "cardNumber": "147/196",
      "owned": true,
      "currentPrice": 25.50
    }
  ],
  "total": 12,
  "skip": 0,
  "take": 100
}
```

**PATCH /api/cards/:id**
```json
// Request
{
  "owned": true,
  "currentPrice": 24.99,
  "condition": "Near Mint"
}

// Response - full updated card object
```

---

## Image Strategy

### Current Implementation
- `imageUrl` field stores external image URLs
- Next.js `<Image>` component optimizes:
  - Lazy loading
  - Responsive sizing
  - Format conversion (WebP)
  - Caching
  
### Image CDNs Supported
- TCGPlayer images
- PokemonTCG.io images
- Any HTTPS image URL

### Fallback
- Card icon placeholder when no image
- Light gray background
- Card number and name shown

---

## Performance Considerations

### Database
- Indexed queries on: pokemon, setName, owned, favorite
- Composite index on pokemon + setName + cardNumber
- SQLite sufficient for ~1000 cards

### Frontend
- Images optimized with Next.js
- Tailwind CSS minified
- Client-side filtering for UX
- Charts only render when visible
- No external API calls (yet)

### Caching
- Revalidate disabled for real-time updates
- ISR could be added for static pages
- Client-side React query caching easy to add

---

## Scalability (Future)

### From SQLite to PostgreSQL
1. Change `prisma/schema.prisma` provider from `sqlite` to `postgresql`
2. Update `DATABASE_URL` to PostgreSQL connection string
3. Run `npm run db:push` - Prisma handles migration
4. Same code works immediately

### From Single User to Multi-User
1. Add authentication layer (NextAuth.js)
2. Add `userId` foreign key to Card model
3. Filter queries by `userId`
4. Row-level security rules in database

### Adding Real-Time Updates
1. Add WebSocket server (Socket.io)
2. Update Card page to listen for changes
3. Notify clients when card data updates

---

## File Relationships

```
page.tsx (Dashboard)
    └── Dashboard.tsx
        ├── StatCard.tsx
        ├── Charts.tsx
        ├── CardTile.tsx
        └── lib/prisma.ts (data)

collection/page.tsx
    └── CollectionPage.tsx
        ├── CollectionFilters.tsx
        ├── CardTile.tsx
        ├── api/cards (fetch)
        └── lib/prisma.ts (initial data)

api/cards/route.ts
    └── lib/prisma.ts (queries)

api/cards/[id]/route.ts
    └── lib/prisma.ts (queries)

app/layout.tsx
    ├── globals.css (styles)
    └── [pages] (all page children)

prisma/schema.prisma
    └── lib/prisma.ts (client uses schema)
```

---

## Development Workflow

```
1. User requests page (e.g., /collection)
2. app/collection/page.tsx renders server-side
3. Queries Prisma for all cards
4. Passes cards to CollectionPage component
5. CollectionPage renders with initial cards
6. Client-side JavaScript hydrates interactive parts
7. User interacts (filter, sort, click card)
8. Component calls fetch(/api/cards?...)
9. API route queries database
10. Returns JSON result
11. React updates UI state
12. Browser re-renders with new data
13. Smooth animations and transitions
14. Loop back to step 7 for next interaction
```

---

## Error Handling

### Database Errors
- Try/catch blocks in API routes
- Return 500 status with error message
- Console logs for debugging

### Validation
- Prisma schema enforces data types
- API routes validate request bodies
- Component-level validation on forms

### User Feedback
- Toast/alert messages (can be added)
- Error states in UI
- Empty state messages

---

## Security Considerations

### Current (Single User Mode)
- No authentication needed
- SQLite file not exposed
- All data is local/private

### For Multi-User Deployment
- Add NextAuth.js for authentication
- Add role-based access control
- Validate user ownership of cards
- Rate limit API endpoints
- Add CSRF protection

---

**This architecture is designed to be:**
- ✅ Simple and maintainable
- ✅ Fast and responsive
- ✅ TypeScript-safe throughout
- ✅ Easily extensible
- ✅ Production-ready
- ✅ Scalable to larger datasets
