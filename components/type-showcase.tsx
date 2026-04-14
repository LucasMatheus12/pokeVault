'use client';

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { Pokemon, TYPE_COLORS, formatTypeName } from '@/lib/pokemon';
import { Flame, Droplets, Leaf, Zap } from 'lucide-react';

interface TypeShowcaseProps {
  pokemonByType: Record<string, Pokemon[]>;
  onSelectPokemon: (pokemon: Pokemon) => void;
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  fire: <Flame className="w-5 h-5" />,
  water: <Droplets className="w-5 h-5" />,
  grass: <Leaf className="w-5 h-5" />,
  electric: <Zap className="w-5 h-5" />,
};

const FEATURED_TYPES = ['fire', 'water', 'grass', 'electric'];

export function TypeShowcase({ pokemonByType, onSelectPokemon }: TypeShowcaseProps) {
  const ref = useRef(null);
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const dragState = useRef({
    type: '',
    isDragging: false,
    startX: 0,
    startScrollLeft: 0,
  });
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const handlePointerDown = (type: string, e: React.PointerEvent<HTMLDivElement>) => {
    const row = rowRefs.current[type];
    if (!row) return;
    dragState.current = {
      type,
      isDragging: true,
      startX: e.clientX,
      startScrollLeft: row.scrollLeft,
    };
    row.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (type: string, e: React.PointerEvent<HTMLDivElement>) => {
    const row = rowRefs.current[type];
    const state = dragState.current;
    if (!row || !state.isDragging || state.type !== type) return;
    const deltaX = e.clientX - state.startX;
    row.scrollLeft = state.startScrollLeft - deltaX;
  };

  const handlePointerUp = (type: string, e: React.PointerEvent<HTMLDivElement>) => {
    const row = rowRefs.current[type];
    if (row?.hasPointerCapture(e.pointerId)) {
      row.releasePointerCapture(e.pointerId);
    }
    if (dragState.current.type === type) {
      dragState.current.isDragging = false;
      dragState.current.type = '';
    }
  };

  return (
    <section ref={ref} className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Explore por tipo
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Descubra Pokémon pelos seus tipos elementais. Cada tipo tem forças e características únicas.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {FEATURED_TYPES.map((type, typeIndex) => {
            const pokemon = pokemonByType[type] || [];
            const colors = TYPE_COLORS[type];
            
            return (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: typeIndex * 0.1 }}
                className="relative glass-strong rounded-2xl overflow-hidden group"
              >
                {/* Background glow */}
                <div className={`absolute inset-0 ${colors.bg} opacity-20 group-hover:opacity-40 transition-opacity`} />
                
                <div className="relative p-6">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-2.5 rounded-xl ${colors.bg} ${colors.text}`}>
                      {TYPE_ICONS[type]}
                    </div>
                    <h3 className={`text-xl font-bold capitalize ${colors.text}`}>
                      Tipo {formatTypeName(type)}
                    </h3>
                  </div>

                  {/* Pokemon row */}
                  <div
                    ref={(el) => {
                      rowRefs.current[type] = el;
                    }}
                    onPointerDown={(e) => handlePointerDown(type, e)}
                    onPointerMove={(e) => handlePointerMove(type, e)}
                    onPointerUp={(e) => handlePointerUp(type, e)}
                    onPointerCancel={(e) => handlePointerUp(type, e)}
                    className="flex gap-3 overflow-x-auto no-scrollbar pb-2 cursor-grab active:cursor-grabbing touch-pan-x select-none"
                  >
                    {pokemon.slice(0, 6).map((poke, index) => (
                      <motion.button
                        key={poke.id}
                        onClick={() => onSelectPokemon(poke)}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                        whileHover={{ scale: 1.1, y: -5 }}
                        className="relative flex-shrink-0 w-20 h-20 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                      >
                        <Image
                          src={poke.sprites.other['official-artwork'].front_default || poke.sprites.front_default}
                          alt={poke.name}
                          fill
                          className="object-contain p-2"
                        />
                      </motion.button>
                    ))}
                    {pokemon.length > 6 && (
                      <div className="flex-shrink-0 w-20 h-20 rounded-xl bg-secondary/30 flex items-center justify-center">
                        <span className="text-sm font-medium text-muted-foreground">+{pokemon.length - 6}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Decorative gradient line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${
                  type === 'fire' ? 'from-orange-600 via-red-500 to-yellow-500' :
                  type === 'water' ? 'from-blue-600 via-cyan-500 to-blue-400' :
                  type === 'grass' ? 'from-green-600 via-emerald-500 to-lime-400' :
                  'from-yellow-500 via-amber-400 to-yellow-300'
                }`} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
