'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

export function OwnedMissingChart({
  owned,
  missing,
}: {
  owned: number;
  missing: number;
}) {
  const data = [
    { name: 'Owned', value: owned },
    { name: 'Missing', value: missing },
  ];

  const COLORS = ['#10b981', '#6b7280'];

  return (
    <div className="bg-dark-800/50 rounded-lg border border-dark-700 p-6 backdrop-blur-sm card-shadow">
      <h3 className="text-lg font-bold mb-4">Collection Status</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value, percent }) =>
              `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
            }
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => value} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ValueByPokemonChart({ data }: { data: Array<{ pokemon: string; value: number }> }) {
  const sortedData = data.sort((a, b) => b.value - a.value).slice(0, 10);

  return (
    <div className="bg-dark-800/50 rounded-lg border border-dark-700 p-6 backdrop-blur-sm card-shadow">
      <h3 className="text-lg font-bold mb-4">Value by Pokémon (Top 10)</h3>
      <div className="space-y-3">
        {sortedData.map((item) => (
          <div key={item.pokemon}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-dark-300">
                {item.pokemon}
              </span>
              <span className="text-sm font-bold text-purple-400">
                ${item.value.toFixed(2)}
              </span>
            </div>
            <div className="w-full bg-dark-900 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                style={{
                  width: `${(item.value / (sortedData[0]?.value || 1)) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ValueBySetChart({ data }: { data: Array<{ set: string; value: number }> }) {
  const sortedData = data.sort((a, b) => b.value - a.value).slice(0, 10);

  return (
    <div className="bg-dark-800/50 rounded-lg border border-dark-700 p-6 backdrop-blur-sm card-shadow">
      <h3 className="text-lg font-bold mb-4">Value by Set (Top 10)</h3>
      <div className="space-y-3">
        {sortedData.map((item) => (
          <div key={item.set}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-dark-300">{item.set}</span>
              <span className="text-sm font-bold text-blue-400">
                ${item.value.toFixed(2)}
              </span>
            </div>
            <div className="w-full bg-dark-900 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all"
                style={{
                  width: `${(item.value / (sortedData[0]?.value || 1)) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CompletionRing({
  percentage,
}: {
  percentage: number;
}) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-40 h-40">
        <svg
          className="transform -rotate-90"
          width="160"
          height="160"
          viewBox="0 0 160 160"
        >
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#1f2937"
            strokeWidth="8"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-4xl font-bold text-white">
            {percentage.toFixed(0)}%
          </p>
          <p className="text-xs text-dark-400 mt-1">Complete</p>
        </div>
      </div>
    </div>
  );
}
