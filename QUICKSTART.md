# ⚡ Quick Start Guide

## 🚀 Running the Application

The dev server is already running at **http://localhost:3000**

### Keyboard Shortcuts
- **Ctrl+C** to stop the server
- **Ctrl+Shift+R** for hard refresh in the browser
- **F12** for browser DevTools

---

## 📋 What Was Built

### ✅ Core Features Implemented

1. **🎴 Database Setup**
   - SQLite database with Prisma ORM
   - 56 verified Zorua-line cards seeded
   - Full CRUD API endpoints

2. **📊 Dashboard (/)**
   - Collection statistics (total, owned, missing, value)
   - Completion progress bar
   - Recent acquisitions display
   - Clean stat cards with icons

3. **🗂️ Collection Page (/collection)**
   - Table view of all cards
   - Search functionality (name, set, Pokémon)
   - Filter by Pokémon and Set
   - Mark cards as owned/missing
   - Sort by any column

4. **❌ Missing Cards Page (/missing)**
   - Filtered view of unowned cards
   - Sort by price (cheapest/most expensive)
   - Grid display for easy browsing
   - Quick "Mark as Owned" action

5. **💎 Portfolio Analytics (/portfolio)**
   - Total collection value
   - Pie chart: Value distribution by Pokémon
   - Bar chart: Progress by Pokémon
   - Top 10 sets by value
   - Detailed breakdown table

6. **🔍 Card Detail Page (/card/[id])**
   - View all card information
   - Edit ownership status
   - Update purchase/current price
   - Set condition (Mint, Near Mint, etc.)
   - Add custom notes
   - Track acquisition date

7. **🧩 Reusable Components**
   - StatCard (compact stat display)
   - ProgressBar (completion visualization)
   - SearchFilterBar (search + filters)
   - CardGrid (responsive card grid)
   - CardTable (sortable table view)
   - Navigation (top navigation bar)

8. **🔌 REST APIs**
   - GET /api/cards (with search/filter params)
   - POST /api/cards (create new)
   - GET /api/cards/:id (view details)
   - PATCH /api/cards/:id (update)
   - DELETE /api/cards/:id (remove)
   - GET /api/stats/dashboard (dashboard data)
   - GET /api/stats/portfolio (portfolio data)

---

## 🎯 Available Pages

| Page | URL | Purpose |
|------|-----|---------|
| Dashboard | http://localhost:3000 | Overview & stats |
| Collection | http://localhost:3000/collection | View all cards |
| Missing | http://localhost:3000/missing | Cards to acquire |
| Portfolio | http://localhost:3000/portfolio | Analytics |
| Card Detail | http://localhost:3000/card/[id] | Edit individual card |

---

## 💻 Development Commands

```bash
# Start development server (already running)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Seed database
npm run prisma:seed

# Reset database
rm prisma/dev.db
npm run prisma:migrate
npm run prisma:seed
```

---

## 🗄️ Database Operations

### View Database

```bash
# Open Prisma Studio
npx prisma studio
```

### Back Up Database

```bash
# Copy database file
copy prisma\dev.db prisma\dev.db.backup
```

### Reset Everything

```bash
del prisma\dev.db
npm run db:seed
```

---

## 🧪 Testing the API

### Using cURL in PowerShell

```powershell
# Get all cards
curl http://localhost:3000/api/cards

# Get missing cards
curl "http://localhost:3000/api/cards?owned=false"

# Search
curl "http://localhost:3000/api/cards?search=Zorua"

# Update a card (replace CARD_ID with real ID)
$body = @{owned=$true; currentPrice=25.50} | ConvertTo-Json
curl -X PATCH http://localhost:3000/api/cards/CARD_ID `
  -ContentType "application/json" `
  -Body $body

# Dashboard stats
curl http://localhost:3000/api/stats/dashboard

# Portfolio stats
curl http://localhost:3000/api/stats/portfolio
```

---

## 📝 Editing Cards

1. Click on any card name to go to detail page
2. Click "Edit Card" button
3. Update fields:
   - ✓ Owned (checkbox)
   - Condition (Mint, NM, LP, MP, HP)
   - Purchase Price (what you paid)
   - Current Price (market value)
   - Notes (custom details)
4. Click "Save Changes"

---

## 📊 Data Flow

```
User Action
    ↓
React Component
    ↓
Fetch to /api/cards
    ↓
Prisma Query
    ↓
SQLite Database
    ↓
Response JSON
    ↓
Re-render Component
```

---

## 🎨 Customization

### Change Theme Colors

Edit `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: '#7c3aed',      // Purple
      secondary: '#ec4899',    // Pink
    },
  },
}
```

### Add New Page

1. Create folder: `src/app/your-page/`
2. Add `page.tsx`
3. Update Navigation.tsx with new link

### Modify Card Fields

1. Update `prisma/schema.prisma`
2. Run `npm run prisma:migrate`
3. Update components/forms as needed

---

## 🚨 Troubleshooting

### Port 3000 Already in Use
```bash
# Find and kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Database Errors
```bash
# Fresh start
del prisma\dev.db
npm run db:seed
```

### Module Errors
```bash
# Reinstall dependencies
del node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
# Check types
npx tsc --noEmit
```

---

## 📦 Project Files

```
src/
├── app/
│   ├── page.tsx           ← Dashboard
│   ├── layout.tsx         ← Root layout
│   ├── globals.css        ← Global styles
│   ├── collection/page.tsx
│   ├── missing/page.tsx
│   ├── portfolio/page.tsx
│   ├── card/[id]/page.tsx
│   └── api/
│       ├── cards/route.ts
│       ├── cards/[id]/route.ts
│       └── stats/
├── components/
│   ├── Navigation.tsx
│   ├── StatCard.tsx
│   ├── ProgressBar.tsx
│   ├── SearchFilterBar.tsx
│   ├── CardGrid.tsx
│   └── CardTable.tsx
└── lib/
    ├── prisma.ts
    ├── utils.ts
    └── types.ts
```

---

## 🎯 Next Steps

### Try These:

1. **View Dashboard** → See your collection stats
2. **Go to Collection** → Search for "Zoroark" cards
3. **Check Missing** → See cheapest cards to buy
4. **View Portfolio** → Analyze your collection value
5. **Edit a Card** → Mark it as owned, add price

### Enhancements to Consider:

- [ ] CSV import/export
- [ ] Dark mode
- [ ] Card images from APIs
- [ ] Price history tracking
- [ ] Email alerts
- [ ] User authentication
- [ ] Mobile app

---

## 📚 Documentation

- **Full README**: See [README.md](README.md)
- **Database**: Prisma schema in `prisma/schema.prisma`
- **API**: Endpoints documented in README.md

---

## 🤝 Support

If something doesn't work:

1. Check terminal for error messages
2. Check browser console (F12)
3. Verify database: `npx prisma studio`
4. Reset everything: `rm prisma/dev.db && npm run db:seed`

---

**Happy collecting! 🦑**
