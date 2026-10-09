/**
 * MotionLab — demo di motion design legato allo scroll per BNS Studio.
 * Route: /motion-lab
 *
 * Ogni sezione è indipendente: puoi copiare il blocco che ti piace
 * dentro una sezione reale del sito. Tutto usa framer-motion (già nel
 * progetto) e funziona con Lenis perché Lenis scrolla la finestra nativa.
 */
import { useLayoutEffect, useRef, useState, type ReactNode } from "react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useAnimationFrame,
  useMotionValue,
  useInView,
  animate,
  type MotionValue,
} from "framer-motion"

const Y = "#e3f503"
const EASE = [0.16, 1, 0.3, 1] as const

/* ---------- etichetta demo ---------- */
function Tag({ n, label }: { n: string; label: string }) {
  return (
    <div className="pointer-events-none absolute left-4 top-24 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white/60 backdrop-blur md:left-10">
      <span style={{ color: Y }}>{n}</span>
      <span>{label}</span>
    </div>
  )
}

/* =========================================================
   01 — Hero: split-text mask reveal + zoom-out allo scroll
   ========================================================= */
function SplitWords({ text, delay = 0, accent = [] as string[] }: { text: string; delay?: number; accent?: string[] }) {
  const words = text.split(" ")
  return (
    <>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="inline-block"
            style={{ color: accent.includes(w) ? Y : undefined }}
            initial={{ y: "110%", rotate: 4 }}
            animate={{ y: "0%", rotate: 0 }}
            transition={{ duration: 1.1, ease: EASE, delay: delay + i * 0.06 }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </>
  )
}

function HeroDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.82])
  const radius = useTransform(scrollYProgress, [0, 1], [0, 48])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2])
  const gridY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"])
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"])

  return (
    <section ref={ref} className="relative h-[180vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          style={{ scale, borderRadius: radius, opacity }}
          className="relative flex h-full w-full items-center justify-center overflow-hidden border border-white/10 bg-[#0e0e10]"
        >
          <motion.div
            style={{ y: gridY }}
            className="absolute inset-[-20%] opacity-40 [background-image:linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:64px_64px]"
          />
          <div
            className="absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
            style={{ background: `${Y}22` }}
          />
          <Tag n="01" label="Split text + zoom out" />
          <motion.div style={{ y: titleY }} className="relative px-4 text-center">
            <h1 className="mx-auto max-w-5xl text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl lg:text-8xl">
              <SplitWords text="Next-gen creative studio for growing brands." accent={["Next-gen", "brands."]} />
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.7 }}
              className="mx-auto mt-6 max-w-xl text-white/60 md:text-lg"
            >
              Scorri: la scena si allontana come un sipario.
            </motion.p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-white/40"
          >
            scroll
            <span className="relative h-10 w-px overflow-hidden bg-white/10">
              <motion.span
                className="absolute left-0 top-0 h-1/2 w-px"
                style={{ background: Y }}
                animate={{ y: ["-100%", "200%"] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

/* =========================================================
   02 — Manifesto: le parole si accendono mentre scorri
   ========================================================= */
function Word({ children, range, progress }: { children: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.12, 1])
  const y = useTransform(progress, range, [6, 0])
  const isAccent = ["design,", "tecnologia", "AI"].includes(children)
  return (
    <motion.span style={{ opacity, y, color: isAccent ? Y : undefined }} className="mr-[0.25em] inline-block">
      {children}
    </motion.span>
  )
}

function ManifestoDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })
  const text =
    "Lavoriamo tra design, tecnologia e AI per costruire brand che si riconoscono al primo sguardo e durano nel tempo. Niente template: ogni progetto nasce da zero, con cura per ogni dettaglio."
  const words = text.split(" ")
  return (
    <section ref={ref} className="relative h-[260vh]">
      <div className="sticky top-0 flex h-screen items-center">
        <Tag n="02" label="Text fill on scroll" />
        <div className="mx-auto max-w-6xl px-4 md:px-10">
          <div className="mb-6 text-xs uppercase tracking-[0.22em] text-white/50">Manifesto</div>
          <p className="text-3xl font-semibold leading-[1.15] tracking-tight md:text-5xl lg:text-6xl">
            {words.map((w, i) => {
              const start = i / words.length
              return (
                <Word key={i} progress={scrollYProgress} range={[start * 0.9, start * 0.9 + 0.1]}>
                  {w}
                </Word>
              )
            })}
          </p>
        </div>
      </div>
    </section>
  )
}

