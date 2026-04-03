import type { FormEvent, ReactElement } from 'react'
import { useMemo, useState } from 'react'

const PROTOCOL_OPTIONS = [
  {
    value: 'openai-compatible',
    label: 'OpenAI Compatible',
    api: 'openai-completions',
    provider: 'openai',
  },
  {
    value: 'anthropic-compatible',
    label: 'Anthropic Compatible',
    api: 'anthropic-messages',
    provider: 'anthropic',
  },
  {
    value: 'google-compatible',
    label: 'Google Compatible',
    api: 'google-generative-ai',
    provider: 'google',
  },
] as const

interface ProviderData {
  id: string
  displayName: string
  api: string
  provider: string
  baseUrl: string
  hasApiKey: boolean
  protocol?: string
  models: {
    id: string
    name: string
    toolUse: boolean
    reasoning: boolean
    contextWindow: number
    maxTokens: number
  }[]
  isBuiltIn: boolean
}

interface ProviderSaveData {
  id: string
  displayName: string
  api: string
  provider: string
  baseUrl: string
  apiKey?: string
  protocol?: string
  models: ProviderData['models']
  isBuiltIn: boolean
}

export function ProviderForm({
  provider,
  onSave,
  onDelete,
  onCancel,
}: {
  provider: ProviderData | null
  onSave: (data: ProviderSaveData) => Promise<void>
  onDelete?: () => Promise<void>
  onCancel?: () => void
}): ReactElement {
  const isBuiltIn = provider?.isBuiltIn ?? false
  const builtInModelIds = useMemo(
    () => new Set(isBuiltIn ? (provider?.models ?? []).map((m) => m.id) : []),
    [isBuiltIn, provider?.models],
  )

  const [apiKey, setApiKey] = useState('')
  const [displayName, setDisplayName] = useState(provider?.displayName ?? '')
  const [protocol, setProtocol] = useState(provider?.protocol ?? 'openai-compatible')
  const [baseUrl, setBaseUrl] = useState(provider?.baseUrl ?? '')
  const [modelInput, setModelInput] = useState('')
  const [models, setModels] = useState(provider?.models ?? [])
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{
    success: boolean
    error?: string
  } | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTest = async (): Promise<void> => {
    if (!provider?.id) return
    setTesting(true)
    setTestResult(null)
    try {
      const result = await window.api.testConnection(provider.id)
      setTestResult(result)
    } catch (err) {
      setTestResult({
        success: false,
        error: err instanceof Error ? err.message : 'Test failed',
      })
    } finally {
      setTesting(false)
    }
  }

  const handleAddModel = (): void => {
    const id = modelInput.trim()
    if (!id || models.some((m) => m.id === id)) return
    setModels([
      ...models,
      {
        id,
        name: id,
        toolUse: false,
        reasoning: false,
        contextWindow: 8192,
        maxTokens: 4096,
      },
    ])
    setModelInput('')
  }

  const handleRemoveModel = (modelId: string): void => {
    setModels(models.filter((m) => m.id !== modelId))
  }

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    setError(null)
    setSaving(true)

    try {
      if (isBuiltIn && provider) {
        await onSave({
          ...provider,
          models,
          apiKey: apiKey.trim() || undefined,
        })
      } else {
        if (!displayName.trim()) {
          setError('Display name is required')
          return
        }
        if (!baseUrl.trim()) {
          setError('Base URL is required')
          return
        }

        const protocolDef = PROTOCOL_OPTIONS.find((p) => p.value === protocol)!
        const id = provider?.id ?? `custom-${Date.now()}`

        await onSave({
          id,
          displayName: displayName.trim(),
          api: protocolDef.api,
          provider: protocolDef.provider,
          baseUrl: baseUrl.trim().replace(/\/$/, ''),
          apiKey: apiKey.trim() || undefined,
          protocol,
          models,
          isBuiltIn: false,
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'w-full rounded border border-[#2a2a2a] bg-[#0c0c0c] px-2.5 py-1.5 text-[12px] text-[#ccc] placeholder:text-[#444] focus:border-[#4af626] focus:outline-none'

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="space-y-3 rounded border border-[#2a2a2a] bg-[#161616] p-3"
    >
      <div>
        <label className="mb-1 block text-[11px] text-[#666]">API Key</label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder={provider?.hasApiKey ? 'leave blank to keep current key' : 'enter key'}
          className={inputClass}
        />
      </div>

      {!isBuiltIn && (
        <>
          <div>
            <label className="mb-1 block text-[11px] text-[#666]">Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g., Local Ollama"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-[11px] text-[#666]">Protocol</label>
            <select
              value={protocol}
              onChange={(e) => setProtocol(e.target.value)}
              className={inputClass}
            >
              {PROTOCOL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-[11px] text-[#666]">Base URL</label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="e.g., http://localhost:11434/v1"
              className={inputClass}
            />
          </div>
        </>
      )}

      <div>
        <label className="mb-1 block text-[11px] text-[#666]">
          {isBuiltIn ? 'Custom Models' : 'Models'}
        </label>
        {isBuiltIn && (
          <p className="mb-1.5 text-[10px] text-[#555]">
            Add model IDs not yet in the built-in list
          </p>
        )}
        <div className="space-y-1">
          {models
            .filter((m) => !isBuiltIn || !builtInModelIds.has(m.id))
            .map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between rounded bg-[#0c0c0c] px-2.5 py-1.5 text-[12px]"
              >
                <span className="text-[#999]">{m.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveModel(m.id)}
                  className="text-[#555] hover:text-[#e06c75]"
                >
                  x
                </button>
              </div>
            ))}
        </div>
        <div className="mt-1.5 flex gap-1.5">
          <input
            type="text"
            value={modelInput}
            onChange={(e) => setModelInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddModel()
              }
            }}
            placeholder="model id"
            className={`flex-1 ${inputClass}`}
          />
          <button
            type="button"
            onClick={handleAddModel}
            className="rounded border border-[#2a2a2a] bg-[#1e1e1e] px-2.5 py-1.5 text-[11px] text-[#999] hover:text-[#ccc]"
          >
            add
          </button>
        </div>
      </div>

      {error && <p className="text-[11px] text-[#e06c75]">{error}</p>}

      <div className="flex items-center gap-2 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="rounded bg-[#4af626] px-3 py-1.5 text-[11px] font-medium text-black transition hover:bg-[#3dd51e] disabled:opacity-50"
        >
          {saving ? 'saving...' : 'save'}
        </button>

        {provider && (
          <button
            type="button"
            onClick={() => void handleTest()}
            disabled={testing || !provider.hasApiKey}
            className="rounded border border-[#2a2a2a] px-3 py-1.5 text-[11px] text-[#999] transition hover:text-[#ccc] disabled:opacity-50"
          >
            {testing ? 'testing...' : 'test'}
          </button>
        )}

        {testResult && (
          <span
            className={`text-[11px] ${testResult.success ? 'text-[#4af626]' : 'text-[#e06c75]'}`}
          >
            {testResult.success ? 'ok' : testResult.error}
          </span>
        )}

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="ml-auto text-[11px] text-[#555] hover:text-[#999]"
          >
            cancel
          </button>
        )}

        {onDelete && (
          <button
            type="button"
            onClick={() => void onDelete()}
            className="ml-auto text-[11px] text-[#e06c75] hover:text-[#ff8a92]"
          >
            delete
          </button>
        )}
      </div>
    </form>
  )
}
