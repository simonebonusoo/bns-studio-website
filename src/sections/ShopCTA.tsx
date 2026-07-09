import { Container } from "../components/Container"
import { Button } from "../components/Button"
import { Reveal } from "../components/Reveal"
import { SHOP_URL } from "../lib/site"

export function ShopCTA() {
  return (
    <section id="shop" className="scroll-mt-24 pt-8 pb-4 md:pt-10 md:pb-6">
      <Container>
        <Reveal>
          <div className="glass relative overflow-hidden rounded-[28px] p-6 shadow-soft md:p-10">
            <div
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                background:
                  "radial-gradient(600px 300px at 85% 0%, rgba(227,245,3,0.10), transparent 70%)",
              }}
            />
            <div className="relative grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-center">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-white/55">Shop</div>
                <div className="pb-2">
                  <h2 className="mt-3 text-[2.7rem] font-semibold tracking-tight md:text-6xl">
                    Scopri il nostro <span className="text-[#e3f503]">shop</span>
                  </h2>
                  <p className="mt-4 leading-relaxed text-white/70 md:whitespace-nowrap">
                    Un catalogo di poster e collezioni originali che raccontano la visione
                    creativa di BnsStudio.
                  </p>
                </div>
              </div>

              <div className="flex lg:justify-end">
                <Button href={SHOP_URL} text="Vai allo shop">
                  Vai allo shop
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
