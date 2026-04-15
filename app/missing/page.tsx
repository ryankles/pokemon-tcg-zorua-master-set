import { prisma } from '@/lib/prisma';
import MissingPage from '@/components/pages/MissingPage';

export const revalidate = 0;

export default async function Missing() {
  const missingCards = await prisma.card.findMany({
    where: { owned: false },
    orderBy: [{ wishlistPriority: 'asc' }, { currentPrice: 'asc' }],
  });

  return <MissingPage cards={missingCards} />;
}
