import { prisma } from '@/lib/prisma';
import Dashboard from '@/components/dashboard/Dashboard';

export const revalidate = 0; // Disable caching for real-time updates

export default async function HomePage() {
  const [
    totalCards,
    ownedCards,
    missingCards,
    totalValue,
    recentCards,
    favorites,
  ] = await Promise.all([
    prisma.card.count(),
    prisma.card.count({ where: { owned: true } }),
    prisma.card.count({ where: { owned: false } }),
    prisma.card.aggregate({
      where: { owned: true },
      _sum: { currentPrice: true },
    }),
    prisma.card.findMany({
      where: { owned: true },
      orderBy: { acquiredDate: 'desc' },
      take: 6,
    }),
    prisma.card.findMany({
      where: { favorite: true },
      take: 4,
    }),
  ]);

  const dashboardData = {
    totalCards,
    ownedCards,
    missingCards,
    completionPercentage: totalCards > 0 ? (ownedCards / totalCards) * 100 : 0,
    totalValue: totalValue._sum.currentPrice || 0,
    recentCards,
    favorites,
  };

  return <Dashboard data={dashboardData} />;
}
