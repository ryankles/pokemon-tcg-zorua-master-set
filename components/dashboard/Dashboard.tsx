'use client';

import { Card } from '@prisma/client';
import { StatCard, ProgressCard, EmptyState } from '@/components/cards/StatCard';
import { CompletionRing, OwnedMissingChart, ValueByPokemonChart, ValueBySetChart } from '@/components/charts/Charts';
import { CardGrid, CardTile } from '@/components/cards/CardTile';
import { useState } from 'react';

interface DashboardProps {
  data: {
    totalCards: number;
    ownedCards: number;
    missingCards: number;
    completionPercentage: number;
    totalValue: number;
    recentCards: Card[];
    favorites: Card[];
  };
}

export default function Dashboard({ data }: DashboardProps) {
  const [favorites, setFavorites] = useState(data.favorites);
  const [recent, setRecent] = useState(data.recentCards);

  const handleCardUpdate = async (id: string, updateData: any) => {
    try {
      const response = await fetch(`/api/cards/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error('Failed to update card');

      // Update local state
      if (updateData.favorite !== undefined) {
        setFavorites((prev) =>
          updateData.favorite
            ? [...prev, { ...prev[0], id }]
            : prev.filter((c) => c.id !== id)
        );
      }
    } catch (error) {
      console.error('Error updating card:', error);
    }
  };

  const missingValue =
    data.totalCards > 0
      ? ((data.totalCards - data.ownedCards) / data.totalCards) * data.totalValue
      : 0;

  const valueByPokemonData = [
    { pokemon: 'Zoroark', value: data.totalValue * 0.6 },
    { pokemon: 'Zorua', value: data.totalValue * 0.4 },
  ];

  const valueBySetData = [
    { set: 'Lost Origin', value: data.totalValue * 0.25 },
    { set: 'Shrouded Fable', value: data.totalValue * 0.2 },
  ];

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-dark-900 via-dark-950 to-dark-950 border-b border-dark-800 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent mb-4">
              Collection Overview
            </h1>
            <p className="text-dark-400 text-lg">
              Your Pokémon TCG Zorua-line Master Set Portfolio
            </p>
          </div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Total Cards in Set"
              value={data.totalCards}
              color="purple"
            />
            <StatCard
              label="Cards Owned"
              value={data.ownedCards}
              color="green"
              subtext={`${data.missingCards} still needed`}
            />
            <StatCard
              label="Collection Value"
              value={`$${data.totalValue.toFixed(2)}`}
              color="blue"
              subtext={`Missing: $${missingValue.toFixed(2)}`}
            />
            <StatCard
              label="Completion"
              value={`${data.completionPercentage.toFixed(1)}%`}
              color="pink"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
        {/* Progress & Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Completion Ring */}
          <div className="lg:col-span-1 bg-dark-800/50 rounded-lg border border-dark-700 p-8 backdrop-blur-sm card-shadow flex items-center justify-center">
            <CompletionRing percentage={data.completionPercentage} />
          </div>

          {/* Collection Status Pie Chart */}
          <div className="lg:col-span-2">
            <OwnedMissingChart
              owned={data.ownedCards}
              missing={data.missingCards}
            />
          </div>
        </div>

        {/* Value Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <ValueByPokemonChart data={valueByPokemonData} />
          <ValueBySetChart data={valueBySetData} />
        </div>

        {/* Recent & Favorites */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Acquisitions */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Recent Acquisitions</h2>
            {recent.length > 0 ? (
              <CardGrid>
                {recent.map((card) => (
                  <CardTile
                    key={card.id}
                    id={card.id}
                    cardName={card.cardName}
                    pokemon={card.pokemon}
                    setName={card.setName}
                    cardNumber={card.cardNumber}
                    imageUrl={card.imageUrl}
                    owned={card.owned}
                    favorite={card.favorite}
                    currentPrice={card.currentPrice}
                    onUpdate={handleCardUpdate}
                  />
                ))}
              </CardGrid>
            ) : (
              <EmptyState
                title="No recent acquisitions"
                description="Cards you acquire will appear here"
              />
            )}
          </div>

          {/* Favorites */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Favorite Cards</h2>
            {favorites.length > 0 ? (
              <CardGrid>
                {favorites.map((card) => (
                  <CardTile
                    key={card.id}
                    id={card.id}
                    cardName={card.cardName}
                    pokemon={card.pokemon}
                    setName={card.setName}
                    cardNumber={card.cardNumber}
                    imageUrl={card.imageUrl}
                    owned={card.owned}
                    favorite={card.favorite}
                    currentPrice={card.currentPrice}
                    onUpdate={handleCardUpdate}
                  />
                ))}
              </CardGrid>
            ) : (
              <EmptyState
                title="No favorites yet"
                description="Star your favorite cards to see them here"
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
