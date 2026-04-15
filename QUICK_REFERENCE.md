# 💻 Quick Reference Commands

## Essential Commands

```bash
# 🚀 Start Development
npm run dev                  # Start dev server on port 3000

# 💾 Database
npm run db:push            # Sync database schema
npm run db:studio          # Open Prisma Studio visual editor  
npm run db:seed            # Seed with 60 English cards from checklist

# 🏗️ Build & Deploy
npm run build              # Build for production
npm start                  # Start production server

# 🧹 Code Quality
npm run lint               # Run ESLint
```

---

## 🌐 Access Points

| URL | Purpose |
|-----|---------|
| `http://localhost:3000` | Dashboard home |
| `http://localhost:3000/collection` | Browse all cards |
| `http://localhost:3000/missing` | Missing cards wishlist |
| `http://localhost:3000/portfolio` | Analytics & insights |
| `http://localhost:3000/card/[id]` | Card details |
| `http://localhost:3555` | Prisma Studio (when running `npm run db:studio`) |

---

## 📚 API Endpoints

### Cards Management

**Get all cards with filters:**
```bash
GET /api/cards?pokemon=Zoroark&owned=true&sort=currentPrice&order=desc
```

**Get single card:**
```bash
GET /api/cards/{card-id}
```

**Update card:**
```bash
PATCH /api/cards/{card-id}
{
  "owned": true,
  "currentPrice": 25.50,
  "condition": "Near Mint"
}
```

**Price history:**
```bash
GET /api/cards/{card-id}/history
POST /api/cards/{card-id}/history
{ "price": 25.50 }
```

---

## 📁 Key Files to Know

| File | Purpose |
|------|---------|
| `app/page.tsx` | Dashboard home page |
| `prisma/schema.prisma` | Database schema definition |
| `lib/prisma.ts` | Prisma client setup |
| `tailwind.config.ts` | Tailwind CSS customization |
| `app/globals.css` | Global styles |

---

## 🛠️ Common Tasks

### Add a New Card Property
1. Edit `prisma/schema.prisma`
2. Add field to Card model
3. Run `npm run db:push`
4. Update components that display it

### Change Theme Colors
1. Edit `tailwind.config.ts`
2. Update `theme.extend.colors`
3. Components automatically update

### Add Card Images Programmatically
```bash
# Via API PATCH
curl -X PATCH http://localhost:3000/api/cards/{id} \
  -H "Content-Type: application/json" \
  -d '{"imageUrl":"https://..."}'
```

### Export Collection Data
```bash
# Via Prisma Studio or SQL query
sqlite3 prisma/dev.db ".mode csv" ".output collection.csv" "SELECT * FROM Card;"
```

---

## 🐛 Troubleshooting

### Port 3000 Already in Use
```bash
npm run dev -- -p 3001
```

### Database Locked
```bash
# Remove old database
rm prisma/dev.db

# Recreate fresh
npm run db:push
npm run db:seed
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -r node_modules package-lock.json
npm install
```

### Changes Not Showing
```bash
# Full database reset
rm prisma/dev.db
npm run db:push
npm run db:seed

# Then restart dev server
npm run dev
```

---

## 📦 Deployment Ready

### Build Production Bundle
```bash
npm run build
npm start
```

### Environment Variables Needed
- `DATABASE_URL` - Already set in `.env.local`

### Database for Production
- Can use any SQLite database location
- Or migrate to PostgreSQL (Prisma supports it)
- Update `DATABASE_URL` in `.env` and schema provider

---

## 🔗 Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Recharts](https://recharts.org)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## 📋 Checklist Before Deployment

- [ ] All images uploaded and URLs populated
- [ ] Prices verified or integrated with API
- [ ] Database backup created
- [ ] Environment variables set
- [ ] Built and tested: `npm run build && npm start`
- [ ] Navigation tested across all pages
- [ ] Filters and sorting verified
- [ ] Mobile responsiveness checked
- [ ] All cards show correct status
- [ ] Charts render properly

---

## 🎯 Performance Tips

- Images load with Next.js optimization
- Database queries are indexed
- Charts only render when needed
- Consider caching strategy for production
- Monitor database size as collection grows

---

**Quick Start:**
```bash
npm install && npm run db:push && npm run db:seed && npm run dev
```

Then open http://localhost:3000 🚀
