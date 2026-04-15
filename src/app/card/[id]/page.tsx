'use client';

import { useEffect, useState } from 'react';
import { Card } from '@prisma/client';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function CardDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    owned: false,
    purchasePrice: '',
    currentPrice: '',
    condition: '',
    notes: '',
  });

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const response = await fetch(`/api/cards/${params.id}`);
        const data = await response.json();
        setCard(data);
        setFormData({
          owned: data.owned,
          purchasePrice: data.purchasePrice || '',
          currentPrice: data.currentPrice || '',
          condition: data.condition || '',
          notes: data.notes || '',
        });
      } catch (error) {
        console.error('Error fetching card:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [params.id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/cards/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          owned: formData.owned,
          purchasePrice: formData.purchasePrice
            ? parseFloat(formData.purchasePrice)
            : null,
          currentPrice: formData.currentPrice
            ? parseFloat(formData.currentPrice)
            : null,
          condition: formData.condition,
          notes: formData.notes,
        }),
      });

      if (response.ok) {
        const updated = await response.json();
        setCard(updated);
        setEditing(false);
      }
    } catch (error) {
      console.error('Error updating card:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading card...</div>;
  }

  if (!card) {
    return <div className="text-center py-12">Card not found</div>;
  }

  return (
    <div className="space-y-8">
      <Link href="/collection" className="text-primary hover:underline">
        ← Back to Collection
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Card Image */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 sticky top-4">
            <div className="relative w-full aspect-video bg-gradient-to-br from-purple-400 to-indigo-600 rounded overflow-hidden flex items-center justify-center">
              {card.imageUrl && (
                <img
                  src={card.imageUrl}
                  alt={card.cardName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              )}
              {/* Fallback card placeholder */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 bg-gradient-to-br from-purple-500 to-indigo-700">
                <div className="text-6xl mb-4">🎴</div>
                <p className="text-center font-bold text-lg">{card.cardName}</p>
                <p className="text-center text-sm opacity-75 mt-2">{card.pokemon}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 text-center mt-4">
              {card.setName} • {card.cardNumber}
            </p>
          </div>
        </div>
        
        {/* Card Info */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">{card.cardName}</h1>
                <p className="text-xl text-gray-600 mb-1">{card.pokemon}</p>
                <p className="text-gray-500">
                  {card.setName} #{card.cardNumber}
                </p>
              </div>
              <span
                className={`px-4 py-2 rounded-lg text-lg font-semibold ${
                  card.owned
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {card.owned ? '✓ Owned' : 'Missing'}
              </span>
            </div>

            {!editing ? (
              <div className="space-y-4">
                {card.condition && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      Condition
                    </p>
                    <p className="text-lg">{card.condition}</p>
                  </div>
                )}

                {card.purchasePrice && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      Purchase Price
                    </p>
                    <p className="text-lg font-semibold">
                      {formatCurrency(card.purchasePrice)}
                    </p>
                  </div>
                )}

                {card.currentPrice && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      Current Price
                    </p>
                    <p className="text-lg font-semibold text-primary">
                      {formatCurrency(card.currentPrice)}
                    </p>
                  </div>
                )}

                {card.acquiredDate && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      Acquired Date
                    </p>
                    <p className="text-lg">{formatDate(card.acquiredDate)}</p>
                  </div>
                )}

                {card.notes && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Notes</p>
                    <p className="text-lg text-gray-600">{card.notes}</p>
                  </div>
                )}

                <button
                  onClick={() => setEditing(true)}
                  className="mt-6 py-2 px-6 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                >
                  Edit Card
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <input
                      type="checkbox"
                      name="owned"
                      checked={formData.owned}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Owned
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Condition
                  </label>
                  <input
                    type="text"
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    placeholder="e.g., Mint, Near Mint, Light Play"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Purchase Price ($)
                  </label>
                  <input
                    type="number"
                    name="purchasePrice"
                    value={formData.purchasePrice}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Price ($)
                  </label>
                  <input
                    type="number"
                    name="currentPrice"
                    value={formData.currentPrice}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Add any notes about this card..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    rows={4}
                  />
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={handleSave}
                    className="py-2 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="py-2 px-6 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Card Info Summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="font-bold text-lg mb-4">Quick Info</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Pokémon</p>
                <p className="font-semibold">{card.pokemon}</p>
              </div>
              <div>
                <p className="text-gray-600">Set</p>
                <p className="font-semibold">{card.setName}</p>
              </div>
              <div>
                <p className="text-gray-600">Card #</p>
                <p className="font-semibold">{card.cardNumber}</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <p className={`font-semibold ${card.owned ? 'text-green-600' : 'text-red-600'}`}>
                  {card.owned ? '✓ Owned' : 'Missing'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-primary/10 rounded-lg p-6 border border-primary/20">
            <p className="text-sm text-gray-700">
              Created on {formatDate(card.createdAt)}
            </p>
            <p className="text-sm text-gray-700">
              Last updated {formatDate(card.updatedAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
