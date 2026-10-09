import { useRef, type ReactNode, type RefObject } from "react"
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion"

import { Container } from "../components/Container"
import { Reveal } from "../components/Reveal"
import { useActive } from "../components/motion"

function RocketIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  )
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3 1.9 4.9L19 9.8l-4.1 2.9L16 18l-4-2.9L8 18l1.1-5.3L5 9.8l5.1-1.9L12 3Z" />
    </svg>
  )
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M21 3v5h-5M3 21v-5h5" />
    </svg>
  )
}

const steps: { icon: ReactNode; title: string; desc: string }[] = [
  {
    icon: <RocketIcon />,
    title: "Raccontaci il progetto",
    desc: "Ci condividi obiettivi e visione: definiamo insieme scope, direzione e priorità, senza pensieri sui costi nascosti.",
  },
  {
    icon: <SparkIcon />,
    title: "Progettiamo & sviluppiamo",
    desc: "Il team crea identità, design, sviluppo e AI su misura, con aggiornamenti costanti in pochi giorni.",
  },
  {
    icon: <RefreshIcon />,
    title: "Revisioni & consegna",
    desc: "Affiniamo con revisioni rapide e consegniamo tutto pronto all'uso, curato in ogni dettaglio.",
  },
]

/**
 * Una card del processo: resta agganciata in alto mentre la successiva
 * sale sovrapponendosi; quelle sotto arretrano e si scuriscono.
 */
function StepCard({
  step,
  idx,
  total,
  progress,
}: {
  step: (typeof steps)[number]
  idx: number
  total: number
  progress: MotionValue<number>
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { active } = useActive(ref as RefObject<HTMLElement>)
  const behind = total - 1 - idx
  const start = idx / total
  const scale = useTransform(progress, [start, 1], [1, 1 - behind * 0.05])
  const dim = useTransform(progress, [start, 1], [0, behind * 0.35])
  const accent = idx === 1 // la card centrale è gialla, come accento

  return (
    <div
      className="sticky"
      style={{ top: `calc(120px + ${idx * 28}px)`, marginBottom: idx < total - 1 ? "22vh" : 0 }}
    >
      <motion.div
        ref={ref}
        style={reduce ? undefined : { scale, transformOrigin: "top center" }}
        className={`relative grid min-h-[56vh] cursor-default overflow-hidden rounded-[32px] border p-7 md:grid-cols-[1fr_1.1fr] md:gap-12 md:p-12 ${
          accent ? "border-transparent bg-[#e3f503] text-black" : "border-white/10 bg-[#111113] text-white"
        }`}
      >
        {/* numero gigante, come le parole della sezione Chi siamo */}
        <motion.div
          animate={{ x: active ? 10 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className={`select-none text-[34vw] font-semibold leading-[0.78] tracking-[-0.07em] md:text-[15rem] ${
            accent ? "text-black" : "text-[#e3f503]"
          }`}
        >
          0{idx + 1}
        </motion.div>

        <div className="mt-8 flex flex-col justify-end md:mt-0">
          <motion.div
            animate={{ rotate: active ? 20 : 0, scale: active ? 1.1 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className={`mb-8 flex h-14 w-14 items-center justify-center rounded-full ${
              accent ? "bg-black text-[#e3f503]" : "bg-[#e3f503] text-black"
            }`}
          >
            {step.icon}
          </motion.div>
          <h3 className="text-3xl font-semibold tracking-tight md:text-5xl">{step.title}</h3>
          <p className={`mt-4 max-w-md text-base leading-relaxed md:text-lg ${accent ? "text-black/70" : "text-white/60"}`}>
            {step.desc}
          </p>
        </div>

        <motion.div aria-hidden style={{ opacity: reduce ? 0 : dim }} className="pointer-events-none absolute inset-0 bg-black" />
      </motion.div>
    </div>
  )
}

export function Process() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })

  return (
    <section id="processo" className="scroll-mt-24 py-12 md:py-16">
      <Container>
        <div className="border-b border-white/10 pb-6">
          <Reveal>
            <div className="text-xs uppercase tracking-[0.22em] text-[#e3f503]/80">Come lavoriamo</div>
            <h2 className="mt-3 text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl">
              Building <span className="text-[#e3f503]">Creative</span> Solutions
            </h2>
          </Reveal>
        </div>

        <div ref={ref} className="relative mt-10 pb-10">
          {steps.map((step, idx) => (
            <StepCard key={step.title} step={step} idx={idx} total={steps.length} progress={scrollYProgress} />
          ))}
        </div>
      </Container>
    </section>
  )
}
