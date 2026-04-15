/**
 * Update script to populate Scrydex image URLs for all cards
 * 
 * Usage:
 *   node scripts/update-scrydex-images.js
 * 
 * This script will:
 * 1. Fetch all cards from the database
 * 2. Generate Scrydex image URLs for each card
 * 3. Update the imageUrl field with the Scrydex URL
 * 4. Report success/failure counts
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Set code mapping - same as in lib/scrydexImages.ts
const setCodeMap = {
  // Scarlet & Violet Era
  'ascended heroes': 'ascendedheroes',
  'crown zenith': 'crownzenith',
  'tag all stars': 'tagallstars',
  'tas': 'tagallstars',
  
  // Sword & Shield Era
  'brilliant stars': 'brilliantstars',
  'darkbreaker': 'darkbreaker',
  'evolutions skies': 'evolvingskies',
  'evolving skies': 'evolvingskies',
  'everyones exciting battle': 'everyonesexcitingbattle',
  'fusion strike': 'fusionstrike',
  'hidden fates': 'hiddenfates',
  'journey together': 'journeytogether',
  'lost origin': 'lostorigin',
  'shining memories': 'shiningmemories',
  'shining legends': 'shininglegends',
  'shrouded fable': 'shroudedfable',
  'team up': 'teamup',
  'unbroken bonds': 'unbrokenbonds',
  'white flare': 'whiteflare',
  
  // Sun & Moon Era
  'sm promos': 'smpromos',
  
  // XY Era
  'breakthrough': 'breakthrough',
  'breakpoint': 'breakpoint',
  'xy': 'xy',
  
  // BW Era
  'black & white': 'blackwhite',
  'black white': 'blackwhite',
  'bw': 'blackwhite',
  'bw promos': 'bwpromos',
  'dark explorers': 'darkexplorers',
  'dex': 'darkexplorers',
  'emerging powers': 'emergingpowers',
  'everybodys exciting battle': 'everyonesexcitingbattle',
  'everyones exciting battle': 'everyonesexcitingbattle',
  'legendary treasures': 'legendarytreasures',
  'next destinies': 'nextdestinies',
  
  // SWSH Promos
  'swsh promos': 'swshpromos',
};


function generateScrydexUrl(setName, cardNumber) {
  const normalizedSet = setName.toLowerCase().trim();
  const setCode = setCodeMap[normalizedSet];

  if (!setCode) {
    console.warn(`⚠️  Unknown set: "${setName}"`);
    return null;
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

  return `https://www.serebii.net/card/${setCode}/${baseCardNumber}.jpg`;
}

async function updateScrydexImages() {
  console.log('🖼️  Starting Scrydex image URL update...\n');

  try {
    // Fetch all cards
    const cards = await prisma.card.findMany();
    console.log(`Found ${cards.length} card(s) to process\n`);

    let updated = 0;
    let skipped = 0;
    let failed = 0;

    // Process each card
    for (const card of cards) {
      try {
        const scrydexUrl = generateScrydexUrl(card.setName, card.cardNumber);

        if (!scrydexUrl) {
          console.log(`⏭️  SKIPPED: ${card.cardName} (${card.setName}) - Unknown set`);
          skipped++;
          continue;
        }

        // Update the card with the Scrydex URL
        await prisma.card.update({
          where: { id: card.id },
          data: { imageUrl: scrydexUrl },
        });

        console.log(`✅ UPDATED: ${card.cardName} (${card.setName} #${card.cardNumber})`);
        console.log(`   → ${scrydexUrl}\n`);
        updated++;
      } catch (error) {
        console.error(`❌ FAILED: ${card.cardName} - ${error.message}`);
        failed++;
      }
    }

    // Summary
    console.log('═══════════════════════════════════════════════');
    console.log('📊 Update Summary:');
    console.log(`✅ Updated: ${updated}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Total: ${updated + skipped + failed}`);
    console.log('═══════════════════════════════════════════════\n');

    if (updated > 0) {
      console.log('🎉 Image URLs successfully updated!');
      console.log('💡 You can now see card images in the app.');
    }
  } catch (error) {
    console.error('Fatal error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update
updateScrydexImages();
