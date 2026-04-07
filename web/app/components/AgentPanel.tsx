"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { MagneticButton } from "./MagneticButton";
import { SpotlightCard } from "./SpotlightCard";

type CapabilityKey =
  | "environment"
  | "heart-rate"
  | "camera"
  | "voice"
  | "led-strip"
  | "haptics"
  | "posture"
  | "formaldehyde";

const onlineBlocks: { id: string; capability: CapabilityKey }[] = [
  { id: "env-001", capability: "environment" },
  { id: "hr-002", capability: "heart-rate" },
  { id: "hcho-01", capability: "formaldehyde" },
  { id: "vision-01", capability: "camera" },
  { id: "voice-01", capability: "voice" },
  { id: "light-03", capability: "led-strip" },
  { id: "vibe-02", capability: "haptics" },
  { id: "imu-01", capability: "posture" },
];

export function AgentPanel() {
  const { locale, t } = useI18n();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Re-mount useChat when locale changes so the system prompt stays in sync.
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { locale },
      }),
    [locale],
  );

  const { messages, sendMessage, status, stop, error } = useChat({
    transport,
    id: `room-${locale}`,
  });

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, status]);

  const isLoading = status === "streaming" || status === "submitted";

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    sendMessage({ text });
    setInput("");
  }

  function sendSuggestion(s: string) {
    if (isLoading) return;
    sendMessage({ text: s });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      {/* Chat panel */}
      <SpotlightCard className="lg:col-span-3 p-0">
        <div className="flex items-center gap-3 border-b border-black/10 px-6 py-4">
          <span className="pulse-dot block h-2 w-2 rounded-full bg-[color:var(--accent-2)]" />
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-black/50">
            {t.agent.header}
          </p>
          <span className="ml-auto font-mono text-[10px] text-black/30">
            {t.agent.ready}
          </span>
        </div>

        <div
          ref={scrollRef}
          className="flex max-h-[480px] min-h-[400px] flex-col gap-4 overflow-y-auto px-6 py-6"
        >
          {messages.length === 0 && (
            <Empty
              locale={locale}
              suggestions={t.agent.suggestions}
              onPick={sendSuggestion}
            />
          )}

          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
          </AnimatePresence>

          {isLoading && <Thinking label={t.agent.thinking} />}

          {error && (
            <div className="rounded-xl border border-[color:var(--accent-3)]/40 bg-[color:var(--accent-3)]/10 px-4 py-3 text-sm text-black/80">
              {t.agent.errorFallback}
              <div className="mt-1 font-mono text-[10px] text-black/40">
                {error.message}
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={submit}
          className="flex items-center gap-3 border-t border-black/10 px-6 py-4"
        >
          <div className="flex flex-1 items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-4 py-2.5 text-sm text-black/80 focus-within:border-black/30">
            <MicIcon />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.agent.placeholder}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-black/30"
            />
          </div>
          {isLoading ? (
            <MagneticButton
              type="button"
              onClick={() => stop()}
              variant="ghost"
              className="!px-5 !py-2.5 text-xs"
            >
              {t.agent.stop}
            </MagneticButton>
          ) : (
            <MagneticButton type="submit" className="!px-5 !py-2.5 text-xs">
              {t.agent.send}
            </MagneticButton>
          )}
        </form>
      </SpotlightCard>

      {/* Side panel */}
      <div className="space-y-4 lg:col-span-2">
        <SpotlightCard>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/40">
            {t.agent.signals}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Metric label={t.agent.metrics.temp} value="29.4°" accent="1" />
            <Metric label={t.agent.metrics.humidity} value="72%" accent="2" />
            <Metric label={t.agent.metrics.bpm} value="86" accent="3" />
            <Metric label={t.agent.metrics.hcho} value="0.09" accent="1" />
          </div>
        </SpotlightCard>

        {/* Proactive Insights */}
        <SpotlightCard>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/40">
            {t.agent.proactive.title}
          </p>
          <ProactiveAlerts alerts={t.agent.proactive.alerts} onAsk={sendSuggestion} />
        </SpotlightCard>

        <SpotlightCard>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/40">
            {t.agent.online}
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {onlineBlocks.map((b) => (
              <li
                key={b.id}
                className="flex items-center justify-between rounded-lg border border-black/5 bg-black/[0.02] px-3 py-2"
              >
                <span className="flex items-center gap-2">
                  <span className="pulse-dot block h-1.5 w-1.5 rounded-full bg-[color:var(--accent-2)]" />
                  <span className="font-mono text-xs text-black/80">
                    {b.id}
                  </span>
                </span>
                <span className="text-xs text-black/40">
                  {t.agent.blockLabels[b.capability]}
                </span>
              </li>
            ))}
          </ul>
        </SpotlightCard>
      </div>
    </div>
  );
}

type UIMessage = ReturnType<typeof useChat>["messages"][number];

