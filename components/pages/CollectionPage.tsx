'use client';

import { useState, useCallback } from 'react';
import { Card } from '@prisma/client';
import { CardTile, CardGrid } from '@/components/cards/CardTile';
import {
  CollectionFilters,
  SortOptions,
} from '@/components/cards/CollectionFilters';
import { EmptyState } from '@/components/cards/StatCard';

interface CollectionPageProps {
  initialCards: Card[];
  pokemonOptions: string[];
  setOptions: string[];
}

export default function CollectionPage({
  initialCards,
  pokemonOptions,
  setOptions,
}: CollectionPageProps) {
  const [cards, setCards] = useState(initialCards);
  const [viewMode, setViewMode] = useState<'gallery' | 'table'>('gallery');
  const [filters, setFilters] = useState<any>({});
  const [sort, setSort] = useState('cardName');
  const [order, setOrder] = useState('asc');

  const applyFilters = useCallback(
    async (newFilters: any) => {
      setFilters(newFilters);

      const params = new URLSearchParams();
      if (newFilters.pokemon) params.append('pokemon', newFilters.pokemon);
      if (newFilters.owned !== undefined)
        params.append('owned', String(newFilters.owned));
      if (newFilters.set) params.append('set', newFilters.set);
      if (newFilters.minPrice) params.append('minPrice', newFilters.minPrice);
      if (newFilters.maxPrice) params.append('maxPrice', newFilters.maxPrice);
      params.append('sort', sort);
      params.append('order', order);

      const response = await fetch(`/api/cards?${params}`);
      const data = await response.json();
      setCards(data.cards);
    },
    [sort, order]
  );

  const handleSort = useCallback(
    async (newSort: string, newOrder: string) => {
      setSort(newSort);
      setOrder(newOrder);

      const params = new URLSearchParams();
      if (filters.pokemon) params.append('pokemon', filters.pokemon);
      if (filters.owned !== undefined)
        params.append('owned', String(filters.owned));
      if (filters.set) params.append('set', filters.set);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      params.append('sort', newSort);
      params.append('order', newOrder);

      const response = await fetch(`/api/cards?${params}`);
      const data = await response.json();
      setCards(data.cards);
    },
    [filters]
  );

  const handleCardUpdate = async (id: string, updateData: any) => {
    try {
      const response = await fetch(`/api/cards/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error('Failed to update card');

      // Update local state
      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updateData } : c))
      );
    } catch (error) {
      console.error('Error updating card:', error);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <section className="bg-gradient-to-br from-dark-900 to-dark-950 border-b border-dark-800 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Collection Gallery</h1>
          <p className="text-dark-400">
            {cards.length} of {initialCards.length} cards
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <CollectionFilters
              onFilter={applyFilters}
              pokemonOptions={pokemonOptions}
              setOptions={setOptions}
            />
          </div>

          {/* Gallery */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">
                  {cards.length} Cards
                </h2>
              </div>
              <div className="flex gap-3">
                <SortOptions onSort={handleSort} />
                <div className="flex gap-2 bg-dark-800/50 rounded border border-dark-700 p-1">
                  <button
                    onClick={() => setViewMode('gallery')}
                    className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                      viewMode === 'gallery'
                        ? 'bg-purple-600 text-white'
                        : 'text-dark-300 hover:text-white'
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                      viewMode === 'table'
                        ? 'bg-purple-600 text-white'
                        : 'text-dark-300 hover:text-white'
                    }`}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>

            {cards.length > 0 ? (
              viewMode === 'gallery' ? (
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
              ) : (
                <div className="bg-dark-800/50 rounded-lg border border-dark-700 overflow-hidden card-shadow">
                  <table className="w-full">
                    <thead className="bg-dark-900 border-b border-dark-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-dark-300">
                          Card
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-dark-300">
                          Set
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-dark-300">
                          Number
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-dark-300">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-sm font-semibold text-dark-300">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-700">
                      {cards.map((card) => (
                        <tr
                          key={card.id}
                          className="hover:bg-dark-700/20 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-white">
                            {card.cardName}
                          </td>
                          <td className="px-6 py-4 text-sm text-dark-300">
                            {card.setName}
                          </td>
                          <td className="px-6 py-4 text-sm text-dark-300">
                            {card.cardNumber}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {card.owned ? (
                              <span className="inline-block bg-green-600/30 text-green-300 px-2 py-1 rounded text-xs font-semibold">
                                OWNED
                              </span>
                            ) : (
                              <span className="inline-block bg-dark-700 text-dark-300 px-2 py-1 rounded text-xs font-semibold">
                                MISSING
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-purple-400 text-right">
                            {card.currentPrice
                              ? `$${card.currentPrice.toFixed(2)}`
                              : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              <EmptyState
                title="No cards found"
                description="Try adjusting your filters"
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
