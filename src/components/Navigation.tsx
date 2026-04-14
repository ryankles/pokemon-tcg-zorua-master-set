'use client';

import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              🦑 Zorua Collection
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary transition"
            >
              Dashboard
            </Link>
            <Link
              href="/collection"
              className="text-gray-700 hover:text-primary transition"
            >
              Collection
            </Link>
            <Link
              href="/missing"
              className="text-gray-700 hover:text-primary transition"
            >
              Missing
            </Link>
            <Link
              href="/portfolio"
              className="text-gray-700 hover:text-primary transition"
            >
              Portfolio
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
