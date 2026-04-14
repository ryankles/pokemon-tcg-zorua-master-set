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

// Map Pokemon names to lowercase for image URLs
function getPokemonImageUrl(pokemonName: string): string {
  // Map common variations to proper API names
  const nameMap: { [key: string]: string } = {
    'Zorua': 'zorua',
    'Zoroark': 'zoroark',
    'Hisuian Zorua': 'zonua-hisuian',
  };

  const apiName = nameMap[pokemonName] || pokemonName.toLowerCase().replace(/\s+/g, '-');
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/other/official-artwork/${apiName.includes('hisuian') ? '923' : apiName === 'zorua' ? '570' : '571'}.png`;
}

// Generate a card image URL - using placeholder for now
function getCardImageUrl(setName: string, cardNumber: string): string {
  // Using a placeholder card image service
  const encodedSet = encodeURIComponent(setName);
  const encodedNumber = encodeURIComponent(cardNumber);
  // Return placeholder with set and number info
  return `https://via.placeholder.com/250x350/7c3aed/FFFFFF?text=${encodedSet}%0A${encodedNumber}`;
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
          imageUrl: getCardImageUrl(card.set, card.number),
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
