import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import CardDetailPage from '@/components/pages/CardDetailPage';

export const revalidate = 0;

export default async function CardDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const card = await prisma.card.findUnique({
    where: { id },
    include: {
      priceHistory: { orderBy: { recordedAt: 'desc' }, take: 30 },
    },
  });

  if (!card) {
    notFound();
  }

  // Get related cards from same pokemon or set
  const relatedCards = await prisma.card.findMany({
    where: {
      OR: [
        { pokemon: card.pokemon, id: { not: id } },
        { setName: card.setName, id: { not: id } },
      ],
    },
    take: 8,
  });

  return (
    <CardDetailPage card={card} relatedCards={relatedCards} />
  );
}
