'use client';

import { useState } from 'react';

interface SearchFilterBarProps {
  onSearchChange: (value: string) => void;
  onFilterChange: (filters: Record<string, string>) => void;
  filterOptions?: {
    pokemon?: string[];
    set?: string[];
  };
}

export default function SearchFilterBar({
  onSearchChange,
  onFilterChange,
  filterOptions,
}: SearchFilterBarProps) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    onSearchChange(value);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Search cards by name, set, or Pokémon..."
          value={search}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {filterOptions && (
        <div className="flex flex-wrap gap-4">
          {filterOptions.pokemon && (
            <select
              value={filters.pokemon || ''}
              onChange={(e) => handleFilterChange('pokemon', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Pokémon</option>
              {filterOptions.pokemon.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          )}

          {filterOptions.set && (
            <select
              value={filters.set || ''}
              onChange={(e) => handleFilterChange('set', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Sets</option>
              {filterOptions.set.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}
        </div>
      )}
    </div>
  );
}
