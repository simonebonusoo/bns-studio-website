import { useState } from "react"
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

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

function ServiceIcon({ icon: Icon, active }: { icon: IconType; active?: boolean }) {
  return (
    <div
      className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full border bg-white/[0.03] text-[1.7rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_18px_40px_rgba(0,0,0,0.35)] transition duration-300 ${
        active
          ? "border-[#e3f503]/40 text-[#e3f503]"
          : "border-white/10 text-white group-hover:border-[#e3f503]/40 group-hover:text-[#e3f503]"
      }`}
    >
      <Icon />
    </div>
  )
}

function ServiceRow({
  title,
  desc,
  icon,
  isOpen,
  onToggle,
  delay = 0,
}: {
  title: string
  desc: string
  icon: IconType
  isOpen: boolean
  onToggle: () => void
  delay?: number
}) {
  const panelId = `service-panel-${slugify(title)}`
  const buttonId = `service-button-${slugify(title)}`
  return (
    <Reveal delay={delay}>
      <div className="border-t border-white/10 first:border-t-0">
        <button
          type="button"
          id={buttonId}
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="group flex w-full items-start justify-between gap-6 py-7 text-left transition duration-300 md:py-8"
        >
          <div className="min-w-0">
            <h3 className="text-[2rem] font-semibold tracking-[-0.045em] text-white md:text-[2.25rem]">
              {title}
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`grid transition-[grid-template-rows,opacity,margin] duration-500 ease-out ${
                isOpen ? "mt-5 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="max-w-[30rem] pt-1 text-base leading-[1.9] text-white/62 md:text-[1.05rem]">
                  {desc}
                </p>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center md:pt-1">
            <ServiceIcon icon={icon} active={isOpen} />
          </div>
        </button>
      </div>
    </Reveal>
  )
}

export function Services() {
  const [openTitle, setOpenTitle] = useState<string | null>(null)
  const leftColumn = items.filter((_, idx) => idx % 2 === 0)
  const rightColumn = items.filter((_, idx) => idx % 2 !== 0)

  return (
    <section id="servizi" className="scroll-mt-24 py-12 md:py-16">
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

        <div className="mt-10 grid gap-x-12 lg:grid-cols-2 lg:gap-x-16">
          <div>
            {leftColumn.map((service, idx) => (
              <ServiceRow
                key={service.title}
                title={service.title}
                desc={service.desc}
                icon={service.icon}
                isOpen={openTitle === service.title}
                onToggle={() =>
                  setOpenTitle((current) => (current === service.title ? null : service.title))
                }
                delay={0.05 * idx}
              />
            ))}
          </div>

          <div>
            {rightColumn.map((service, idx) => (
              <ServiceRow
                key={service.title}
                title={service.title}
                desc={service.desc}
                icon={service.icon}
                isOpen={openTitle === service.title}
                onToggle={() =>
                  setOpenTitle((current) => (current === service.title ? null : service.title))
                }
                delay={0.08 + 0.05 * idx}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
