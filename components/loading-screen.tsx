'use client';

import { motion } from 'framer-motion';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="text-center">
        {/* Pokeball animation */}
        <motion.div
          className="relative w-24 h-24 mx-auto mb-8"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        >
          {/* Top half */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-red-500 to-red-600 rounded-t-full" />
          {/* Bottom half */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-gray-200 to-gray-100 rounded-b-full" />
          {/* Center line */}
          <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-800 -translate-y-1/2" />
          {/* Center button */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gray-100 rounded-full border-4 border-gray-800">
            <motion.div
              className="absolute inset-1 rounded-full bg-white"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Loading text */}
        <motion.h2
          className="text-2xl font-bold text-foreground mb-2"
          style={{ fontFamily: 'var(--font-heading)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Carregando PokéVault
        </motion.h2>
        <motion.p
          className="text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Capturando todos os Pokémon...
        </motion.p>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
