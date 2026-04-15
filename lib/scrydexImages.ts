/**
 * Serebii Card Image Integration Utility
 * 
 * Uses Serebii.net for high-quality Pokemon card images.
 * This service provides free, direct image links.
 * 
 * Image URLs follow this pattern:
 * https://www.serebii.net/card/{set_id}/{card_number}.jpg
 * 
 * Example: https://www.serebii.net/card/blackwhite/70.jpg
 */

/**
 * Generate a Serebii image URL for a Pokemon card
 * 
 * @param setName - The set name (e.g., "Scarlet & Violet", "Black & White")
 * @param cardNumber - The card number as string or number (e.g., "1", "70", "223 / 173")
 * @returns The Serebii image URL, or null if set cannot be mapped
 */
export function generateScrydexUrl(
  setName: string,
  cardNumber: string | number
): string | null {
  // Map of set names to Serebii set IDs - based on actual collection
  const setCodeMap: Record<string, string> = {
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

  // Normalize the set name to lowercase for lookup
  const normalizedSet = setName.toLowerCase().trim();
  const setCode = setCodeMap[normalizedSet];

  if (!setCode) {
    console.warn(`Unknown set: "${setName}". Cannot generate image URL.`);
    return null;
  }

  // Extract just the card number
  // Handle cases like:
  // - "223 / 173" -> "223"
  // - "107" -> "107"
  // - "BW19" -> "19" (promo cards)
  // - "GG56 / GG70" -> "h56" (Crown Zenith Hisuian cards)
  const cardNumberStr = String(cardNumber).trim();
  
  let baseCardNumber: string;
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

  // Construct the Serebii URL
  return `https://www.serebii.net/card/${setCode}/${baseCardNumber}.jpg`;
}

/**
 * Scrydex API alternative (if direct URLs don't work)
 * Search for a card and get its image URL via API
 * 
 * Note: This requires checking if Scrydex has an API endpoint.
 * For now, the pattern-based URL approach is most reliable.
 */
export async function searchScrydexCard(
  pokemonName: string,
  setName: string
): Promise<string | null> {
  try {
    // This is a placeholder - replace with actual API if Scrydex provides one
    // Example pattern: https://scrydex.com/api/search?q=card_name
    
    // For now, return null and let the pattern-based approach handle it
    return null;
  } catch (error) {
    console.error('Error searching Scrydex:', error);
    return null;
  }
}

/**
 * Batch generate Scrydex URLs for multiple cards
 * 
 * @param cards - Array of card objects with setName and cardNumber
 * @returns Array of card objects with scrydexUrl added
 */
export function generateBatchScrydexUrls(
  cards: Array<{ setName: string; cardNumber: string | number }>
) {
  return cards.map((card) => ({
    ...card,
    scrydexUrl: generateScrydexUrl(card.setName, card.cardNumber),
  }));
}

/**
 * Fallback image URL if Scrydex image is not found
 * This is for displaying in the UI as a placeholder
 */
export const FALLBACK_IMAGE = 
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="280" viewBox="0 0 200 280"%3E%3Crect fill="%23333" width="200" height="280"/%3E%3Ctext x="50%" y="50%" font-size="16" fill="%23666" text-anchor="middle" dominant-baseline="middle"%3ECard Image%3C/text%3E%3C/svg%3E';
