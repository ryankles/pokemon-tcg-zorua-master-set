'use client';

import { Card } from '@prisma/client';
import { StatCard, EmptyState } from '@/components/cards/StatCard';
import {
  OwnedMissingChart,
  ValueByPokemonChart,
  ValueBySetChart,
  CompletionRing,
} from '@/components/charts/Charts';
import { useMemo } from 'react';

interface PortfolioPageProps {
  ownedCards: Card[];
  allCards: Card[];
}

export default function PortfolioPage({
  ownedCards,
  allCards,
}: PortfolioPageProps) {
  const analytics = useMemo(() => {
    const totalOwned = ownedCards.length;
    const totalCards = allCards.length;
    const totalValue = ownedCards.reduce(
      (sum, c) => sum + (c.currentPrice || 0),
      0
    );
    const avgCardValue =
      totalOwned > 0 ? totalValue / totalOwned : 0;

    // Group by pokemon
    const byPokemon: { [key: string]: number } = {};
    ownedCards.forEach((card) => {
      byPokemon[card.pokemon] =
        (byPokemon[card.pokemon] || 0) + (card.currentPrice || 0);
    });

    const valueByPokemon = Object.entries(byPokemon).map(([pokemon, value]) => ({
      pokemon,
      value,
    }));

    // Group by set
    const bySet: { [key: string]: number } = {};
    ownedCards.forEach((card) => {
      bySet[card.setName] =
        (bySet[card.setName] || 0) + (card.currentPrice || 0);
    });

    const valueBySet = Object.entries(bySet).map(([set, value]) => ({
      set,
      value,
    }));

    // Top cards by value
    const topCards = [...ownedCards]
      .sort((a, b) => (b.currentPrice || 0) - (a.currentPrice || 0))
      .slice(0, 10);

    // Completion percentage
    const completionPercentage =
      totalCards > 0 ? (totalOwned / totalCards) * 100 : 0;

    // Cards by acquisition date
    const recentCards = [...ownedCards]
      .filter((c) => c.acquiredDate)
      .sort(
        (a, b) =>
          new Date(b.acquiredDate!).getTime() -
          new Date(a.acquiredDate!).getTime()
      )
      .slice(0, 5);

    return {
      totalOwned,
      totalCards,
      totalValue,
      avgCardValue,
      valueByPokemon,
      valueBySet,
      topCards,
      completionPercentage,
      recentCards,
      missingValue:
        totalCards > totalOwned
          ? totalValue *
            ((totalCards - totalOwned) / totalOwned)
          : 0,
    };
  }, [ownedCards, allCards]);

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <section className="bg-gradient-to-br from-dark-900 to-dark-950 border-b border-dark-800 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Portfolio Analytics</h1>
          <p className="text-dark-400 mb-8">
            Deep dive into your collection value and statistics
          </p>

          {/* Key Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Collection Value"
              value={`$${analytics.totalValue.toFixed(2)}`}
              color="purple"
            />
            <StatCard
              label="Cards Owned"
              value={analytics.totalOwned}
              color="green"
              subtext={`of ${analytics.totalCards}`}
            />
            <StatCard
              label="Avg Card Value"
              value={`$${analytics.avgCardValue.toFixed(2)}`}
              color="blue"
            />
            <StatCard
              label="Missing Value"
              value={`$${analytics.missingValue.toFixed(2)}`}
              color="pink"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
        <div className="space-y-12">
          {/* Completion Ring & Coverage */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-dark-800/50 rounded-lg border border-dark-700 p-8 backdrop-blur-sm card-shadow flex items-center justify-center">
              <CompletionRing percentage={analytics.completionPercentage} />
            </div>
            <div className="lg:col-span-2">
              <OwnedMissingChart
                owned={analytics.totalOwned}
                missing={analytics.totalCards - analytics.totalOwned}
              />
            </div>
          </div>

          {/* Value Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ValueByPokemonChart data={analytics.valueByPokemon} />
            <ValueBySetChart data={analytics.valueBySet} />
          </div>

          {/* Top Valuable Cards */}
          <div>
            <h2 className="text-2xl font-bold mb-6">💎 Top Valuable Cards</h2>
            {analytics.topCards.length > 0 ? (
              <div className="bg-dark-800/50 rounded-lg border border-dark-700 overflow-hidden card-shadow">
                <table className="w-full">
                  <thead className="bg-dark-900 border-b border-dark-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-dark-300">
                        Card
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-dark-300">
                        Pokémon
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-dark-300">
                        Set
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-dark-300">
                        Value
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-dark-300">
                        Condition
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-700">
                    {analytics.topCards.map((card) => (
                      <tr
                        key={card.id}
                        className="hover:bg-dark-700/20 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-white">
                          {card.cardName}
                        </td>
                        <td className="px-6 py-4 text-sm text-dark-300">
                          {card.pokemon}
                        </td>
                        <td className="px-6 py-4 text-sm text-dark-300">
                          {card.setName}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-purple-400 text-right">
                          ${card.currentPrice?.toFixed(2) || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-center text-dark-300">
                          {card.condition || 'NM'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                title="No valuable cards yet"
                description="Cards with prices will appear here"
              />
            )}
          </div>

          {/* Recent Acquisitions */}
          {analytics.recentCards.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">📅 Recent Acquisitions</h2>
              <div className="space-y-3">
                {analytics.recentCards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-dark-800/50 rounded-lg border border-dark-700 p-4 backdrop-blur-sm card-shadow flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-semibold text-white">
                        {card.cardName}
                      </h4>
                      <p className="text-sm text-dark-400">
                        {card.pokemon} • {card.setName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-purple-400">
                        ${card.currentPrice?.toFixed(2) || '-'}
                      </p>
                      <p className="text-xs text-dark-400">
                        {card.acquiredDate
                          ? new Date(card.acquiredDate).toLocaleDateString()
                          : 'Date unknown'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
