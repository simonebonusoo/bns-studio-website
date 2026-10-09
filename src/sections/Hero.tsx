import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"

import { Container } from "../components/Container"
import { Button } from "../components/Button"
import { TimeReveal } from "../components/Reveal"
import { SHOP_URL } from "../lib/site"
import { Magnetic, SplitHeading, W } from "../components/motion"

/**
 * Hero: il titolo entra parola per parola; allo scroll scorre più lento
 * della pagina, arretra in profondità e si dissolve (stile iOS).
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })

  // Uscita "iOS": la scena resta ferma, arretra in profondità e si dissolve.
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92])
  const opacity = useTransform(scrollYProgress, [0.15, 0.9], [1, 0])
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const blur = useTransform(scrollYProgress, [0.35, 1], [0, 6])
  const filter = useTransform(blur, (b) => `blur(${b}px)`)

  const content = (
    <div className="mx-auto max-w-4xl text-center">
      <SplitHeading
        delay={0.1}
        className="text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl"
      >
        <W className="text-[#e3f503]">Next-gen</W> <W>creative studio for growing</W>{" "}
        <W className="text-[#e3f503]">brands</W>
        <W>.</W>
      </SplitHeading>

      <TimeReveal delay={0.5}>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
          Siamo uno studio creativo che lavora tra design, tecnologia e AI:
          identità visive, siti web, software, strumenti AI e prodotti digitali
          pensati per distinguersi e durare.
        </p>
      </TimeReveal>

      <TimeReveal delay={0.62}>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Magnetic>
            <Button href="/#contatti" text="Richiedi un progetto">
              Richiedi un progetto
            </Button>
          </Magnetic>
          <Magnetic>
            <Button href={SHOP_URL} variant="ghost" text="Vai allo shop">
              Vai allo shop
            </Button>
          </Magnetic>
        </div>
      </TimeReveal>
    </div>
  )

  if (reduce) {
    return (
      <section className="relative pt-14 pb-14 md:pt-20 md:pb-20">
        <Container>{content}</Container>
      </section>
    )
  }

  return (
    <section ref={ref} className="relative pt-14 pb-14 md:pt-20 md:pb-20">
      <motion.div style={{ scale, opacity, y, filter }} className="w-full origin-top will-change-transform">
        <Container>{content}</Container>
      </motion.div>
    </section>
  )
}
