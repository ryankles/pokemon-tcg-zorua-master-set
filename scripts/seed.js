const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const checklistPath = path.join(process.cwd(), 'checklist.json');
const checklist = JSON.parse(fs.readFileSync(checklistPath, 'utf-8'));

async function seed() {
  console.log('🌱 Starting seed...');

  // Clear existing cards
  await prisma.card.deleteMany({});
  console.log('Cleared existing cards');

  // Create cards one by one to avoid constraint issues
  let created = 0;
  for (const item of checklist) {
    try {
      await prisma.card.create({
        data: {
          pokemon: item.pokemon,
          cardName: item.card_name,
          setName: item.set,
          cardNumber: item.number,
          imageUrl: null,
          owned: false,
          favorite: false,
          wishlistPriority: null,
          purchasePrice: null,
          currentPrice: null,
          condition: 'Near Mint',
          acquiredDate: null,
          notes: null,
        },
      });
      created++;
    } catch (e) {
      // Skip duplicates
    }
  }

  console.log(`✅ Seeded ${created} cards`);
  console.log('Seed completed successfully!');
}

seed()
  .catch((e) => {
    console.error('Error:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

