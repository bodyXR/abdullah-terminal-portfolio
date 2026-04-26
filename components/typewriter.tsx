'use client';

import { motion } from 'framer-motion';

interface TypewriterProps {
  text: string;
  delay?: number;
  speed?: number;
}

export function Typewriter({ text, delay = 0, speed = 0.02 }: TypewriterProps) {
  const characters = text.split('');

  return (
    <div className="inline">
      {characters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: delay + index * speed,
            duration: 0.01,
          }}
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
}