/* =========================================================
   03 — Galleria orizzontale "pinned"
   ========================================================= */
const services = [
  ["Brand Identity", "Logo, palette, tipografia e direzione estetica."],
  ["Web Design", "Siti e landing essenziali, veloci, che convertono."],
  ["UI Design", "Interfacce chiare per prodotti e piattaforme."],
  ["AI Shooting", "Immagini e campagne guidate dall'AI."],
  ["Social Content", "Contenuti coordinati con continuità visiva."],
  ["E-commerce", "Shop curati, dalla scheda prodotto al checkout."],
]

function HorizontalDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [dist, setDist] = useState(0)

  useLayoutEffect(() => {
    const measure = () => {
      if (track.current) setDist(track.current.scrollWidth - window.innerWidth)
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })
  const x = useTransform(smooth, [0, 1], [0, -dist])
  const bar = useTransform(smooth, [0, 1], ["0%", "100%"])

  return (
    <section ref={ref} className="relative h-[400vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <Tag n="03" label="Pinned horizontal scroll" />
        <div className="mb-10 px-4 md:px-10">
          <div className="text-xs uppercase tracking-[0.22em] text-white/50">Servizi</div>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
            Cosa <span style={{ color: Y }}>facciamo</span>
          </h2>
        </div>
        <motion.div ref={track} style={{ x }} className="flex w-max gap-5 px-4 md:gap-8 md:px-10">
          {services.map(([t, d], i) => (
            <Card key={t} i={i} title={t} desc={d} progress={smooth} total={services.length} />
          ))}
        </motion.div>
        <div className="mx-4 mt-10 h-px bg-white/10 md:mx-10">
          <motion.div className="h-px" style={{ width: bar, background: Y }} />
        </div>
      </div>
    </section>
  )
}

function Card({ i, title, desc, progress, total }: { i: number; title: string; desc: string; progress: MotionValue<number>; total: number }) {
  const center = i / (total - 1)
  const rotate = useTransform(progress, [center - 0.3, center, center + 0.3], [6, 0, -6])
  return (
    <motion.article
      style={{ rotate }}
      className="group relative flex h-[52vh] w-[78vw] shrink-0 flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.01] p-7 sm:w-[46vw] lg:w-[30vw]"
    >
      <span className="text-sm font-semibold" style={{ color: Y }}>
        0{i + 1}
      </span>
      <div
        className="absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `${Y}33` }}
      />
      <div>
        <h3 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h3>
        <p className="mt-3 max-w-sm text-white/60">{desc}</p>
      </div>
    </motion.article>
  )
}

/* =========================================================
   04 — Stacking cards (processo)
   ========================================================= */
const steps = [
  ["Raccontaci il progetto", "Obiettivi, visione, priorità. Definiamo lo scope insieme, senza costi nascosti."],
  ["Progettiamo & sviluppiamo", "Identità, design, sviluppo e AI su misura, con aggiornamenti costanti."],
  ["Revisioni & consegna", "Affiniamo con revisioni rapide e consegniamo tutto pronto all'uso."],
]

function StackDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })
  return (
    <section ref={ref} className="relative px-4 pb-[20vh] md:px-10">
      <div className="relative mx-auto max-w-5xl pt-32">
        <Tag n="04" label="Stacking cards" />
        <h2 className="mb-12 text-4xl font-semibold tracking-tight md:text-6xl">
          Come <span style={{ color: Y }}>lavoriamo</span>
        </h2>
        {steps.map(([t, d], i) => (
          <StackCard key={t} i={i} title={t} desc={d} progress={scrollYProgress} total={steps.length} />
        ))}
      </div>
    </section>
  )
}

