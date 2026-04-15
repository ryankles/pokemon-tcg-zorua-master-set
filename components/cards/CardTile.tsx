'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface CardTileProps {
  id: string;
  cardName: string;
  pokemon: string;
  setName: string;
  cardNumber: string;
  imageUrl?: string | null;
  owned: boolean;
  favorite: boolean;
  currentPrice?: number | null;
  onUpdate?: (id: string, data: any) => Promise<void>;
}

export function CardTile({
  id,
  cardName,
  pokemon,
  setName,
  cardNumber,
  imageUrl,
  owned,
  favorite,
  currentPrice,
  onUpdate,
}: CardTileProps) {
  const [isLoading, setIsLoading] = useState(false);

  const toggleOwned = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!onUpdate) return;

    setIsLoading(true);
    try {
      await onUpdate(id, { owned: !owned });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!onUpdate) return;

    setIsLoading(true);
    try {
      await onUpdate(id, { favorite: !favorite });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link href={`/card/${id}`}>
      <div className="group relative bg-dark-800/50 rounded-lg border border-dark-700 overflow-hidden card-shadow-hover h-full flex flex-col cursor-pointer">
        {/* Image Container */}
        <div className="relative bg-dark-900 aspect-square overflow-hidden flex items-center justify-center">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={cardName}
              fill
              className="object-contain group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-dark-700 to-dark-900">
              <div className="text-center">
                <div className="text-3xl opacity-20 mb-2">🃏</div>
                <p className="text-xs text-dark-400">No Image</p>
              </div>
            </div>
          )}

          {/* Owned Badge */}
          {owned && (
            <div className="absolute top-2 right-2 bg-green-500/90 text-white text-xs font-bold px-2 py-1 rounded">
              OWNED
            </div>
          )}

          {/* Missing Badge */}
          {!owned && (
            <div className="absolute top-2 right-2 bg-dark-600/90 text-dark-300 text-xs font-bold px-2 py-1 rounded">
              MISSING
            </div>
          )}

          {/* Favorite Star */}
          <button
            onClick={toggleFavorite}
            className="absolute top-2 left-2 text-xl opacity-0 group-hover:opacity-100 transition-opacity"
            disabled={isLoading}
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
            title={favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {favorite ? '⭐' : '☆'}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col">
          <p className="text-xs text-dark-400 uppercase font-semibold">{pokemon}</p>
          <h3 className="text-sm font-bold text-white mt-1 line-clamp-2">
            {cardName}
          </h3>
          <p className="text-xs text-dark-500 mt-2">{setName}</p>
          <p className="text-xs text-dark-500">{cardNumber}</p>

          {currentPrice && (
            <p className="mt-auto text-sm font-semibold text-purple-400 pt-2">
              ${currentPrice.toFixed(2)}
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <div
          className="border-t border-dark-700 p-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.preventDefault()}
        >
          <button
            onClick={toggleOwned}
            disabled={isLoading}
            aria-label={owned ? 'Mark as missing' : 'Mark as owned'}
            title={owned ? 'Mark as missing' : 'Mark as owned'}
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
              owned
                ? 'bg-green-600/30 text-green-300 hover:bg-green-600/50'
                : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
            }`}
          >
            {owned ? '✓ Own' : 'Need'}
          </button>
        </div>
      </div>
    </Link>
  );
}

export function CardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {children}
    </div>
  );
}
