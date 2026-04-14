'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { TYPES, GENERATIONS, TYPE_COLORS, formatTypeName } from '@/lib/pokemon';

export type SortOption = 'id' | 'name' | 'stats' | 'id-desc';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTypes: string[];
  onTypeChange: (types: string[]) => void;
  selectedGeneration: number | null;
  onGenerationChange: (gen: number | null) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedTypes,
  onTypeChange,
  selectedGeneration,
  onGenerationChange,
  sortBy,
  onSortChange,
}: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      onTypeChange(selectedTypes.filter((t) => t !== type));
    } else {
      onTypeChange([...selectedTypes, type]);
    }
  };

  const clearAllFilters = () => {
    onSearchChange('');
    onTypeChange([]);
    onGenerationChange(null);
    onSortChange('id');
  };

  const hasActiveFilters = searchQuery || selectedTypes.length > 0 || selectedGeneration !== null || sortBy !== 'id';

  return (
    <div className="sticky top-0 z-40 py-4">
      <div className="glass-strong rounded-2xl p-4">
        {/* Main filter row */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar Pokémon..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full py-3 pl-12 pr-4 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="appearance-none w-full md:w-48 py-3 pl-4 pr-10 bg-secondary/50 border border-border rounded-xl text-foreground focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
            >
              <option value="id">Ordenar por Número ↑</option>
              <option value="id-desc">Ordenar por Número ↓</option>
              <option value="name">Ordenar por Nome</option>
              <option value="stats">Ordenar por Total de Stats</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>

          {/* Filter toggle button */}
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
              showFilters || hasActiveFilters
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary/50 border border-border text-foreground hover:bg-secondary'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
            {hasActiveFilters && (
              <span className="w-5 h-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center">
                {selectedTypes.length + (selectedGeneration ? 1 : 0)}
              </span>
            )}
          </motion.button>
        </div>

        {/* Expanded filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-6 space-y-6">
                {/* Types */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Tipos</h4>
                  <div className="flex flex-wrap gap-2">
                    {TYPES.map((type) => {
                      const isSelected = selectedTypes.includes(type);
                      const colors = TYPE_COLORS[type] || TYPE_COLORS.normal;
                      return (
                        <motion.button
                          key={type}
                          onClick={() => toggleType(type)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
                            isSelected
                              ? `${colors.bg} ${colors.text} border-2 border-current`
                              : 'bg-secondary/50 text-muted-foreground border border-border hover:border-primary/30'
                          }`}
                        >
                          {formatTypeName(type)}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Generations */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Geração</h4>
                  <div className="flex flex-wrap gap-2">
                    {GENERATIONS.map((gen) => (
                      <motion.button
                        key={gen.id}
                        onClick={() => onGenerationChange(selectedGeneration === gen.id ? null : gen.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedGeneration === gen.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary/50 text-muted-foreground border border-border hover:border-primary/30'
                        }`}
                      >
                        Geração {gen.id}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Clear all */}
                {hasActiveFilters && (
                  <motion.button
                    onClick={clearAllFilters}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Limpar todos os filtros
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
