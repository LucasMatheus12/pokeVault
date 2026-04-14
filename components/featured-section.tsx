'use client';

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { Pokemon, TYPE_COLORS, formatPokemonId, formatTypeName, formatStatName } from '@/lib/pokemon';
import { Crown, Sparkles, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface FeaturedSectionProps {
  legendaryPokemon: Pokemon[];
  featuredPokemon: Pokemon[];
  onSelectPokemon: (pokemon: Pokemon) => void;
}

export function FeaturedSection({ legendaryPokemon, featuredPokemon, onSelectPokemon }: FeaturedSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [currentLegendaryIndex, setCurrentLegendaryIndex] = useState(0);

  const nextLegendary = () => {
    setCurrentLegendaryIndex((prev) => (prev + 1) % legendaryPokemon.length);
  };

  const prevLegendary = () => {
    setCurrentLegendaryIndex((prev) => (prev - 1 + legendaryPokemon.length) % legendaryPokemon.length);
  };

  const currentLegendary = legendaryPokemon[currentLegendaryIndex];

  return (
    <section ref={ref} className="py-20 px-6">
      <div className="max-w-7xl mx-auto space-y-20">
        {/* Legendary Showcase */}
        {currentLegendary && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <Crown className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                Pokémon Lendários
              </h2>
            </div>

            <div className="relative glass-strong rounded-3xl overflow-hidden p-8 md:p-12">
              {/* Background glow */}
              <div className={`absolute inset-0 ${TYPE_COLORS[currentLegendary.types[0]?.type.name || 'normal'].bg} opacity-30 blur-3xl`} />
              
              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                {/* Image */}
                <motion.div
                  key={currentLegendary.id}
                  initial={{ opacity: 0, scale: 0.8, x: -50 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full max-w-md aspect-square mx-auto"
                >
                  <Image
                    src={currentLegendary.sprites.other['official-artwork'].front_default || currentLegendary.sprites.front_default}
                    alt={currentLegendary.name}
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </motion.div>

                {/* Info */}
                <motion.div
                  key={`info-${currentLegendary.id}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-center md:text-left"
                >
                  <span className="text-sm font-mono text-muted-foreground">{formatPokemonId(currentLegendary.id)}</span>
                  <h3 className="text-4xl md:text-5xl font-bold capitalize text-foreground mt-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    {currentLegendary.name}
                  </h3>
                  
                  <div className="flex gap-2 mt-4 justify-center md:justify-start">
                    {currentLegendary.types.map(({ type }) => {
                      const colors = TYPE_COLORS[type.name] || TYPE_COLORS.normal;
                      return (
                        <span
                          key={type.name}
                          className={`px-4 py-1.5 text-sm font-medium rounded-full capitalize ${colors.bg} ${colors.text} border border-current/20`}
                        >
                          {formatTypeName(type.name)}
                        </span>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-8">
                    {currentLegendary.stats.slice(0, 3).map((stat) => (
                      <div key={stat.stat.name} className="text-center p-4 rounded-xl bg-secondary/30">
                        <div className="text-2xl font-bold text-gradient">{stat.base_stat}</div>
                        <div className="text-xs text-muted-foreground mt-1">{formatStatName(stat.stat.name)}</div>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    onClick={() => onSelectPokemon(currentLegendary)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-8 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium inline-flex items-center gap-2 hover:bg-primary/90 transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    Ver detalhes
                  </motion.button>
                </motion.div>
              </div>

              {/* Navigation */}
              {legendaryPokemon.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:left-auto md:right-8 md:translate-x-0 flex items-center gap-4">
                  <motion.button
                    onClick={prevLegendary}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full bg-secondary/80 text-foreground hover:bg-secondary transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </motion.button>
                  <div className="flex gap-2">
                    {legendaryPokemon.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentLegendaryIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentLegendaryIndex 
                            ? 'bg-primary w-6' 
                            : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                        }`}
                      />
                    ))}
                  </div>
                  <motion.button
                    onClick={nextLegendary}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full bg-secondary/80 text-foreground hover:bg-secondary transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Featured Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <Star className="w-6 h-6 text-accent" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
              Favoritos dos fãs
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {featuredPokemon.map((pokemon, index) => {
              const primaryType = pokemon.types[0]?.type.name || 'normal';
              const typeColors = TYPE_COLORS[primaryType] || TYPE_COLORS.normal;
              
              return (
                <motion.button
                  key={pokemon.id}
                  onClick={() => onSelectPokemon(pokemon)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                  whileHover={{ y: -8, scale: 1.05 }}
                  className="group relative glass-strong rounded-2xl p-4 text-center"
                >
                  <div className={`absolute inset-0 ${typeColors.bg} opacity-0 group-hover:opacity-30 rounded-2xl blur-xl transition-opacity`} />
                  <div className="relative aspect-square mb-2">
                    <Image
                      src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                      alt={pokemon.name}
                      fill
                      className="object-contain drop-shadow-lg"
                    />
                  </div>
                  <span className="text-sm font-medium capitalize text-foreground">{pokemon.name}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
