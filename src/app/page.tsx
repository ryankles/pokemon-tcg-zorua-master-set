'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/components/StatCard';
import ProgressBar from '@/components/ProgressBar';
import { formatCurrency } from '@/lib/utils';
import { DashboardStats } from '@/lib/types';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats/dashboard');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading dashboard...</div>;
  }

  if (!stats) {
    return <div className="text-center py-12">Error loading dashboard</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Collection Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Track your Zorua-line Pokémon TCG master set collection
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Cards"
          value={stats.totalCards}
          icon="🎴"
          color="blue"
        />
        <StatCard
          label="Owned Cards"
          value={stats.ownedCards}
          icon="✓"
          color="green"
        />
        <StatCard
          label="Missing Cards"
          value={stats.missingCards}
          icon="✗"
          color="pink"
        />
        <StatCard
          label="Collection Value"
          value={formatCurrency(stats.totalValue)}
          icon="💰"
          color="purple"
        />
      </div>

      {/* Progress Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold mb-4">Collection Progress</h2>
        <ProgressBar
          current={stats.ownedCards}
          total={stats.totalCards}
          label="Master Set Completion"
          showPercentage={true}
        />
        <div className="mt-4 text-center">
          <p className="text-2xl font-bold text-primary">
            {stats.completionPercentage}%
          </p>
          <p className="text-gray-600">
            {stats.ownedCards} of {stats.totalCards} cards owned
          </p>
        </div>
      </div>

      {/* Recent Acquisitions */}
      {stats.recentAcquisitions.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold mb-4">Recent Acquisitions</h2>
          <div className="space-y-3">
            {stats.recentAcquisitions.map((card) => (
              <div
                key={card.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded"
              >
                <div>
                  <p className="font-semibold">{card.cardName}</p>
                  <p className="text-sm text-gray-600">
                    {card.pokemon} • {card.setName}
                  </p>
                </div>
                <p className="font-semibold text-primary">
                  {formatCurrency(card.currentPrice)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
