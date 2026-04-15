'use client';

import { Card, PriceHistory } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useCallback } from 'react';
import { CardTile, CardGrid } from '@/components/cards/CardTile';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CardDetailPageProps {
  card: Card & { priceHistory: PriceHistory[] };
  relatedCards: Card[];
}

export default function CardDetailPage({
  card,
  relatedCards,
}: CardDetailPageProps) {
  const [cardData, setCardData] = useState(card);
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    owned: card.owned,
    favorite: card.favorite,
    purchasePrice: card.purchasePrice?.toString() || '',
    currentPrice: card.currentPrice?.toString() || '',
    condition: card.condition || 'Near Mint',
    notes: card.notes || '',
    wishlistPriority: card.wishlistPriority?.toString() || '',
  });

  const handleUpdate = useCallback(async () => {
    try {
      const response = await fetch(`/api/cards/${card.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          owned: editValues.owned,
          favorite: editValues.favorite,
          purchasePrice: editValues.purchasePrice
            ? parseFloat(editValues.purchasePrice)
            : null,
          currentPrice: editValues.currentPrice
            ? parseFloat(editValues.currentPrice)
            : null,
          condition: editValues.condition,
          notes: editValues.notes,
          wishlistPriority: editValues.wishlistPriority
            ? parseInt(editValues.wishlistPriority)
            : null,
        }),
      });

      if (!response.ok) throw new Error('Failed to update');

      const updated = await response.json();
      setCardData(updated);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating card:', error);
    }
  }, [card.id, editValues]);

  const priceChartData = cardData.priceHistory
    .slice()
    .reverse()
    .map((h) => ({
      date: new Date(h.recordedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      price: h.price,
    }));

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Breadcrumb */}
      <div className="bg-dark-900 border-b border-dark-800 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/collection" className="text-dark-400 hover:text-white transition-colors">
            ← Back to Collection
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card Image */}
          <div className="lg:col-span-1">
            <div className="bg-dark-800/50 rounded-lg border border-dark-700 overflow-hidden card-shadow aspect-square sticky top-20">
              {cardData.imageUrl ? (
                <Image
                  src={cardData.imageUrl}
                  alt={cardData.cardName}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-dark-700 to-dark-900">
                  <div className="text-center">
                    <div className="text-6xl opacity-20 mb-4">🃏</div>
                    <p className="text-dark-400">No image available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card Details & Editing */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card Info */}
            <div className="bg-dark-800/50 rounded-lg border border-dark-700 p-8 backdrop-blur-sm card-shadow">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{cardData.cardName}</h1>
                  <p className="text-lg text-dark-400">
                    {cardData.pokemon} • {cardData.setName} #{cardData.cardNumber}
                  </p>
                </div>
                {cardData.favorite && (
                  <span className="text-4xl">⭐</span>
                )}
              </div>

              {/* Status Badge */}
              <div className="mb-6">
                {cardData.owned ? (
                  <span className="inline-block bg-green-600/30 text-green-300 px-4 py-2 rounded text-sm font-bold">
                    ✓ OWNED
                  </span>
                ) : (
                  <span className="inline-block bg-dark-700 text-dark-300 px-4 py-2 rounded text-sm font-bold">
                    MISSING
                  </span>
                )}
              </div>

              {/* Pricing Section */}
              <div className="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-dark-700">
                <div>
                  <p className="text-dark-400 text-sm mb-2">Purchase Price</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {cardData.purchasePrice
                      ? `$${cardData.purchasePrice.toFixed(2)}`
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-dark-400 text-sm mb-2">Current Market Price</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {cardData.currentPrice
                      ? `$${cardData.currentPrice.toFixed(2)}`
                      : '-'}
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-4 mb-8 pb-8 border-b border-dark-700">
                <div>
                  <p className="text-dark-400 text-sm">Condition</p>
                  <p className="text-white font-semibold">
                    {cardData.condition || 'Not specified'}
                  </p>
                </div>
                {cardData.acquiredDate && (
                  <div>
                    <p className="text-dark-400 text-sm">Acquired Date</p>
                    <p className="text-white font-semibold">
                      {new Date(cardData.acquiredDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {cardData.wishlistPriority && (
                  <div>
                    <p className="text-dark-400 text-sm">Wishlist Priority</p>
                    <p className="text-white font-semibold">
                      Priority #{cardData.wishlistPriority}
                    </p>
                  </div>
                )}
                {cardData.notes && (
                  <div>
                    <p className="text-dark-400 text-sm">Notes</p>
                    <p className="text-white">{cardData.notes}</p>
                  </div>
                )}
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 rounded transition-all"
              >
                {isEditing ? '✕ Cancel' : '✎ Edit Card'}
              </button>
            </div>

            {/* Edit Form */}
            {isEditing && (
              <div className="bg-dark-800/50 rounded-lg border border-dark-700 p-8 backdrop-blur-sm card-shadow space-y-4">
                <h3 className="text-lg font-bold mb-6">Edit Card</h3>

                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={editValues.owned}
                      onChange={(e) =>
                        setEditValues({
                          ...editValues,
                          owned: e.target.checked,
                        })
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-white">Owned</span>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={editValues.favorite}
                      onChange={(e) =>
                        setEditValues({
                          ...editValues,
                          favorite: e.target.checked,
                        })
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-white">Favorite</span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-dark-300 mb-2">
                      Purchase Price
                    </label>
                    <input
                      type="number"
                      value={editValues.purchasePrice}
                      onChange={(e) =>
                        setEditValues({
                          ...editValues,
                          purchasePrice: e.target.value,
                        })
                      }
                      placeholder="0.00"
                      className="w-full bg-dark-900 border border-dark-700 rounded px-3 py-2 text-white"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-dark-300 mb-2">
                      Current Price
                    </label>
                    <input
                      type="number"
                      value={editValues.currentPrice}
                      onChange={(e) =>
                        setEditValues({
                          ...editValues,
                          currentPrice: e.target.value,
                        })
                      }
                      placeholder="0.00"
                      className="w-full bg-dark-900 border border-dark-700 rounded px-3 py-2 text-white"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-dark-300 mb-2">
                    Condition
                  </label>
                  <select
                    value={editValues.condition}
                    onChange={(e) =>
                      setEditValues({
                        ...editValues,
                        condition: e.target.value,
                      })
                    }
                    className="w-full bg-dark-900 border border-dark-700 rounded px-3 py-2 text-white"
                  >
                    <option value="Mint">Mint</option>
                    <option value="Near Mint">Near Mint</option>
                    <option value="Lightly Played">Lightly Played</option>
                    <option value="Moderately Played">Moderately Played</option>
                    <option value="Heavily Played">Heavily Played</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-dark-300 mb-2">
                    Wishlist Priority
                  </label>
                  <input
                    type="number"
                    value={editValues.wishlistPriority}
                    onChange={(e) =>
                      setEditValues({
                        ...editValues,
                        wishlistPriority: e.target.value,
                      })
                    }
                    placeholder="1-10"
                    className="w-full bg-dark-900 border border-dark-700 rounded px-3 py-2 text-white"
                    min="1"
                    max="10"
                  />
                </div>

                <div>
                  <label className="block text-sm text-dark-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={editValues.notes}
                    onChange={(e) =>
                      setEditValues({
                        ...editValues,
                        notes: e.target.value,
                      })
                    }
                    placeholder="Add notes..."
                    className="w-full bg-dark-900 border border-dark-700 rounded px-3 py-2 text-white h-24 resize-none"
                  />
                </div>

                <button
                  onClick={handleUpdate}
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded transition-all"
                >
                  Save Changes
                </button>
              </div>
            )}

            {/* Price History Chart */}
            {priceChartData.length > 1 && (
              <div className="bg-dark-800/50 rounded-lg border border-dark-700 p-8 backdrop-blur-sm card-shadow">
                <h3 className="text-lg font-bold mb-4">Price History</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={priceChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      formatter={(value) => {
                        if (typeof value === 'number') return `$${value.toFixed(2)}`;
                        return String(value);
                      }}
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#ec4899"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Related Cards */}
        {relatedCards.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8">Related Cards</h2>
            <CardGrid>
              {relatedCards.slice(0, 4).map((relatedCard) => (
                <CardTile
                  key={relatedCard.id}
                  id={relatedCard.id}
                  cardName={relatedCard.cardName}
                  pokemon={relatedCard.pokemon}
                  setName={relatedCard.setName}
                  cardNumber={relatedCard.cardNumber}
                  imageUrl={relatedCard.imageUrl}
                  owned={relatedCard.owned}
                  favorite={relatedCard.favorite}
                  currentPrice={relatedCard.currentPrice || undefined}
                />
              ))}
            </CardGrid>
          </div>
        )}
      </section>
    </div>
  );
}
