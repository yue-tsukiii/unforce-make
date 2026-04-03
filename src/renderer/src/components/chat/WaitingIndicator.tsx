import type { ReactElement } from 'react'

export function WaitingIndicator({ label = 'thinking...' }: { label?: string }): ReactElement {
  return (
    <div className="message-enter">
      <div className="flex items-center gap-2 border-l border-[#2a2a2a] pl-4">
        <span className="thinking-dot h-1.5 w-1.5 rounded-full bg-[#666]" />
        <span className="thinking-dot h-1.5 w-1.5 rounded-full bg-[#666]" />
        <span className="thinking-dot h-1.5 w-1.5 rounded-full bg-[#666]" />
        <span className="text-[11px] text-[#666]">{label}</span>
      </div>
    </div>
  )
}
