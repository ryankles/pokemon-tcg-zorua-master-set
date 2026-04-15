const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const checklistPath = path.join(process.cwd(), 'checklist.json');
const checklist = JSON.parse(fs.readFileSync(checklistPath, 'utf-8'));

// Set code mapping for Serebii image URLs - based on actual collection
const setCodeMap = {
  'ascended heroes': 'ascendedheroes',
  'crown zenith': 'crownzenith',
  'everyones exciting battle': 'everyonesexcitingbattle',
  'evolving skies': 'evolvingskies',
  'fusion strike': 'fusionstrike',
  'hidden fates': 'hiddenfates',
  'journey together': 'journeytogether',
  'legendary treasures': 'legendarytreasures',
  'lost origin': 'lostorigin',
  'next destinies': 'nextdestinies',
  'shining legends': 'shininglegends',
  'shrouded fable': 'shroudedfable',
  'sv promos': 'svpromos',
  'tag all stars': 'tagallstars',
  'team up': 'teamup',
  'unbroken bonds': 'unbrokenbonds',
  'white flare': 'whiteflare',
  'x y': 'xy',
  'xy': 'xy',
  'breakthrough': 'breakthrough',
  'breakpoint': 'breakpoint',
  'black white': 'blackwhite',
  'black & white': 'blackwhite',
  'bw': 'blackwhite',
  'bw promos': 'bwpromos',
  'bw promo': 'bwpromos',
  'dark explorers': 'darkexplorers',
  'emerging powers': 'emergingpowers',
  'sm promos': 'smpromos',
  'swsh promos': 'swshpromos',
};

// Generate Serebii image URL
function generateScrydexUrl(setName, cardNumber) {
  const normalizedSet = setName.toLowerCase().trim();
  const setCode = setCodeMap[normalizedSet];
  
  if (!setCode) {
    return null; // Set not found, use null for imageUrl
  }
  
  // Extract just the card number
  // Handle cases like:
  // - "223 / 173" -> "223"
  // - "107" -> "107"
  // - "BW19" -> "19" (promo cards)
  // - "GG56 / GG70" -> "h56" (Crown Zenith Hisuian cards)
  const cardNumberStr = String(cardNumber).trim();
  
  let baseCardNumber;
  if (cardNumberStr.includes('/')) {
    // Standard format with slash separator: extract first number
    baseCardNumber = cardNumberStr.split('/')[0].trim();
  } else if (/^[A-Z]+\d+$/.test(cardNumberStr)) {
    // Promo format like "BW19" or "SM111": extract just digits
    baseCardNumber = cardNumberStr.replace(/[A-Z]+/g, '');
  } else {
    // Regular number: use as-is
    baseCardNumber = cardNumberStr;
  }

  // Handle special cases for different card formats
  // Crown Zenith Hisuian cards: "GG56" -> "h56"
  if (baseCardNumber.toUpperCase().startsWith('GG')) {
    baseCardNumber = 'h' + baseCardNumber.substring(2);
  }
  // Hidden Fates special cards: "SV25" -> "h25"
  if (setCode === 'hiddenfates' && baseCardNumber.toUpperCase().startsWith('SV')) {
    baseCardNumber = 'h' + baseCardNumber.substring(2);
  }

  // Use the card number for the Serebii URL
  return `https://www.serebii.net/card/${setCode}/${baseCardNumber}.jpg`;
}

async function seed() {
  console.log('🌱 Starting seed...');

  // Clear existing cards
  await prisma.card.deleteMany({});
  console.log('✓ Cleared existing cards');

  // Create cards one by one to avoid constraint issues
  let created = 0;
  let duplicates = 0;
  let errors = 0;

  for (const item of checklist) {
    try {
      // Generate Scrydex image URL
      const imageUrl = generateScrydexUrl(item.set, item.number);

      await prisma.card.create({
        data: {
          pokemon: item.pokemon,
          cardName: item.card_name,
          setName: item.set,
          cardNumber: item.number,
          imageUrl: imageUrl,
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
      if (e.code === 'P2002') {
        // Unique constraint violation (duplicate)
        console.warn(
          `⚠️  Skipped duplicate: ${item.pokemon} / ${item.set} #${item.number}`
        );
        duplicates++;
      } else {
        console.error(
          `❌ Error creating ${item.pokemon} / ${item.set} #${item.number}:`,
          e.message
        );
        errors++;
      }
    }
  }

  console.log(`\n✅ Seed Summary:`);
  console.log(`   Created: ${created} card${created !== 1 ? 's' : ''}`);
  if (duplicates > 0)
    console.log(`   Skipped (duplicates): ${duplicates}`);
  if (errors > 0)
    console.log(`   Failed: ${errors}`);
  console.log(
    `\n✓ Seed completed successfully! Total: ${created + duplicates + errors} items processed`
  );
}

seed()
  .catch((e) => {
    console.error('❌ Seed failed:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

