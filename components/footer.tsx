'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { PokeballIcon } from '@/components/pokeball-icon';

export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo and tagline */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <PokeballIcon size={16} />
              </div>
              <span className="text-lg font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                PokéVault
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              A experiência premium definitiva de Pokédex
            </p>
          </div>

          {/* Credits */}
          <div className="text-center md:text-right text-sm text-muted-foreground">
            <p className="flex items-center justify-center md:justify-end gap-1">
              Feito com <Heart className="w-4 h-4 text-red-500" fill="currentColor" /> usando a PokéAPI
            </p>
            <p className="mt-1">
              Pokémon e todos os nomes relacionados são marcas registradas da Nintendo
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
