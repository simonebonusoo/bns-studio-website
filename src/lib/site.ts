// Configurazione centrale del sito istituzionale BNS Studio.
// Modifica qui contatti, link social e URL dello shop.

export const SHOP_URL = "https://shop.bnsstudio.it"

export const CONTACTS = {
  email: "bnsstudio26@gmail.com",
  phone: "+393913170206",
  whatsapp: "https://wa.me/3913170206",
  instagram: "https://www.instagram.com/bnsstudio.it/?hl=it",
} as const

// Voci di navigazione della landing page.
// Le ancore puntano alle sezioni della home; "Shop" è un link esterno.
export const NAV_LINKS = [
  { label: "Home", href: "/#top" },
  { label: "Chi siamo", href: "/#studio" },
  { label: "Team", href: "/#team" },
  { label: "Servizi", href: "/#servizi" },
  { label: "Contatti", href: "/#contatti" },
] as const
