import "dotenv/config"
import fs from "node:fs/promises"
import path from "node:path"
import { PrismaClient } from "@prisma/client"

import { getNormalizedProductVariants } from "../src/server/shop/lib/product-variants.mjs"

const prisma = new PrismaClient()
const rootDir = process.cwd()
const exportDir = path.join(rootDir, "shopify-export")
const imagesDir = path.join(exportDir, "export-images")
const csvPath = path.join(exportDir, "shopify-products.csv")
const reportPath = path.join(exportDir, "export-report.json")
const imageReadmePath = path.join(imagesDir, "README.txt")
const exportReadmePath = path.join(exportDir, "README.md")

const CSV_HEADERS = [
  "Handle",
  "Title",
  "Body (HTML)",
  "Vendor",
  "Product Category",
  "Type",
  "Tags",
  "Published",
  "Option1 Name",
  "Option1 Value",
  "Option2 Name",
  "Option2 Value",
  "Variant SKU",
  "Variant Price",
  "Variant Compare At Price",
  "Variant Inventory Qty",
  "Variant Inventory Tracker",
  "Variant Inventory Policy",
  "Variant Fulfillment Service",
  "Variant Requires Shipping",
  "Variant Taxable",
  "Image Src",
  "Image Position",
  "Image Alt Text",
  "SEO Title",
  "SEO Description",
  "Status",
]

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 80)
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
}

function normalizeTagSet(values) {
  const seen = new Set()
  return values
    .map((value) => String(value || "").trim())
    .filter(Boolean)
    .filter((value) => {
      const key = value.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
}

function toMoneyString(cents) {
  const normalized = Number(cents || 0)
  return (normalized / 100).toFixed(2)
}

function buildBodyHtml(description) {
  const raw = String(description || "").trim()
  if (!raw) return ""
  if (/<[a-z][\s\S]*>/i.test(raw)) return raw
  return raw
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`)
    .join("")
}

function buildSeoDescription(description) {
  return String(description || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160)
}

function mapStatus(status) {
  const normalized = String(status || "").trim().toLowerCase()
  if (normalized === "draft") return "draft"
  return "active"
}

function getPublishedValue(status) {
  return mapStatus(status) === "active" ? "TRUE" : "FALSE"
}

function parseImageList(raw) {
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw
    return Array.isArray(parsed) ? parsed.filter((value) => typeof value === "string" && value.trim()) : []
  } catch {
    return []
  }
}

async function fileExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function resolveLocalImageSource(rawSource) {
  const trimmed = String(rawSource || "").trim()
  if (!trimmed) return null
  if (/^https?:\/\//i.test(trimmed)) {
    return { type: "remote", csvValue: trimmed, copiedFile: null }
  }

  const candidatePaths = [
    trimmed,
    path.join(rootDir, trimmed),
    path.join(rootDir, "public", trimmed),
    path.join(rootDir, "data", trimmed),
    path.join(rootDir, "data/uploads/products", trimmed),
  ]

  for (const candidate of candidatePaths) {
    const absolutePath = path.isAbsolute(candidate) ? candidate : path.resolve(candidate)
    if (await fileExists(absolutePath)) {
      return { type: "local", absolutePath }
    }
  }

  return null
}

async function copyLocalImage(absolutePath, handle, index) {
  const ext = path.extname(absolutePath) || ".jpg"
  const fileName = `${handle}-${String(index + 1).padStart(2, "0")}${ext.toLowerCase()}`
  const targetPath = path.join(imagesDir, fileName)
  await fs.copyFile(absolutePath, targetPath)
  return {
    csvValue: `export-images/${fileName}`,
    fileName,
  }
}

function buildVariantOptions(variant) {
  const explicitOptions = Array.isArray(variant.options)
    ? variant.options
        .filter((entry) => entry && !String(entry.name || "").startsWith("_"))
        .map((entry) => ({
          name: String(entry.name || "").trim(),
          value: String(entry.value || "").trim(),
        }))
        .filter((entry) => entry.name && entry.value)
    : []

  if (explicitOptions.length) return explicitOptions.slice(0, 2)
  return [{ name: "Title", value: variant.title || "Default Title" }]
}

function buildProductTags(product, variants, collections, tags) {
  const variantTags = variants.flatMap((variant) => [
    variant.editionName || "",
    variant.size || "",
    variant.title || "",
  ])

  return normalizeTagSet([
    product.category,
    product.status,
    product.isCustomizable ? "personalizzabile" : "",
    ...collections.map((collection) => collection.title),
    ...tags.map((tag) => tag.name),
    ...variantTags,
  ]).join(", ")
}

function toCsvRow(values) {
  return values
    .map((value) => {
      const normalized = value == null ? "" : String(value)
      return `"${normalized.replaceAll('"', '""')}"`
    })
    .join(",")
}

