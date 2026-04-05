"use client";

import { motion } from "framer-motion";
import { SpotlightCard } from "./SpotlightCard";
import { MagneticButton } from "./MagneticButton";

const mqttSnippet = `# 订阅任意积木的上线通知
mosquitto_sub -h host.local -t "blocks/+/announce"

# 控制灯光块
mosquitto_pub -h host.local \\
  -t "blocks/light-001/command" \\
  -m '{"action":"set_color","r":255,"g":94,"b":135}'`;

const pySnippet = `import asyncio, json
from paho.mqtt import client as mqtt

async def main():
    c = mqtt.Client()
    c.connect("host.local", 1883)
    c.subscribe("blocks/+/data")

    def on_msg(_, __, msg):
        payload = json.loads(msg.payload)
        # feed into your LLM / rules engine
        print(msg.topic, payload)

    c.on_message = on_msg
    c.loop_forever()

asyncio.run(main())`;

const topics = [
  { t: "blocks/+/announce", d: "模块上线时上报 id / type / capability" },
  { t: "blocks/+/status", d: "online · offline（LWT 自动触发）" },
  { t: "blocks/+/data", d: "传感器数据（温度、姿态、心率…）" },
  { t: "blocks/{id}/config", d: "Host → 模块 的工作配置" },
  { t: "blocks/{id}/command", d: "Agent/Host → 执行器 的控制指令" },
];

const services = [
  { port: ":1883", name: "MQTT Broker", tag: "Mosquitto · QoS 1 · LWT" },
  { port: ":5600", name: "UDP Server", tag: "视觉块 JPEG 帧" },
  { port: ":8765", name: "WebSocket", tag: "语音块 双向音频" },
  { port: ":3000", name: "Host API", tag: "Agent & 前端统一通道" },
];

export function DeveloperPanel() {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <CodeCard title="MQTT · CLI" language="bash" code={mqttSnippet} />
        <CodeCard title="Agent · Python" language="python" code={pySnippet} />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <SpotlightCard className="lg:col-span-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
            MQTT topic 规范
          </p>
          <div className="mt-5 space-y-2">
            {topics.map((t, i) => (
              <motion.div
                key={t.t}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3"
              >
                <span className="font-mono text-sm text-[color:var(--accent-2)]">
                  {t.t}
                </span>
                <span className="text-xs text-white/50">{t.d}</span>
              </motion.div>
            ))}
          </div>
        </SpotlightCard>

        <SpotlightCard className="lg:col-span-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
            Host 服务端口
          </p>
          <div className="mt-5 space-y-3">
            {services.map((s, i) => (
              <motion.div
                key={s.port}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm text-white">
                    {s.name}
                  </span>
                  <span className="font-mono text-xs text-[color:var(--accent-1)]">
                    {s.port}
                  </span>
                </div>
                <p className="mt-1 text-xs text-white/40">{s.tag}</p>
              </motion.div>
            ))}
          </div>
        </SpotlightCard>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-white/10 bg-white/[0.02] p-8">
        <div>
          <h3 className="font-display text-2xl font-medium tracking-tight text-white">
            接入自己的积木只需要一条 MQTT 消息
          </h3>
          <p className="mt-2 max-w-xl text-sm text-white/50">
            ESP32-C3 上连好 WiFi → publish `blocks/{"{id}"}/announce`，Host
            自动识别能力并下发配置。你不用关心端口、配网，或协议转换。
          </p>
        </div>
        <div className="flex gap-3">
          <MagneticButton>阅读文档 →</MagneticButton>
          <MagneticButton variant="ghost">GitHub</MagneticButton>
        </div>
      </div>
    </div>
  );
}

function CodeCard({
  title,
  language,
  code,
}: {
  title: string;
  language: string;
  code: string;
}) {
  return (
    <SpotlightCard className="p-0">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
            {title}
          </span>
        </div>
        <span className="font-mono text-[10px] text-white/30">{language}</span>
      </div>
      <pre className="overflow-x-auto px-5 py-5 font-mono text-[12.5px] leading-[1.7] text-white/80">
        <code>{code}</code>
      </pre>
    </SpotlightCard>
  );
}
