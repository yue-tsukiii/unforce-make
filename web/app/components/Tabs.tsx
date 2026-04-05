"use client";

import { motion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type TabItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
};

type Props = {
  items: TabItem[];
  defaultId?: string;
  className?: string;
};

export function Tabs({ items, defaultId, className }: Props) {
  const [active, setActive] = useState(defaultId ?? items[0]?.id);
  const current = items.find((i) => i.id === active) ?? items[0];

  return (
    <div className={cn("w-full", className)}>
      <div
        role="tablist"
        aria-label="View modes"
        className="mx-auto flex w-fit items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1.5 backdrop-blur-xl"
      >
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(item.id)}
              className={cn(
                "relative rounded-full px-5 py-2.5 font-display text-sm font-medium tracking-wide transition-colors duration-300",
                isActive ? "text-black" : "text-white/60 hover:text-white"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-full"
                  transition={{ type: "spring", stiffness: 340, damping: 30 }}
                  style={{
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #c6b9ff 55%, #7c5cff 100%)",
                    boxShadow:
                      "0 10px 40px -12px rgba(124, 92, 255, 0.6), 0 0 0 1px rgba(255,255,255,0.3)",
                  }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {item.icon}
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-12">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {current.content}
        </motion.div>
      </div>
    </div>
  );
}
