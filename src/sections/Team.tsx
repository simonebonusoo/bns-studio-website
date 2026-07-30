import { Container } from "../components/Container"
import { Reveal } from "../components/Reveal"
import { CONTACTS } from "../lib/site"

type Member = {
  name: string
  role: string
  tag: string
  badge: string
  meta: string
  href: string
  imageUrl: string
}

const members: Member[] = [
  {
    name: "Simone Bonuso",
    role: "Founder & Creative Director",
    tag: "Art Direction",
    badge: "Founder",
    meta: "Founder & Art Director",
    href: CONTACTS.instagram,
    imageUrl: "/team/1.webp",
  },
  {
    name: "Andrea Brandolini",
    role: "Full-Stack Developer",
    tag: "Developer",
    badge: "Lead Team",
    meta: "Full-Stack Developer",
    href: CONTACTS.instagram,
    imageUrl: "/team/2.webp",
  },
]

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  )
}

function MemberCard({ member }: { member: Member }) {
  const isExternal = member.href.startsWith("http")

  return (
    <div className="relative w-full overflow-hidden rounded-[24px]" style={{ aspectRatio: "1 / 1" }}>
      <a
        href={member.href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer" : undefined}
        className="group absolute inset-0 block overflow-hidden rounded-[24px] border border-white/10"
      >
        <img
          src={member.imageUrl}
          alt={member.name}
          width={800}
          height={800}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover grayscale transition duration-500 ease-out group-hover:scale-[1.03] group-hover:grayscale-0"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/12 to-black/40" />

        <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-3">
          <span className="inline-flex items-center rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs font-medium text-white/85 backdrop-blur-md">
            {member.tag}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-xs font-semibold text-white/85 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[#e3f503]" />
            {member.badge}
          </span>
        </div>

        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
          <div>
            <div className="text-xl font-semibold text-white">{member.name}</div>
            <div className="mt-0.5 text-sm text-white/60">{member.meta}</div>
          </div>
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e3f503] text-black transition group-hover:bg-[#eeff3d]">
            <ArrowIcon />
          </span>
        </div>
      </a>
    </div>
  )
}

export function Team() {
  return (
    <section id="team" className="scroll-mt-24 pt-6 pb-12 md:pt-8 md:pb-16">
      <Container>
        <Reveal>
          <div className="flex flex-col gap-6 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-[#e3f503]/80">Team</div>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
                Il nostro <span className="text-[#e3f503]">team</span>
              </h2>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member, idx) => (
            <Reveal key={member.name} delay={0.05 * idx}>
              <MemberCard member={member} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
