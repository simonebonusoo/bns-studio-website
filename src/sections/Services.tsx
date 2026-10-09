import type { IconType } from "react-icons"
import {
  HiOutlineCamera,
  HiOutlineGlobeAlt,
  HiOutlinePaintBrush,
  HiOutlinePhoto,
  HiOutlineShoppingBag,
  HiOutlineSparkles,
} from "react-icons/hi2"
import { TbDeviceDesktopCode, TbDirectionSign } from "react-icons/tb"
import { Container } from "../components/Container"
import { Reveal } from "../components/Reveal"
import { useEffect, useRef, useState, type RefObject } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { useActive } from "../components/motion"

const items = [
  {
    title: "Brand Identity",
    desc: "Creiamo identita visive coerenti: logo, palette, tipografia e direzione estetica per costruire un brand riconoscibile in ogni punto di contatto.",
    icon: HiOutlineSparkles,
  },
  {
    title: "Web Design",
    desc: "Progettiamo siti, landing page ed esperienze digitali essenziali, responsive e focalizzate sulla conversione.",
    icon: HiOutlineGlobeAlt,
  },
  {
    title: "Graphic Design",
    desc: "Realizziamo materiali visivi, layout editoriali, campagne e asset coordinati che danno forza al linguaggio del brand.",
    icon: HiOutlinePaintBrush,
  },
  {
    title: "UI Design",
    desc: "Disegniamo interfacce chiare e contemporanee per piattaforme, prodotti e strumenti digitali, con attenzione a ritmo, gerarchia e usabilita.",
    icon: TbDeviceDesktopCode,
  },
  {
    title: "AI Driven Shooting",
    desc: "Sviluppiamo shooting e immagini guidate dall'AI per concept, campagne e contenuti visivi con una direzione estetica coerente.",
    icon: HiOutlineCamera,
  },
  {
    title: "Social Content",
    desc: "Costruiamo contenuti social coordinati, pensati per dare continuita visiva e narrativa al brand sui canali digitali.",
    icon: HiOutlinePhoto,
  },
  {
    title: "E-commerce",
    desc: "Progettiamo esperienze e-commerce curate nel dettaglio, dalla struttura delle pagine prodotto fino all'identita visiva dello shop.",
    icon: HiOutlineShoppingBag,
  },
  {
    title: "Creative Direction",
    desc: "Definiamo una direzione creativa chiara per campagne, prodotti e brand, allineando estetica, messaggio e visione.",
    icon: TbDirectionSign,
  },
] satisfies Array<{
  title: string
  desc: string
  icon: IconType
}>

type Service = (typeof items)[number]

const SPRING = { type: "spring" as const, stiffness: 320, damping: 32, mass: 0.9 }

/**
 * Card in stile Wallet: resta agganciata in alto lasciando visibile la
 * propria intestazione, e la card successiva le sale sopra.
 * Cliccandola si apre ingrandita al centro (stile App Store).
 */
