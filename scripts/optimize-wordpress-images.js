#!/usr/bin/env node
// scripts/optimize-wordpress-images.js
// Konvertiert WordPress Uploads zu modernen WebP/AVIF Formaten
// Generiert nur 3 intelligente Größen statt 10+ WordPress Thumbnails

import { promises as fs } from 'fs'
import path from 'path'
import sharp from 'sharp'
import { glob } from 'glob'

const config = {
  inputDir: './public/uploads',
  outputDir: './public/uploads', // In-place optimization - WordPress Struktur beibehalten

  // 🎯 WordPress Struktur BEIBEHALTEN - viel besser!
  // Optimierte Bilder bleiben in der gleichen Jahr/Monat Struktur
  preserveStructure: true,

  // 3 smarte Größen für alle Use Cases
  sizes: [
    { name: 'small', width: 400, height: 300, quality: 80 },   // Thumbnails, Cards
    { name: 'medium', width: 800, height: 600, quality: 85 },  // Content Images
    { name: 'large', width: 1200, height: 900, quality: 90 }   // Featured, Hero Images
  ],

  // Moderne Formate + JPEG Fallback
  formats: ['webp', 'avif', 'jpeg'],

  // Original behalten für Fallback
  keepOriginal: true,

  // Naming Convention: originalname-size.format
  namingPattern: '{name}-{size}.{format}'
}/**
 * Bildoptimierung mit Sharp
 */
async function optimizeImage(inputPath, outputDir, originalName) {
  console.log(`📸 Optimiere: ${originalName}`)

  try {
    // Original Image Info
    const image = sharp(inputPath)
    const metadata = await image.metadata()

    const baseName = path.parse(originalName).name
    const results = []

    // Für jede Größe und Format
    for (const size of config.sizes) {
      for (const format of config.formats) {
        const outputName = `${baseName}-${size.name}.${format}`
        const outputPath = path.join(outputDir, outputName)

        await image
          .resize(size.width, size.height, {
            fit: 'cover',
            withoutEnlargement: true // Nicht größer als Original
          })
          .toFormat(format, { quality: size.quality })
          .toFile(outputPath)

        results.push({
          size: size.name,
          format,
          path: outputPath,
          width: size.width,
          height: size.height
        })
      }
    }

    // Original in WebP konvertieren (Fallback)
    if (config.keepOriginal) {
      const originalWebP = `${baseName}-original.webp`
      const originalPath = path.join(outputDir, originalWebP)

      await image
        .toFormat('webp', { quality: 90 })
        .toFile(originalPath)

      results.push({
        size: 'original',
        format: 'webp',
        path: originalPath,
        width: metadata.width,
        height: metadata.height
      })
    }

    console.log(`✅ ${results.length} Varianten erstellt für ${originalName}`)
    return results

  } catch (error) {
    console.warn(`⚠️ Fehler bei ${originalName}:`, error.message)
    return []
  }
}

/**
 * WordPress Thumbnails bereinigen
 */
async function cleanWordPressThumbnails(dir) {
  console.log('🧹 Bereinige WordPress Thumbnails...')

  const thumbnailPattern = path.join(dir, '**/*-[0-9]*x[0-9]*.*')
  const thumbnails = await glob(thumbnailPattern, { ignore: '**/optimized/**' })

  let cleaned = 0
  for (const thumbnail of thumbnails) {
    try {
      await fs.unlink(thumbnail)
      cleaned++
      console.log(`🗑️ Gelöscht: ${path.basename(thumbnail)}`)
    } catch (error) {
      console.warn(`⚠️ Konnte nicht löschen: ${thumbnail}`)
    }
  }

  console.log(`✅ ${cleaned} WordPress Thumbnails bereinigt`)
}

/**
 * Alle Originalbilder finden und optimieren
 */
async function processAllImages() {
  console.log('🚀 WordPress Image Optimierung gestartet...')

  // Output Directory erstellen
  await fs.mkdir(config.outputDir, { recursive: true })

  // Alle Originalbilder finden (keine WordPress Thumbnails)
  const imagePattern = path.join(config.inputDir, '**/*.{jpg,jpeg,png,gif,webp}')
  const allImages = await glob(imagePattern, { ignore: '**/optimized/**' })

  // WordPress Thumbnails filtern
  const originalImages = allImages.filter(img => {
    const basename = path.basename(img)
    return !basename.match(/-\d+x\d+\.(jpg|jpeg|png|gif)$/i)
  })

  console.log(`📄 Gefunden: ${originalImages.length} Original-Bilder`)
  console.log(`🗑️ Übersprungen: ${allImages.length - originalImages.length} WordPress-Thumbnails`)

  let processed = 0
  let totalVariants = 0

  // Verarbeitung mit Parallel-Limit für Performance
  const parallelLimit = 3
  for (let i = 0; i < originalImages.length; i += parallelLimit) {
    const batch = originalImages.slice(i, i + parallelLimit)

    const promises = batch.map(async (imagePath) => {
      // 🎯 WordPress Struktur beibehalten: /uploads/2024/01/
      const imageDir = path.dirname(imagePath) // Gleicher Ordner wie Original

      // Optimierte Bilder im GLEICHEN Ordner wie Original
      const variants = await optimizeImage(
        imagePath,
        imageDir, // Nicht separater optimized/ Ordner!
        path.basename(imagePath)
      )

      return variants.length
    })

    const results = await Promise.all(promises)
    processed += batch.length
    totalVariants += results.reduce((sum, count) => sum + count, 0)

    console.log(`📊 Fortschritt: ${processed}/${originalImages.length} Bilder`)
  }

  // WordPress Thumbnails bereinigen
  await cleanWordPressThumbnails(config.inputDir)

  console.log('\n✅ Optimierung abgeschlossen!')
  console.log(`📸 ${processed} Original-Bilder verarbeitet`)
  console.log(`🎯 ${totalVariants} optimierte Varianten erstellt`)
  console.log(`💾 Ausgabe: ${config.outputDir}`)
  console.log('\n📝 Nächste Schritte:')
  console.log('   1. Nuxt Image konfigurieren für /uploads/optimized/')
  console.log('   2. OptimizedImage Komponente im Frontend verwenden')
  console.log('   3. Performance testen!')
}

/**
 * Main Function
 */
async function main() {
  try {
    await processAllImages()
  } catch (error) {
    console.error('❌ Optimierung fehlgeschlagen:', error)
    process.exit(1)
  }
}

main().catch(console.error)
