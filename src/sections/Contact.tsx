import type { IconType } from "react-icons"
import { FiMail } from "react-icons/fi"
import { SiInstagram, SiWhatsapp } from "react-icons/si"

import { Container } from "../components/Container"
import { Reveal } from "../components/Reveal"
import { CONTACTS } from "../lib/site"

type Channel = {
  icon: IconType
  label: string
  desc: string
  value: string
  href: string
  external?: boolean
}

const channels: Channel[] = [
  {
    icon: SiInstagram,
    label: "Instagram",
    desc: "Dai un'occhiata ai progetti, alle novità e all'estetica dello studio.",
    value: "@bnsstudio.it",
    href: CONTACTS.instagram,
    external: true,
  },
  {
    icon: SiWhatsapp,
    label: "WhatsApp",
    desc: "Preferisci un contatto diretto? Scrivici su WhatsApp per una risposta rapida.",
    value: "+39 391 317 0206",
    href: CONTACTS.whatsapp,
    external: true,
  },
  {
    icon: FiMail,
    label: "Email",
    desc: "Raccontaci obiettivi e idee del tuo progetto: ti rispondiamo il prima possibile.",
    value: CONTACTS.email,
    href: `mailto:${CONTACTS.email}`,
  },
]

function ChannelCol({ channel }: { channel: Channel }) {
  const { icon: Icon } = channel
  return (
    <div className="group flex h-full flex-col items-center px-4 pt-3 text-center md:px-8 lg:px-10">
      <span className="text-white transition duration-300 group-hover:scale-105">
        <Icon className="h-10 w-10" />
      </span>

      <div className="mt-4 text-xs font-semibold uppercase tracking-[0.24em] text-white">
        {channel.label}
      </div>

      <p className="mt-4 max-w-[20rem] text-sm leading-relaxed text-white/55">{channel.desc}</p>

      <a
        href={channel.href}
        target={channel.external ? "_blank" : undefined}
        rel={channel.external ? "noreferrer" : undefined}
        className="mt-6 text-sm font-semibold text-[#e3f503] transition hover:text-[#eeff3d]"
      >
        {channel.value}
      </a>
    </div>
  )
}

export function Contact() {
  return (
    <section id="contatti" className="scroll-mt-24 pt-6 pb-12 md:pt-8 md:pb-16">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs uppercase tracking-[0.22em] text-[#e3f503]/80">Contatti</div>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-6xl">
              Mettiamoci in <span className="text-[#e3f503]">contatto</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-white/60">
              Branding, web, AI o software: siamo qui per aiutarti.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-12 md:mt-24 md:grid-cols-3 md:gap-0 md:divide-x md:divide-white/10">
          {channels.map((channel, idx) => (
            <Reveal key={channel.label} delay={0.04 * idx}>
              <ChannelCol channel={channel} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
