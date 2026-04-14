'use client';

import { useEffect, useState } from 'react';
import CardTable from '@/components/CardTable';
import SearchFilterBar from '@/components/SearchFilterBar';
import { Card } from '@prisma/client';

export default function CollectionPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [filteredCards, setFilteredCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [pokemonList, setPokemonList] = useState<string[]>([]);
  const [setList, setSetList] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('/api/cards');
        const data = await response.json();
        setCards(data);

        // Extract unique Pokémon and sets
        const uniquePokemon = Array.from(new Set(data.map((c: Card) => c.pokemon)));
        const uniqueSets = Array.from(new Set(data.map((c: Card) => c.setName)));

        setPokemonList(uniquePokemon as string[]);
        setSetList(uniqueSets as string[]);
      } catch (error) {
        console.error('Error fetching cards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  useEffect(() => {
    let result = cards;

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

    if (filters.set) {
      result = result.filter((card) => card.setName === filters.set);
    }

    setFilteredCards(result);
  }, [cards, search, filters]);

  const handleCardUpdate = (cardId: string, owned: boolean) => {
    setCards(
      cards.map((c) =>
        c.id === cardId ? { ...c, owned } : c
      )
    );
  };

  if (loading) {
    return <div className="text-center py-12">Loading collection...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          My Collection
        </h1>
        <p className="text-lg text-gray-600">
          Manage and view all cards in your collection
        </p>
      </div>

      <SearchFilterBar
        onSearchChange={setSearch}
        onFilterChange={setFilters}
        filterOptions={{
          pokemon: pokemonList,
          set: setList,
        }}
      />

      <div>
        <p className="text-sm text-gray-600 mb-4">
          Showing {filteredCards.length} of {cards.length} cards
        </p>
        <CardTable cards={filteredCards} onCardUpdate={handleCardUpdate} />
      </div>
    </div>
  );
}
