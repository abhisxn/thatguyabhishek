'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

// Polls router.refresh() in dev so Notion changes appear without a hard reload.
// Only refreshes when the tab is visible to avoid rate-limiting Notion.
// Rendered only when NODE_ENV === 'development' — stripped in production builds.
export default function DevLiveReload({ intervalMs = 30000 }) {
  const router = useRouter()
  const timerRef = useRef(null)

  useEffect(() => {
    const start = () => {
      timerRef.current = setInterval(() => {
        if (document.visibilityState === 'visible') {
          router.refresh()
        }
      }, intervalMs)
    }

    const stop = () => clearInterval(timerRef.current)

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        router.refresh() // immediate refresh on tab focus
        start()
      } else {
        stop()
      }
    }

    start()
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [router, intervalMs])

  return null
}
