import { prisma } from '@/lib/prisma';
import PortfolioPage from '@/components/pages/PortfolioPage';

export const revalidate = 0;

export default async function Portfolio() {
  const [ownedCards, cards] = await Promise.all([
    prisma.card.findMany({
      where: { owned: true },
      orderBy: { currentPrice: 'desc' },
    }),
    prisma.card.findMany(),
  ]);

  return <PortfolioPage ownedCards={ownedCards} allCards={cards} />;
}
