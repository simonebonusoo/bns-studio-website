import { useRef, type ReactNode } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"

/**
 * Reveal legato allo scroll (stile pagine prodotto Apple).
 * L'elemento sale, cresce appena e appare in base alla sua posizione
 * nello schermo: segue il dito/la rotella e torna indietro se risali.
 * `delay` sfasa l'ingresso degli elementi vicini (stagger).
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
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 100%", "start 78%"] })

  const d = Math.min(delay * 2.5, 0.45)
  const opacity = useTransform(scrollYProgress, [d, 1], [0, 1])
  const y = useTransform(scrollYProgress, [d, 1], [48, 0])
  const scale = useTransform(scrollYProgress, [d, 1], [0.97, 1])

  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div ref={ref} className={className} style={{ opacity, y, scale, willChange: "opacity, transform" }}>
      {children}
    </motion.div>
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
