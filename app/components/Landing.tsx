"use client";

import { motion } from "framer-motion";
import { CursorSpotlight } from "./CursorSpotlight";
import { MagneticButton } from "./MagneticButton";
import { Tabs, type TabItem } from "./Tabs";
import { AgentPanel } from "./AgentPanel";
import { DeveloperPanel } from "./DeveloperPanel";

const tabs: TabItem[] = [
  {
    id: "agent",
    label: "Talk to the Agent",
    icon: <SparkleIcon />,
    content: <AgentPanel />,
  },
  {
    id: "dev",
    label: "For Developers",
    icon: <CodeIcon />,
    content: <DeveloperPanel />,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export function Landing() {
  return (
    <main className="relative z-[3] min-h-screen">
      <CursorSpotlight />
      <div className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-[900px]" />

      {/* Nav */}
      <header className="relative mx-auto flex max-w-7xl items-center justify-between px-6 pt-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3"
        >
          <LogoMark />
          <span className="font-display text-lg font-medium tracking-tight">
            unforce <span className="text-white/50">/ make</span>
          </span>
        </motion.div>

        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="hidden items-center gap-8 font-mono text-xs uppercase tracking-[0.18em] text-white/50 md:flex"
        >
          <a href="#product" className="hover:text-white">
            Product
          </a>
          <a href="#architecture" className="hover:text-white">
            Architecture
          </a>
          <a href="#team" className="hover:text-white">
            Team
          </a>
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <MagneticButton className="!px-5 !py-2.5 text-xs">
            Join the Beta
          </MagneticButton>
        </motion.div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-6 pt-24 pb-20 lg:px-10 lg:pt-32">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          className="max-w-4xl"
        >
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-white/60 backdrop-blur-md"
          >
            <span className="pulse-dot block h-1.5 w-1.5 rounded-full bg-[color:var(--accent-2)]" />
            Team Unforce Make · Hackathon 2026
          </motion.div>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-display mt-8 text-[clamp(2.75rem,7vw,6.25rem)] font-medium leading-[0.95] tracking-[-0.04em]"
          >
            <span className="text-gradient">Snap the blocks.</span>
            <br />
            <span className="text-white">Talk to the room.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 max-w-2xl text-lg leading-relaxed text-white/60"
          >
            Unforce Make is a modular IoT blocks platform. Magnetic POGO-pin
            hardware joins a single Wi-Fi mesh in seconds, a local Host routes
            MQTT, UDP and WebSocket traffic, and a Claude-powered Agent
            understands the whole room — so your space can finally{" "}
            <span className="text-white">listen, see, and act</span>.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <MagneticButton>
              Try the live demo <ArrowIcon />
            </MagneticButton>
            <MagneticButton variant="ghost">Read the docs</MagneticButton>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16 grid grid-cols-2 gap-8 border-t border-white/10 pt-8 sm:grid-cols-4"
          >
            {[
              { k: "< 3s", v: "block plug-and-play" },
              { k: "7", v: "hardware modules" },
              { k: "4", v: "protocol lanes" },
              { k: "100%", v: "runs on-device" },
            ].map((s) => (
              <div key={s.v}>
                <div className="font-display text-3xl font-medium text-white">
                  {s.k}
                </div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
                  {s.v}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Tabs section */}
      <section
        id="product"
        className="relative mx-auto max-w-7xl px-6 pb-28 lg:px-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 flex flex-col items-center text-center"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/40">
            Two ways in
          </span>
          <h2 className="font-display mt-4 max-w-3xl text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.03em]">
            One room. One platform.{" "}
            <span className="text-gradient">Two surfaces.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-white/50">
            End-users come in through the Agent. Developers come in through the
            protocol. Same brain, different entry points.
          </p>
        </motion.div>

        <Tabs items={tabs} />
      </section>

      {/* Architecture */}
      <section
        id="architecture"
        className="relative mx-auto max-w-7xl px-6 pb-28 lg:px-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-6 lg:grid-cols-3"
        >
          {[
            {
              k: "01",
              t: "Hardware Layer",
              d: "ESP32-S3 for vision/voice streams. ESP32-C3 for low-power sensors and actuators. POGO-pin magnetic docks for instant mesh join.",
            },
            {
              k: "02",
              t: "Host Layer",
              d: "Python asyncio runtime. MQTT broker, UDP server, WebSocket server. Event bus, node registry, port pool, AI pipeline.",
            },
            {
              k: "03",
              t: "Agent Layer",
              d: "Claude 4.6 as the reasoning core. Multi-modal context over sensors, vision and voice. Executes via MQTT commands.",
            },
          ].map((c, i) => (
            <motion.div
              key={c.k}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-8 transition-colors duration-500 hover:border-white/25"
            >
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--accent-1)]">
                {c.k}
              </div>
              <h3 className="font-display mt-4 text-2xl font-medium tracking-tight text-white">
                {c.t}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55">
                {c.d}
              </p>
              <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[color:var(--accent-1)]/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <footer
        id="team"
        className="relative mx-auto mt-10 max-w-7xl border-t border-white/10 px-6 py-14 lg:px-10"
      >
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <LogoMark />
            <div>
              <div className="font-display text-lg font-medium">unforce make</div>
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
                Hackathon · 2026
              </div>
            </div>
          </div>
          <p className="max-w-md text-sm text-white/40">
            Built in 48 hours with ESP32s, Mosquitto, asyncio, Next.js and
            Claude. Everything runs on your own hardware.
          </p>
          <div className="flex gap-4 font-mono text-xs uppercase tracking-[0.2em] text-white/50">
            <a href="#" className="hover:text-white">
              GitHub
            </a>
            <a href="#" className="hover:text-white">
              Docs
            </a>
            <a href="#" className="hover:text-white">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function LogoMark() {
  return (
    <div className="relative grid h-9 w-9 place-items-center">
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[color:var(--accent-1)] via-[color:var(--accent-3)] to-[color:var(--accent-2)] opacity-90" />
      <div className="absolute inset-[2px] rounded-[7px] bg-[color:var(--background)]" />
      <div className="relative grid grid-cols-2 gap-0.5">
        <span className="h-1.5 w-1.5 rounded-[2px] bg-[color:var(--accent-1)]" />
        <span className="h-1.5 w-1.5 rounded-[2px] bg-[color:var(--accent-2)]" />
        <span className="h-1.5 w-1.5 rounded-[2px] bg-[color:var(--accent-3)]" />
        <span className="h-1.5 w-1.5 rounded-[2px] bg-white/80" />
      </div>
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.8 2.8M14.9 14.9l2.8 2.8M6.3 17.7l2.8-2.8M14.9 9.1l2.8-2.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M8 6l-5 6 5 6M16 6l5 6-5 6M14 4l-4 16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12h14M13 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
