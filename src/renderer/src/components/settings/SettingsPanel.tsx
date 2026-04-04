import type { ReactElement } from 'react'
import { useCallback, useEffect, useState } from 'react'

import { ProviderForm } from './ProviderForm'
import { WebSearchSettings } from './WebSearchSettings'

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

interface WebSearchData {
  hasTavilyApiKey: boolean
}

export function SettingsPanel({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}): ReactElement | null {
  const [providers, setProviders] = useState<ProviderData[]>([])
  const [webSearch, setWebSearch] = useState<WebSearchData | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [addingCustom, setAddingCustom] = useState(false)
  const [activeTab, setActiveTab] = useState<'models' | 'websearch'>('models')

  const loadProviders = useCallback(async () => {
    const data = (await window.api.getProviders()) as ProviderData[]
    setProviders(data)
  }, [])

  const loadWebSearch = useCallback(async () => {
    const data = await window.api.getWebSearchConfig()
    setWebSearch(data)
  }, [])

  useEffect(() => {
    if (open) {
      void loadProviders()
      void loadWebSearch()
    }
  }, [open, loadProviders, loadWebSearch])

  useEffect(() => {
    const unsub = window.api.onConfigChanged(() => {
      void loadProviders()
    })
    return unsub
  }, [loadProviders])

  if (!open) return null

  const configured = providers.filter((p) => p.hasApiKey)
  const unconfigured = providers.filter((p) => !p.hasApiKey && p.isBuiltIn)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative z-10 flex h-[min(720px,calc(100vh-32px))] w-[min(720px,calc(100vw-32px))] min-w-0 flex-col overflow-hidden rounded-2xl bg-[#0f0f0f] shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
        <section className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between bg-[#161616] px-5 py-4">
            <div>
              <div className="text-xs text-[#999]">settings</div>
              <div className="mt-1 text-[11px] text-[#666]">
                Manage providers, models, and web search.
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded p-1 text-[#666] transition hover:text-[#ccc]"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex gap-1 bg-[#1b1b1b] px-5 py-3">
            <button
              type="button"
              onClick={() => setActiveTab('models')}
              className={`rounded px-2.5 py-1 text-[11px] transition ${
                activeTab === 'models'
                  ? 'bg-[#1e1e1e] text-[#ccc]'
                  : 'text-[#666] hover:text-[#999]'
              }`}
            >
              models
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('websearch')}
              className={`rounded px-2.5 py-1 text-[11px] transition ${
                activeTab === 'websearch'
                  ? 'bg-[#1e1e1e] text-[#ccc]'
                  : 'text-[#666] hover:text-[#999]'
              }`}
            >
              web search
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5">
            {activeTab === 'models' ? (
              <>
                {configured.length > 0 && (
                  <section className="mb-5">
                    <h3 className="mb-2 text-[11px] uppercase tracking-wider text-[#555]">
                      Configured
                    </h3>
                    <div className="space-y-1.5">
                      {configured.map((p) => (
                        <div key={p.id}>
                          <button
                            type="button"
                            onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                            className="flex w-full items-center justify-between rounded bg-[#1a1a1a] px-3 py-2.5 text-left text-xs transition hover:bg-[#222]"
                          >
                            <div className="flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#4af626]" />
                              <span className="text-[#ccc]">{p.displayName}</span>
                              <span className="text-[#555]">{p.models.length} models</span>
                            </div>
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className={`text-[#555] transition ${expandedId === p.id ? 'rotate-180' : ''}`}
                            >
                              <path d="M6 9l6 6 6-6" />
                            </svg>
                          </button>
                          {expandedId === p.id && (
                            <div className="mt-1.5">
                              <ProviderForm
                                provider={p}
                                onSave={async (updated) => {
                                  await window.api.saveProvider(updated)
                                  void loadProviders()
                                }}
                                onDelete={
                                  p.isBuiltIn
                                    ? undefined
                                    : async () => {
                                        await window.api.deleteProvider(p.id)
                                        setExpandedId(null)
                                        void loadProviders()
                                      }
                                }
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {unconfigured.length > 0 && (
                  <section className="mb-5">
                    <h3 className="mb-2 text-[11px] uppercase tracking-wider text-[#555]">
                      {configured.length === 0 ? 'Add an API key to get started' : 'Available'}
                    </h3>
                    <div className="space-y-1.5">
                      {unconfigured.map((p) => (
                        <div key={p.id}>
                          <button
                            type="button"
                            onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                            className="flex w-full items-center justify-between rounded bg-[#141414] px-3 py-2.5 text-left text-xs transition hover:bg-[#1a1a1a]"
                          >
                            <span className="text-[#888]">{p.displayName}</span>
                            <span className="text-[#555]">+ add key</span>
                          </button>
                          {expandedId === p.id && (
                            <div className="mt-1.5">
                              <ProviderForm
                                provider={p}
                                onSave={async (updated) => {
                                  await window.api.saveProvider(updated)
                                  void loadProviders()
                                }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <section>
                  {!addingCustom ? (
                    <button
                      type="button"
                      onClick={() => setAddingCustom(true)}
                      className="flex w-full items-center justify-center gap-1.5 rounded bg-[#181818] px-3 py-2.5 text-xs text-[#666] transition hover:bg-[#202020] hover:text-[#999]"
                    >
                      + custom provider
                    </button>
                  ) : (
                    <div className="rounded bg-[#181818] p-3">
                      <ProviderForm
                        provider={null}
                        onSave={async (provider) => {
                          await window.api.saveProvider(provider)
                          setAddingCustom(false)
                          void loadProviders()
                        }}
                        onCancel={() => setAddingCustom(false)}
                      />
                    </div>
                  )}
                </section>
              </>
            ) : (
              <WebSearchSettings
                settings={webSearch}
                onSave={async (data) => {
                  await window.api.saveWebSearchConfig(data)
                  await loadWebSearch()
                }}
              />
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
