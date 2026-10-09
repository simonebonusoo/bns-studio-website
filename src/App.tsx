import { useEffect, useRef, lazy, Suspense } from "react"
import Lenis from "lenis"
import { Routes, Route, useLocation } from "react-router-dom"

import { Navbar } from "./components/Navbar"
import { BackToTop } from "./components/BackToTop"
import { Noise } from "./components/Noise"
import { Backdrop } from "./components/Backdrop"
import { CookieBanner } from "./components/CookieBanner"

import { Hero } from "./sections/Hero"
import { TrustedBrands } from "./sections/TrustedBrands"
import { Process } from "./sections/Process"
import { Studio } from "./sections/Studio"
import { Stats } from "./sections/Stats"
import { Team } from "./sections/Team"
import { Services } from "./sections/Services"
import { ShopCTA } from "./sections/ShopCTA"
import { Contact } from "./sections/Contact"
import { Footer } from "./sections/Footer"

const MotionLabPage = lazy(() =>
  import("./pages/MotionLab").then((m) => ({ default: m.MotionLabPage }))
)

const PrivacyPolicyPage = lazy(() =>
  import("./pages/PrivacyPolicyPage").then((m) => ({ default: m.PrivacyPolicyPage }))
)

declare global {
  interface Window {
    __lenis?: Lenis
  }
}

function Home() {
  return (
    <main id="top">
      <Hero />
      <TrustedBrands />
      <Process />
      <Studio />
      <Stats />
      {/* Team resta agganciato e Servizi gli scorre sopra: il wrapper limita l'aggancio */}
      <div id="team" className="relative scroll-mt-24">
        <Team />
        <Services />
      </div>
      <Contact />
      <ShopCTA />
    </main>
  )
}

export default function App() {
  const location = useLocation()
  const lenisRef = useRef<Lenis | null>(null)
  const rafRef = useRef<number>(0)

  const OFFSET = -80

  // Scroll restoration manuale.
  useEffect(() => {
    if (typeof window === "undefined" || !window.history) return
    const previous = window.history.scrollRestoration
    window.history.scrollRestoration = "manual"
    return () => {
      window.history.scrollRestoration = previous
    }
  }, [])

  // Smooth scroll con Lenis + gestione anchor interni.
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.12,
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false,
    } as any)
    lenisRef.current = lenis
    window.__lenis = lenis

    const loop = (time: number) => {
      lenis.raf(time)
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || (e as any).button !== 0) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

      const target = e.target as HTMLElement | null
      const a = target?.closest('a[href^="#"], a[href^="/#"]') as HTMLAnchorElement | null
      if (!a) return

      const href = a.getAttribute("href") || ""
      const isRootHash = href.startsWith("/#")
      const isLocalHash = href.startsWith("#")
      if (!isRootHash && !isLocalHash) return

      if (isRootHash && window.location.pathname !== "/") return

      const id = isRootHash ? href.slice(2) : href.slice(1)
      if (!id) return

      const el = document.getElementById(id)
      if (!el) return

      e.preventDefault()
      lenis.scrollTo(el, { offset: OFFSET, duration: 1.15 })
      history.pushState(null, "", `/#${id}`)
    }

    document.addEventListener("click", onClick)

    return () => {
      document.removeEventListener("click", onClick)
      cancelAnimationFrame(rafRef.current)
      lenis.destroy()
      lenisRef.current = null
      delete window.__lenis
    }
  }, [])

  // Riporta in cima al cambio pagina.
  useEffect(() => {
    const lenis = lenisRef.current
    if (lenis) {
      lenis.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" })
    }
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-ink text-white">
      <Backdrop />
      <Noise />
      <Navbar />

      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/motion-lab" element={<MotionLabPage />} />
        </Routes>
      </Suspense>

      <Footer />

      <BackToTop />
      <CookieBanner />
    </div>
  )
}
