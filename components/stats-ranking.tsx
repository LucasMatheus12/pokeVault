'use client';

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { Pokemon, TYPE_COLORS, calculateTotalStats, formatPokemonId, formatTypeName } from '@/lib/pokemon';
import { Trophy, Medal, Award } from 'lucide-react';

interface StatsRankingProps {
  allPokemon: Pokemon[];
  onSelectPokemon: (pokemon: Pokemon) => void;
}

export function StatsRanking({ allPokemon, onSelectPokemon }: StatsRankingProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Sort by total stats and get top 10
  const topPokemon = [...allPokemon]
    .sort((a, b) => calculateTotalStats(b.stats) - calculateTotalStats(a.stats))
    .slice(0, 10);

  const rankIcons = [
    <Trophy key="1" className="w-5 h-5 text-yellow-400" />,
    <Medal key="2" className="w-5 h-5 text-gray-300" />,
    <Award key="3" className="w-5 h-5 text-amber-600" />,
  ];

  return (
    <section ref={ref} className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
              Ranking de poder
            </h2>
          </div>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Os Pokémon mais fortes classificados pelo total de stats base. Estes são os verdadeiros gigantes.
          </p>
        </motion.div>

        <div className="space-y-3">
          {topPokemon.map((pokemon, index) => {
            const primaryType = pokemon.types[0]?.type.name || 'normal';
            const typeColors = TYPE_COLORS[primaryType] || TYPE_COLORS.normal;
            const totalStats = calculateTotalStats(pokemon.stats);

            return (
              <motion.button
                key={pokemon.id}
                onClick={() => onSelectPokemon(pokemon)}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 10 }}
                className="w-full glass-strong rounded-xl p-4 flex items-center gap-4 group text-left"
              >
                {/* Rank */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                  index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                  index === 1 ? 'bg-gray-400/20 text-gray-300' :
                  index === 2 ? 'bg-amber-600/20 text-amber-500' :
                  'bg-secondary/50 text-muted-foreground'
                }`}>
                  {index < 3 ? rankIcons[index] : `#${index + 1}`}
                </div>

                {/* Pokemon image */}
                <div className="relative w-16 h-16 flex-shrink-0">
                  <div className={`absolute inset-0 ${typeColors.bg} opacity-50 rounded-full blur-lg group-hover:opacity-80 transition-opacity`} />
                  <Image
                    src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                    alt={pokemon.name}
                    fill
                    className="object-contain drop-shadow-lg"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-muted-foreground">{formatPokemonId(pokemon.id)}</span>
                    <h3 className="text-lg font-bold capitalize text-foreground truncate">{pokemon.name}</h3>
                  </div>
                  <div className="flex gap-2 mt-1">
                    {pokemon.types.map(({ type }) => {
                      const colors = TYPE_COLORS[type.name] || TYPE_COLORS.normal;
                      return (
                        <span
                          key={type.name}
                          className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${colors.bg} ${colors.text}`}
                        >
                          {formatTypeName(type.name)}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Stats */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-gradient">{totalStats}</div>
                  <div className="text-xs text-muted-foreground">Total de Stats</div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
