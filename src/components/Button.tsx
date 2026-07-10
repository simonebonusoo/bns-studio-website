import { PropsWithChildren, useEffect, useRef, useState } from "react"
import clsx from "clsx"

type Variant = "primary" | "ghost"

type Props = PropsWithChildren<{
  href?: string
  onClick?: (e: React.MouseEvent) => void
  type?: "button" | "submit" | "reset"
  variant?: Variant
  size?: "sm" | "md"
  className?: string
  disabled?: boolean
  /** Se children NON è stringa, passa text per lo scramble */
  text?: string
  icon?: React.ReactNode
}>

const BRAND = "#e3f503"
const CHARS = "!@#$%^&*():{};|,.<>/?"
const CYCLES_PER_LETTER = 2
const SHUFFLE_TIME = 40

function getButtonClassName({
  variant,
  size,
  className,
  disabled,
}: {
  variant: Variant
  size: "sm" | "md"
  className?: string
  disabled: boolean
}) {
  const base =
    "group relative overflow-hidden inline-flex items-center justify-center gap-2 font-medium " +
    "transition active:scale-[.98] select-none"

  const sizeCls =
    size === "sm"
      ? "h-9 px-3.5 text-xs rounded-md"
      : "h-11 px-5 text-sm rounded-lg"

  const variantCls =
    variant === "primary"
      ? "bg-white text-black hover:bg-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
      : "bg-transparent text-white/80 border border-white/15 hover:border-white/30 hover:text-white"

  const disabledCls = disabled
    ? "cursor-not-allowed opacity-60 hover:bg-inherit hover:border-inherit hover:text-inherit active:scale-100"
    : ""

  return clsx(base, sizeCls, variantCls, disabledCls, className)
}

export function Button({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  className,
  disabled = false,
  text,
  icon,
}: Props) {
  const intervalRef = useRef<number | null>(null)

  const targetText = text ?? (typeof children === "string" ? children : "")
  const [label, setLabel] = useState(targetText)

  useEffect(() => {
    setLabel(targetText)
  }, [targetText])

  const stopScramble = () => {
    if (intervalRef.current) window.clearInterval(intervalRef.current)
    intervalRef.current = null
    setLabel(targetText)
  }

  const scramble = () => {
    if (!targetText) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let pos = 0
    if (intervalRef.current) window.clearInterval(intervalRef.current)

    intervalRef.current = window.setInterval(() => {
      const scrambled = targetText
        .split("")
        .map((_, i) => {
          if (pos / CYCLES_PER_LETTER > i) return targetText[i]
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        })
        .join("")

      setLabel(scrambled)
      pos++

      if (pos >= targetText.length * CYCLES_PER_LETTER) stopScramble()
    }, SHUFFLE_TIME)
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [])

  const cls = getButtonClassName({ variant, size, className, disabled })

  const iconCls =
    variant === "primary"
      ? "text-black/80"
      : "text-white/80 transition-colors group-hover:text-[color:var(--brand)]"

  const labelCls =
    "absolute left-0 top-0 whitespace-pre transition-colors " +
    (variant === "primary"
      ? "text-black"
      : "text-white/80 group-hover:text-[color:var(--brand)]")

  const Inner = (
    <>
      <span
        className="relative z-10 inline-flex items-center gap-2"
        style={{ ["--brand" as string]: BRAND } as React.CSSProperties}
      >
        {icon ? <span className={iconCls}>{icon}</span> : null}

        {targetText ? (
          <span className="relative inline-block uppercase tracking-wide">
            {/* spazio riservato: evita resize */}
            <span className="invisible whitespace-pre">{targetText}</span>

            {/* testo reale (scramble) */}
            <span className={labelCls}>{label}</span>
          </span>
        ) : (
          <span>{children}</span>
        )}
      </span>

      {/* scanline glow (CSS, solo su hover) */}
      <span
        aria-hidden
        className="btn-scanline pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ ["--brand" as string]: BRAND } as React.CSSProperties}
      />

      {/* depth */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 shadow-[inset_-1px_-1px_1px_rgba(255,255,255,0.06),inset_1px_1px_1px_rgba(0,0,0,0.9)]"
      />
    </>
  )

  const common = {
    className: cls,
    onMouseEnter: disabled ? undefined : scramble,
    onMouseLeave: stopScramble,
    onFocus: disabled ? undefined : scramble,
    onBlur: stopScramble,
  }

  if (href) {
    return (
      <a
        href={href}
        onClick={(event) => {
          if (disabled) {
            event.preventDefault()
            return
          }
          onClick?.(event)
        }}
        {...common}
      >
        {Inner}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} {...common}>
      {Inner}
    </button>
  )
}
