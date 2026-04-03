import type { DependencyList, RefObject } from 'react'
import { useEffect, useRef } from 'react'

export function useAutoScroll(deps: DependencyList): RefObject<HTMLDivElement | null> {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = scrollRef.current
    if (element) {
      element.scrollTop = element.scrollHeight
    }
    // biome-ignore lint/correctness/useExhaustiveDependencies: deps forwarded from caller
  }, deps)

  return scrollRef
}
