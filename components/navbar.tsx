'use client';

import { motion } from 'framer-motion';
import { ArrowLeftRight, Star, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { PokeballIcon } from '@/components/pokeball-icon';

interface NavbarProps {
  onOpenComparator: () => void;
  favoriteCount: number;
  showOnlyFavorites: boolean;
  onShowFavorites: () => void;
  onShowAllPokemon: () => void;
}

export function Navbar({
  onOpenComparator,
  favoriteCount,
  showOnlyFavorites,
  onShowFavorites,
  onShowAllPokemon,
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-4 mt-4">
        <div className="glass-strong rounded-2xl px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"
              >
                <PokeballIcon size={20} />
              </motion.div>
              <span className="text-xl font-bold text-foreground hidden sm:block" style={{ fontFamily: 'var(--font-heading)' }}>
                PokéVault
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              <motion.button
                onClick={onOpenComparator}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 hover:bg-secondary text-foreground transition-colors"
              >
                <ArrowLeftRight className="w-4 h-4" />
                <span className="text-sm font-medium">Comparar</span>
              </motion.button>

              <motion.button
                onClick={onShowAllPokemon}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                  !showOnlyFavorites
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary/50 hover:bg-secondary text-foreground'
                }`}
              >
                <span className="text-sm font-medium">Todos</span>
              </motion.button>

              <motion.button
                onClick={onShowFavorites}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                  showOnlyFavorites
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary/50 hover:bg-secondary text-foreground'
                }`}
              >
                <Star className="w-4 h-4" />
                <span className="text-sm font-medium">Favoritos</span>
                {favoriteCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-medium">
                    {favoriteCount}
                  </span>
                )}
              </motion.button>
            </div>

            {/* Mobile menu button */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="md:hidden p-2 rounded-xl bg-secondary/50 text-foreground"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pt-4 border-t border-border"
            >
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    onOpenComparator();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary/50 hover:bg-secondary text-foreground transition-colors"
                >
                  <ArrowLeftRight className="w-5 h-5" />
                  <span className="font-medium">Comparar Pokémon</span>
                </button>
                <button
                  onClick={() => {
                    onShowAllPokemon();
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                    !showOnlyFavorites
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary/50 hover:bg-secondary text-foreground'
                  }`}
                >
                  <span className="font-medium">Todos</span>
                </button>
                <button
                  onClick={() => {
                    onShowFavorites();
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                    showOnlyFavorites
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary/50 hover:bg-secondary text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5" />
                    <span className="font-medium">Favoritos</span>
                  </div>
                  {favoriteCount > 0 && (
                    <span className="w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-medium">
                      {favoriteCount}
                    </span>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
