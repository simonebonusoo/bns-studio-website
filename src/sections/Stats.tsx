import { useEffect, useMemo, useRef, useState } from "react"

import { Container } from "../components/Container"
import { Reveal } from "../components/Reveal"
import { motion } from "framer-motion"
import type { RefObject } from "react"
import { useActive } from "../components/motion"

function StatValue({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const { active } = useActive(ref as RefObject<HTMLElement>)
  return (
    <motion.div
      ref={ref}
      animate={{ color: active ? "#e3f503" : "#ffffff", scale: active ? 1.06 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="cursor-default text-[2.9rem] font-semibold leading-none tracking-[-0.06em] text-white md:text-[4.4rem]"
    >
      {children}
    </motion.div>
  )
}
import { Parallax } from "../components/motion"

const stats = [
  {
    value: 100,
    suffix: "k+",
    label: "Visualizzazioni dei progetti",
  },
  {
    value: 50,
    suffix: "+",
    label: "Progetti portati a termine",
  },
  {
    value: 58,
    suffix: "%",
    label: "Clienti da referral",
  },
  {
    value: 10,
    suffix: "k+",
    label: "Ore di lavoro dedicate ai progetti",
  },
] as const

function CountUp({
  value,
  suffix,
  start,
}: {
  value: number
  suffix: string
  start: boolean
}) {
  const [displayValue, setDisplayValue] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!start || hasAnimated.current) return
    hasAnimated.current = true

    const duration = 1400
    const startTime = performance.now()
    let frame = 0

    const animate = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(Math.round(value * eased))

      if (progress < 1) {
        frame = requestAnimationFrame(animate)
      }
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [start, value])

  const formatted = useMemo(() => `${displayValue}${suffix}`, [displayValue, suffix])
  return <span>{formatted}</span>
}

export function Stats() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="scroll-mt-24 pt-8 pb-2 md:pt-12 md:pb-4">
      <Container>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-4 xl:gap-12">
          {stats.map((stat, idx) => (
            <Parallax key={stat.label} speed={idx % 2 ? 22 : 8}>
            <Reveal delay={0.04 * idx}>
              <div className="text-center">
                <StatValue>
                  <CountUp value={stat.value} suffix={stat.suffix} start={isVisible} />
                </StatValue>
                <p className="mx-auto mt-3 max-w-[11rem] text-[0.95rem] leading-relaxed text-white/72 md:mt-4 md:max-w-[14rem] md:text-[1.05rem]">
                  {stat.label}
                </p>
              </div>
            </Reveal>
            </Parallax>
          ))}
        </div>
      </Container>
    </section>
  )
}
