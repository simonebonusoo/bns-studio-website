/**
 * Motion design legato allo scroll (stile pagine prodotto Apple/iOS).
 * Tutte le primitive rispettano "Riduci movimento" del sistema.
 */
import { createElement, type ElementType, type ReactNode } from "react"
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type Variants,
} from "framer-motion"
import { useEffect, useRef, useState, type RefObject } from "react"

export const EASE = [0.16, 1, 0.3, 1] as const

/* ------------------------------------------------------------------
   SplitHeading + W: titolo che entra parola per parola da una maschera
------------------------------------------------------------------- */
const wordVariants: Variants = {
  hidden: { y: "110%", rotate: 4 },
  show: { y: "0%", rotate: 0, transition: { duration: 1.1, ease: EASE } },
}

export function SplitHeading({
  as = "h1",
  className,
  children,
  delay = 0,
}: {
  as?: "h1" | "h2"
  className?: string
  children: ReactNode
  delay?: number
}) {
  const reduce = useReducedMotion()
  if (reduce) return createElement(as, { className }, children)
  const Tag = motion[as] as ElementType
  return (
    <Tag
      className={className}
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: delay } } }}
    >
      {children}
    </Tag>
  )
}

export function W({ children, className }: { children: string; className?: string }) {
  const words = children.split(" ")
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={i} className="-mb-[0.1em] inline-block overflow-hidden pb-[0.1em] align-bottom">
          <motion.span className="inline-block will-change-transform" variants={wordVariants}>
            {w}
          </motion.span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  )
}

/* ------------------------------------------------------------------
   VelocityMarquee: marquee infinito che accelera, cambia verso
   in base alla velocità di scroll.
------------------------------------------------------------------- */
function wrap(min: number, max: number, v: number) {
  const r = max - min
  return ((((v - min) % r) + r) % r) + min
}

