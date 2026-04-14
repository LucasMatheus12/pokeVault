'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ChevronRight, Ruler, Weight, Sparkles, Zap, Shield, Heart, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { 
  Pokemon, 
  PokemonSpecies, 
  EvolutionChain, 
  EvolutionNode,
  TYPE_COLORS, 
  formatPokemonId, 
  formatStatName,
  formatTypeName,
  fetchPokemonSpecies,
  fetchEvolutionChain,
  fetchPokemonByName,
  calculateTotalStats
} from '@/lib/pokemon';
import { translateToPortuguese } from '@/lib/translation';

interface PokemonModalProps {
  pokemon: Pokemon | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectPokemon: (pokemon: Pokemon) => void;
  isFavorite: boolean;
  onToggleFavorite: (pokemonId: number) => void;
}

interface EvolutionPokemon {
  name: string;
  id: number;
  image: string;
}

export function PokemonModal({
  pokemon,
  isOpen,
  onClose,
  onSelectPokemon,
  isFavorite,
  onToggleFavorite,
}: PokemonModalProps) {
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [evolutions, setEvolutions] = useState<EvolutionPokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [translatedFlavorText, setTranslatedFlavorText] = useState('');
  const [translatedGenus, setTranslatedGenus] = useState('');
  const [translatedAbilities, setTranslatedAbilities] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!pokemon) return;

    const loadDetails = async () => {
      setLoading(true);
      try {
        const speciesData = await fetchPokemonSpecies(pokemon.id);
        setSpecies(speciesData);

        // Load evolution chain
        const evolutionData = await fetchEvolutionChain(speciesData.evolution_chain.url);
        const evolutionList = await getEvolutionList(evolutionData.chain);
        setEvolutions(evolutionList);
      } catch (error) {
        console.error('[v0] Error loading pokemon details:', error);
      }
      setLoading(false);
    };

    loadDetails();
  }, [pokemon]);

  const getEvolutionList = async (chain: EvolutionNode): Promise<EvolutionPokemon[]> => {
    const evolutions: EvolutionPokemon[] = [];
    
    const traverse = async (node: EvolutionNode) => {
      try {
        const poke = await fetchPokemonByName(node.species.name);
        evolutions.push({
          name: node.species.name,
          id: poke.id,
          image: poke.sprites.other['official-artwork'].front_default || poke.sprites.front_default,
        });
        
        for (const evo of node.evolves_to) {
          await traverse(evo);
        }
      } catch (error) {
        console.error('[v0] Error fetching evolution:', error);
      }
    };
    
    await traverse(chain);
    return evolutions;
  };

  const handleEvolutionClick = async (name: string) => {
    try {
      const poke = await fetchPokemonByName(name);
      onSelectPokemon(poke);
    } catch (error) {
      console.error('[v0] Error selecting evolution:', error);
    }
  };

  const flavorText = species?.flavor_text_entries
    .find(entry => entry.language.name === 'pt' || entry.language.name === 'pt-BR')
    ?.flavor_text.replace(/\f/g, ' ') ||
    species?.flavor_text_entries.find(entry => entry.language.name === 'en')?.flavor_text.replace(/\f/g, ' ') ||
    '';

  const genus = species?.genera
    .find(g => g.language.name === 'pt' || g.language.name === 'pt-BR')
    ?.genus ||
    species?.genera.find(g => g.language.name === 'en')?.genus ||
    '';

  useEffect(() => {
    let isCancelled = false;

    const translateModalTexts = async () => {
      if (!pokemon) return;

      const nextAbilities: Record<string, string> = {};

      const [translatedDescription, translatedCategory, ...translatedAbilityValues] = await Promise.all([
        flavorText ? translateToPortuguese(flavorText) : Promise.resolve(''),
        genus ? translateToPortuguese(genus) : Promise.resolve(''),
        ...pokemon.abilities.map(({ ability }) =>
          translateToPortuguese(ability.name.replace(/-/g, ' '))
        ),
      ]);

      pokemon.abilities.forEach(({ ability }, index) => {
        nextAbilities[ability.name] = translatedAbilityValues[index] || ability.name.replace(/-/g, ' ');
      });

      if (!isCancelled) {
        setTranslatedFlavorText(translatedDescription);
        setTranslatedGenus(translatedCategory);
        setTranslatedAbilities(nextAbilities);
      }
    };

    translateModalTexts();

    return () => {
      isCancelled = true;
    };
  }, [pokemon, flavorText, genus]);

  if (!pokemon) return null;

  const primaryType = pokemon.types[0]?.type.name || 'normal';
  const typeColors = TYPE_COLORS[primaryType] || TYPE_COLORS.normal;
  const totalStats = calculateTotalStats(pokemon.stats);
  
  const imageUrl = pokemon.sprites.other['official-artwork'].front_default || 
                   pokemon.sprites.other.dream_world.front_default ||
                   pokemon.sprites.front_default;

  const statIcons: Record<string, React.ReactNode> = {
    hp: <Heart className="w-4 h-4" />,
    attack: <Zap className="w-4 h-4" />,
    defense: <Shield className="w-4 h-4" />,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 cursor-pointer"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl max-h-[92vh] md:max-h-[90vh] z-50 overflow-y-auto no-scrollbar"
          >
            <div className="glass-strong rounded-3xl">
              {/* Close button */}
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-secondary/80 text-foreground hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>

              <div className="grid md:grid-cols-2 gap-0">
                {/* Left side - Image */}
                <div className="relative p-8 md:p-12">
                  {/* Background glow */}
                  <div className={`absolute inset-0 ${typeColors.bg} opacity-30 blur-3xl`} />
                  
                  {/* Legendary badge */}
                  {species?.is_legendary && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="absolute top-8 left-8 flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm font-medium">Lendário</span>
                    </motion.div>
                  )}

                  {species?.is_mythical && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="absolute top-8 left-8 flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm font-medium">Mítico</span>
                    </motion.div>
                  )}

                  <motion.div
                    className="relative aspect-square"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Image
                      src={imageUrl}
                      alt={pokemon.name}
                      fill
                      className="object-contain drop-shadow-2xl"
                      priority
                    />
                  </motion.div>
                </div>

                {/* Right side - Info */}
                <div className="p-8 md:p-12 bg-secondary/30">
                  {/* Header */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <span className="text-sm font-mono text-muted-foreground">{formatPokemonId(pokemon.id)}</span>
                    <h2 className="text-3xl md:text-4xl font-bold capitalize text-foreground mt-1" style={{ fontFamily: 'var(--font-heading)' }}>
                      {pokemon.name.replace(/-/g, ' ')}
                    </h2>
                    {translatedGenus && <p className="text-muted-foreground mt-1">{translatedGenus}</p>}
                  <motion.button
                    onClick={() => onToggleFavorite(pokemon.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      isFavorite
                        ? 'bg-yellow-400/15 border-yellow-400/40 text-yellow-300'
                        : 'bg-secondary/50 border-border text-foreground hover:bg-secondary'
                    }`}
                  >
                    <Star className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
                    {isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                  </motion.button>
                  </motion.div>

                  {/* Types */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex gap-2 mt-4"
                  >
                    {pokemon.types.map(({ type }) => {
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
                  </motion.div>

                  {/* Description */}
                  {translatedFlavorText && (
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mt-6 text-muted-foreground leading-relaxed"
                    >
                      {translatedFlavorText}
                    </motion.p>
                  )}

                  {/* Physical stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="flex gap-6 mt-6"
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-secondary/50">
                        <Ruler className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Altura</div>
                        <div className="font-medium text-foreground">{(pokemon.height / 10).toFixed(1)}m</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-secondary/50">
                        <Weight className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Peso</div>
                        <div className="font-medium text-foreground">{(pokemon.weight / 10).toFixed(1)}kg</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Abilities */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6"
                  >
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Habilidades</h4>
                    <div className="flex flex-wrap gap-2">
                      {pokemon.abilities.map(({ ability, is_hidden }) => (
                        <span
                          key={ability.name}
                          className={`px-3 py-1.5 text-sm rounded-lg capitalize ${
                            is_hidden 
                              ? 'bg-primary/20 text-primary border border-primary/30' 
                              : 'bg-secondary/50 text-foreground border border-border'
                          }`}
                        >
                          {translatedAbilities[ability.name] || ability.name.replace(/-/g, ' ')}
                          {is_hidden && <span className="ml-1 text-xs opacity-70">(Oculta)</span>}
                        </span>
                      ))}
                    </div>
                  </motion.div>

                  {/* Stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="mt-6"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-muted-foreground">Atributos base</h4>
                      <span className="text-sm font-medium text-primary">Total de atributos: {totalStats}</span>
                    </div>
                    <div className="space-y-3">
                      {pokemon.stats.map((stat, index) => (
                        <motion.div
                          key={stat.stat.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.05 }}
                        >
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="flex items-center gap-2 text-muted-foreground">
                              {statIcons[stat.stat.name]}
                              {formatStatName(stat.stat.name)}
                            </span>
                            <span className="font-medium text-foreground">{stat.base_stat}</span>
                          </div>
                          <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(100, (stat.base_stat / 255) * 100)}%` }}
                              transition={{ delay: 0.5 + index * 0.05, duration: 0.6, ease: 'easeOut' }}
                              className={`h-full rounded-full ${
                                stat.base_stat >= 100 
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-400' 
                                  : stat.base_stat >= 70 
                                    ? 'bg-gradient-to-r from-primary to-primary/80' 
                                    : 'bg-gradient-to-r from-orange-500 to-amber-400'
                              }`}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Evolution chain */}
                  {evolutions.length > 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mt-8"
                    >
                      <h4 className="text-sm font-medium text-muted-foreground mb-4">Linha evolutiva</h4>
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        {evolutions.map((evo, index) => (
                          <div key={evo.name} className="flex items-center gap-2">
                            <motion.button
                              onClick={() => handleEvolutionClick(evo.name)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className={`relative p-3 rounded-xl transition-all ${
                                evo.id === pokemon.id
                                  ? 'bg-primary/20 border-2 border-primary'
                                  : 'bg-secondary/50 border border-border hover:border-primary/50'
                              }`}
                            >
                              <div className="relative w-16 h-16">
                                <Image
                                  src={evo.image}
                                  alt={evo.name}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <span className="text-xs text-center block mt-1 capitalize text-muted-foreground">
                                {evo.name}
                              </span>
                            </motion.button>
                            {index < evolutions.length - 1 && (
                              <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
