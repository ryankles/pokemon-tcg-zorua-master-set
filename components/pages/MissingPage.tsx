'use client';

import { Card } from '@prisma/client';
import { CardTile, CardGrid } from '@/components/cards/CardTile';
import { StatCard, EmptyState } from '@/components/cards/StatCard';
import { useCallback, useMemo, useState } from 'react';
import { useToast } from '@/lib/toastContext';

interface MissingPageProps {
  cards: Card[];
}

export default function MissingPage({ cards: initialCards }: MissingPageProps) {
  // FIX #5: Use local state instead of window.location.reload()
  const [cards, setCards] = useState(initialCards);
  const { addToast } = useToast();

  const handleCardUpdate = useCallback(async (id: string, updateData: any) => {
    try {
      const response = await fetch(`/api/cards/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update card');
      }

      const updatedCard = await response.json();

      // FIX #5: Update local state smoothly
      if (updateData.owned) {
        // Remove from missing list if marked as owned
        setCards((prev) => prev.filter((c) => c.id !== id));
        addToast('success', 'Card marked as owned!');
      } else {
        // Update card data if unmarking ownership
        setCards((prev) => prev.map((c) => (c.id === id ? updatedCard : c)));
        addToast('success', 'Card marked as missing');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update card';
      addToast('error', message);
      console.error('Error updating card:', error);
    }
  }, [addToast]);

  const stats = useMemo(() => {
    const totalMissing = cards.length;
    const totalMissingValue = cards.reduce(
      (sum, c) => sum + (c.currentPrice || 0),
      0
    );
    const cheapestCards = [...cards]
      .sort((a, b) => (a.currentPrice || 0) - (b.currentPrice || 0))
      .slice(0, 3);
    const mostExpensive = [...cards]
      .sort((a, b) => (b.currentPrice || 0) - (a.currentPrice || 0))
      .slice(0, 3);
    const highPriority = cards.filter(
      (c) => c.wishlistPriority && c.wishlistPriority <= 3
    );

    return {
      totalMissing,
      totalMissingValue,
      cheapestCards,
      mostExpensive,
      highPriority,
      avgPrice: totalMissing > 0 ? totalMissingValue / totalMissing : 0,
    };
  }, [cards]);

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <section className="bg-gradient-to-br from-dark-900 to-dark-950 border-b border-dark-800 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Missing Cards Wishlist</h1>
          <p className="text-dark-400 mb-8">
            {stats.totalMissing} cards still needed to complete your collection
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Missing"
              value={stats.totalMissing}
              color="blue"
            />
            <StatCard
              label="Total Missing Value"
              value={`$${stats.totalMissingValue.toFixed(2)}`}
              color="pink"
            />
            <StatCard
              label="Average Price"
              value={`$${stats.avgPrice.toFixed(2)}`}
              color="purple"
            />
            <StatCard
              label="High Priority"
              value={stats.highPriority.length}
              color="green"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
        <div className="space-y-12">
          {/* Cheapest Cards */}
          {stats.cheapestCards.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">💰 Cheapest Missing Cards</h2>
              <CardGrid>
                {stats.cheapestCards.map((card) => (
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
                    currentPrice={card.currentPrice || undefined}
                    onUpdate={handleCardUpdate}
                  />
                ))}
              </CardGrid>
            </div>
          )}

          {/* High Priority */}
          {stats.highPriority.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">⭐ High Priority Missing</h2>
              <CardGrid>
                {stats.highPriority.map((card) => (
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
                    currentPrice={card.currentPrice || undefined}
                    onUpdate={handleCardUpdate}
                  />
                ))}
              </CardGrid>
            </div>
          )}

          {/* Most Expensive */}
          {stats.mostExpensive.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">💎 Most Expensive Missing</h2>
              <CardGrid>
                {stats.mostExpensive.map((card) => (
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
                    currentPrice={card.currentPrice || undefined}
                    onUpdate={handleCardUpdate}
                  />
                ))}
              </CardGrid>
            </div>
          )}

          {/* All Missing Cards */}
          {cards.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">📋 All Missing Cards</h2>
              <CardGrid>
                {cards.map((card) => (
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
                    currentPrice={card.currentPrice || undefined}
                    onUpdate={handleCardUpdate}
                  />
                ))}
              </CardGrid>
            </div>
          )}

          {/* Empty State */}
          {cards.length === 0 && (
            <div className="text-center py-12">
              <EmptyState
                title="🎉 Collection Complete!"
                description="You own all cards in the Zorua-line master set"
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
