
import { Container } from "../components/Container"
import { VelocityMarquee } from "../components/motion"

const BRAND_COUNT = 11
const brands = Array.from({ length: BRAND_COUNT }, (_, i) => i + 1)

export function TrustedBrands() {
  return (
    <section id="clienti" aria-label="Brand con cui abbiamo lavorato" className="scroll-mt-24 pb-4 pt-2 md:pb-8">
      <Container>
        {/* Eyebrow con linee laterali */}
        <div className="mx-auto flex max-w-md items-center justify-center gap-4">
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#e3f503]/60" />
          <span className="text-center text-[11px] uppercase tracking-[0.28em] text-white/55">
            Trusted by amazing brands
          </span>
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#e3f503]/60" />
        </div>

        {/* Marquee pulito, senza card contenitiva */}
        <div className="relative mt-6 overflow-hidden px-2">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#0b0b0c] to-transparent md:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#0b0b0c] to-transparent md:w-24" />

          {/* Marquee che accelera e cambia verso seguendo lo scroll */}
          <VelocityMarquee className="flex w-max py-6">
            <div className="flex shrink-0 items-center gap-8 pr-8 md:gap-12 md:pr-12">
            {brands.map((n) => (
              <div key={n} className="flex h-12 shrink-0 items-center justify-center md:h-14">
                <img
                  src={`/brands/${n}.webp`}
                  alt={`Brand ${n}`}
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                  className="h-9 w-auto object-contain opacity-55 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 md:h-11"
                />
              </div>
            ))}
            </div>
          </VelocityMarquee>
        </div>
      </Container>
    </section>
  )
}
