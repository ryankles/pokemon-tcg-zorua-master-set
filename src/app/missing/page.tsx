'use client';

import { useEffect, useState } from 'react';
import CardGrid from '@/components/CardGrid';
import SearchFilterBar from '@/components/SearchFilterBar';
import { Card } from '@prisma/client';

export default function MissingPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [filteredCards, setFilteredCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [pokemonList, setPokemonList] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc'>('price-asc');
  const [filters, setFilters] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('/api/cards?owned=false');
        const data = await response.json();
        setCards(data);

        const uniquePokemon = Array.from(new Set(data.map((c: Card) => c.pokemon)));
        setPokemonList(uniquePokemon as string[]);
      } catch (error) {
        console.error('Error fetching missing cards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  useEffect(() => {
    let result = [...cards];

    if (search) {
      result = result.filter(
        (card) =>
          card.cardName.toLowerCase().includes(search.toLowerCase()) ||
          card.pokemon.toLowerCase().includes(search.toLowerCase()) ||
          card.setName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filters.pokemon) {
      result = result.filter((card) => card.pokemon === filters.pokemon);
    }

    // Sort
    if (sortBy === 'price-asc') {
      result.sort((a, b) => (a.currentPrice || 0) - (b.currentPrice || 0));
    } else {
      result.sort((a, b) => (b.currentPrice || 0) - (a.currentPrice || 0));
    }

    setFilteredCards(result);
  }, [cards, search, sortBy, filters]);

  const handleCardUpdate = (cardId: string) => {
    setCards(cards.filter((c) => c.id !== cardId));
  };

  if (loading) {
    return <div className="text-center py-12">Loading missing cards...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Missing Cards
        </h1>
        <p className="text-lg text-gray-600">
          Cards needed to complete your master set
        </p>
      </div>

      <SearchFilterBar
        onSearchChange={setSearch}
        onFilterChange={setFilters}
        filterOptions={{
          pokemon: pokemonList,
        }}
      />

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          {filteredCards.length} cards needed
        </p>
        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value as 'price-asc' | 'price-desc')
          }
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="price-asc">Cheapest First</option>
          <option value="price-desc">Most Expensive First</option>
        </select>
      </div>

      <CardGrid cards={filteredCards} onCardUpdate={handleCardUpdate} />
    </div>
  );
}
