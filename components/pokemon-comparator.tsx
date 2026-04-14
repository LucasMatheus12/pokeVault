'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, Search, ArrowLeftRight, Trophy } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Pokemon, TYPE_COLORS, formatPokemonId, formatStatName, calculateTotalStats, fetchPokemonByName, formatTypeName } from '@/lib/pokemon';

interface PokemonComparatorProps {
  isOpen: boolean;
  onClose: () => void;
  allPokemon: Pokemon[];
}

export function PokemonComparator({ isOpen, onClose, allPokemon }: PokemonComparatorProps) {
  const [pokemon1, setPokemon1] = useState<Pokemon | null>(null);
  const [pokemon2, setPokemon2] = useState<Pokemon | null>(null);
  const [search1, setSearch1] = useState('');
  const [search2, setSearch2] = useState('');

  const searchPokemon = async (query: string, slot: 1 | 2) => {
    const setPokemon = slot === 1 ? setPokemon1 : setPokemon2;
    const setSearch = slot === 1 ? setSearch1 : setSearch2;

    if (!query.trim()) return;

    try {
      const poke = await fetchPokemonByName(query.toLowerCase().trim());
      setPokemon(poke);
      setSearch('');
    } catch {
      console.error('[v0] Pokemon not found');
    }
  };

  const filteredPokemon1 = search1 
    ? allPokemon.filter(p => 
        p.name.toLowerCase().includes(search1.toLowerCase()) || 
        p.id.toString().includes(search1)
      ).slice(0, 5)
    : [];

  const filteredPokemon2 = search2 
    ? allPokemon.filter(p => 
        p.name.toLowerCase().includes(search2.toLowerCase()) || 
        p.id.toString().includes(search2)
      ).slice(0, 5)
    : [];

  const selectSuggestion = (pokemon: Pokemon, slot: 1 | 2) => {
    if (slot === 1) {
      setPokemon1(pokemon);
      setSearch1('');
    } else {
      setPokemon2(pokemon);
      setSearch2('');
    }
  };

  const getStatComparison = (stat1: number, stat2: number) => {
    if (stat1 > stat2) return { winner: 1, diff: stat1 - stat2 };
    if (stat2 > stat1) return { winner: 2, diff: stat2 - stat1 };
    return { winner: 0, diff: 0 };
  };

  const total1 = pokemon1 ? calculateTotalStats(pokemon1.stats) : 0;
  const total2 = pokemon2 ? calculateTotalStats(pokemon2.stats) : 0;
  const winner = total1 === total2 ? 0 : total1 > total2 ? 1 : 2;

  const statRows = useMemo(() => {
    if (!pokemon1 || !pokemon2) return [];
    return pokemon1.stats.map((leftStat) => {
      const rightStat = pokemon2.stats.find((item) => item.stat.name === leftStat.stat.name);
      const rightValue = rightStat?.base_stat ?? 0;
      const leftValue = leftStat.base_stat;
      const maxValue = Math.max(leftValue, rightValue, 1);
      return {
        name: leftStat.stat.name,
        leftValue,
        rightValue,
        leftPercent: (leftValue / maxValue) * 100,
        rightPercent: (rightValue / maxValue) * 100,
      };
    });
  }, [pokemon1, pokemon2]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 cursor-pointer"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-2 sm:inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-5xl max-h-[92vh] md:max-h-[90vh] z-50 overflow-y-auto no-scrollbar"
          >
            <div className="glass-strong rounded-3xl p-6 md:p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/20 text-primary">
                    <ArrowLeftRight className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                    Comparar Pokémon
                  </h2>
                </div>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full bg-secondary/80 text-foreground hover:bg-secondary transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="grid md:grid-cols-2 gap-4 md:gap-6 items-start">
                <ComparePicker
                  label="Primeiro Pokémon"
                  placeholder="Buscar primeiro Pokémon..."
                  search={search1}
                  setSearch={setSearch1}
                  filteredPokemon={filteredPokemon1}
                  selectedPokemon={pokemon1}
                  onSelect={(poke) => selectSuggestion(poke, 1)}
                  onEnterSearch={() => searchPokemon(search1, 1)}
                />
                <ComparePicker
                  label="Segundo Pokémon"
                  placeholder="Buscar segundo Pokémon..."
                  search={search2}
                  setSearch={setSearch2}
                  filteredPokemon={filteredPokemon2}
                  selectedPokemon={pokemon2}
                  onSelect={(poke) => selectSuggestion(poke, 2)}
                  onEnterSearch={() => searchPokemon(search2, 2)}
                />
              </div>

              {pokemon1 && pokemon2 ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 md:p-6 rounded-2xl bg-gradient-to-r from-yellow-500/10 via-yellow-500/5 to-yellow-500/10 border border-yellow-500/20"
                  >
                    <div className="flex items-center justify-center gap-3 md:gap-4 text-center">
                      <Trophy className="w-5 h-5 md:w-6 md:h-6 text-yellow-400 shrink-0" />
                      <span className="text-base md:text-lg font-medium text-foreground">
                        {winner === 1
                          ? `${pokemon1.name.charAt(0).toUpperCase() + pokemon1.name.slice(1)} vence com ${total1 - total2} atributos totais a mais!`
                          : winner === 2
                            ? `${pokemon2.name.charAt(0).toUpperCase() + pokemon2.name.slice(1)} vence com ${total2 - total1} atributos totais a mais!`
                            : 'Empate!'}
                      </span>
                    </div>
                  </motion.div>

                  <div className="mt-6 rounded-2xl border border-border bg-secondary/20 overflow-hidden">
                    <div className="grid grid-cols-[1fr,auto,1fr] gap-3 items-center p-4 border-b border-border bg-secondary/30">
                      <CompareHeader pokemon={pokemon1} isWinner={winner === 1} total={total1} align="left" />
                      <div className="w-10 h-10 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-sm">VS</div>
                      <CompareHeader pokemon={pokemon2} isWinner={winner === 2} total={total2} align="right" />
                    </div>

                    <div className="p-4 space-y-3">
                      {statRows.map((row) => (
                        <div key={row.name} className="grid grid-cols-[1fr,auto,1fr] gap-3 items-center">
                          <div className="text-right">
                            <div className="text-sm font-semibold text-foreground">{row.leftValue}</div>
                            <div className="h-2 mt-1 bg-secondary rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full ml-auto" style={{ width: `${row.leftPercent}%` }} />
                            </div>
                          </div>
                          <div className="text-xs md:text-sm text-muted-foreground font-medium uppercase tracking-wide whitespace-nowrap">
                            {formatStatName(row.name)}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-foreground">{row.rightValue}</div>
                            <div className="h-2 mt-1 bg-secondary rounded-full overflow-hidden">
                              <div className="h-full bg-accent rounded-full" style={{ width: `${row.rightPercent}%` }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
                  Selecione dois Pokémon para comparar os atributos lado a lado.
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ComparePicker({
  label,
  placeholder,
  search,
  setSearch,
  filteredPokemon,
  selectedPokemon,
  onSelect,
  onEnterSearch,
}: {
  label: string;
  placeholder: string;
  search: string;
  setSearch: (value: string) => void;
  filteredPokemon: Pokemon[];
  selectedPokemon: Pokemon | null;
  onSelect: (pokemon: Pokemon) => void;
  onEnterSearch: () => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onEnterSearch()}
          className="w-full py-3 pl-10 pr-4 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
        />
        {filteredPokemon.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl overflow-hidden z-10">
            {filteredPokemon.map((poke) => (
              <button
                key={poke.id}
                onClick={() => onSelect(poke)}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-secondary/50 transition-colors text-left"
              >
                <Image
                  src={poke.sprites.front_default}
                  alt={poke.name}
                  width={32}
                  height={32}
                />
                <span className="capitalize text-foreground">{poke.name}</span>
                <span className="text-sm text-muted-foreground">{formatPokemonId(poke.id)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedPokemon ? (
        <CompactPokemonCard pokemon={selectedPokemon} />
      ) : (
        <div className="rounded-xl bg-secondary/20 border border-dashed border-border p-5 text-center text-sm text-muted-foreground">
          Nenhum Pokémon selecionado.
        </div>
      )}
    </div>
  );
}

function CompactPokemonCard({ pokemon }: { pokemon: Pokemon }) {
  const primaryType = pokemon.types[0]?.type.name || 'normal';
  const typeColors = TYPE_COLORS[primaryType] || TYPE_COLORS.normal;
  const imageSrc = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;

  return (
    <div className="rounded-xl border border-border bg-secondary/20 p-4">
      <div className="flex items-center gap-3">
        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-secondary/60 shrink-0">
          <div className={`absolute inset-0 ${typeColors.bg} opacity-40`} />
          <Image
            src={imageSrc}
            alt={pokemon.name}
            fill
            className="object-contain p-1"
          />
        </div>
        <div className="min-w-0">
          <div className="text-xs text-muted-foreground font-mono">{formatPokemonId(pokemon.id)}</div>
          <div className="font-semibold text-foreground capitalize truncate">{pokemon.name}</div>
          <div className="flex gap-1 mt-1">
            {pokemon.types.map(({ type }) => {
              const colors = TYPE_COLORS[type.name] || TYPE_COLORS.normal;
              return (
                <span
                  key={type.name}
                  className={`px-2 py-0.5 text-[11px] font-medium rounded-full capitalize ${colors.bg} ${colors.text}`}
                >
                  {formatTypeName(type.name)}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function CompareHeader({
  pokemon,
  isWinner,
  total,
  align,
}: {
  pokemon: Pokemon;
  isWinner: boolean;
  total: number;
  align: 'left' | 'right';
}) {
  const imageSrc = pokemon.sprites.front_default || pokemon.sprites.other['official-artwork'].front_default;

  return (
    <div className={`flex items-center gap-2 ${align === 'right' ? 'justify-end text-right' : ''}`}>
      {align === 'right' ? null : (
        <Image
          src={imageSrc}
          alt={pokemon.name}
          width={36}
          height={36}
          className="rounded-lg bg-secondary/50 p-1"
        />
      )}
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground font-mono">{formatPokemonId(pokemon.id)}</div>
        <div className="text-sm md:text-base font-semibold text-foreground capitalize truncate">{pokemon.name}</div>
        <div className={`text-xs md:text-sm font-semibold ${isWinner ? 'text-yellow-400' : 'text-muted-foreground'}`}>
          Total: {total}
        </div>
      </div>
      {align === 'right' ? (
        <Image
          src={imageSrc}
          alt={pokemon.name}
          width={36}
          height={36}
          className="rounded-lg bg-secondary/50 p-1"
        />
      ) : null}
    </div>
  );
}
