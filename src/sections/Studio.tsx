import { useRef } from "react"
import type { RefObject } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"

import { Container } from "../components/Container"
import { Reveal } from "../components/Reveal"
import { GiantWord, Magnetic, useActive } from "../components/motion"

const features = [
  {
    title: "Approccio su misura",
    desc: "Ogni progetto parte dagli obiettivi reali del brand, non da template.",
  },
  {
    title: "Team creativo",
    desc: "Design, sviluppo e direzione creativa sotto lo stesso tetto.",
  },
  {
    title: "AI & Tecnologia",
    desc: "Strumenti e AI su misura per risultati concreti e scalabili.",
  },
]

/* Punto della riga di dettagli: il pallino si accende al passaggio. */
function Feature({ idx, title, desc }: { idx: number; title: string; desc: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { active } = useActive(ref as RefObject<HTMLElement>)
  return (
    <div ref={ref} className="relative cursor-default pt-14 md:pt-16">
      {/* numero gigante a contorno, si riempie quando attivo */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -top-1 left-0 text-[4.25rem] md:-top-2 md:text-[5.5rem] font-semibold leading-none tracking-[-0.06em]"
        style={{ WebkitTextStroke: "1px rgba(255,255,255,0.14)" }}
        animate={{ color: active ? "rgba(227,245,3,0.9)" : "rgba(227,245,3,0)", y: active ? -6 : 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        0{idx + 1}
      </motion.span>
      <motion.div
        className="relative"
        animate={{ x: active ? 8 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      >
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/55">{desc}</p>
      </motion.div>
    </div>
  )
}

export function Studio() {
  const photoRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: photoRef, offset: ["start end", "end start"] })
  const photoY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"])
  const photoColor = useTransform(scrollYProgress, [0.3, 0.55], [0, 1])

  return (
    <section id="studio" className="relative scroll-mt-24 overflow-hidden py-12 md:py-20">
      {/* riga di dettagli con linee, come un'etichetta editoriale */}
      <Container>
        <Reveal>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 text-[11px] uppercase tracking-[0.22em] text-white/55">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#e3f503]" />
              Chi siamo
            </span>
            <span className="hidden h-px w-16 bg-white/15 sm:block" />
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
              Design · Tecnologia · AI
            </span>
            <span className="hidden h-px w-16 bg-white/15 sm:block" />
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
              Studio indipendente
            </span>
          </div>
        </Reveal>
      </Container>

      {/* parola gigante in alto: scorre verso sinistra */}
      <GiantWord word="creativo" from="4%" to="-30%" className="mt-8 md:mt-14" />

      <Container>
        <div className="relative z-10 -mt-[3vw] grid items-center md:-mt-[6vw] gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-14">
          {/* foto: parallax interno, da bianco e nero a colore quando è al centro */}
          <Reveal>
            <div ref={photoRef} className="relative aspect-[5/4] w-full overflow-hidden rounded-[24px] border border-white/10 sm:aspect-[4/5] md:max-w-[30rem]">
              {/* due livelli: sotto in bianco e nero (filtro statico), sopra a colori che appare in dissolvenza */}
              <motion.div className="absolute inset-x-0 -top-[10%] h-[120%] will-change-transform" style={reduce ? undefined : { y: photoY }}>
                <img
                  src="/team/1.webp"
                  alt="Il founder di BNS Studio al lavoro"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover grayscale"
                />
                {!reduce ? (
                  <motion.img
                    src="/team/1.webp"
                    alt=""
                    aria-hidden
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ opacity: photoColor }}
                  />
                ) : null}
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
          </Reveal>

          <div className="md:self-start md:pt-[8vw]">
            <Reveal>
              <h2 className="text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl">
                Uno <span className="text-[#e3f503]">studio creativo</span>
                <br />
                indipendente.
              </h2>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="mt-6 max-w-lg leading-relaxed text-white/70">
                BNS Studio è uno studio creativo indipendente tra design, tecnologia e AI.
                Costruiamo identità visive, siti, software e sistemi digitali per brand chiari e
                riconoscibili.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/45">
                Lo shop è un&apos;estensione del nostro universo creativo: un progetto collegato,
                non il cuore dello studio. Lavoriamo per creare direzione, coerenza e strumenti reali.
              </p>
            </Reveal>
            <Reveal delay={0.14} className="hidden md:block">
              <div className="mt-8">
                <Magnetic>
                  <a
                    href="/#team"
                    className="group inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-white"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e3f503] text-black transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:rotate-45">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17 17 7M8 7h9v9" />
                      </svg>
                    </span>
                    Conosci il team
                  </a>
                </Magnetic>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>

      {/* parola gigante in basso: scorre verso destra, passa dietro la foto */}
      <GiantWord word="indipendente" from="-30%" to="2%" className="relative z-0 hidden md:-mt-[9vw] md:block" />

      {/* tre punti con numeri giganti a contorno */}
      <Container>
        <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-3 md:gap-8">
          {features.map((f, idx) => (
            <Reveal key={f.title} delay={0.05 * idx}>
              <Feature idx={idx} title={f.title} desc={f.desc} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
