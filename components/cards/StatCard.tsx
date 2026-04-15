export function StatCard({
  label,
  value,
  icon: Icon,
  color = 'purple',
  subtext,
}: {
  label: string;
  value: string | number;
  icon?: React.ComponentType<{ className?: string }>;
  color?: string;
  subtext?: string;
}) {
  const colorClasses = {
    purple: 'bg-gradient-to-br from-purple-600/20 to-purple-900/10 border-purple-700/30',
    pink: 'bg-gradient-to-br from-pink-600/20 to-pink-900/10 border-pink-700/30',
    blue: 'bg-gradient-to-br from-blue-600/20 to-blue-900/10 border-blue-700/30',
    green: 'bg-gradient-to-br from-green-600/20 to-green-900/10 border-green-700/30',
  };

  return (
    <div
      className={`rounded-lg border p-6 backdrop-blur-sm card-shadow ${colorClasses[color as keyof typeof colorClasses]}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-dark-400 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold mt-2 text-white">{value}</p>
          {subtext && <p className="text-dark-400 text-xs mt-1">{subtext}</p>}
        </div>
        {Icon && <Icon className="w-8 h-8 text-dark-400 opacity-50" />}
      </div>
    </div>
  );
}

export function ProgressCard({
  label,
  current,
  total,
  color = 'purple',
}: {
  label: string;
  current: number;
  total: number;
  color?: string;
}) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  const colorClasses = {
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
  };

  return (
    <div className="bg-dark-800/50 rounded-lg border border-dark-700 p-6 backdrop-blur-sm card-shadow">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-dark-300">{label}</p>
        <p className="text-lg font-bold text-white">
          {current} / {total}
        </p>
      </div>
      <div className="w-full bg-dark-900 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${colorClasses[color as keyof typeof colorClasses]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-dark-400 mt-2">
        {percentage.toFixed(1)}% Complete
      </p>
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
}) {
  return (
    <div className="text-center py-12">
      {Icon && <Icon className="w-16 h-16 mx-auto opacity-20 mb-4" />}
      <h3 className="text-lg font-semibold text-dark-300">{title}</h3>
      {description && <p className="text-dark-400 text-sm mt-2">{description}</p>}
    </div>
  );
}
