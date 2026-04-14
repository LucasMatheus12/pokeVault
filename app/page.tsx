'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useSWR from 'swr';
import { Pokemon, GENERATIONS, LEGENDARY_IDS, fetchPokemon, calculateTotalStats } from '@/lib/pokemon';
import { HeroSection } from '@/components/hero-section';
import { PokemonCard, PokemonCardSkeleton } from '@/components/pokemon-card';
import { FilterBar, SortOption } from '@/components/filter-bar';
import { PokemonModal } from '@/components/pokemon-modal';
import { FeaturedSection } from '@/components/featured-section';
import { TypeShowcase } from '@/components/type-showcase';
import { PokemonComparator } from '@/components/pokemon-comparator';
import { StatsRanking } from '@/components/stats-ranking';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { LoadingScreen } from '@/components/loading-screen';

const POKEMON_PER_PAGE = 40;
const INITIAL_POKEMON_COUNT = 1025; // All Pokemon from current API generations

const fetcher = async (ids: number[]): Promise<Pokemon[]> => {
  const promises = ids.map(id => fetchPokemon(id));
  const results = await Promise.allSettled(promises);
  return results
    .filter((result): result is PromiseFulfilledResult<Pokemon> => result.status === 'fulfilled')
    .map(result => result.value);
};

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedGeneration, setSelectedGeneration] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('id');
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isComparatorOpen, setIsComparatorOpen] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [displayCount, setDisplayCount] = useState(POKEMON_PER_PAGE);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  const catalogRef = useRef<HTMLDivElement>(null);

  // Generate IDs to fetch
  const pokemonIds = useMemo(() => {
    return Array.from({ length: INITIAL_POKEMON_COUNT }, (_, i) => i + 1);
  }, []);

  // Fetch all pokemon
  const { data: allPokemon = [], isLoading } = useSWR(
    ['pokemon', pokemonIds],
    () => fetcher(pokemonIds),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  // Simulate initial loading
  useEffect(() => {
    if (allPokemon.length > 0) {
      const timer = setTimeout(() => {
        setIsInitialLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [allPokemon]);

  // Load favorites from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('pokevault-favorites');
    if (stored) {
      setFavorites(new Set(JSON.parse(stored)));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('pokevault-favorites', JSON.stringify([...favorites]));
  }, [favorites]);

  // Filter and sort pokemon
  const filteredPokemon = useMemo(() => {
    let result = [...allPokemon];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.id.toString().includes(query)
      );
    }

    // Type filter
    if (selectedTypes.length > 0) {
      result = result.filter(p => 
        p.types.some(t => selectedTypes.includes(t.type.name))
      );
    }

    // Generation filter
    if (selectedGeneration) {
      const gen = GENERATIONS.find(g => g.id === selectedGeneration);
      if (gen) {
        result = result.filter(p => p.id >= gen.range[0] && p.id <= gen.range[1]);
      }
    }

    // Favorites filter
    if (showOnlyFavorites) {
      result = result.filter(p => favorites.has(p.id));
    }

    // Sort
    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'stats':
        result.sort((a, b) => calculateTotalStats(b.stats) - calculateTotalStats(a.stats));
        break;
      case 'id-desc':
        result.sort((a, b) => b.id - a.id);
        break;
      default:
        result.sort((a, b) => a.id - b.id);
    }

    return result;
  }, [allPokemon, searchQuery, selectedTypes, selectedGeneration, sortBy, showOnlyFavorites, favorites]);

  // Get pokemon to display
  const displayedPokemon = filteredPokemon.slice(0, displayCount);

  // Get featured pokemon
  const legendaryPokemon = useMemo(() => 
    allPokemon.filter(p => LEGENDARY_IDS.includes(p.id)).slice(0, 5),
    [allPokemon]
  );

  const featuredPokemon = useMemo(() => {
    const popularIds = [25, 6, 150, 149, 94, 143, 131, 9, 3, 130, 65, 59];
    return allPokemon.filter(p => popularIds.includes(p.id));
  }, [allPokemon]);

  // Get pokemon by type for showcase
  const pokemonByType = useMemo(() => {
    const byType: Record<string, Pokemon[]> = {};
    allPokemon.forEach(p => {
      p.types.forEach(({ type }) => {
        if (!byType[type.name]) byType[type.name] = [];
        byType[type.name].push(p);
      });
    });
    return byType;
  }, [allPokemon]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setDisplayCount(POKEMON_PER_PAGE);
    if (query && catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleSelectPokemon = useCallback((pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
    setIsModalOpen(true);
  }, []);

  const toggleFavorite = useCallback((pokemonId: number) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(pokemonId)) {
        next.delete(pokemonId);
      } else {
        next.add(pokemonId);
      }
      return next;
    });
  }, []);

  const loadMore = useCallback(() => {
    setDisplayCount(prev => prev + POKEMON_PER_PAGE);
  }, []);

  const scrollToCatalog = useCallback(() => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const showFavoritesView = useCallback(() => {
    setShowOnlyFavorites(true);
    setDisplayCount(POKEMON_PER_PAGE);
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const showAllPokemonView = useCallback(() => {
    setShowOnlyFavorites(false);
    setDisplayCount(POKEMON_PER_PAGE);
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  if (isInitialLoading) {
    return <LoadingScreen />;
  }

  return (
    <main className="min-h-screen">
      <Navbar 
        onOpenComparator={() => setIsComparatorOpen(true)} 
        favoriteCount={favorites.size}
        showOnlyFavorites={showOnlyFavorites}
        onShowFavorites={showFavoritesView}
        onShowAllPokemon={showAllPokemonView}
      />

      {/* Hero Section */}
      <HeroSection onSearch={handleSearch} onScrollToCatalog={scrollToCatalog} />

      {/* Featured Section */}
      {legendaryPokemon.length > 0 && featuredPokemon.length > 0 && (
        <FeaturedSection 
          legendaryPokemon={legendaryPokemon}
          featuredPokemon={featuredPokemon}
          onSelectPokemon={handleSelectPokemon}
        />
      )}

      {/* Type Showcase */}
      {Object.keys(pokemonByType).length > 0 && (
        <TypeShowcase 
          pokemonByType={pokemonByType}
          onSelectPokemon={handleSelectPokemon}
        />
      )}

      {/* Stats Ranking */}
      {allPokemon.length > 0 && (
        <StatsRanking 
          allPokemon={allPokemon}
          onSelectPokemon={handleSelectPokemon}
        />
      )}

      {/* Main Catalog */}
      <section ref={catalogRef} className="py-20 px-6 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Pokédex Completa
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Navegue por toda a coleção de Pokémon. Use os filtros para encontrar seus favoritos.
            </p>
          </motion.div>

          {/* Filters */}
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedTypes={selectedTypes}
            onTypeChange={setSelectedTypes}
            selectedGeneration={selectedGeneration}
            onGenerationChange={setSelectedGeneration}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {/* Results count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 mb-8 text-sm text-muted-foreground"
          >
            {showOnlyFavorites ? 'Favoritos: ' : 'Mostrando '}
            {displayedPokemon.length} de {filteredPokemon.length} Pokémon
          </motion.div>

          {/* Pokemon Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {[...Array(20)].map((_, i) => (
                <PokemonCardSkeleton key={i} index={i} />
              ))}
            </div>
          ) : filteredPokemon.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary/50 flex items-center justify-center">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Nenhum Pokémon encontrado</h3>
              <p className="text-muted-foreground">Tente ajustar sua busca ou os filtros</p>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                <AnimatePresence mode="popLayout">
                  {displayedPokemon.map((pokemon, index) => (
                    <PokemonCard
                      key={pokemon.id}
                      pokemon={pokemon}
                      onClick={() => handleSelectPokemon(pokemon)}
                      index={index}
                      isFavorite={favorites.has(pokemon.id)}
                      onToggleFavorite={() => toggleFavorite(pokemon.id)}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Load more button */}
              {displayCount < filteredPokemon.length && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center mt-12"
                >
                  <motion.button
                    onClick={loadMore}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
                  >
                    Carregar mais ({filteredPokemon.length - displayCount} restantes)
                  </motion.button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Pokemon Detail Modal */}
      <PokemonModal
        pokemon={selectedPokemon}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectPokemon={handleSelectPokemon}
        isFavorite={selectedPokemon ? favorites.has(selectedPokemon.id) : false}
        onToggleFavorite={toggleFavorite}
      />

      {/* Comparator Modal */}
      <PokemonComparator
        isOpen={isComparatorOpen}
        onClose={() => setIsComparatorOpen(false)}
        allPokemon={allPokemon}
      />
    </main>
  );
}
