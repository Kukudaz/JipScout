import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface Props {
  text: string;
  className?: string;
  subtext?: string;
}

export const ScrollLitText = ({ text, className, subtext }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Opacity transform: 0.2 when far away, 1 when in center
  const opacity = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0.3, 1, 0.3]);
  const y = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [20, 0, -20]);

  return (
    <div ref={containerRef} className="py-24 md:py-48 flex flex-col items-center justify-center">
      <motion.h2
        style={{ opacity, y }}
        className={`text-4xl md:text-8xl font-black text-center leading-tight tracking-tight ${className}`}
      >
        {text}
      </motion.h2>
      {subtext && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          viewport={{ once: false }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-8 text-xl md:text-2xl text-[var(--text-sub)] text-center max-w-2xl px-6"
        >
          {subtext}
        </motion.p>
      )}
    </div>
  );
};
