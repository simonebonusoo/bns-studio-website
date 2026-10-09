import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"

import { Container } from "../components/Container"
import { Button } from "../components/Button"
import { Reveal } from "../components/Reveal"
import { SHOP_URL } from "../lib/site"
import { Magnetic } from "../components/motion"

/**
 * Shop: un riquadro giallo si espande fino a riempire lo schermo
 * mentre scorri, e il contenuto cresce con lui.
 */
export function ShopCTA() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start start"] })
  const panelScale = useTransform(scrollYProgress, [0, 1], [0.62, 1])
  const contentScale = useTransform(scrollYProgress, [0, 1], [0.72, 1])
  const contentY = useTransform(scrollYProgress, [0, 1], ["12%", "0%"])

  if (reduce) {
    return (
      <section id="shop" className="scroll-mt-24 pt-8 pb-4 md:pt-10 md:pb-6">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-[28px] bg-[#e3f503] p-6 text-black md:p-10">
              <div className="text-xs uppercase tracking-[0.24em] text-black/55">Shop</div>
              <h2 className="mt-3 text-[2.7rem] font-semibold tracking-tight md:text-6xl">Scopri il nostro shop</h2>
              <p className="mt-4 leading-relaxed text-black/70">
                Un catalogo di poster e collezioni originali che raccontano la visione creativa di BnsStudio.
              </p>
              <div className="mt-6">
                <Button href={SHOP_URL} text="Vai allo shop">Vai allo shop</Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    )
  }

  return (
    <section ref={ref} id="shop" className="relative h-[190svh]">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden text-black">
        {/* fondo giallo: cresce fino a riempire lo schermo */}
        <motion.div
          aria-hidden
          style={{ scale: panelScale }}
          className="absolute inset-0 rounded-[32px] bg-[#e3f503] will-change-transform"
        />
        <div className="relative flex h-full w-full items-center justify-center">
          <motion.div style={{ scale: contentScale, y: contentY }} className="px-4 text-center will-change-transform">
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-black/55">Shop</div>
            <h2 className="mt-4 text-5xl font-semibold leading-[0.95] tracking-tighter md:text-8xl">
              Scopri il nostro
              <br />
              shop.
            </h2>
            <p className="mx-auto mt-6 max-w-xl leading-relaxed text-black/70 md:text-lg">
              Un catalogo di poster e collezioni originali che raccontano la visione creativa di BnsStudio.
            </p>
            <div className="mt-9">
              <Magnetic strength={0.35}>
                <a
                  href={SHOP_URL}
                  className="group inline-flex h-12 items-center gap-3 rounded-full bg-black pl-7 pr-2 text-sm font-semibold text-white transition-transform duration-300 active:scale-[0.97]"
                >
                  Vai allo shop
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e3f503] text-black transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17 17 7M8 7h9v9" />
                    </svg>
                  </span>
                </a>
              </Magnetic>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
