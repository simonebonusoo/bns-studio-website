import { useEffect, useRef, useState, type ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"

/**
 * Reveal leggero: l'elemento sale e appare quando entra nello schermo.
 * Niente JavaScript a ogni frame: un IntersectionObserver aggiunge una
 * classe e la transizione CSS (solo opacity + transform) gira sul
 * compositor, quindi resta fluida anche su telefoni lenti.
 * `delay` sfasa gli elementi vicini (stagger).
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || reduce) return
    const io = new IntersectionObserver(
      ([e]) => {
        // visibile, oppure già sopra lo schermo (es. salto con un'ancora): mostra subito
        if (e.isIntersecting || e.boundingClientRect.bottom < 0) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduce])

  if (reduce) return <div className={className}>{children}</div>

  return (
    <div
      ref={ref}
      className={`reveal ${shown ? "is-shown" : ""} ${className ?? ""}`}
      style={{ transitionDelay: shown ? `${Math.min(delay, 0.4)}s` : "0s" }}
    >
      {children}
    </div>
  )
}

/** Reveal a tempo (per ciò che è già visibile al caricamento, es. hero). */
export function TimeReveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  )
}
