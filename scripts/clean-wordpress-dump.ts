#!/usr/bin/env node
// scripts/clean-wordpress-dump.ts
// WordPress Dump Bereinigungsskript - Entfernt Plugin-Tabellen und bereinigt Shortcodes

import { readFileSync, writeFileSync } from 'fs'

// WordPress Core Tabellen (ohne Prefix)
const WP_CORE_TABLES = [
  'commentmeta',
  'comments',
  'links',
  'options',
  'postmeta',
  'posts',
  'term_relationships',
  'terms',
  'term_taxonomy',
  'usermeta',
  'users'
]

// Plugin Prefixe die entfernt werden sollen
const PLUGIN_PREFIXES = [
  'actionscheduler_',
  'awb_',
  'cli_',
  'fusion_',
  'layerslider',
  'loginizer_',
  'woocommerce_',
  'wc_',
  'yoast_',
  'elementor_',
  'contact_form_',
  'wpforms_',
  'mailchimp_',
  'newsletter_',
  'wordfence_',
  'updraftplus_',
  'wp_rocket_',
  'smush_',
  'sg_',
  'revslider_',
  'tablepress_'
]

// Häufige Shortcodes die bereinigt werden sollen
const SHORTCODES_TO_CLEAN = [
  // Elementor
  /\[elementor-template[^\]]*\]/g,
  /\[\/elementor-template\]/g,

  // Fusion Builder
  /\[fusion_[^\]]*\]/g,
  /\[\/fusion_[^\]]*\]/g,

  // Contact Forms
  /\[contact-form-7[^\]]*\]/g,
  /\[wpforms[^\]]*\]/g,
  /\[gravityform[^\]]*\]/g,

  // Sliders
  /\[rev_slider[^\]]*\]/g,
  /\[layerslider[^\]]*\]/g,
  /\[metaslider[^\]]*\]/g,

  // Galleries
  /\[foogallery[^\]]*\]/g,
  /\[ngg[^\]]*\]/g,

  // SEO/Analytics
  /\[yoast[^\]]*\]/g,
  /\[google_analytics[^\]]*\]/g,

  // Social Media
  /\[instagram-feed[^\]]*\]/g,
  /\[twitter-feed[^\]]*\]/g,
  /\[facebook-feed[^\]]*\]/g,

  // E-Commerce
  /\[woocommerce[^\]]*\]/g,
  /\[product[^\]]*\]/g,
  /\[add_to_cart[^\]]*\]/g,

  // Generic Plugin Shortcodes
  /\[vc_[^\]]*\]/g,
  /\[\/vc_[^\]]*\]/g
]

interface CleanOptions {
  inputFile: string
  outputFile: string
  wpPrefix: string
  keepOnlyCoreTables: boolean
  cleanShortcodes: boolean
  removePluginOptions: boolean
}

class WordPressDumpCleaner {
  private options: CleanOptions
  private stats = {
    tablesRemoved: 0,
    shortcodesRemoved: 0,
    optionsRemoved: 0,
    linesProcessed: 0
  }

  constructor(options: CleanOptions) {
    this.options = options
  }

  async clean(): Promise<void> {
    process.stdout.write('🧹 WordPress Dump Bereinigung gestartet...\n')
    process.stdout.write(`📁 Input: ${this.options.inputFile}\n`)
    process.stdout.write(`📁 Output: ${this.options.outputFile}\n`)
    process.stdout.write(`🏷️  WordPress Prefix: ${this.options.wpPrefix}\n`)

    const content = readFileSync(this.options.inputFile, 'utf8')
    const lines = content.split('\n')
    const cleanedLines: string[] = []

    let skipTable = false
    let currentTable = ''

    for (const line of lines) {
      this.stats.linesProcessed++

      // Prüfe CREATE TABLE statements
      if (line.startsWith('CREATE TABLE')) {
        const tableMatch = line.match(/CREATE TABLE `([^`]+)`/)
        if (tableMatch) {
          currentTable = tableMatch[1]

          if (this.shouldSkipTable(currentTable)) {
            skipTable = true
            this.stats.tablesRemoved++
            process.stdout.write(`❌ Entferne Tabelle: ${currentTable}\n`)
            continue
          } else {
            skipTable = false
            process.stdout.write(`✅ Behalte Tabelle: ${currentTable}\n`)
          }
        }
      }

      // Prüfe DROP TABLE statements
      if (line.startsWith('DROP TABLE')) {
        const tableMatch = line.match(/DROP TABLE.*`([^`]+)`/)
        if (tableMatch) {
          const tableName = tableMatch[1]
          if (this.shouldSkipTable(tableName)) {
            continue // Skip DROP für Plugin-Tabellen
          }
        }
      }

      // Skip Zeilen für Plugin-Tabellen
      if (skipTable) {
        continue
      }

      // Bereinige INSERT Statements
      let processedLine = line
      if (line.startsWith('INSERT INTO')) {
        processedLine = this.cleanInsertStatement(line)
      }

      cleanedLines.push(processedLine)
    }

    // Schreibe bereinigte Datei
    const cleanedContent = cleanedLines.join('\n')
    writeFileSync(this.options.outputFile, cleanedContent, 'utf8')

    this.printStats()
  }