function StackCard({ i, title, desc, progress, total }: { i: number; title: string; desc: string; progress: MotionValue<number>; total: number }) {
  const start = i / total
  const targetScale = 1 - (total - 1 - i) * 0.05
  const scale = useTransform(progress, [start, 1], [1, targetScale])
  const dim = useTransform(progress, [start, 1], [0, (total - 1 - i) * 0.25])
  const highlight = i === 1
  return (
    <div className="sticky top-0 flex h-screen items-center" style={{ paddingTop: i * 28 }}>
      <motion.div
        style={{ scale, transformOrigin: "top center", background: highlight ? Y : "#141416" }}
        className={`relative grid h-[60vh] w-full overflow-hidden rounded-[2rem] border border-white/10 p-8 md:grid-cols-[auto_1fr] md:gap-16 md:p-14 ${highlight ? "text-black" : ""}`}
      >
        <div className="text-[18vw] font-semibold leading-none tracking-tighter opacity-90 md:text-[10rem]">0{i + 1}</div>
        <div className="self-end">
          <h3 className="text-3xl font-semibold tracking-tight md:text-5xl">{title}</h3>
          <p className={`mt-4 max-w-md text-lg ${highlight ? "text-black/70" : "text-white/60"}`}>{desc}</p>
        </div>
        <motion.div style={{ opacity: dim }} className="pointer-events-none absolute inset-0 bg-black" />
      </motion.div>
    </div>
  )
}

/* =========================================================
   05 — Marquee guidato dalla velocità di scroll
   ========================================================= */
function wrap(min: number, max: number, v: number) {
  const r = max - min
  return ((((v - min) % r) + r) % r) + min
}

function VelocityRow({ children, base }: { children: ReactNode; base: number }) {
  const x = useMotionValue(0)
  const { scrollY } = useScroll()
  const vel = useVelocity(scrollY)
  const smoothVel = useSpring(vel, { damping: 50, stiffness: 400 })
  const factor = useTransform(smoothVel, [-1000, 0, 1000], [-5, 0, 5], { clamp: false })
  const skew = useTransform(smoothVel, [-2000, 0, 2000], [8, 0, -8])
  const dir = useRef(1)
  const wx = useTransform(x, (v) => `${wrap(-50, 0, v)}%`)

  useAnimationFrame((_, delta) => {
    let move = dir.current * base * (delta / 1000)
    const f = factor.get()
    if (f < 0) dir.current = -1
    else if (f > 0) dir.current = 1
    move += dir.current * move * Math.abs(f)
    x.set(x.get() + move)
  })

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div style={{ x: wx, skewX: skew }} className="flex w-max">
        {children}
        {children}
      </motion.div>
    </div>
  )
}

function MarqueeDemo() {
  const items = ["Brand Identity", "Web Design", "UI Design", "AI Shooting", "E-commerce", "Creative Direction"]
  const Row = ({ outline }: { outline?: boolean }) => (
    <div className="flex shrink-0 items-center">
      {items.map((t) => (
        <span key={t} className="flex items-center">
          <span
            className="px-6 text-6xl font-semibold uppercase tracking-tight md:text-8xl"
            style={outline ? { WebkitTextStroke: "1px rgba(255,255,255,.35)", color: "transparent" } : undefined}
          >
            {t}
          </span>
          <span className="text-4xl" style={{ color: Y }}>
            ✦
          </span>
        </span>
      ))}
    </div>
  )
  return (
    <section className="relative space-y-4 border-y border-white/10 py-24">
      <Tag n="05" label="Scroll-velocity marquee" />
      <VelocityRow base={-2}>
        <Row />
      </VelocityRow>
      <VelocityRow base={2}>
        <Row outline />
      </VelocityRow>
      <p className="pt-6 text-center text-xs uppercase tracking-[0.22em] text-white/40">
        Scorri veloce su e giù: cambia velocità e direzione
      </p>
    </section>
  )
}

