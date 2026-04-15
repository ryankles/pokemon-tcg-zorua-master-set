import { prisma } from '@/lib/prisma';
import CollectionPage from '@/components/pages/CollectionPage';

export const revalidate = 0;

export default async function Collection() {
  const cards = await prisma.card.findMany({
    orderBy: { cardName: 'asc' },
  });

  const pokemonOptions = Array.from(
    new Set(cards.map((c) => c.pokemon))
  ).sort();

  const setOptions = Array.from(
    new Set(cards.map((c) => c.setName))
  ).sort();

  return (
    <CollectionPage
      initialCards={cards}
      pokemonOptions={pokemonOptions}
      setOptions={setOptions}
    />
  );
}