  private shouldSkipTable(tableName: string): boolean {
    // Entferne Prefix für Vergleich
    const tableWithoutPrefix = tableName.replace(new RegExp(`^${this.options.wpPrefix}`), '')

    if (this.options.keepOnlyCoreTables) {
      // Nur WordPress Core Tabellen behalten
      const isCoreTables = WP_CORE_TABLES.includes(tableWithoutPrefix)
      if (!isCoreTables) {
        return true // Skip non-core Tabellen
      }
    }

    // Prüfe Plugin-Prefixe
    for (const pluginPrefix of PLUGIN_PREFIXES) {
      if (tableWithoutPrefix.startsWith(pluginPrefix)) {
        return true // Skip Plugin-Tabellen
      }
    }

    return false
  }

  private cleanInsertStatement(line: string): string {
    let cleanedLine = line

    // Bereinige WordPress Options von Plugin-Daten
    if (this.options.removePluginOptions && line.includes(`INSERT INTO \`${this.options.wpPrefix}options\``)) {
      cleanedLine = this.cleanPluginOptions(cleanedLine)
    }

    // Bereinige Post Content von Shortcodes
    if (this.options.cleanShortcodes && line.includes(`INSERT INTO \`${this.options.wpPrefix}posts\``)) {
      cleanedLine = this.cleanShortcodes(cleanedLine)
    }

    return cleanedLine
  }

  private cleanPluginOptions(line: string): string {
    // Plugin Option Namen die entfernt werden sollen
    const pluginOptions = [
      'elementor_',
      'fusion_',
      'layerslider_',
      'revslider_',
      'woocommerce_',
      'yoast_',
      'wordfence_',
      '_transient_',
      '_site_transient_',
      'widget_',
      'sidebars_widgets'
    ]

    for (const option of pluginOptions) {
      if (line.includes(`'${option}`) || line.includes(`"${option}`)) {
        this.stats.optionsRemoved++
        return '' // Entferne gesamte Zeile mit Plugin-Option
      }
    }

    return line
  }

  private cleanShortcodes(line: string): string {
    let cleanedLine = line

    for (const shortcodeRegex of SHORTCODES_TO_CLEAN) {
      const matches = cleanedLine.match(shortcodeRegex)
      if (matches) {
        this.stats.shortcodesRemoved += matches.length
        cleanedLine = cleanedLine.replace(shortcodeRegex, '')
      }
    }

    return cleanedLine
  }

  private printStats(): void {
    process.stdout.write('\n📊 Bereinigungsstatistiken:\n')
    process.stdout.write(`📝 Zeilen verarbeitet: ${this.stats.linesProcessed.toLocaleString()}\n`)
    process.stdout.write(`🗑️  Tabellen entfernt: ${this.stats.tablesRemoved}\n`)
    process.stdout.write(`🏷️  Shortcodes bereinigt: ${this.stats.shortcodesRemoved}\n`)
    process.stdout.write(`⚙️  Plugin-Optionen entfernt: ${this.stats.optionsRemoved}\n`)
    process.stdout.write('✅ Bereinigung abgeschlossen!\n')
  }
}

// CLI Ausführung
async function main() {
  const inputFile = process.argv[2] || '.docker/data/mysql/sta3wp.sql'
  const outputFile = process.argv[3] || '.docker/data/mysql/sta3wp_clean.sql'
  const wpPrefix = process.env.DB_PREFIX || process.env.WP_PREFIX || 'as_'

  const options: CleanOptions = {
    inputFile,
    outputFile,
    wpPrefix,
    keepOnlyCoreTables: true,
    cleanShortcodes: true,
    removePluginOptions: true
  }

  try {
    const cleaner = new WordPressDumpCleaner(options)
    await cleaner.clean()
  } catch (error) {
    process.stderr.write(`❌ Fehler bei der Bereinigung: ${error}\n`)
    process.exit(1)
  }
}

// ES Module Kompatibilität
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { WordPressDumpCleaner, type CleanOptions }
