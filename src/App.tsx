import { Suspense, lazy, useEffect } from "react"
import { LazyMotion, domAnimation } from "framer-motion"
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

// Pagina secondaria: caricata on-demand per alleggerire il bundle iniziale.
const PrivacyPolicyPage = lazy(() =>
  import("./pages/PrivacyPolicyPage").then((m) => ({ default: m.PrivacyPolicyPage })),
)

// Offset (px) per compensare l'header sticky durante lo scroll ancorato.
const SCROLL_OFFSET = 80

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

function Home() {
  return (
    <main id="top">
      <Hero />
      <TrustedBrands />
      <Process />
      <Studio />
      <Stats />
      <Team />
      <Services />
      <Contact />
      <ShopCTA />
    </main>
  )
}

export default function App() {
  const location = useLocation()

  // Scroll restoration manuale.
  useEffect(() => {
    if (typeof window === "undefined" || !window.history) return
    const previous = window.history.scrollRestoration
    window.history.scrollRestoration = "manual"
    return () => {
      window.history.scrollRestoration = previous
    }
  }, [])

  // Scroll fluido nativo per gli anchor interni (senza librerie di smooth scroll).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

      const target = e.target as HTMLElement | null
      const a = target?.closest('a[href^="#"], a[href^="/#"]') as HTMLAnchorElement | null
      if (!a) return

      const href = a.getAttribute("href") || ""
      const isRootHash = href.startsWith("/#")
      const isLocalHash = href.startsWith("#")
      if (!isRootHash && !isLocalHash) return

      // Su pagine diverse dalla home lascia la navigazione nativa del browser.
      if (isRootHash && window.location.pathname !== "/") return

      const id = isRootHash ? href.slice(2) : href.slice(1)
      if (!id) return

      const el = document.getElementById(id)
      if (!el) return

      e.preventDefault()
      const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET
      window.scrollTo({
        top,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      })
      history.pushState(null, "", `/#${id}`)
    }

    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [])

  // Riporta in cima al cambio pagina.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
  }, [location.pathname])

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="min-h-screen bg-ink text-white">
        <Backdrop />
        <Noise />
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/privacy"
            element={
              <Suspense fallback={<div className="min-h-screen" />}>
                <PrivacyPolicyPage />
              </Suspense>
            }
          />
        </Routes>

        <Footer />

        <BackToTop />
        <CookieBanner />
      </div>
    </LazyMotion>
  )
}
