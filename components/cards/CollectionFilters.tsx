'use client';

import { useState, useCallback } from 'react';

export function CollectionFilters({
  onFilter,
  pokemonOptions,
  setOptions,
}: {
  onFilter: (filters: any) => void;
  pokemonOptions: string[];
  setOptions: string[];
}) {
  const [pokemon, setPokemon] = useState('');
  const [owned, setOwned] = useState<'all' | 'true' | 'false'>('all');
  const [setName, setSetName] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');

  const applyFilters = useCallback(() => {
    const filters: any = {};
    if (pokemon) filters.pokemon = pokemon;
    if (owned !== 'all') filters.owned = owned === 'true';
    if (setName) filters.set = setName;
    if (priceMin) filters.minPrice = priceMin;
    if (priceMax) filters.maxPrice = priceMax;
    onFilter(filters);
  }, [pokemon, owned, setName, priceMin, priceMax, onFilter]);

  return (
    <div className="bg-dark-800/50 rounded-lg border border-dark-700 p-6 backdrop-blur-sm card-shadow">
      <h3 className="text-lg font-bold mb-4">Filters</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            Pokémon
          </label>
          <select
            value={pokemon}
            onChange={(e) => setPokemon(e.target.value)}
            className="w-full bg-dark-900 border border-dark-700 rounded px-3 py-2 text-white"
          >
            <option value="">All Pokémon</option>
            {pokemonOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            Status
          </label>
          <select
            value={owned}
            onChange={(e) => setOwned(e.target.value as any)}
            className="w-full bg-dark-900 border border-dark-700 rounded px-3 py-2 text-white"
          >
            <option value="all">All Cards</option>
            <option value="true">Owned Only</option>
            <option value="false">Missing Only</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            Set
          </label>
          <select
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
            className="w-full bg-dark-900 border border-dark-700 rounded px-3 py-2 text-white"
          >
            <option value="">All Sets</option>
            {setOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Min Price
            </label>
            <input
              type="number"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              placeholder="0"
              className="w-full bg-dark-900 border border-dark-700 rounded px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Max Price
            </label>
            <input
              type="number"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              placeholder="999"
              className="w-full bg-dark-900 border border-dark-700 rounded px-3 py-2 text-white"
            />
          </div>
        </div>

        <button
          onClick={applyFilters}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-2 rounded transition-all"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}

export function SortOptions({
  onSort,
}: {
  onSort: (sort: string, order: string) => void;
}) {
  const [sort, setSort] = useState('cardName');
  const [order, setOrder] = useState('asc');

  return (
    <div className="flex gap-3">
      <select
        value={sort}
        onChange={(e) => {
          setSort(e.target.value);
          onSort(e.target.value, order);
        }}
        className="bg-dark-900 border border-dark-700 rounded px-3 py-2 text-white text-sm"
      >
        <option value="cardName">Card Name</option>
        <option value="setName">Set</option>
        <option value="currentPrice">Price</option>
        <option value="acquiredDate">Recently Acquired</option>
        <option value="wishlistPriority">Wishlist Priority</option>
      </select>
      <button
        onClick={() => {
          const newOrder = order === 'asc' ? 'desc' : 'asc';
          setOrder(newOrder);
          onSort(sort, newOrder);
        }}
        className="bg-dark-900 border border-dark-700 rounded px-3 py-2 text-white text-sm hover:bg-dark-800"
      >
        {order === 'asc' ? '↑' : '↓'}
      </button>
    </div>
  );
}
