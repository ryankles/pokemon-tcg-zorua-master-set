import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Zorua Collection Portfolio',
  description: 'Track, visualize, and manage your Pokémon TCG Zorua-line collection',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-dark-950 text-dark-50">
        <div className="min-h-screen flex flex-col">
          <nav className="bg-dark-900 border-b border-dark-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Zorua Portfolio
                  </div>
                  <div className="hidden sm:flex gap-6">
                    <NavLink href="/" label="Dashboard" />
                    <NavLink href="/collection" label="Collection" />
                    <NavLink href="/missing" label="Missing" />
                    <NavLink href="/portfolio" label="Analytics" />
                  </div>
                </div>
              </div>
            </div>
          </nav>
          <main className="flex-1 bg-dark-950">{children}</main>
          <footer className="bg-dark-900 border-t border-dark-800 text-center py-6 text-dark-400 text-sm">
            <p>Pokémon TCG Zorua-line Master Set Collection • Built with precision</p>
          </footer>
        </div>
      </body>
    </html>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="text-dark-300 hover:text-purple-400 transition-colors font-medium text-sm"
    >
      {label}
    </a>
  );
}
