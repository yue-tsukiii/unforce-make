import type { WebSearchConfig } from '../providers/types'

export interface ToolContext {
  cwd: string
  getWebSearchConfig: () => WebSearchConfig
}