function MessageBubble({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={
        isUser
          ? "ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-black/10 px-5 py-3 text-right text-sm text-black/90 backdrop-blur-sm"
          : "max-w-[90%] rounded-2xl rounded-bl-md border border-black/10 bg-gradient-to-br from-black/[0.06] to-black/[0.02] px-5 py-4 text-sm leading-relaxed text-black/90"
      }
    >
      <div className="space-y-2">
        {message.parts.map((part, i) => {
          if (part.type === "text") {
            return (
              <div key={i} className="whitespace-pre-wrap">
                {part.text}
              </div>
            );
          }
          if (part.type.startsWith("tool-")) {
            const tp = part as {
              type: string;
              state?: string;
              input?: unknown;
              output?: unknown;
            };
            const toolName = part.type.replace("tool-", "");
            return (
              <div
                key={i}
                className="rounded-lg border border-[color:var(--accent-1)]/40 bg-[color:var(--accent-1)]/10 px-3 py-2 font-mono text-[11px]"
              >
                <div className="text-[color:var(--accent-1)]">
                  → {toolName}
                  {tp.state ? ` · ${tp.state}` : ""}
                </div>
                {tp.output !== undefined && (
                  <pre className="mt-1 overflow-x-auto whitespace-pre-wrap text-[10px] text-black/60">
                    {JSON.stringify(tp.output, null, 2)}
                  </pre>
                )}
              </div>
            );
          }
          return null;
        })}
      </div>
    </motion.div>
  );
}

function Empty({
  locale,
  suggestions,
  onPick,
}: {
  locale: "en" | "zh";
  suggestions: readonly string[];
  onPick: (s: string) => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-start justify-center gap-5 py-8">
      <div className="font-display text-xl leading-snug text-black/80">
        {locale === "zh"
          ? "你好呀 👋 让我帮你照看这个房间。"
          : "Hi there 👋 let me keep an eye on your room."}
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onPick(s)}
            className="rounded-full border border-black/10 bg-black/[0.03] px-4 py-2 text-xs text-black/70 transition-all duration-300 hover:border-black/30 hover:bg-black/[0.08] hover:text-gray-900"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function Thinking({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 font-mono text-[11px] text-black/40">
      <span className="inline-flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="inline-block h-1 w-1 rounded-full bg-black/60"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
      </span>
      {label}
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
    <div className="rounded-xl border border-black/10 bg-black/[0.02] px-3 py-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/40">
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

function ProactiveAlerts({
  alerts,
  onAsk,
}: {
  alerts: readonly { icon: string; text: string; severity: string }[];
  onAsk: (s: string) => void;
}) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount >= alerts.length) return;
    const timer = setTimeout(
      () => setVisibleCount((c) => c + 1),
      visibleCount === 0 ? 2000 : 4000,
    );
    return () => clearTimeout(timer);
  }, [visibleCount, alerts.length]);

  const severityStyles: Record<string, { border: string; bg: string; dot: string }> = {
    warn: { border: "border-amber-400/40", bg: "bg-amber-50", dot: "bg-amber-400" },
    info: { border: "border-blue-400/40", bg: "bg-blue-50", dot: "bg-blue-400" },
    action: { border: "border-emerald-400/40", bg: "bg-emerald-50", dot: "bg-emerald-400" },
  };

  const iconMap: Record<string, React.ReactNode> = {
    heart: <HeartAlertIcon />,
    air: <AirAlertIcon />,
    posture: <PostureAlertIcon />,
    sleep: <SleepAlertIcon />,
    mood: <MoodAlertIcon />,
  };

  return (
    <div className="mt-3 space-y-2 max-h-[260px] overflow-y-auto">
      <AnimatePresence initial={false}>
        {alerts.slice(0, visibleCount).map((a, i) => {
          const style = severityStyles[a.severity] ?? severityStyles.info;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={`rounded-xl border ${style.border} ${style.bg} px-3 py-2.5 cursor-pointer transition-all hover:shadow-sm`}
              onClick={() => onAsk(a.text)}
            >
              <div className="flex items-start gap-2">
                <span className={`mt-0.5 block h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-black/50">{iconMap[a.icon]}</span>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-black/35">
                      {a.severity === "warn" ? "warning" : a.severity === "action" ? "auto-action" : "insight"}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-black/70">{a.text}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
      {visibleCount === 0 && (
        <div className="flex items-center gap-2 py-3 font-mono text-[11px] text-black/30">
          <motion.span
            className="inline-block h-1.5 w-1.5 rounded-full bg-black/20"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          analyzing patterns…
        </div>
      )}
    </div>
  );
}

function HeartAlertIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M12 21C12 21 4 14.36 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12 4 12 4S12.76 3 14.5 3C17.58 3 20 5.42 20 8.5C20 14.36 12 21 12 21Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
function AirAlertIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M3 8h10a3 3 0 1 0-3-3M4 14h12a3 3 0 1 1-3 3M2 11h16a3 3 0 1 0-3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function PostureAlertIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7v5l-3 5M12 12l3 5M8 12h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function SleepAlertIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
function MoodAlertIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="9" cy="10" r="1" fill="currentColor" />
      <circle cx="15" cy="10" r="1" fill="currentColor" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <rect
        x="9"
        y="3"
        width="6"
        height="12"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M5 11a7 7 0 0 0 14 0M12 18v3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
