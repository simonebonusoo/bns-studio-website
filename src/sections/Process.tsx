import { Container } from "../components/Container"
import { Reveal } from "../components/Reveal"

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

const steps = [
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

export function Process() {
  return (
    <section id="processo" className="scroll-mt-24 py-12 md:py-16">
      <Container>
        <div className="grid gap-8 border-b border-white/10 pb-6 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <Reveal>
            <div className="text-center lg:text-left">
              <div className="text-xs uppercase tracking-[0.22em] text-[#e3f503]/80">Come lavoriamo</div>
              <h2 className="mt-3 text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl">
                Building <span className="text-[#e3f503]">Creative</span> Solutions
              </h2>
            </div>
          </Reveal>

          <div />
        </div>

        {/* Timeline */}
        <div className="mt-10 grid gap-y-12 md:grid-cols-3 md:gap-x-6">
          {steps.map((step, idx) => (
            <Reveal key={step.title} delay={0.08 * idx}>
              <div className="relative mx-auto flex max-w-sm flex-col text-center md:text-left">
                <div className="relative mb-6 h-16">
                  <div className="absolute left-0 top-1/2 hidden h-px -translate-y-1/2 md:block md:w-[calc(50%-2.75rem)]">
                    <div
                      className={`h-px w-full ${
                        idx === 0
                          ? "bg-gradient-to-r from-transparent via-white/10 to-[#e3f503]/50"
                          : "bg-gradient-to-r from-transparent to-[#e3f503]/50"
                      }`}
                    />
                  </div>

                  <div className="absolute right-0 top-1/2 hidden h-px -translate-y-1/2 md:flex md:w-[calc(50%-2.75rem)] md:items-center">
                    <div
                      className={`h-px w-full ${
                        idx === steps.length - 1
                          ? "bg-gradient-to-r from-[#e3f503]/50 via-white/10 to-transparent"
                          : "bg-gradient-to-r from-[#e3f503]/50 to-white/10"
                      }`}
                    />
                    {idx < steps.length - 1 ? (
                      <svg viewBox="0 0 24 24" className="ml-1 h-4 w-4 shrink-0 text-white/30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    ) : null}
                  </div>

                  <div className="absolute left-1/2 top-0 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full bg-[#e3f503] text-black shadow-[0_10px_30px_rgba(227,245,3,0.25)]">
                    {step.icon}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-center gap-3 md:justify-start">
                    <span className="text-xs font-semibold text-[#e3f503]">0{idx + 1}</span>
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{step.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
