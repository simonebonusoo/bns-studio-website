# BNS Studio — sito istituzionale (React + Tailwind + Framer Motion)

Sito ufficiale di BNS Studio: studio creativo indipendente che lavora su
identità visive, siti web, software, AI tools e prodotti digitali.

Lo shop vive separatamente su Shopify: **https://shop.bnsstudio.it**

## Avvio rapido
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Dove cambiare i contenuti
- `src/lib/site.ts` — contatti, link social e URL dello shop
- `src/sections/*` — sezioni della landing (Hero, Studio, Team, Servizi, Clienti, Shop, Contatti)
- `src/components/Navbar.tsx` — voci del menu
- `src/sections/Footer.tsx` — footer
- `src/styles.css` — effetti visivi (griglia, glass, noise)

## Struttura
Single-page con sezioni ancorate:
Home → Studio → Team → Servizi → Clienti → Shop → Contatti.
La voce **Shop** rimanda allo store Shopify esterno.
