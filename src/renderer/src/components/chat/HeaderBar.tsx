import type { ReactElement } from 'react'

export function HeaderBar(): ReactElement {
  return (
    <header className="h-11 border-b border-[var(--term-border)] bg-[var(--term-bg)] pl-20 [-webkit-app-region:drag] select-none" />
  )
}
