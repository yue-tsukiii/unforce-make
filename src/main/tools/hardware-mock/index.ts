import type { ToolDefinition } from '@mariozechner/pi-coding-agent'
import { type Static, Type } from '@sinclair/typebox'
import { actuatorState, BLOCKS, getCameraSnapshot, readSensor } from './data'

// ── list_blocks ───────────────────────────────────────────────────────────────

const listBlocksSchema = Type.Object({
  status_filter: Type.Optional(
    Type.Union([Type.Literal('online'), Type.Literal('offline'), Type.Literal('all')], {
      description: 'Filter by status. Defaults to "all".',
    }),
  ),
})

type ListBlocksParams = Static<typeof listBlocksSchema>

const listBlocksTool: ToolDefinition<typeof listBlocksSchema> = {
  name: 'list_blocks',
  label: 'List Hardware Blocks',
  description:
    'List all registered hardware module blocks (sensors, actuators, stream devices). Returns their IDs, capabilities, battery level, and online/offline status.',
  promptSnippet: 'List all connected hardware modules and their status.',
  promptGuidelines: [
    'Call list_blocks first to discover which hardware is available before using other hardware tools',
    'A block with status "offline" cannot be read or controlled — inform the user',
    'Use the block_id from this list when calling get_sensor_data or control_actuator',
  ],
  parameters: listBlocksSchema,
  async execute(_id: string, params: ListBlocksParams) {
    const filter = params.status_filter ?? 'all'
    const blocks = filter === 'all' ? BLOCKS : BLOCKS.filter((b) => b.status === filter)

    const lines = [
      `Found ${blocks.length} block(s) (filter: ${filter}):`,
      '',
      ...blocks.map(
        (b) =>
          `• [${b.status.toUpperCase()}] ${b.block_id} — ${b.capability} (${b.type}) | chip: ${b.chip} | fw: ${b.firmware} | battery: ${b.battery}%`,
      ),
    ]

    return {
      content: [{ type: 'text', text: lines.join('\n') }],
      details: undefined,
    }
  },
}

// ── get_sensor_data ───────────────────────────────────────────────────────────

const getSensorDataSchema = Type.Object({
  block_id: Type.String({
    description: 'The block ID of the sensor to read (e.g. "heart_01", "env_01")',
  }),
})

type GetSensorDataParams = Static<typeof getSensorDataSchema>

const getSensorDataTool: ToolDefinition<typeof getSensorDataSchema> = {
  name: 'get_sensor_data',
  label: 'Get Sensor Data',
  description:
    'Read the latest sensor values from a specific hardware block. Supports heart_rate, imu, temperature, humidity, and formaldehyde sensors.',
  promptSnippet: 'Read real-time sensor data from a hardware block.',
  promptGuidelines: [
    'Use list_blocks first to find valid sensor block_ids',
    'Cannot read stream or actuator blocks — those are not sensors',
    'Interpret the values for the user: bpm > 100 is elevated heart rate, hcho_mg > 0.08 is a concerning formaldehyde level, etc.',
  ],
  parameters: getSensorDataSchema,
  async execute(_id: string, params: GetSensorDataParams) {
    const block = BLOCKS.find((b) => b.block_id === params.block_id)

    if (!block) {
      return {
        content: [{ type: 'text', text: `Error: block "${params.block_id}" not found.` }],
        details: undefined,
        isError: true,
      }
    }

    if (block.status === 'offline') {
      return {
        content: [
          {
            type: 'text',
            text: `Error: block "${params.block_id}" is offline and cannot be read.`,
          },
        ],
        details: undefined,
        isError: true,
      }
    }

    if (block.type !== 'sensor') {
      return {
        content: [
          {
            type: 'text',
            text: `Error: "${params.block_id}" is a ${block.type} block, not a sensor. Use get_camera_snapshot for cameras.`,
          },
        ],
        details: undefined,
        isError: true,
      }
    }

    const values = readSensor(block.capability)
    const ts = Date.now()

    const valueLines = Object.entries(values)
      .map(([k, v]) => `  ${k}: ${v}`)
      .join('\n')

    const text = [
      `Sensor: ${params.block_id} (${block.capability})`,
      `Timestamp: ${new Date(ts).toISOString()}`,
      `Values:`,
      valueLines,
    ].join('\n')

    return {
      content: [{ type: 'text', text }],
      details: undefined,
    }
  },
}

// ── get_camera_snapshot ───────────────────────────────────────────────────────

const getCameraSnapshotSchema = Type.Object({
  block_id: Type.String({
    description: 'The block ID of the camera (e.g. "cam_01")',
  }),
})

type GetCameraSnapshotParams = Static<typeof getCameraSnapshotSchema>

