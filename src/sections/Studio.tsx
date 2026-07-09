import type { IconType } from "react-icons"
import { HiOutlineSparkles, HiOutlineUserGroup, HiOutlineCpuChip } from "react-icons/hi2"

import { Container } from "../components/Container"
import { Reveal } from "../components/Reveal"

const features = [
  {
    title: "Approccio su misura",
    desc: "Ogni progetto parte dagli obiettivi reali del brand, non da template.",
    icon: HiOutlineSparkles,
  },
  {
    title: "Team creativo",
    desc: "Design, sviluppo e direzione creativa sotto lo stesso tetto.",
    icon: HiOutlineUserGroup,
  },
  {
    title: "AI & Tecnologia",
    desc: "Strumenti e AI su misura per risultati concreti e scalabili.",
    icon: HiOutlineCpuChip,
  },
] satisfies Array<{ title: string; desc: string; icon: IconType }>

function FeatureCard({
  title,
  desc,
  icon: Icon,
  dark,
}: {
  title: string
  desc: string
  icon: IconType
  dark?: boolean
}) {
  return (
    <div className="glass flex items-center gap-5 rounded-[22px] p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:border-white/20">
      <span
        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-2xl ${
          dark
            ? "bg-white/[0.06] text-[#e3f503] ring-1 ring-inset ring-white/10"
            : "bg-[#e3f503] text-black shadow-[0_10px_30px_rgba(227,245,3,0.22)]"
        }`}
      >
        <Icon />
      </span>
      <div className="min-w-0">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-white/55">{desc}</p>
      </div>
    </div>
  )
}

export function Studio() {
  return (
    <section id="studio" className="scroll-mt-24 py-12 md:py-16">
      <Container>
        {/* Eyebrow */}
        <Reveal>
          <div className="text-xs uppercase tracking-[0.22em] text-[#e3f503]/80">Chi siamo</div>
        </Reveal>

        {/* Headline + testo su due colonne (testo centrato sul titolo) */}
        <div className="mt-3 grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
          <Reveal>
            <h2 className="text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl">
              Uno <span className="text-[#e3f503]">studio creativo</span>
              <br />
              indipendente.
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="grid gap-8 sm:grid-cols-2">
              <p className="text-sm leading-relaxed text-white/62">
                BNS Studio è uno studio creativo indipendente tra design, tecnologia e AI.
                Costruiamo identità visive, siti, software e sistemi digitali per brand chiari e
                riconoscibili.
              </p>
              <p className="text-sm leading-relaxed text-white/45">
                Lo shop è un&apos;estensione del nostro universo creativo: un progetto collegato,
                non il cuore dello studio. Lavoriamo per creare direzione, coerenza e strumenti reali.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Feature cards */}
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {features.map((f, idx) => (
            <Reveal key={f.title} delay={0.05 * idx}>
              <FeatureCard title={f.title} desc={f.desc} icon={f.icon} dark />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
