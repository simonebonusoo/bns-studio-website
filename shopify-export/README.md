# Shopify Export

Export generato in modalità read-only dal database Prisma del progetto.

Sorgente dati:
- Product
- ProductVariant
- Product.imageUrls come sorgente immagini prodotto
- Product.category come categoria sorgente
- ProductCollection -> Collection
- ProductTag -> Tag
- stock prodotto/variante come inventory
- discountPrice / compare-at price da prezzi reali nel DB

Questo export non modifica il database, non esegue migration e non esegue seed.
