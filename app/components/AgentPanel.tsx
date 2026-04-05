"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MagneticButton } from "./MagneticButton";
import { SpotlightCard } from "./SpotlightCard";

const scripts = [
  {
    user: "房间有点闷，帮我看看",
    thought: "读取 环境块 · 甲醛块 · 心率块",
    reply:
      "温度 29.4°C，湿度 72%，甲醛 0.09 mg/m³，你的心率略偏高。我把灯光调成冷白，并让语音块提醒休息五分钟。",
    actions: ["light.set_color(#A8D8FF)", "vibe.pulse(2s, gentle)", "tts.say(...)"],
  },
  {
    user: "我读书的时候提醒我坐直",
    thought: "订阅 姿态块 · 视觉块",
    reply:
      "已开启姿态监测。一旦你驼背超过 6 秒，振动块会轻轻提醒你，语音块会低声说一句。",
    actions: ["imu.subscribe(slouch)", "vibe.on_trigger(slouch)", "tts.whisper(...)"],
  },
  {
    user: "谁进房间了？",
    thought: "触发 视觉块 · 检索 注册表",
    reply:
      "刚才走进门的是你的猫 Mochi。我没有识别到其他人脸。需要我之后只在是陌生人时提醒你吗？",
    actions: ["vision.snapshot()", "vision.detect(face|pet)", "context.remember()"],
  },
];

export function AgentPanel() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % scripts.length), 6500);
    return () => clearInterval(t);
  }, []);

  const current = scripts[idx];

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      {/* Chat panel */}
      <SpotlightCard className="lg:col-span-3 p-0">
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-4">
          <span className="pulse-dot block h-2 w-2 rounded-full bg-[color:var(--accent-2)]" />
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
            Unforce Agent · live
          </p>
          <span className="ml-auto font-mono text-[10px] text-white/30">
            {idx + 1} / {scripts.length}
          </span>
        </div>

        <div className="min-h-[360px] space-y-5 px-6 py-6">
          <motion.div
            key={`u-${idx}`}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-white/10 px-5 py-3 text-right text-sm text-white/90 backdrop-blur-sm"
          >
            {current.user}
          </motion.div>

          <motion.div
            key={`t-${idx}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.35 }}
            className="flex items-center gap-2 font-mono text-[11px] text-white/40"
          >
            <span className="inline-block h-px w-6 bg-white/30" />
            thinking · {current.thought}
          </motion.div>

          <motion.div
            key={`r-${idx}`}
            initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.55, delay: 0.6 }}
            className="max-w-[90%] rounded-2xl rounded-bl-md border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] px-5 py-4 text-sm leading-relaxed text-white/90"
          >
            {current.reply}
          </motion.div>

          <motion.div
            key={`a-${idx}`}
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08, delayChildren: 0.85 } },
            }}
            className="flex flex-wrap gap-2 pt-2"
          >
            {current.actions.map((a) => (
              <motion.span
                key={a}
                variants={{
                  hidden: { opacity: 0, y: 6 },
                  show: { opacity: 1, y: 0 },
                }}
                className="rounded-full border border-[color:var(--accent-1)]/40 bg-[color:var(--accent-1)]/10 px-3 py-1 font-mono text-[11px] text-[color:var(--accent-1)]"
              >
                {a}
              </motion.span>
            ))}
          </motion.div>
        </div>

        <div className="flex items-center gap-3 border-t border-white/10 px-6 py-4">
          <div className="flex flex-1 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white/40">
            <MicIcon />
            say something to the room…
          </div>
          <MagneticButton className="!px-5 !py-2.5 text-xs">Talk</MagneticButton>
        </div>
      </SpotlightCard>

      {/* Capabilities side panel */}
      <div className="space-y-4 lg:col-span-2">
        <SpotlightCard>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
            live signals
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Metric label="temp" value="29.4°" accent="1" />
            <Metric label="humidity" value="72%" accent="2" />
            <Metric label="bpm" value="86" accent="3" />
            <Metric label="hcho" value="0.09" accent="1" />
          </div>
        </SpotlightCard>

        <SpotlightCard>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
            online blocks
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              { n: "env-001", t: "environment" },
              { n: "hr-002", t: "heart rate" },
              { n: "vision-01", t: "camera" },
              { n: "voice-01", t: "voice" },
              { n: "light-03", t: "led strip" },
              { n: "vibe-02", t: "haptics" },
            ].map((b) => (
              <li
                key={b.n}
                className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2"
              >
                <span className="flex items-center gap-2">
                  <span className="pulse-dot block h-1.5 w-1.5 rounded-full bg-[color:var(--accent-2)]" />
                  <span className="font-mono text-xs text-white/80">{b.n}</span>
                </span>
                <span className="text-xs text-white/40">{b.t}</span>
              </li>
            ))}
          </ul>
        </SpotlightCard>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "1" | "2" | "3";
}) {
  const color =
    accent === "1"
      ? "var(--accent-1)"
      : accent === "2"
        ? "var(--accent-2)"
        : "var(--accent-3)";
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
        {label}
      </div>
      <div
        className="mt-1 font-display text-2xl font-medium"
        style={{ color }}
      >
        {value}
      </div>
    </div>
  );
}

function MicIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <rect x="9" y="3" width="6" height="12" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
