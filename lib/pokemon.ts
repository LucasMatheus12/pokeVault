export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
      dream_world: {
        front_default: string;
      };
    };
  };
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  height: number;
  weight: number;
  abilities: {
    ability: {
      name: string;
    };
    is_hidden: boolean;
  }[];
}

export interface PokemonSpecies {
  evolution_chain: {
    url: string;
  };
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
    };
  }[];
  genera: {
    genus: string;
    language: {
      name: string;
    };
  }[];
  is_legendary: boolean;
  is_mythical: boolean;
}

export interface EvolutionChain {
  chain: EvolutionNode;
}

export interface EvolutionNode {
  species: {
    name: string;
    url: string;
  };
  evolves_to: EvolutionNode[];
}

export const TYPE_COLORS: Record<string, { bg: string; glow: string; text: string }> = {
  fire: { bg: 'bg-orange-500/20', glow: 'shadow-orange-500/30', text: 'text-orange-400' },
  water: { bg: 'bg-blue-500/20', glow: 'shadow-blue-500/30', text: 'text-blue-400' },
  grass: { bg: 'bg-green-500/20', glow: 'shadow-green-500/30', text: 'text-green-400' },
  electric: { bg: 'bg-yellow-400/20', glow: 'shadow-yellow-400/30', text: 'text-yellow-400' },
  psychic: { bg: 'bg-pink-500/20', glow: 'shadow-pink-500/30', text: 'text-pink-400' },
  ice: { bg: 'bg-cyan-400/20', glow: 'shadow-cyan-400/30', text: 'text-cyan-400' },
  dragon: { bg: 'bg-indigo-500/20', glow: 'shadow-indigo-500/30', text: 'text-indigo-400' },
  dark: { bg: 'bg-stone-600/20', glow: 'shadow-stone-600/30', text: 'text-stone-400' },
  fairy: { bg: 'bg-pink-300/20', glow: 'shadow-pink-300/30', text: 'text-pink-300' },
  fighting: { bg: 'bg-red-600/20', glow: 'shadow-red-600/30', text: 'text-red-500' },
  flying: { bg: 'bg-violet-400/20', glow: 'shadow-violet-400/30', text: 'text-violet-400' },
  poison: { bg: 'bg-purple-500/20', glow: 'shadow-purple-500/30', text: 'text-purple-400' },
  ground: { bg: 'bg-amber-600/20', glow: 'shadow-amber-600/30', text: 'text-amber-500' },
  rock: { bg: 'bg-amber-700/20', glow: 'shadow-amber-700/30', text: 'text-amber-600' },
  bug: { bg: 'bg-lime-500/20', glow: 'shadow-lime-500/30', text: 'text-lime-400' },
  ghost: { bg: 'bg-purple-600/20', glow: 'shadow-purple-600/30', text: 'text-purple-500' },
  steel: { bg: 'bg-slate-400/20', glow: 'shadow-slate-400/30', text: 'text-slate-400' },
  normal: { bg: 'bg-gray-400/20', glow: 'shadow-gray-400/30', text: 'text-gray-400' },
};

export const GENERATIONS = [
  { id: 1, name: 'Geração I', range: [1, 151] },
  { id: 2, name: 'Geração II', range: [152, 251] },
  { id: 3, name: 'Geração III', range: [252, 386] },
  { id: 4, name: 'Geração IV', range: [387, 493] },
  { id: 5, name: 'Geração V', range: [494, 649] },
  { id: 6, name: 'Geração VI', range: [650, 721] },
  { id: 7, name: 'Geração VII', range: [722, 809] },
  { id: 8, name: 'Geração VIII', range: [810, 905] },
  { id: 9, name: 'Geração IX', range: [906, 1025] },
];

export const TYPES = [
  'fire', 'water', 'grass', 'electric', 'psychic', 'ice', 'dragon', 'dark',
  'fairy', 'fighting', 'flying', 'poison', 'ground', 'rock', 'bug', 'ghost', 'steel', 'normal'
];

export const LEGENDARY_IDS = [
  144, 145, 146, 150, 151, 243, 244, 245, 249, 250, 251, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386,
  480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493, 494, 638, 639, 640, 641, 642, 643,
  644, 645, 646, 647, 648, 649, 716, 717, 718, 719, 720, 721, 785, 786, 787, 788, 789, 790, 791, 792, 800,
  801, 802, 807, 808, 809, 888, 889, 890, 891, 892, 893, 894, 895, 896, 897, 898
];

export async function fetchPokemon(id: number): Promise<Pokemon> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!res.ok) throw new Error('Failed to fetch pokemon');
  return res.json();
}

export async function fetchPokemonByName(name: string): Promise<Pokemon> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
  if (!res.ok) throw new Error('Failed to fetch pokemon');
  return res.json();
}

export async function fetchPokemonSpecies(id: number): Promise<PokemonSpecies> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
  if (!res.ok) throw new Error('Failed to fetch species');
  return res.json();
}

export async function fetchEvolutionChain(url: string): Promise<EvolutionChain> {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch evolution chain');
  return res.json();
}

export function formatPokemonId(id: number): string {
  return `#${id.toString().padStart(4, '0')}`;
}

export function formatStatName(stat: string): string {
  const statNames: Record<string, string> = {
    hp: 'HP',
    attack: 'ATK',
    defense: 'DEF',
    'special-attack': 'SP.ATK',
    'special-defense': 'SP.DEF',
    speed: 'SPD',
  };
  return statNames[stat] || stat.toUpperCase();
}

export function formatTypeName(type: string): string {
  const typeNames: Record<string, string> = {
    fire: 'Fogo',
    water: 'Água',
    grass: 'Planta',
    electric: 'Elétrico',
    psychic: 'Psíquico',
    ice: 'Gelo',
    dragon: 'Dragão',
    dark: 'Sombrio',
    fairy: 'Fada',
    fighting: 'Lutador',
    flying: 'Voador',
    poison: 'Venenoso',
    ground: 'Terrestre',
    rock: 'Pedra',
    bug: 'Inseto',
    ghost: 'Fantasma',
    steel: 'Aço',
    normal: 'Normal',
  };

  return typeNames[type] || type;
}

export function calculateTotalStats(stats: Pokemon['stats']): number {
  return stats.reduce((total, stat) => total + stat.base_stat, 0);
}
