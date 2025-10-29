// migrate/assign-real-images.ts
// Weise echte WordPress-Bilder zu Content zu, basierend auf verfügbaren Dateien

import { PrismaClient as PostgresCMSClient } from '../prisma/generated/postgres-cms/index.js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const pg = new PostgresCMSClient()

const config = {
  uploadsPath: '/srv/proj/nuxt-wp-multilang-theme/public/uploads'
}

/**
 * Sammle alle verfügbaren WordPress-Bilder
 */
async function collectAvailableImages() {
  console.log('🔍 Sammle verfügbare WordPress-Bilder...')

  const imageExtensions = ['.webp', '.jpg', '.jpeg', '.png']
  const availableImages: string[] = []

  // Durchsuche alle Upload-Ordner
  const uploadPath = config.uploadsPath

  function scanDirectory(dirPath: string, relativePath: string = '') {
    try {
      const items = fs.readdirSync(dirPath)

      for (const item of items) {
        const fullPath = path.join(dirPath, item)
        const itemRelativePath = relativePath ? `${relativePath}/${item}` : item

        if (fs.statSync(fullPath).isDirectory()) {
          // Rekursiv in Unterordner
          scanDirectory(fullPath, itemRelativePath)
        } else {
          // Prüfe ob es ein Bild ist
          const ext = path.extname(item).toLowerCase()
          if (imageExtensions.includes(ext)) {
            // Ignoriere unsere Platzhalter
            if (!item.startsWith('featured-')) {
              const imagePath = `/uploads/${itemRelativePath}`
              availableImages.push(imagePath)
            }
          }
        }
      }
    } catch (error) {
      console.warn(`⚠️ Error scanning ${dirPath}:`, error)
    }
  }

  scanDirectory(uploadPath)

  console.log(`📊 Found ${availableImages.length} real WordPress images`)

  // Zeige ein paar Beispiele
  console.log('\n📷 Beispiele gefundener Bilder:')
  availableImages.slice(0, 5).forEach(img => console.log(`   ${img}`))
  if (availableImages.length > 5) {
    console.log(`   ... und ${availableImages.length - 5} weitere`)
  }

  return availableImages
}

/**
 * Weise echte Bilder zu Content zu
 */
async function assignRealImages(availableImages: string[]) {
  console.log('\n🔄 Weise echte Bilder zu Content zu...')

  if (availableImages.length === 0) {
    console.log('❌ Keine echten Bilder gefunden')
    return { assigned: 0, errors: 0 }
  }

  let assigned = 0
  let errors = 0
  let imageIndex = 0

  // Articles - ersetze Platzhalter
  console.log('\n📰 Processing Articles...')
  const articlesWithPlaceholders = await pg.articleMeta.findMany({
    where: {
      key: 'featured_image'
    },
    include: { article: { select: { slug: true } } }
  })

  // Filter für Platzhalter im Code
  const articlesPlaceholdersFiltered = articlesWithPlaceholders.filter(meta => {
    const value = meta.value?.toString()
    return value && value.includes('featured-')
  })

  for (const meta of articlesPlaceholdersFiltered) {
    try {
      const realImage = availableImages[imageIndex % availableImages.length]

      await pg.articleMeta.update({
        where: { id: meta.id },
        data: { value: realImage }
      })

      console.log(`✅ Article "${meta.article.slug}" → ${realImage}`)
      assigned++
      imageIndex++
    } catch (error) {
      console.error(`❌ Error updating article meta ${meta.id}:`, error)
      errors++
    }
  // Pages - ersetze Platzhalter
  console.log('\n📄 Processing Pages...')
  const pagesWithPlaceholders = await pg.pageMeta.findMany({
    where: {
      key: 'featured_image'
    },
    include: { page: { select: { slug: true } } }
  })

  const pagesPlaceholdersFiltered = pagesWithPlaceholders.filter(meta => {
    const value = meta.value?.toString()
    return value && value.includes('featured-')
  })

  for (const meta of pagesPlaceholdersFiltered) {
    try {
      const realImage = availableImages[imageIndex % availableImages.length]

      await pg.pageMeta.update({
        where: { id: meta.id },
        data: { value: realImage }
      })

      console.log(`✅ Page "${meta.page.slug}" → ${realImage}`)
      assigned++
      imageIndex++
    } catch (error) {
      console.error(`❌ Error updating page meta ${meta.id}:`, error)
      errors++
    }
  }

  // Portfolios - ersetze Platzhalter
  console.log('\n🎨 Processing Portfolios...')
  const portfoliosWithPlaceholders = await pg.portfolioMeta.findMany({
    where: {
      key: 'featured_image'
    },
    include: { portfolio: { select: { slug: true } } }
  })

  const portfoliosPlaceholdersFiltered = portfoliosWithPlaceholders.filter(meta => {
    const value = meta.value?.toString()
    return value && value.includes('featured-')
  })

  for (const meta of portfoliosPlaceholdersFiltered) {
    try {
      const realImage = availableImages[imageIndex % availableImages.length]

      await pg.portfolioMeta.update({
        where: { id: meta.id },
        data: { value: realImage }
      })

      console.log(`✅ Portfolio "${meta.portfolio.slug}" → ${realImage}`)
      assigned++
      imageIndex++
    } catch (error) {
      console.error(`❌ Error updating portfolio meta ${meta.id}:`, error)
      errors++
    }
  }

  return { assigned, errors }
}

/**
 * Zeige Statistiken vor und nach der Zuweisung
 */
async function showStats() {
  console.log('\n📊 Featured Image Statistiken:')

  const articleTotal = await pg.articleMeta.count({ where: { key: 'featured_image' } })
  const pageTotal = await pg.pageMeta.count({ where: { key: 'featured_image' } })
  const portfolioTotal = await pg.portfolioMeta.count({ where: { key: 'featured_image' } })

  console.log(`   Articles: ${articleTotal} featured images`)
  console.log(`   Pages: ${pageTotal} featured images`)
  console.log(`   Portfolios: ${portfolioTotal} featured images`)
}/**
 * Main Function
 */
async function main() {
  console.log('🚀 Real WordPress Images Assignment gestartet...')

  try {
    // Zeige aktuelle Stats
    console.log('📊 Aktuelle Statistiken:')
    await showStats()

    // Sammle verfügbare Bilder
    const availableImages = await collectAvailableImages()

    if (availableImages.length === 0) {
      console.log('❌ Keine echten WordPress-Bilder gefunden')
      return
    }

    // Weise echte Bilder zu
    const results = await assignRealImages(availableImages)

    console.log('\n📊 Neue Statistiken:')
    await showStats()

    console.log('\n✅ Real Images Assignment abgeschlossen!')
    console.log('📈 Results:')
    console.log(`   Assigned: ${results.assigned}`)
    console.log(`   Errors: ${results.errors}`)
    console.log(`   Available Images: ${availableImages.length}`)
    console.log(`   Success Rate: ${((results.assigned / (results.assigned + results.errors)) * 100).toFixed(1)}%`)

    console.log('\n💡 Jetzt sollten echte WordPress-Bilder angezeigt werden!')

  } catch (error) {
    console.error('❌ Assignment Fehler:', error)
    process.exit(1)
  } finally {
    await pg.$disconnect()
  }
}

main().catch(console.error)
