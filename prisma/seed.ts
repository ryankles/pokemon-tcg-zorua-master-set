import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface CardData {
  pokemon: string;
  card_name: string;
  set: string;
  number: string;
}

// Generate card image URL using Pokemon TCG official imagery
function getCardImageUrl(setName: string, cardNumber: string, pokemonName: string): string {
  // Map set names to set IDs with comprehensive coverage
  const setIdMap: { [key: string]: string } = {
    'Black & White': 'bw1',
    'McDonald\'s Promos 2011': 'mcdonald-2011',
    'Emerging Powers': 'bw3',
    'Dark Explorers': 'bw4',
    'Dragons Exalted': 'bw5',
    'Boundaries Crossed': 'bw6',
    'Plasma Freeze': 'bw7',
    'Plasma Blast': 'bw8',
    'Legendary Treasures': 'bw9',
    'XY': 'xy1',
    'Flashfire': 'xy2',
    'Furious Fists': 'xy3',
    'Phantom Forces': 'xy4',
    'Primal Clash': 'xy5',
    'Roaring Skies': 'xy6',
    'Ancient Origins': 'xy7',
    'Breakpoint': 'xy8',
    'Breakthrough': 'xy9',
    'Generations': 'g1',
    'Sun & Moon': 'sm1',
    'Guardians Rising': 'sm2',
    'Burning Shadows': 'sm3',
    'Crimson Invasion': 'sm4',
    'Ultra Prism': 'sm5',
    'Forbidden Light': 'sm6',
    'Celestial Storm': 'sm7',
    'Lost Thunder': 'sm8',
    'Team Up': 'sm9',
    'Unbroken Bonds': 'sm10',
    'Hidden Fates': 'sm115',
    'Shining Fates': 'ss25',
    'Sword & Shield': 'ss1',
    'Rebel Clash': 'ss2',
    'Darkness Ablaze': 'ss3',
    'Vivid Voltage': 'ss4',
    'Battle Styles': 'ss5',
    'Chilling Reign': 'ss6',
    'Evolving Skies': 'ss7',
    'Fusion Strike': 'ss8',
    'Lost Origin': 'sv04pt',
    'Scarlet & Violet': 'sv1',
    'Scarlet & Violet: 151': 'sv4pt',
    'Paldean Fates': 'sv45pt',
    'SWSH Promo': 'swsh-promo',
  };
  
  // Extract set ID - use mapped value or convert to lowercase with fallback
  let setId = setIdMap[setName];
  if (!setId) {
    // For unmapped sets, try common patterns
    setId = setName
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-')
      .substring(0, 20); // Limit length
  }
  
  // Extract card number (just the first part before slash)
  const cardNum = cardNumber.split('/')[0].trim();
  
  // Use official Pokemon TCG image API
  // Format: https://images.pokemontcg.io/{setId}/{cardNumber}.png
  return `https://images.pokemontcg.io/${setId}/${cardNum}.png`;
}

async function main() {
  try {
    // Read the verified checklist
    const dataPath = path.join(process.cwd(), 'data', 'checklist_verified.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const cards: CardData[] = JSON.parse(rawData);

    console.log(`Found ${cards.length} cards to seed...`);

    // Delete existing cards
    await prisma.card.deleteMany({});
    console.log('Cleared existing cards');

    // Seed cards
    for (const card of cards) {
      await prisma.card.create({
        data: {
          pokemon: card.pokemon,
          cardName: card.card_name,
          setName: card.set,
          cardNumber: card.number,
          imageUrl: getCardImageUrl(card.set, card.number, card.pokemon),
          owned: false,
        },
      });
    }

    console.log(`Successfully seeded ${cards.length} cards!`);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
