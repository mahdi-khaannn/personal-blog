import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const phrases = [
  "Agentic Systems",
  "Human-First AI Strategy",
  "Autonomous Orchestration"
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
    <span className="inline-flex items-center justify-center gap-2 relative w-full -mb-[0.5em] font-sans tracking-tight">
      <span className="inline-flex flex-col overflow-visible h-[1.5em] align-top relative w-[300px] sm:w-[500px] justify-center text-center">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="text-[#00ff94] font-semibold"
          >
            {phrases[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}
