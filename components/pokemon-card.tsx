'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Pokemon, TYPE_COLORS, formatPokemonId, formatStatName, formatTypeName } from '@/lib/pokemon';
import { Star } from 'lucide-react';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick: () => void;
  index: number;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
}

export function PokemonCard({ pokemon, onClick, index, isFavorite, onToggleFavorite }: PokemonCardProps) {
  const primaryType = pokemon.types[0]?.type.name || 'normal';
  const typeColors = TYPE_COLORS[primaryType] || TYPE_COLORS.normal;
  
  const imageUrl = pokemon.sprites.other['official-artwork'].front_default || 
                   pokemon.sprites.other.dream_world.front_default ||
                   pokemon.sprites.front_default;

  const topStats = pokemon.stats.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={onClick}
      className="group relative cursor-pointer"
    >
      {/* Glow effect */}
      <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-br from-primary/30 via-transparent to-accent/30 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`} />
      
      {/* Card */}
      <div className="relative glass-strong rounded-2xl overflow-hidden transition-all duration-300 group-hover:border-primary/30">
        {/* Header with ID and Favorite */}
        <div className="flex items-center justify-between px-4 pt-4">
          <span className="text-sm font-mono text-muted-foreground">{formatPokemonId(pokemon.id)}</span>
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.(e);
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className={`p-1.5 rounded-full transition-colors ${
              isFavorite 
                ? 'text-yellow-400 bg-yellow-400/20' 
                : 'text-muted-foreground hover:text-yellow-400 hover:bg-yellow-400/10'
            }`}
          >
            <Star className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
          </motion.button>
        </div>

        {/* Image container */}
        <div className="relative aspect-square p-6">
          {/* Background glow */}
          <div className={`absolute inset-0 ${typeColors.bg} opacity-50 blur-2xl group-hover:opacity-70 transition-opacity`} />
          
          {/* Pokemon image */}
          <motion.div
            className="relative w-full h-full"
            whileHover={{ scale: 1.1, rotate: 3 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Image
              src={imageUrl}
              alt={pokemon.name}
              fill
              className="object-contain drop-shadow-2xl"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          </motion.div>
        </div>

        {/* Info section */}
        <div className="p-4 space-y-3">
          {/* Name */}
          <h3 className="text-lg font-bold capitalize text-foreground tracking-wide">
            {pokemon.name.replace(/-/g, ' ')}
          </h3>

          {/* Types */}
          <div className="flex gap-2">
            {pokemon.types.map(({ type }) => {
              const colors = TYPE_COLORS[type.name] || TYPE_COLORS.normal;
              return (
                <span
                  key={type.name}
                  className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${colors.bg} ${colors.text} border border-current/20`}
                >
                  {formatTypeName(type.name)}
                </span>
              );
            })}
          </div>

          {/* Mini stats */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            {topStats.map((stat) => (
              <div key={stat.stat.name} className="text-center">
                <div className="text-xs text-muted-foreground">{formatStatName(stat.stat.name)}</div>
                <div className="text-sm font-semibold text-foreground">{stat.base_stat}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Shine effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        </div>
      </div>
    </motion.div>
  );
}

export function PokemonCardSkeleton({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="glass-strong rounded-2xl overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="w-16 h-4 skeleton rounded" />
        <div className="w-6 h-6 skeleton rounded-full" />
      </div>
      <div className="aspect-square p-6">
        <div className="w-full h-full skeleton rounded-full" />
      </div>
      <div className="p-4 space-y-3">
        <div className="w-2/3 h-6 skeleton rounded" />
        <div className="flex gap-2">
          <div className="w-16 h-6 skeleton rounded-full" />
          <div className="w-16 h-6 skeleton rounded-full" />
        </div>
        <div className="grid grid-cols-3 gap-2 pt-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-1">
              <div className="w-8 h-3 mx-auto skeleton rounded" />
              <div className="w-6 h-4 mx-auto skeleton rounded" />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
