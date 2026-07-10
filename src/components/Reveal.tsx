import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"

/**
 * Reveal on-scroll basato su IntersectionObserver + CSS transition.
 * Anima solo transform e opacity (niente layout). Rispetta prefers-reduced-motion.
 */
export function Reveal({
  children,
  delay = 0,
}: {
  children: ReactNode
  delay?: number
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "-10% 0px -10% 0px" },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      data-reveal
      data-visible={visible ? "true" : "false"}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  )
}
