"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Locale = "en" | "zh";

export const dict = {
  en: {
    nav: {
      product: "Product",
      architecture: "Architecture",
      team: "Team",
      cta: "Join the Beta",
    },
    hero: {
      badge: "Team Unforce Make · Hackathon 2026",
      titleA: "Snap the blocks.",
      titleB: "Talk to the room.",
      desc1:
        "Unforce Make is a modular IoT blocks platform. Magnetic POGO-pin hardware joins a single Wi-Fi mesh in seconds, a local Host routes MQTT, UDP and WebSocket traffic, and a Claude-powered Agent understands the whole room — so your space can finally",
      desc2: "listen, see, and act",
      primary: "Try the live agent",
      secondary: "Read the docs",
      stats: [
        { k: "< 3s", v: "block plug-and-play" },
        { k: "7", v: "hardware modules" },
        { k: "4", v: "protocol lanes" },
        { k: "100%", v: "runs on-device" },
      ],
    },
    tabsSection: {
      eyebrow: "Ways in",
      titleA: "Talk to it.",
      titleB: "Or hack on it.",
      desc: "Chat with the Agent and feel the space think — or grab our open-source stack and build your own.",
    },
    tabs: {
      agent: "Talk to the Agent",
      dev: "For Developers",
    },
    agent: {
      header: "Unforce Agent · live",
      ready: "Powered by Claude via Vercel AI Gateway",
      placeholder: "Ask the room anything…",
      send: "Send",
      stop: "Stop",
      suggestions: [
        "Is the air in the room ok?",
        "Remind me to sit straight while I'm reading",
        "Turn the lights into sunset mode",
        "How are my vitals right now?",
      ],
      thinking: "thinking…",
      signals: "live signals",
      online: "online blocks",
      metrics: {
        temp: "temp",
        humidity: "humidity",
        bpm: "bpm",
        hcho: "hcho",
      },
      blockLabels: {
        environment: "environment",
        "heart-rate": "heart rate",
        camera: "camera",
        voice: "voice",
        "led-strip": "led strip",
        haptics: "haptics",
        posture: "posture",
        formaldehyde: "formaldehyde",
      },
      errorFallback:
        "The agent is offline in this preview. Showing a canned reply.",
    },
    dev: {
      mqttCardTitle: "MQTT · CLI",
      pyCardTitle: "Agent · Python",
      topicsTitle: "MQTT topic spec",
      portsTitle: "Host services",
      topics: [
        { t: "blocks/+/announce", d: "Reports id / type / capability on boot" },
        { t: "blocks/+/status", d: "online · offline (auto LWT)" },
        { t: "blocks/+/data", d: "Sensor telemetry (temp, IMU, HR…)" },
        { t: "blocks/{id}/config", d: "Host → block work config" },
        { t: "blocks/{id}/command", d: "Agent/Host → actuator commands" },
      ],
      services: [
        { port: ":1883", name: "MQTT Broker", tag: "Mosquitto · QoS 1 · LWT" },
        { port: ":5600", name: "UDP Server", tag: "Vision block JPEG frames" },
        { port: ":8765", name: "WebSocket", tag: "Voice block duplex audio" },
        { port: ":3000", name: "Host API", tag: "Agent & frontend gateway" },
      ],
      ctaTitle: "Ship your own block in one MQTT message",
      ctaDesc:
        "Wire Wi-Fi on an ESP32-C3, publish blocks/{id}/announce, and the Host auto-detects its capability and hands back a config. No ports, no pairing, no protocol translation.",
      ctaPrimary: "Read the docs →",
      ctaSecondary: "GitHub",
    },
    arch: {
      cards: [
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
      ],
    },
    footer: {
      subtitle: "Hackathon · 2026",
      blurb:
        "Built in 48 hours with ESP32s, Mosquitto, asyncio, Next.js and Claude. Everything runs on your own hardware.",
      github: "GitHub",
      docs: "Docs",
      contact: "Contact",
    },
    lang: {
      label: "Language",
      en: "English",
      zh: "中文",
    },
  },
  zh: {
    nav: {
      product: "产品",
      architecture: "架构",
      team: "团队",
      cta: "加入内测",
    },
    hero: {
      badge: "Unforce Make 战队 · 2026 黑客松",
      titleA: "拼上积木。",
      titleB: "和房间说话。",
      desc1:
        "Unforce Make 是一个模块化 IoT 积木平台。磁吸 POGO 硬件几秒钟内接入同一个 Wi-Fi，本地 Host 统一调度 MQTT、UDP 与 WebSocket，由 Claude 驱动的 Agent 理解整个空间 —— 让你的房间真正能",
      desc2: "听、看、动",
      primary: "试试实时 Agent",
      secondary: "查看文档",
      stats: [
        { k: "< 3 秒", v: "积木即插即用" },
        { k: "7", v: "种硬件积木" },
        { k: "4", v: "条协议通道" },
        { k: "100%", v: "本地运行" },
      ],
    },
    tabsSection: {
      eyebrow: "打开方式",
      titleA: "开口就能聊，",
      titleB: "开源随便造。",
      desc: "直接跟 Agent 说话，感受整个智能空间；或者拿我们开源的协议栈和硬件，自己拼一套出来。",
    },
    tabs: {
      agent: "和 Agent 对话",
      dev: "面向开发者",
    },
    agent: {
      header: "Unforce Agent · 在线",
      ready: "由 Claude × Vercel AI Gateway 驱动",
      placeholder: "随便问问这个房间……",
      send: "发送",
      stop: "停止",
      suggestions: [
        "现在房间空气还好吗？",
        "我读书的时候提醒我坐直",
        "把灯调成日落的感觉",
        "我现在的身体状况怎么样？",
      ],
      thinking: "思考中……",
      signals: "实时信号",
      online: "在线积木",
      metrics: {
        temp: "温度",
        humidity: "湿度",
        bpm: "心率",
        hcho: "甲醛",
      },
      blockLabels: {
        environment: "环境",
        "heart-rate": "心率",
        camera: "摄像头",
        voice: "语音",
        "led-strip": "灯带",
        haptics: "振动",
        posture: "姿态",
        formaldehyde: "甲醛",
      },
      errorFallback: "Agent 暂时离线，先给你一条预置回复。",
    },
    dev: {
      mqttCardTitle: "MQTT · 命令行",
      pyCardTitle: "Agent · Python",
      topicsTitle: "MQTT Topic 规范",
      portsTitle: "Host 服务端口",
      topics: [
        { t: "blocks/+/announce", d: "模块上线上报 id / 类型 / 能力" },
        { t: "blocks/+/status", d: "online · offline（LWT 自动）" },
        { t: "blocks/+/data", d: "传感器数据（温度、姿态、心率…）" },
        { t: "blocks/{id}/config", d: "Host → 模块的工作配置" },
        { t: "blocks/{id}/command", d: "Agent / Host → 执行器指令" },
      ],
      services: [
        { port: ":1883", name: "MQTT Broker", tag: "Mosquitto · QoS 1 · LWT" },
        { port: ":5600", name: "UDP Server", tag: "视觉块 JPEG 帧" },
        { port: ":8765", name: "WebSocket", tag: "语音块双向音频" },
        { port: ":3000", name: "Host API", tag: "Agent 与前端统一网关" },
      ],
      ctaTitle: "接入自己的积木只需要一条 MQTT 消息",
      ctaDesc:
        "ESP32-C3 上连好 Wi-Fi，publish 一条 blocks/{id}/announce，Host 就会自动识别能力并下发配置。你不用关心端口、配网或协议转换。",
      ctaPrimary: "阅读文档 →",
      ctaSecondary: "GitHub",
    },
    arch: {
      cards: [
        {
          k: "01",
          t: "硬件层",
          d: "ESP32-S3 承载视觉 / 语音流；ESP32-C3 承载低功耗传感器与执行器。POGO 磁吸即插即用，秒级入网。",
        },
        {
          k: "02",
          t: "Host 层",
          d: "Python asyncio 运行时。MQTT broker、UDP server、WebSocket server，配合事件总线、节点注册表、端口池与 AI 管线。",
        },
        {
          k: "03",
          t: "Agent 层",
          d: "Claude 4.6 做推理核心，融合传感器、视觉、语音多模态上下文，通过 MQTT 指令执行决策。",
        },
      ],
    },
    footer: {
      subtitle: "黑客松 · 2026",
      blurb:
        "48 小时用 ESP32、Mosquitto、asyncio、Next.js 与 Claude 做出来。一切都跑在你自己的设备上。",
      github: "GitHub",
      docs: "文档",
      contact: "联系",
    },
    lang: {
      label: "语言",
      en: "English",
      zh: "中文",
    },
  },
};

export type Dict = (typeof dict)["en"];

type Ctx = {
  locale: Locale;
  t: Dict;
  setLocale: (l: Locale) => void;
};

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? (localStorage.getItem("unforce-locale") as Locale | null)
        : null;
    if (stored === "zh" || stored === "en") {
      setLocaleState(stored);
      return;
    }
    if (typeof navigator !== "undefined") {
      const lang = navigator.language.toLowerCase();
      if (lang.startsWith("zh")) setLocaleState("zh");
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
    }
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    if (typeof window !== "undefined") {
      localStorage.setItem("unforce-locale", l);
    }
  }, []);

  return (
    <I18nContext.Provider value={{ locale, t: dict[locale], setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
