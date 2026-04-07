import type { WebSearchConfig } from '../providers/types'
import type { HardwareStore } from '../hardware/store'

export interface ToolContext {
  cwd: string
  getWebSearchConfig: () => WebSearchConfig
  hardware: HardwareStore
}
