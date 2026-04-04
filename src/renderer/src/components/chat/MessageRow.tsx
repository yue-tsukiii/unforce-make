import type { ReactElement } from 'react'

import { BlockView } from '@/components/chat/BlockView'
import { WaitingIndicator } from '@/components/chat/WaitingIndicator'
import type { Message } from '@/types/chat'

export function MessageRow({
  message,
  isStreaming = false,
}: {
  message: Message
  isStreaming?: boolean
}): ReactElement {
  if (message.role === 'user') {
    return (
      <div className="message-enter">
        <div className="flex gap-2">
          <span className="shrink-0 text-[var(--term-blue)]">&gt;</span>
          <div className="min-w-0 flex-1 whitespace-pre-wrap break-words text-[13px] text-[var(--term-text)]">
            {message.content}
          </div>
        </div>
      </div>
    )
  }

  const hasBlocks = (message.blocks?.length ?? 0) > 0

  if (!hasBlocks && message.status === 'queued') {
    return <WaitingIndicator label="queued..." />
  }

  if (!hasBlocks && isStreaming) {
    return <WaitingIndicator label="running..." />
  }

  return (
    <div className={hasBlocks ? 'message-enter' : undefined}>
      <div className="min-w-0 space-y-2 border-l border-[var(--term-border)] pl-4">
        {message.blocks?.map((block) => (
          <BlockView
            key={
              block.type === 'tool'
                ? block.id
                : `${block.type}:${block.content.length}:${block.content.slice(0, 32)}`
            }
            block={block}
          />
        ))}
        {isStreaming && hasBlocks && (
          <span className="inline-block text-[var(--term-blue)] [animation:blink_0.8s_step-end_infinite]">
            _
          </span>
        )}
      </div>
    </div>
  )
}
