"use client";

import { motion } from "framer-motion";

const blocks = [
  { x: "8%", y: "15%", size: 44, color: "var(--accent-1)", delay: 0, dur: 6 },
  { x: "85%", y: "10%", size: 32, color: "var(--accent-2)", delay: 1.2, dur: 7 },
  { x: "75%", y: "55%", size: 52, color: "var(--accent-3)", delay: 0.5, dur: 8 },
  { x: "12%", y: "65%", size: 28, color: "var(--accent-2)", delay: 2, dur: 5.5 },
  { x: "50%", y: "8%", size: 36, color: "var(--accent-1)", delay: 0.8, dur: 6.5 },
  { x: "92%", y: "40%", size: 24, color: "var(--accent-3)", delay: 1.5, dur: 7.5 },
  { x: "30%", y: "75%", size: 40, color: "var(--accent-1)", delay: 0.3, dur: 5 },
  { x: "65%", y: "80%", size: 30, color: "var(--accent-2)", delay: 2.5, dur: 6 },
];

export function FloatingBlocks() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {blocks.map((b, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: b.x, top: b.y }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: b.delay + 0.5, duration: 0.8 }}
        >
          <motion.div
            animate={{
              y: [0, -18, 0],
              rotateX: [0, 15, 0],
              rotateY: [0, 360],
              rotateZ: [0, 8, -8, 0],
            }}
            transition={{
              duration: b.dur,
              repeat: Infinity,
              ease: "easeInOut",
              rotateY: { duration: b.dur * 3, repeat: Infinity, ease: "linear" },
            }}
            style={{
              width: b.size,
              height: b.size,
              perspective: 200,
              transformStyle: "preserve-3d",
            }}
          >
            <div
              className="relative h-full w-full rounded-lg"
              style={{
                transformStyle: "preserve-3d",
                transform: "rotateX(20deg) rotateY(30deg)",
              }}
            >
              {/* Front */}
              <div
                className="absolute inset-0 rounded-lg border"
                style={{
                  backgroundColor: `color-mix(in srgb, ${b.color} 15%, transparent)`,
                  borderColor: `color-mix(in srgb, ${b.color} 40%, transparent)`,
                  transform: `translateZ(${b.size / 2}px)`,
                  backdropFilter: "blur(4px)",
                }}
              />
              {/* Back */}
              <div
                className="absolute inset-0 rounded-lg border"
                style={{
                  backgroundColor: `color-mix(in srgb, ${b.color} 10%, transparent)`,
                  borderColor: `color-mix(in srgb, ${b.color} 25%, transparent)`,
                  transform: `translateZ(-${b.size / 2}px) rotateY(180deg)`,
                }}
              />
              {/* Top */}
              <div
                className="absolute inset-0 rounded-lg border"
                style={{
                  backgroundColor: `color-mix(in srgb, ${b.color} 20%, transparent)`,
                  borderColor: `color-mix(in srgb, ${b.color} 35%, transparent)`,
                  transform: `rotateX(90deg) translateZ(${b.size / 2}px)`,
                }}
              />
              {/* Right */}
              <div
                className="absolute inset-0 rounded-lg border"
                style={{
                  backgroundColor: `color-mix(in srgb, ${b.color} 12%, transparent)`,
                  borderColor: `color-mix(in srgb, ${b.color} 30%, transparent)`,
                  transform: `rotateY(90deg) translateZ(${b.size / 2}px)`,
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
