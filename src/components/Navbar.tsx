import { Fragment, useEffect, useState } from "react"
import { AnimatePresence, m } from "framer-motion"

import { Container } from "./Container"
import { Logo } from "./Logo"
import { Button } from "./Button"
import { NAV_LINKS, SHOP_URL } from "../lib/site"

const overlayTransition = { duration: 0.18, ease: [0.22, 1, 0.36, 1] as const }
const drawerTransition = { duration: 0.24, ease: [0.22, 1, 0.36, 1] as const }
const desktopNavTransition = { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const }

const navH = 88

type NavItem = (typeof NAV_LINKS)[number]

function isExternal(item: NavItem) {
  return "external" in item && item.external === true
}

function DesktopNavLink({
  href,
  label,
  external,
  onClick,
}: {
  href: string
  label: string
  external?: boolean
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      {...(external ? { rel: "noopener" } : {})}
      className="group/navlink relative block overflow-hidden py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/62 transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:text-white xl:text-xs"
    >
      <span className="relative block h-[1.15em] overflow-hidden leading-none">
        <span className="block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/navlink:-translate-y-full group-focus-visible/navlink:-translate-y-full">
          {label}
        </span>
        <span
          aria-hidden
          className="absolute left-0 top-full block text-[#e3f503] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/navlink:-translate-y-full group-focus-visible/navlink:-translate-y-full"
        >
          {label}
        </span>
      </span>
    </a>
  )
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  // Blocca lo scroll del body quando il drawer mobile è aperto.
  useEffect(() => {
    if (!menuOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [menuOpen])

  // Chiudi il drawer su resize verso desktop.
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false)
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-50" style={{ ["--nav-h" as any]: `${navH}px` } as any}>
        <div className="relative">
          {/* Liquid glass */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 bg-black/30 backdrop-blur-2xl backdrop-saturate-125"
          >
            <div className="absolute inset-x-0 bottom-0 h-px bg-white/12" />
            <div className="absolute inset-x-0 top-0 h-px bg-white/8" />

            <div
              className="nav-shimmer absolute -top-10 left-0 h-24 w-[55%] rotate-[-8deg]"
              style={{
                background:
                  "linear-gradient(90deg, rgba(227,245,3,0) 0%, rgba(227,245,3,0.10) 50%, rgba(227,245,3,0) 100%)",
                filter: "blur(10px)",
              }}
            />
          </div>

          <div className="bg-transparent">
            <Container>
              <div className="relative z-20">
                {/* MOBILE bar */}
                <div className="flex min-h-[68px] items-center justify-between gap-3 py-3 md:hidden">
                  <button
                    type="button"
                    onClick={() => setMenuOpen((current) => !current)}
                    className="inline-flex h-11 w-11 items-center justify-center text-white/72 transition hover:text-white"
                    aria-label="Apri menu"
                    aria-expanded={menuOpen}
                  >
                    <MenuIcon />
                  </button>

                  <a href="/#top" aria-label="Vai all'inizio" className="flex flex-1 items-center justify-center no-underline">
                    <Logo className="h-7" />
                  </a>

                  <Button href={SHOP_URL} size="sm" text="Shop">
                    Shop
                  </Button>
                </div>

                {/* DESKTOP bar */}
                <div className="relative hidden md:block">
                  <div className="grid min-h-[88px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-6 py-4">
                    <a href="/#top" aria-label="Vai all'inizio" className="relative z-20 flex items-center no-underline">
                      <Logo className="h-9" />
                    </a>

                    {/* Spacer che occupa la colonna centrale (1fr): tiene la CTA
                        nella terza colonna e lascia i link cliccabili sotto */}
                    <div className="min-w-0" />

                    {/* Centered nav links */}
                    <div className="pointer-events-none absolute inset-y-0 left-1/2 z-10 flex w-[min(58vw,760px)] -translate-x-1/2 items-center justify-center">
                      <div className="pointer-events-auto w-full">
                        <m.nav
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={desktopNavTransition}
                          className="flex min-w-0 items-center justify-center gap-5 xl:gap-7"
                          aria-label="Navigazione desktop principale"
                        >
                          {NAV_LINKS.map((item) => (
                            <DesktopNavLink
                              key={item.label}
                              href={item.href}
                              label={item.label}
                              external={isExternal(item)}
                            />
                          ))}
                        </m.nav>
                      </div>
                    </div>

                    {/* Right CTA — mantiene la composizione del tasto (scramble) */}
                    <div className="relative z-20 flex items-center justify-end gap-3">
                      <Button href={SHOP_URL} size="sm" text="Vai allo shop">
                        Vai allo shop
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </div>
        </div>
      </header>

      {/* MOBILE drawer */}
      <AnimatePresence>
        {menuOpen ? (
          <Fragment>
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={overlayTransition}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm md:hidden"
            />

            <m.aside
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={drawerTransition}
              className="fixed inset-y-0 left-0 z-50 w-[88vw] max-w-sm border-r border-white/10 bg-[#050505]/98 px-6 py-5 shadow-[0_20px_80px_rgba(0,0,0,.45)] backdrop-blur-2xl md:hidden"
            >
              <div className="flex h-full flex-col">
                <div className="flex items-start justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    className="inline-flex h-9 w-9 items-center justify-center text-white/70 transition hover:text-white"
                    aria-label="Chiudi menu"
                  >
                    <CloseIcon />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto pt-10 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
                  {NAV_LINKS.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      {...(isExternal(item) ? { rel: "noopener" } : {})}
                      onClick={() => setMenuOpen(false)}
                      className="block py-2 text-left text-[2.15rem] font-medium leading-[1.08] tracking-tight text-white/92 transition hover:text-white"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </m.aside>
          </Fragment>
        ) : null}
      </AnimatePresence>
    </>
  )
}
