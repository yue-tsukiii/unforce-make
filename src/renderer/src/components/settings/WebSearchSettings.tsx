import type { FormEvent, ReactElement } from 'react'
import { useState } from 'react'

interface WebSearchData {
  hasTavilyApiKey: boolean
}

export function WebSearchSettings({
  settings,
  onSave,
}: {
  settings: WebSearchData | null
  onSave: (data: { tavilyApiKey?: string }) => Promise<void>
}): ReactElement {
  const [tavilyApiKey, setTavilyApiKey] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const inputClass =
    'w-full rounded border border-[#2a2a2a] bg-[#0c0c0c] px-2.5 py-1.5 text-[12px] text-[#ccc] placeholder:text-[#444] focus:border-[#4af626] focus:outline-none'

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    setError(null)
    setSaved(false)

    if (!settings?.hasTavilyApiKey && !tavilyApiKey.trim()) {
      setError('Tavily API key is required')
      return
    }

    setSaving(true)
    try {
      await onSave({
        tavilyApiKey: tavilyApiKey.trim() || undefined,
      })
      setTavilyApiKey('')
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section>
      <h3 className="mb-2 text-[11px] uppercase tracking-wider text-[#555]">Web Search</h3>
      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="space-y-3 rounded border border-[#2a2a2a] bg-[#161616] p-3"
      >
        <div className="flex items-center justify-between text-[12px]">
          <span className="text-[#ccc]">Tavily</span>
          <span className={settings?.hasTavilyApiKey ? 'text-[#4af626]' : 'text-[#666]'}>
            {settings?.hasTavilyApiKey ? 'configured' : 'not configured'}
          </span>
        </div>

        <p className="text-[12px] leading-relaxed text-[#777]">
          Enables the <code>web_search</code> and <code>web_extract</code> tools.
        </p>

        <div>
          <label className="mb-1 block text-[11px] text-[#666]">Tavily API Key</label>
          <input
            type="password"
            value={tavilyApiKey}
            onChange={(e) => setTavilyApiKey(e.target.value)}
            placeholder={
              settings?.hasTavilyApiKey ? 'leave blank to keep current key' : 'enter key'
            }
            className={inputClass}
          />
        </div>

        {error && <p className="text-[11px] text-[#e06c75]">{error}</p>}
        {saved && <p className="text-[11px] text-[#4af626]">saved</p>}

        <div className="pt-1">
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-[#4af626] px-3 py-1.5 text-[11px] font-medium text-black transition hover:bg-[#3dd51e] disabled:opacity-50"
          >
            {saving ? 'saving...' : 'save'}
          </button>
        </div>
      </form>
    </section>
  )
}