async function main() {
  await fs.mkdir(imagesDir, { recursive: true })
  await fs.writeFile(
    exportReadmePath,
    [
      "# Shopify Export",
      "",
      "Export generato in modalità read-only dal database Prisma del progetto.",
      "",
      "Sorgente dati:",
      "- Product",
      "- ProductVariant",
      "- Product.imageUrls come sorgente immagini prodotto",
      "- Product.category come categoria sorgente",
      "- ProductCollection -> Collection",
      "- ProductTag -> Tag",
      "- stock prodotto/variante come inventory",
      "- discountPrice / compare-at price da prezzi reali nel DB",
      "",
      "Questo export non modifica il database, non esegue migration e non esegue seed.",
      "",
    ].join("\n"),
    "utf8",
  )
  await fs.writeFile(
    imageReadmePath,
    "Questa cartella contiene eventuali immagini locali copiate per l'export Shopify.\nSe il CSV usa URL remoti, qui potresti trovare solo questo file di supporto.\n",
    "utf8",
  )

  const products = await prisma.product.findMany({
    orderBy: [{ id: "asc" }],
    include: {
      variants: {
        orderBy: [{ position: "asc" }, { id: "asc" }],
      },
      productTags: {
        include: {
          tag: true,
        },
      },
      productCollections: {
        orderBy: [{ position: "asc" }],
        include: {
          collection: true,
        },
      },
    },
  })

  const rows = [CSV_HEADERS]
  const summary = []
  const missingImages = []
  const localImagesCopied = []
  const warnings = []

  for (const product of products) {
    const handle = slugify(product.slug || product.title || `product-${product.id}`) || `product-${product.id}`
    const bodyHtml = buildBodyHtml(product.description)
    const seoTitle = `${product.title} | BNS Studio`
    const seoDescription = buildSeoDescription(product.description)
    const status = mapStatus(product.status)
    const variants = getNormalizedProductVariants(product)
    const tags = product.productTags.map((entry) => entry.tag)
    const collections = product.productCollections.map((entry) => entry.collection)
    const productTags = buildProductTags(product, variants, collections, tags)
    const rawImages = parseImageList(product.imageUrls)
    const resolvedImages = []

    for (let index = 0; index < rawImages.length; index += 1) {
      const imageSource = await resolveLocalImageSource(rawImages[index])
      if (!imageSource) {
        warnings.push(`Immagine non risolta per ${product.title}: ${rawImages[index]}`)
        continue
      }
      if (imageSource.type === "remote") {
        resolvedImages.push({
          src: imageSource.csvValue,
          position: resolvedImages.length + 1,
          alt: `${product.title} - immagine ${resolvedImages.length + 1}`,
          kind: "remote",
        })
      } else {
        const copied = await copyLocalImage(imageSource.absolutePath, handle, resolvedImages.length)
        localImagesCopied.push(copied.fileName)
        resolvedImages.push({
          src: copied.csvValue,
          position: resolvedImages.length + 1,
          alt: `${product.title} - immagine ${resolvedImages.length + 1}`,
          kind: "local",
        })
      }
    }

    if (!resolvedImages.length) {
      missingImages.push(product.title)
    }

    variants.forEach((variant, variantIndex) => {
      const optionEntries = buildVariantOptions(variant)
      const option1 = optionEntries[0] || { name: "", value: "" }
      const option2 = optionEntries[1] || { name: "", value: "" }
      const sellingPrice = typeof variant.discountPrice === "number" && variant.discountPrice < variant.price ? variant.discountPrice : variant.price
      const compareAtPrice = typeof variant.discountPrice === "number" && variant.discountPrice < variant.price ? variant.price : ""
      const variantSku =
        String(variant.sku || "").trim().toUpperCase() ||
        `BNS-${handle}-${slugify(variant.key || variant.title || `variant-${variantIndex + 1}`)}`.toUpperCase()

      const image = variantIndex === 0 ? resolvedImages[0] || null : null

      rows.push([
        handle,
        product.title,
        bodyHtml,
        "BNS Studio",
        product.category || "",
        product.category || "",
        productTags,
        getPublishedValue(product.status),
        option1.name,
        option1.value,
        option2.name,
        option2.value,
        variantSku,
        toMoneyString(sellingPrice),
        compareAtPrice === "" ? "" : toMoneyString(compareAtPrice),
        variant.stock,
        "shopify",
        "deny",
        "manual",
        "TRUE",
        "TRUE",
        image?.src || "",
        image?.position || "",
        image?.alt || "",
        seoTitle,
        seoDescription,
        status,
      ])
    })

    resolvedImages.slice(1).forEach((image) => {
      rows.push([
        handle,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        image.src,
        image.position,
        image.alt,
        "",
        "",
        "",
      ])
    })

    summary.push({
      id: product.id,
      title: product.title,
      handle,
      variants: variants.length,
      images: resolvedImages.length,
      status,
    })
  }

  const csvContent = rows.map((row) => toCsvRow(row)).join("\n")
  await fs.writeFile(csvPath, csvContent, "utf8")

  const report = {
    generatedAt: new Date().toISOString(),
    source: {
      mode: "read-only",
      provider: "Prisma Client",
      usesDatabaseUrl: Boolean(process.env.DATABASE_URL),
      modelMapping: {
        product: "Product",
        variant: "ProductVariant",
        productImage: "Product.imageUrls (JSON field)",
        category: "Product.category",
        collection: "ProductCollection -> Collection",
        tag: "ProductTag -> Tag",
        inventory: "Product.stock / ProductVariant.stock",
        discountedPrice: "Product.discountPrice / ProductVariant.discountPrice",
        sku: "Product.sku / ProductVariant.sku",
      },
    },
    productCount: summary.length,
    exportRowCount: rows.length - 1,
    headers: CSV_HEADERS,
    products: summary,
    missingImages,
    localImagesCopied,
    warnings,
    validation: {
      hasSettingsSchema: false,
      csvHeadersPresent: CSV_HEADERS.every((header) => rows[0].includes(header)),
      everyProductHasAtLeastOneVariantRow: summary.every((product) => product.variants >= 1),
      imageReferenceMode: localImagesCopied.length ? "mixed" : "remote-only",
    },
  }

  await fs.writeFile(reportPath, JSON.stringify(report, null, 2), "utf8")
  console.log(JSON.stringify(report, null, 2))
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