export function VelocityMarquee({
  children,
  baseSpeed = 1.25,
  className,
}: {
  children: ReactNode
  /** % della larghezza al secondo */
  baseSpeed?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  const base = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 })
  const factor = useTransform(smooth, [0, 1000], [0, 5], { clamp: false })
  const dir = useRef(-1)
  const ref = useRef<HTMLDivElement>(null)
  const visible = useRef(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useAnimationFrame((_, delta) => {
    if (reduce || !visible.current) return
    let move = dir.current * baseSpeed * (Math.min(delta, 50) / 1000)
    const f = factor.get()
    if (f < 0) dir.current = 1
    else if (f > 0) dir.current = -1
    move += move * Math.abs(f)
    base.set(base.get() + move)
  })

  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`)

  return (
    <motion.div ref={ref} className={className} style={{ x, willChange: "transform" }}>
      {children}
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------
   Parallax: sposta il contenuto in verticale mentre attraversa lo
   schermo. speed > 0 = va più lento della pagina, < 0 = più veloce.
------------------------------------------------------------------- */
export function Parallax({ children, speed = 40, className }: { children: ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed])
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------
   useActive: "hover" che funziona anche senza mouse.
   - Con mouse/trackpad: attivo al passaggio del puntatore.
   - Su touch: attivo quando l'elemento passa al centro dello schermo.
------------------------------------------------------------------- */

export function useCanHover() {
  const [can, setCan] = useState(true)
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)")
    const update = () => setCan(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  return can
}

export function useActive(ref: RefObject<HTMLElement>) {
  const canHover = useCanHover()
  const [hovered, setHovered] = useState(false)
  const [centered, setCentered] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (canHover) {
      const on = () => setHovered(true)
      const off = () => setHovered(false)
      el.addEventListener("pointerenter", on)
      el.addEventListener("pointerleave", off)
      el.addEventListener("focusin", on)
      el.addEventListener("focusout", off)
      return () => {
        el.removeEventListener("pointerenter", on)
        el.removeEventListener("pointerleave", off)
        el.removeEventListener("focusin", on)
        el.removeEventListener("focusout", off)
      }
    }
    const io = new IntersectionObserver(([e]) => setCentered(e.isIntersecting), {
      rootMargin: "-42% 0px -42% 0px",
    })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, canHover])

  return { active: canHover ? hovered : centered, canHover }
}

/* ------------------------------------------------------------------
   InteractiveCard: inclinazione 3D + riflesso che segue il puntatore
   + leggero sollevamento. Su touch si "accende" al centro dello schermo.
------------------------------------------------------------------- */
export function InteractiveCard({
  children,
  className,
  tilt = 6,
  glow = "rgba(227,245,3,0.14)",
  radius = 22,
}: {
  children: ReactNode
  className?: string
  tilt?: number
  glow?: string
  radius?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { active, canHover } = useActive(ref as RefObject<HTMLElement>)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const spring = { stiffness: 220, damping: 22, mass: 0.6 }
  const rx = useSpring(useTransform(py, [0, 1], [tilt, -tilt]), spring)
  const ry = useSpring(useTransform(px, [0, 1], [-tilt, tilt]), spring)
  // Riflesso: un cerchio sfumato fisso che si sposta con transform (niente repaint del gradiente)
  const size = useRef({ w: 1, h: 1 })
  const gx = useTransform(px, (v) => v * size.current.w - 210)
  const gy = useTransform(py, (v) => v * size.current.h - 210)
  const rect = useRef<DOMRect | null>(null)

  const onEnter = () => {
    if (!ref.current) return
    rect.current = ref.current.getBoundingClientRect()
    size.current = { w: ref.current.offsetWidth, h: ref.current.offsetHeight }
  }
  const onMove = (e: React.PointerEvent) => {
    if (!canHover || reduce) return
    const r = rect.current
    if (!r) return
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const onLeave = () => {
    rect.current = null
    px.set(0.5)
    py.set(0.5)
  }

  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div
      ref={ref}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      animate={{ y: active ? -6 : 0, scale: active ? 1.015 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      style={{ rotateX: canHover ? rx : 0, rotateY: canHover ? ry : 0, transformPerspective: 900 }}
      className={`relative ${className ?? ""}`}
      data-active={active || undefined}
    >
      {children}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ borderRadius: radius }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="absolute left-0 top-0 h-[420px] w-[420px] rounded-full"
          style={{
            left: canHover ? 0 : "50%",
            x: canHover ? gx : "-50%",
            y: canHover ? gy : -110,
            background: `radial-gradient(circle at center, ${glow}, transparent 60%)`,
          }}
        />
      </motion.div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------
   Magnetic: l'elemento viene "attirato" dal puntatore (solo mouse).
------------------------------------------------------------------- */
export function Magnetic({ children, strength = 0.3 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const canHover = useCanHover()
  const reduce = useReducedMotion()
  const x = useSpring(0, { stiffness: 250, damping: 18, mass: 0.5 })
  const y = useSpring(0, { stiffness: 250, damping: 18, mass: 0.5 })
  if (!canHover || reduce) return <>{children}</>
  return (
    <motion.div
      ref={ref}
      className="inline-block"
      style={{ x, y }}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * strength)
        y.set((e.clientY - (r.top + r.height / 2)) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

/* Parola gigante gialla che scorre in orizzontale con lo scroll. */
export function GiantWord({ word, from, to, className, size = "text-[23vw]" }: { word: string; from: string; to: string; className?: string; size?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const x = useTransform(scrollYProgress, [0, 1], [from, to])
  return (
    <div ref={ref} aria-hidden className={`pointer-events-none select-none overflow-hidden ${className ?? ""}`}>
      <motion.div
        style={reduce ? undefined : { x }}
        className={`whitespace-nowrap ${size} font-semibold leading-[0.78] tracking-[-0.06em] text-[#e3f503]`}
      >
        {word}
      </motion.div>
    </div>
  )
}

