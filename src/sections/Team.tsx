import { useEffect, useRef, useState, type RefObject } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"

import { Container } from "../components/Container"
import { Reveal } from "../components/Reveal"
import { CONTACTS } from "../lib/site"
import { useActive } from "../components/motion"

type Member = {
  name: string
  meta: string
  badge: string
  href: string
  imageUrl: string
}

const members: Member[] = [
  {
    name: "Simone Bonuso",
    meta: "Founder & Art Director",
    badge: "Founder",
    href: CONTACTS.instagram,
    imageUrl: "/team/1.webp",
  },
  {
    name: "Andrea Brandolini",
    meta: "Full-Stack Developer",
    badge: "Lead Team",
    href: CONTACTS.instagram,
    imageUrl: "/team/2.webp",
  },
]

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {dir === "left" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
    </svg>
  )
}

/**
 * Ritratto in stile editoriale: niente cornice, nome in alto con una
 * lineetta verticale, foto che sale da una maschera e passa a colori
 * al passaggio del mouse (o al centro dello schermo su touch).
 */
function Portrait({ member, index }: { member: Member; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const reduce = useReducedMotion()
  const { active } = useActive(ref as RefObject<HTMLElement>)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 35%"] })
  const imgY = useTransform(scrollYProgress, [0, 1], ["18%", "0%"])
  const clip = useTransform(scrollYProgress, [0, 1], [30, 0])
  const clipPath = useTransform(clip, (c) => `inset(${c}% 0% 0% 0%)`)
  const line = useTransform(scrollYProgress, [0.2, 0.8], [0, 1])

  return (
    <a
      ref={ref}
      href={member.href}
      target="_blank"
      rel="noreferrer"
      className="group relative block w-[82vw] shrink-0 snap-start sm:w-[24rem] lg:w-[30rem]"
    >
      {/* nome con lineetta verticale, come un'etichetta */}
      <div className="flex items-center gap-3">
        <motion.span
          style={reduce ? undefined : { scaleY: line }}
          className="block h-9 w-px origin-top bg-white/25"
        />
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-[0.22em] text-white">{member.name}</div>
          <div className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-white/40">{member.meta}</div>
        </div>
        <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-white/50">
          <span className="h-1.5 w-1.5 rounded-full bg-[#e3f503]" />
          {member.badge}
        </span>
      </div>

      {/* ritratto: sfondo sfumato, la persona "esce" dal basso */}
      <motion.div
        style={reduce ? undefined : { clipPath }}
        className="relative mt-5 aspect-[4/5] overflow-hidden bg-gradient-to-b from-white/[0.07] to-white/[0.01]"
      >
        <motion.img
          src={member.imageUrl}
          alt={member.name}
          width={800}
          height={1000}
          loading="lazy"
          decoding="async"
          style={reduce ? undefined : { y: imgY }}
          animate={{ scale: active ? 1.04 : 1, filter: active ? "grayscale(0)" : "grayscale(1)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0b0b0c] to-transparent" />

        {/* freccia che appare in basso */}
        <motion.span
          animate={{ opacity: active ? 1 : 0, y: active ? 0 : 12, rotate: active ? 0 : -45 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#e3f503] text-black"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17 17 7M8 7h9v9" />
          </svg>
        </motion.span>
      </motion.div>
      <span className="sr-only">Profilo {index + 1}</span>
    </a>
  )
}

/** Tiene la sezione agganciata con il fondo allo schermo: la sezione successiva le scorre sopra. */
function useStickyBottom(ref: RefObject<HTMLElement>) {
  const [top, setTop] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setTop(Math.min(0, window.innerHeight - el.offsetHeight))
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener("resize", update)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", update)
    }
  }, [ref])
  return top
}

export function Team() {
  const sectionRef = useRef<HTMLElement>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const stickyTop = useStickyBottom(sectionRef as RefObject<HTMLElement>)
  // Le frecce compaiono solo se i ritratti non stanno tutti nello schermo.
  const [overflow, setOverflow] = useState(false)
  useEffect(() => {
    const el = scroller.current
    if (!el) return
    const check = () => setOverflow(el.scrollWidth > el.clientWidth + 4)
    check()
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Quando la sezione Servizi sale, il team arretra e si scurisce.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["end end", "end start"] })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.25])

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current
    if (!el) return
    const card = el.querySelector("a")
    el.scrollBy({ left: dir * ((card?.clientWidth ?? 300) + 32), behavior: "smooth" })
  }

  return (
    <section
      ref={sectionRef}
      className="scroll-mt-24 pt-6 pb-12 md:sticky md:pt-8 md:pb-24"
      style={reduce ? undefined : { top: stickyTop }}
    >
      <motion.div style={reduce ? undefined : { scale, opacity, transformOrigin: "center top" }}>
        <Container>
          <div className="flex items-end justify-between gap-6">
            <Reveal>
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/60">
                <span className="text-[#e3f503]">+</span> Team
              </div>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
                Il nostro <span className="text-[#e3f503]">team</span>
              </h2>
            </Reveal>

            <div className={`flex shrink-0 gap-2 ${overflow ? "" : "hidden"}`}>
              {(["left", "right"] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  aria-label={d === "left" ? "Precedente" : "Successivo"}
                  onClick={() => scrollBy(d === "left" ? -1 : 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-md bg-white/[0.06] text-white/80 transition hover:bg-[#e3f503] hover:text-black active:scale-95"
                >
                  <Arrow dir={d} />
                </button>
              ))}
            </div>
          </div>

          <div
            ref={scroller}
            className="-mx-4 mt-12 flex snap-x snap-mandatory gap-8 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10 [&::-webkit-scrollbar]:hidden"
          >
            {members.map((m, i) => (
              <Portrait key={m.name} member={m} index={i} />
            ))}
          </div>
        </Container>
      </motion.div>
    </section>
  )
}