function ServiceCard({
  item,
  idx,
  step,
  onOpen,
  hidden,
}: {
  item: Service
  idx: number
  step: number
  onOpen: () => void
  hidden: boolean
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const reduce = useReducedMotion()
  const { active } = useActive(ref as RefObject<HTMLElement>)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 55%"] })
  const y = useTransform(scrollYProgress, [0, 1], [80, 0])
  const rotate = useTransform(scrollYProgress, [0, 1], [idx % 2 ? 3 : -3, 0])
  const Icon = item.icon

  return (
    <div className="sticky" style={{ top: `calc(110px + ${idx * step}px)` }}>
      <motion.div style={reduce ? undefined : { y, rotate }}>
        <motion.button
          ref={ref}
          type="button"
          layoutId={`service-${item.title}`}
          onClick={onOpen}
          animate={{ y: active ? -8 : 0 }}
          transition={SPRING}
          style={{ borderRadius: 28, visibility: hidden ? "hidden" : "visible" }}
          className="group relative flex h-[13.5rem] w-full flex-col justify-start overflow-hidden border border-white/10 bg-[#141416] text-left shadow-[0_-18px_50px_rgba(0,0,0,0.55)] md:h-[15rem]"
        >
          <div className="flex items-center gap-4 px-6 pt-5 md:gap-6 md:px-9 md:pt-6">
            <span className="text-xs font-semibold tabular-nums text-[#e3f503]">0{idx + 1}</span>
            <motion.h3
              layoutId={`service-title-${item.title}`}
              animate={{ x: active ? 6 : 0, color: active ? "#e3f503" : "#ffffff" }}
              transition={SPRING}
              className="text-2xl font-semibold tracking-[-0.04em] md:text-[2.25rem]"
            >
              {item.title}
            </motion.h3>
            <motion.span
              animate={{ rotate: active ? 90 : 0 }}
              transition={SPRING}
              className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors group-hover:border-[#e3f503]/50 group-hover:text-[#e3f503]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </motion.span>
          </div>

          {/* icona grande sullo sfondo della card */}
          <motion.span
            aria-hidden
            animate={{ rotate: active ? -10 : 0, scale: active ? 1.08 : 1, opacity: active ? 0.9 : 0.35 }}
            transition={SPRING}
            className="absolute bottom-5 right-6 text-[5.5rem] text-[#e3f503] md:right-9 md:text-[7rem]"
          >
            <Icon />
          </motion.span>
          <span className="absolute bottom-6 left-6 text-[11px] uppercase tracking-[0.22em] text-white/40 md:left-9">
            Tocca per leggere
          </span>
        </motion.button>
      </motion.div>
    </div>
  )
}

/* Card aperta: si ingrandisce dalla sua posizione fino al centro. */
function ServiceSheet({ item, idx, onClose }: { item: Service; idx: number; onClose: () => void }) {
  const Icon = item.icon
  useEffect(() => {
    window.__lenis?.stop()
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => {
      window.__lenis?.start()
      window.removeEventListener("keydown", onKey)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        layoutId={`service-${item.title}`}
        transition={SPRING}
        style={{ borderRadius: 32 }}
        role="dialog"
        aria-modal="true"
        aria-label={item.title}
        className="relative w-full max-w-2xl overflow-hidden border border-white/10 bg-[#141416] p-7 md:p-10"
      >
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold tabular-nums text-[#e3f503]">0{idx + 1}</span>
          <motion.h3 layoutId={`service-title-${item.title}`} className="text-3xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
            {item.title}
          </motion.h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi"
            className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e3f503] text-black transition-transform hover:rotate-90"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          className="mt-8 max-w-xl text-lg leading-relaxed text-white/70 md:text-xl"
        >
          {item.desc}
        </motion.p>
        <motion.span
          aria-hidden
          initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0, transition: { delay: 0.1, ...SPRING } }}
          exit={{ opacity: 0 }}
          className="mt-10 block text-[6rem] leading-none text-[#e3f503]"
        >
          <Icon />
        </motion.span>
      </motion.div>
    </div>
  )
}

export function Services() {
  const [open, setOpen] = useState<number | null>(null)
  const [step, setStep] = useState(72)

  // Altezza della "linguetta" visibile di ogni card nella pila.
  useEffect(() => {
    const update = () => setStep(window.innerHeight < 760 ? 48 : window.innerWidth < 768 ? 56 : 72)
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  // Il pannello sale da sotto e si sovrappone al team.
  const panelRef = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: panelRef, offset: ["start end", "start start"] })
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1])
  const radius = useTransform(scrollYProgress, [0, 1], [48, 28])

  return (
    <motion.section
      ref={panelRef}
      id="servizi"
      style={reduce ? undefined : { scale, borderTopLeftRadius: radius, borderTopRightRadius: radius, transformOrigin: "center top" }}
      className="relative z-10 scroll-mt-24 border-t border-white/10 bg-[#0e0e10] pb-[30vh] pt-12 shadow-[0_-40px_120px_rgba(0,0,0,0.7)] md:pt-16"
    >
      <Container>
        <Reveal>
          <div className="border-b border-white/10 pb-6">
            <div className="max-w-2xl">
              <div className="text-xs uppercase tracking-[0.22em] text-[#e3f503]/80">Servizi</div>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
                Cosa <span className="text-[#e3f503]">costruiamo</span>
              </h2>
            </div>
          </div>
        </Reveal>

        <div className="mx-auto mt-10 flex max-w-4xl flex-col gap-6">
          {items.map((item, idx) => (
            <ServiceCard
              key={item.title}
              item={item}
              idx={idx}
              step={step}
              hidden={open === idx}
              onOpen={() => setOpen(idx)}
            />
          ))}
        </div>
      </Container>

      {/* la card aperta vive fuori dal pannello (che è trasformato), così resta centrata nello schermo */}
      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {open !== null ? <ServiceSheet item={items[open]} idx={open} onClose={() => setOpen(null)} /> : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </motion.section>
  )
}
