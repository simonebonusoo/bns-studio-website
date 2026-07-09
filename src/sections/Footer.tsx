import { Link } from "react-router-dom"
import { SiInstagram, SiWhatsapp } from "react-icons/si"
import { FiMail } from "react-icons/fi"

import { Container } from "../components/Container"
import { Logo } from "../components/Logo"
import { CONTACTS, SHOP_URL } from "../lib/site"

function SocialButton({
  href,
  label,
  external,
  children,
}: {
  href: string
  label: string
  external?: boolean
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      aria-label={label}
      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/80 transition hover:border-white/20 hover:text-white"
    >
      <span className="flex h-5 w-5 items-center justify-center">{children}</span>
    </a>
  )
}

export function Footer() {
  return (
    <footer className="mt-4 border-t border-white/10 bg-black">
      <Container>
        <div className="flex flex-col items-center gap-6 py-10 text-center">
          <div className="flex items-center gap-3">
            <SocialButton href={CONTACTS.instagram} label="Instagram" external>
              <SiInstagram className="h-5 w-5" />
            </SocialButton>
            <SocialButton href={CONTACTS.whatsapp} label="WhatsApp" external>
              <SiWhatsapp className="h-5 w-5" />
            </SocialButton>
            <SocialButton href={`mailto:${CONTACTS.email}`} label="Email">
              <FiMail className="h-5 w-5" />
            </SocialButton>
          </div>

          <Logo className="h-9 md:h-10" />

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/60">
            <a href="/#studio" className="transition hover:text-white">Studio</a>
            <a href="/#servizi" className="transition hover:text-white">Servizi</a>
            <a href="/#contatti" className="transition hover:text-white">Contatti</a>
            <a href={SHOP_URL} rel="noopener" className="transition hover:text-white">Shop</a>
          </nav>

          <div className="text-sm text-white/60">© {new Date().getFullYear()} BNS Studio. All rights reserved.</div>

          <Link to="/privacy" className="text-sm text-white/45 transition hover:text-white/70">
            Privacy Policy
          </Link>
        </div>
      </Container>
    </footer>
  )
}
