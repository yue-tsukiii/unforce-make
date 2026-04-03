import type { ReactElement } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

interface SessionSummary {
  path: string
  id: string
  name?: string
  modified: string
  messageCount: number
  firstMessage: string
}

function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString)
  const now = Date.now()
  const diffMs = now - date.getTime()
  const diffMin = Math.floor(diffMs / 60_000)
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.floor(diffHr / 24)
  if (diffDay < 7) return `${diffDay}d ago`
  return date.toLocaleDateString()
}

export function SessionList({
  onResume,
  onDelete,
  currentSessionPath,
}: {
  onResume: (sessionPath: string) => void
  onDelete: (sessionPath: string) => void
  currentSessionPath: string | null
}): ReactElement {
  const [open, setOpen] = useState(false)
  const [sessions, setSessions] = useState<SessionSummary[]>([])
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const loadSessions = useCallback(async () => {
    setLoading(true)
    try {
      const list = await window.api.listSessions()
      setSessions(list)
    } catch {
      setSessions([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (open) void loadSessions()
  }, [open, loadSessions])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded p-1.5 text-[#666] transition hover:bg-[#1e1e1e] hover:text-[#ccc]"
        title="Session history"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-72 overflow-hidden rounded-lg border border-[#2a2a2a] bg-[#161616] shadow-xl">
          <div className="border-b border-[#2a2a2a] px-3 py-2 text-[11px] font-medium text-[#888]">
            Recent Sessions
          </div>

          <div className="max-h-64 overflow-y-auto">
            {loading && (
              <div className="px-3 py-4 text-center text-[11px] text-[#666]">Loading...</div>
            )}

            {!loading && sessions.length === 0 && (
              <div className="px-3 py-4 text-center text-[11px] text-[#666]">No sessions yet</div>
            )}

            {!loading &&
              sessions.map((s) => {
                const isCurrent = s.path === currentSessionPath
                return (
                  <div
                    key={s.id}
                    className={`group flex items-center gap-1 transition ${
                      isCurrent ? 'bg-[#1a2a1a]' : 'hover:bg-[#1e1e1e]'
                    }`}
                  >
                    <button
                      type="button"
                      disabled={isCurrent}
                      onClick={() => {
                        onResume(s.path)
                        setOpen(false)
                      }}
                      className={`flex min-w-0 flex-1 flex-col gap-0.5 px-3 py-2 text-left ${
                        isCurrent ? 'text-[#4af626]' : 'text-[#ccc]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-[11px] font-medium">
                          {s.name || s.firstMessage || `Session ${s.id}`}
                        </span>
                        <span className="shrink-0 text-[10px] text-[#666]">
                          {formatRelativeTime(s.modified)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-[#666]">
                        <span>{s.messageCount} msgs</span>
                        {isCurrent && <span className="text-[#4af626]">current</span>}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(s.path)
                        setSessions((prev) => prev.filter((x) => x.path !== s.path))
                      }}
                      className="mr-2 shrink-0 rounded p-1 text-[#666] opacity-0 transition hover:bg-[#2a2a2a] hover:text-[#f66] group-hover:opacity-100"
                      title="Delete session"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                    </button>
                  </div>
                )
              })}
          </div>
        </div>
      )}
    </div>
  )
}
