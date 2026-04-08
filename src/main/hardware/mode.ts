export type HardwareMode = 'mock' | 'real'

const DEFAULT_HARDWARE_MODE: HardwareMode = 'mock'

export function resolveHardwareMode(envValue = process.env.HARDWARE_MODE): HardwareMode {
  if (envValue === 'real') {
    return 'real'
  }

  return DEFAULT_HARDWARE_MODE
}

export function isMockHardwareMode(mode: HardwareMode): boolean {
  return mode === 'mock'
}
