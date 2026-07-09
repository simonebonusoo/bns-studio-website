import { Container } from "../components/Container"
import { Button } from "../components/Button"
import { Reveal } from "../components/Reveal"
import { SHOP_URL } from "../lib/site"

export function Hero() {
  return (
    <section className="relative pt-14 pb-14 md:pt-20 md:pb-20">
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              <span className="text-[#e3f503]">Next-gen</span> creative studio for growing{" "}
              <span className="text-[#e3f503]">brands</span>.
            </h1>
          </Reveal>

          <Reveal delay={0.06}>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
              Siamo uno studio creativo che lavora tra design, tecnologia e AI:
              identità visive, siti web, software, strumenti AI e prodotti digitali
              pensati per distinguersi e durare.
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/#contatti" text="Richiedi un progetto">
                Richiedi un progetto
              </Button>
              <Button href={SHOP_URL} variant="ghost" text="Vai allo shop">
                Vai allo shop
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