/* =========================================================
   06 — Numeri + linea SVG che si disegna
   ========================================================= */
function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-20%" })
  const [v, setV] = useState(0)
  useLayoutEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration: 1.8, ease: EASE, onUpdate: (n) => setV(Math.round(n)) })
    return () => c.stop()
  }, [inView, to])
  return (
    <span ref={ref}>
      {v}
      {suffix}
    </span>
  )
}

function StatsDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] })
  const path = useSpring(scrollYProgress, { stiffness: 80, damping: 25 })
  const stats: [number, string, string][] = [
    [100, "k+", "Visualizzazioni"],
    [50, "+", "Progetti"],
    [58, "%", "Clienti da referral"],
    [10, "k+", "Ore di lavoro"],
  ]
  return (
    <section ref={ref} className="relative px-4 py-40 md:px-10">
      <Tag n="06" label="SVG draw + counters" />
      <svg viewBox="0 0 1200 300" className="pointer-events-none absolute inset-x-0 top-1/2 w-full -translate-y-1/2 opacity-40" fill="none">
        <motion.path
          d="M0 220 C 200 220, 250 60, 420 80 S 650 260, 800 180 S 1050 40, 1200 70"
          stroke={Y}
          strokeWidth="2"
          style={{ pathLength: path }}
        />
      </svg>
      <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-10 md:grid-cols-4">
        {stats.map(([n, s, l], i) => (
          <motion.div
            key={l}
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.9, ease: EASE, delay: i * 0.1 }}
          >
            <div className="text-5xl font-semibold tracking-tight md:text-7xl">
              <Counter to={n} suffix={s} />
            </div>
            <div className="mt-2 text-sm text-white/50">{l}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* =========================================================
   07 — CTA: clip-path che si espande a tutto schermo
   ========================================================= */
function CtaDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start start"] })
  const inset = useTransform(scrollYProgress, [0, 1], [22, 0])
  const r = useTransform(scrollYProgress, [0, 1], [40, 0])
  const clip = useTransform([inset, r] as MotionValue<number>[], ([i, rr]) => `inset(${i}% ${i}% ${i}% ${i}% round ${rr}px)`)
  const textScale = useTransform(scrollYProgress, [0, 1], [0.7, 1])
  return (
    <section ref={ref} className="relative h-[200vh]">
      <div className="sticky top-0 h-screen">
        <motion.div
          style={{ clipPath: clip, background: Y }}
          className="flex h-full w-full flex-col items-center justify-center text-black"
        >
          <motion.div style={{ scale: textScale }} className="text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-black/60">07 — Clip-path expand</div>
            <h2 className="mt-4 text-6xl font-semibold leading-[0.95] tracking-tighter md:text-9xl">
              Let's build
              <br />
              something.
            </h2>
            <a
              href="/#contatti"
              className="mt-10 inline-flex items-center gap-3 rounded-full bg-black px-7 py-4 text-sm font-semibold text-white transition-transform hover:scale-105"
            >
              Richiedi un progetto →
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

/* ---------- barra di progresso pagina ---------- */
function PageProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40 })
  return <motion.div style={{ scaleX, background: Y }} className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left" />
}

/* ---------- versione statica per "riduci movimento" ---------- */
function ReducedNotice() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-40 text-center text-white/70">
      Il tuo sistema ha attivo “Riduci movimento”: le animazioni di questa demo sono disattivate per rispetto
      dell'accessibilità. Disattivalo nelle impostazioni per vederle.
    </div>
  )
}

export function MotionLabPage() {
  const reduce = useReducedMotion()
  if (reduce) return <ReducedNotice />
  return (
    <main className="relative">
      <PageProgress />
      <HeroDemo />
      <ManifestoDemo />
      <HorizontalDemo />
      <StackDemo />
      <MarqueeDemo />
      <StatsDemo />
      <CtaDemo />
    </main>
  )
}
