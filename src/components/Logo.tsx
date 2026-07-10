type LogoProps = {
  className?: string
}

export function Logo({ className = "h-8 md:h-10" }: LogoProps) {
  return (
    <img
      src="/logo-bns-cropped.webp"
      alt="BNS Studio"
      width={634}
      height={120}
      draggable={false}
      decoding="async"
      className={`${className} w-auto object-contain shrink-0`}
    />
  )
}
