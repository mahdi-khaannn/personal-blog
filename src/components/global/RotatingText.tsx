import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const phrases = [
  "Agentic Systems",
  "AI Strategy",
  "Digital Governance"
];

export default function RotatingText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, 4000); // Relaxed transitions
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="relative inline-flex w-full min-w-0 items-center justify-center px-4 py-3 sm:min-w-[360px] sm:px-9 sm:py-4 lg:min-w-[430px]">
      <span className="pointer-events-none absolute left-0 top-0 h-3.5 w-3.5 border-l border-t border-primary-500/85 sm:h-4 sm:w-4" />
      <span className="pointer-events-none absolute right-0 top-0 h-3.5 w-3.5 border-r border-t border-primary-500/85 sm:h-4 sm:w-4" />
      <span className="pointer-events-none absolute bottom-0 left-0 h-3.5 w-3.5 border-b border-l border-primary-500/85 sm:h-4 sm:w-4" />
      <span className="pointer-events-none absolute bottom-0 right-0 h-3.5 w-3.5 border-b border-r border-primary-500/85 sm:h-4 sm:w-4" />
      <span className="pointer-events-none absolute inset-x-5 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-primary-500/15 to-transparent" />
      <span className="inline-flex min-h-[1.35em] items-center justify-center overflow-hidden align-top text-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -18, opacity: 0 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
            className="block text-balance text-[clamp(2.3rem,10vw,3.2rem)] font-semibold tracking-[-0.04em] text-primary-500 sm:text-5xl lg:text-6xl"
          >
            {phrases[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}