const getCameraSnapshotTool: ToolDefinition<typeof getCameraSnapshotSchema> = {
  name: 'get_camera_snapshot',
  label: 'Get Camera Snapshot',
  description:
    'Capture a snapshot from a camera block and get a visual description of the scene via AI vision analysis.',
  promptSnippet: 'Capture and analyze a camera snapshot.',
  promptGuidelines: [
    'Use list_blocks to confirm the camera block_id before calling this tool',
    'The snapshot is analyzed by a vision model — describe what you see to the user',
    'If the user asks "what do you see" or "look around", use this tool',
  ],
  parameters: getCameraSnapshotSchema,
  async execute(_id: string, params: GetCameraSnapshotParams) {
    const block = BLOCKS.find((b) => b.block_id === params.block_id)

    if (!block) {
      return {
        content: [{ type: 'text', text: `Error: block "${params.block_id}" not found.` }],
        details: undefined,
        isError: true,
      }
    }

    if (block.status === 'offline') {
      return {
        content: [
          {
            type: 'text',
            text: `Error: camera "${params.block_id}" is offline.`,
          },
        ],
        details: undefined,
        isError: true,
      }
    }

    if (block.capability !== 'camera') {
      return {
        content: [
          {
            type: 'text',
            text: `Error: "${params.block_id}" is not a camera (capability: ${block.capability}).`,
          },
        ],
        details: undefined,
        isError: true,
      }
    }

    const scene = getCameraSnapshot()

    const text = [
      `Camera snapshot from ${params.block_id} at ${new Date().toISOString()}`,
      ``,
      `Scene description (vision analysis):`,
      scene,
    ].join('\n')

    return {
      content: [{ type: 'text', text }],
      details: undefined,
    }
  },
}

// ── control_actuator ──────────────────────────────────────────────────────────

const controlActuatorSchema = Type.Object({
  block_id: Type.String({
    description: 'The actuator block ID (e.g. "light_01", "vibr_01")',
  }),
  action: Type.String({
    description:
      'The action to perform. Light: "set_color", "set_pattern", "off". Vibration: "pulse", "pattern", "off".',
  }),
  params: Type.Optional(
    Type.Record(Type.String(), Type.Unknown(), {
      description:
        'Action parameters. set_color: {r,g,b,brightness}. set_pattern: {pattern,color,speed}. pulse: {intensity,duration_ms}. pattern: {pattern,duration_ms}.',
    }),
  ),
})

type ControlActuatorParams = Static<typeof controlActuatorSchema>

const controlActuatorTool: ToolDefinition<typeof controlActuatorSchema> = {
  name: 'control_actuator',
  label: 'Control Actuator',
  description:
    'Send a control command to a light or vibration actuator block. Can set colors, patterns, or turn off.',
  promptSnippet: 'Control a hardware actuator (light color, vibration pattern, etc.).',
  promptGuidelines: [
    'Use list_blocks to confirm the actuator block_id before calling this tool',
    'For light set_color, params must include r, g, b (0-255) and brightness (0-100)',
    'For set_pattern, valid patterns are: "breathing", "strobe", "rainbow", "steady"',
    'For vibration pulse, params must include intensity (0-100) and duration_ms',
    'For vibration pattern, valid patterns are: "heartbeat", "alert", "gentle"',
    'Always confirm with the user before sending repeated or high-intensity commands',
  ],
  parameters: controlActuatorSchema,
  async execute(_id: string, params: ControlActuatorParams) {
    const block = BLOCKS.find((b) => b.block_id === params.block_id)

    if (!block) {
      return {
        content: [{ type: 'text', text: `Error: block "${params.block_id}" not found.` }],
        details: undefined,
        isError: true,
      }
    }

    if (block.status === 'offline') {
      return {
        content: [
          {
            type: 'text',
            text: `Error: actuator "${params.block_id}" is offline and cannot be controlled.`,
          },
        ],
        details: undefined,
        isError: true,
      }
    }

    if (block.type !== 'actuator') {
      return {
        content: [
          {
            type: 'text',
            text: `Error: "${params.block_id}" is not an actuator (type: ${block.type}).`,
          },
        ],
        details: undefined,
        isError: true,
      }
    }

    // Apply state mutation
    const p = params.params ?? {}

    if (block.capability === 'light') {
      if (params.action === 'set_color') {
        actuatorState.light = {
          r: (p.r as number) ?? 255,
          g: (p.g as number) ?? 255,
          b: (p.b as number) ?? 255,
          brightness: (p.brightness as number) ?? 100,
          pattern: null,
        }
      } else if (params.action === 'set_pattern') {
        actuatorState.light = {
          ...(actuatorState.light ?? { r: 255, g: 255, b: 255, brightness: 80 }),
          pattern: (p.pattern as string) ?? 'breathing',
        }
      } else if (params.action === 'off') {
        actuatorState.light = { r: 0, g: 0, b: 0, brightness: 0, pattern: null }
      }
    } else if (block.capability === 'vibration') {
      if (params.action === 'pulse') {
        actuatorState.vibration = {
          active: true,
          pattern: null,
          intensity: (p.intensity as number) ?? 50,
        }
      } else if (params.action === 'pattern') {
        actuatorState.vibration = {
          active: true,
          pattern: (p.pattern as string) ?? 'heartbeat',
          intensity: 70,
        }
      } else if (params.action === 'off') {
        actuatorState.vibration = { active: false, pattern: null, intensity: 0 }
      }
    }

    const stateStr = JSON.stringify(
      block.capability === 'light' ? actuatorState.light : actuatorState.vibration,
      null,
      2,
    )

    const text = [
      `Command sent to ${params.block_id} (${block.capability}): ${params.action}`,
      `Parameters: ${JSON.stringify(params.params ?? {})}`,
      ``,
      `Current actuator state:`,
      stateStr,
    ].join('\n')

    return {
      content: [{ type: 'text', text }],
      details: undefined,
    }
  },
}

// ── export ────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createHardwareMockTools(): ToolDefinition<any, any, any>[] {
  return [listBlocksTool, getSensorDataTool, getCameraSnapshotTool, controlActuatorTool]
}
