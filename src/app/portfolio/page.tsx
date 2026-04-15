'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/components/StatCard';
import { formatCurrency } from '@/lib/utils';
import { PortfolioStats } from '@/lib/types';
import { Card } from '@prisma/client';
import Link from 'next/link';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const COLORS = ['#7c3aed', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#8b5cf6'];

export default function PortfolioPage() {
  const [stats, setStats] = useState<PortfolioStats | null>(null);
  const [recentCards, setRecentCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, cardsRes] = await Promise.all([
          fetch('/api/stats/portfolio'),
          fetch('/api/cards?limit=8&sort=owned'),
        ]);
        const statsData = await statsRes.json();
        const cardsData = await cardsRes.json();
        setStats(statsData);
        setRecentCards(cardsData);
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading portfolio...</div>;
  }

  if (!stats) {
    return <div className="text-center py-12">Error loading portfolio</div>;
  }

  // Prepare data for Pokémon value chart
  const pokemonValueData = Object.entries(stats.valueByPokemon).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  // Prepare data for Pokémon progress chart
  const pokemonProgressData = Object.entries(stats.totalByPokemon).map(
    ([name, total]) => ({
      name,
      owned: stats.ownedByPokemon[name] || 0,
      missing: total - (stats.ownedByPokemon[name] || 0),
    })
  );

  // Prepare data for set value chart
  const setValueData = Object.entries(stats.valueBySet)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, value]) => ({
      name: name.substring(0, 15),
      value,
    }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Portfolio Analysis
        </h1>
        <p className="text-lg text-gray-600">
          Track collection value and progress
        </p>
      </div>

      {/* Total Value */}
      <StatCard
        label="Total Portfolio Value"
        value={formatCurrency(stats.totalValue)}
        icon="💎"
        color="purple"
      />

      {/* Pokémon Progress Chart */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold mb-4">Progress by Pokémon</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={pokemonProgressData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="owned" stackId="a" fill="#10b981" />
            <Bar dataKey="missing" stackId="a" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Value by Pokémon */}
        {pokemonValueData.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold mb-4">Value by Pokémon</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pokemonValueData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${((percent || 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pokemonValueData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number | undefined)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Value by Set */}
        {setValueData.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold mb-4">Top 10 Sets by Value</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={setValueData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 200 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={190} />
                <Tooltip formatter={(value) => formatCurrency(value as number | undefined)} />
                <Bar dataKey="value" fill="#7c3aed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Pokémon Breakdown Table */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold mb-4">Pokémon Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Pokémon
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">
                  Owned
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">
                  Total
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">
                  Progress
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Object.entries(stats.totalByPokemon).map(([pokemon, total]) => {
                const owned = stats.ownedByPokemon[pokemon] || 0;
                const percentage = Math.round((owned / total) * 100);
                const value = stats.valueByPokemon[pokemon] || 0;

                return (
                  <tr key={pokemon} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-semibold">
                      {pokemon}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">{owned}</td>
                    <td className="px-6 py-4 text-sm text-right">{total}</td>
                    <td className="px-6 py-4 text-sm text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {percentage}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-semibold text-primary">
                      {formatCurrency(value)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Card Gallery - Featured Cards */}
      {recentCards.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Featured Cards</h2>
            <Link href="/collection" className="text-primary hover:underline">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {recentCards.map((card) => (
              <Link
                key={card.id}
                href={`/card/${card.id}`}
                className="group cursor-pointer"
              >
                <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg overflow-hidden border border-purple-200 hover:border-purple-400 transition h-64 flex flex-col">
                  {/* Card Image */}
                  <div className="flex-1 overflow-hidden bg-gradient-to-br from-purple-400 to-indigo-600 relative flex items-center justify-center">
                    {card.imageUrl ? (
                      <img
                        src={card.imageUrl}
                        alt={card.cardName}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : null}
                    {/* Fallback - shown if image doesn't exist or fails */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 bg-gradient-to-br from-purple-500 to-indigo-700">
                      <div className="text-4xl font-bold mb-2">🎴</div>
                      <p className="text-center text-sm font-semibold">{card.cardName}</p>
                      <p className="text-center text-xs opacity-75 mt-1">#{card.cardNumber}</p>
                    </div>
                  </div>
                  
                  {/* Card Info */}
                  <div className="p-3 border-t border-purple-200 bg-white">
                    <p className="text-sm font-semibold truncate">{card.cardName}</p>
                    <p className="text-xs text-gray-600 truncate">{card.pokemon}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">{card.setName.substring(0, 12)}</span>
                      {card.owned && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          ✓ Owned
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
