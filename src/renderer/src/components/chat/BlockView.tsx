import type { ReactElement } from 'react'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

import type { Block } from '@/types/chat'
import { formatArgs } from '@/utils/formatArgs'

const remarkPlugins = [remarkGfm]
const rehypePlugins = [rehypeHighlight]

export function BlockView({ block }: { block: Block }): ReactElement | null {
  const [expanded, setExpanded] = useState(false)

  if (block.type === 'text') {
    return (
      <div className="markdown-body text-[13px] text-[#ccc]">
        <ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>
          {block.content}
        </ReactMarkdown>
      </div>
    )
  }

  if (block.type === 'thinking') {
    return (
      <details className="group">
        <summary className="flex cursor-pointer items-center gap-1.5 text-[11px] text-[#666] transition select-none hover:text-[#999]">
          <svg
            className="h-3 w-3 transition group-open:rotate-90"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M6 4l4 4-4 4" />
          </svg>
          thinking...
        </summary>
        <div className="mt-2 border-l border-[#333] pl-3 text-[12px] leading-relaxed text-[#888]">
          {block.content}
        </div>
      </details>
    )
  }

  if (block.type === 'tool') {
    const isRunning = block.status === 'running'
    const isError = block.isError

    return (
      <div className="overflow-hidden rounded border border-[#2a2a2a] bg-[#161616]">
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="flex w-full items-center gap-2 px-3 py-2 text-left text-[11px] transition hover:bg-[#1e1e1e]"
        >
          <span
            className={`text-[11px] ${
              isRunning ? 'text-[#e5c07b]' : isError ? 'text-[#e06c75]' : 'text-[#4af626]'
            }`}
          >
            {isRunning ? '...' : isError ? 'x' : 'ok'}
          </span>
          <span className="text-[#ccc]">{block.name}</span>
          <span className="min-w-0 flex-1 truncate text-[#555]">{formatArgs(block.args)}</span>
          <svg
            className={`h-3 w-3 shrink-0 text-[#555] transition ${expanded ? 'rotate-90' : ''}`}
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M6 4l4 4-4 4" />
          </svg>
        </button>
        {expanded && block.result && (
          <pre className="max-h-60 overflow-auto border-t border-[#2a2a2a] bg-[#0e0e0e] px-3 py-2 text-[11px] leading-relaxed whitespace-pre-wrap break-all text-[#999]">
            {block.result}
          </pre>
        )}
        {!expanded && block.result && (
          <div className="truncate border-t border-[#2a2a2a] bg-[#111] px-3 py-1.5 text-[11px] text-[#555]">
            {block.result.length > 200 ? `${block.result.slice(0, 200)}...` : block.result}
          </div>
        )}
      </div>
    )
  }

  return null
}
