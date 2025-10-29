// prisma/seed-data/postgres-seed.ts
// PostgreSQL CMS Seed Data for NuxtWP Multilang Theme

import { getPostgresClient } from '../../server/lib/prisma-utils'

async function seedPostgresCMS() {
  const prisma = await getPostgresClient()

  if (!prisma) {
    throw new Error('PostgreSQL client not available')
  }

  try {
    // Clean existing data (in development only)
    if (process.env.NODE_ENV !== 'production') {
      await prisma.termRelationship.deleteMany()
      await prisma.termTaxonomy.deleteMany()
      await prisma.term.deleteMany()
      await prisma.comment.deleteMany()
      await prisma.articleTranslation.deleteMany()
      await prisma.article.deleteMany()
      await prisma.pageTranslation.deleteMany()
      await prisma.page.deleteMany()
      await prisma.portfolioTranslation.deleteMany()
      await prisma.portfolio.deleteMany()
      await prisma.productTranslation.deleteMany()
      await prisma.product.deleteMany()
      await prisma.userMeta.deleteMany()
      await prisma.user.deleteMany()
      await prisma.setting.deleteMany()
      await prisma.menu.deleteMany()
    }

    // Create admin user
    const _adminUser = await prisma.user.create({
      data: {
        login: 'admin',
        email: 'admin@nuxtwo.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        displayName: 'Administrator',
        role: 'SUPERADMIN'
      }
    })

    // Create author user
    const authorUser = await prisma.user.create({
      data: {
        login: 'aleksandar',
        email: 'aleksandar@stajic.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        displayName: 'Aleksandar Stajic',
        role: 'AUTHOR'
      }
    })

    // Create categories (terms)
    const techTerm = await prisma.term.create({
      data: {
        slug: 'technology',
        name: 'Technology'
      }
    })

    const webDevTerm = await prisma.term.create({
      data: {
        slug: 'web-development',
        name: 'Web Development'
      }
    })

    const nuxtTerm = await prisma.term.create({
      data: {
        slug: 'nuxt',
        name: 'Nuxt.js'
      }
    })

    // Create taxonomies
    const techCategory = await prisma.termTaxonomy.create({
      data: {
        termId: techTerm.id,
        taxonomy: 'category',
        description: 'Technology and programming articles'
      }
    })

    const webDevCategory = await prisma.termTaxonomy.create({
      data: {
        termId: webDevTerm.id,
        taxonomy: 'category',
        description: 'Web development tutorials and guides',
        parentId: techCategory.id
      }
    })

    const nuxtTag = await prisma.termTaxonomy.create({
      data: {
        termId: nuxtTerm.id,
        taxonomy: 'tag',
        description: 'Nuxt.js framework related content'
      }
    })

    // Create sample articles
    const _article1 = await prisma.article.create({
      data: {
        slug: 'welcome-to-nuxtwo-multilang-theme',
        status: 'PUBLISHED',
        authorId: authorUser.id,
        translations: {
          create: [
            {
              lang: 'en',
              title: 'Welcome to NuxtWP Multilang Theme',
              content: `# Welcome to NuxtWP Multilang Theme

This is a modern, multilingual WordPress-inspired theme built with Nuxt 4. Features include:

## Key Features

- **Nuxt 4.1.3** with Vue 3 Composition API
- **Multi-Database Architecture** (PostgreSQL, MySQL, MongoDB)
- **Modern Layout System** with AppSidebar and AppFooter
- **7 Language Support** with smart detection
- **WordPress Integration** via MySQL database
- **Advanced Security** with production-ready headers

## Created by Aleksandar Stajic

This theme represents the pinnacle of modern web development, combining the best of Nuxt.js with WordPress-like content management capabilities.

Built with ❤️ using modern technologies and best practices.`,
              excerpt:
                'Introduction to the NuxtWP Multilang Theme - a modern multilingual CMS built with Nuxt 4.'
            },
            {
              lang: 'de',
              title: 'Willkommen beim NuxtWP Multilang Theme',
              content: `# Willkommen beim NuxtWP Multilang Theme

Dies ist ein modernes, mehrsprachiges WordPress-inspiriertes Theme, das mit Nuxt 4 entwickelt wurde.

## Hauptfunktionen

- **Nuxt 4.1.3** mit Vue 3 Composition API
- **Multi-Datenbank-Architektur** (PostgreSQL, MySQL, MongoDB)
- **Modernes Layout-System** mit AppSidebar und AppFooter
- **7 Sprachen Unterstützung** mit intelligenter Erkennung
- **WordPress Integration** über MySQL-Datenbank
- **Erweiterte Sicherheit** mit produktionsbereiten Headern

## Erstellt von Aleksandar Stajic

Dieses Theme repräsentiert den Höhepunkt moderner Webentwicklung und kombiniert das Beste von Nuxt.js mit WordPress-ähnlichen Content-Management-Fähigkeiten.`,
              excerpt:
                'Einführung in das NuxtWP Multilang Theme - ein modernes mehrsprachiges CMS mit Nuxt 4.'
            },
            {
              lang: 'sr',
              title: 'Dobrodošli u NuxtWP Multilang Theme',
              content: `# Dobrodošli u NuxtWP Multilang Theme

Ovo je moderna, višejezična tema inspirisana WordPress-om, razvijena sa Nuxt 4.

## Ključne karakteristike

- **Nuxt 4.1.3** sa Vue 3 Composition API
- **Multi-baza arhitektura** (PostgreSQL, MySQL, MongoDB)
- **Moderan layout sistem** sa AppSidebar i AppFooter
- **Podrška za 7 jezika** sa pametnim prepoznavanjem
- **WordPress integracija** preko MySQL baze
- **Napredna bezbednost** sa production-ready header-ima

## Kreirao Aleksandar Stajić

Ova tema predstavlja vrh moderne web razvojačke arhitekture.`,
              excerpt:
                'Uvod u NuxtWP Multilang Theme - moderan višejezični CMS napravljen sa Nuxt 4.'
            }
          ]
        },
        terms: {
          create: [{ termTaxonomyId: techCategory.id }, { termTaxonomyId: nuxtTag.id }]
        }
      }
    })

    const _article2 = await prisma.article.create({
      data: {
        slug: 'multi-database-architecture',
        status: 'PUBLISHED',
        authorId: authorUser.id,
        translations: {
          create: [
            {
              lang: 'en',
              title: 'Multi-Database Architecture in NuxtWP',
              content: `# Multi-Database Architecture

The NuxtWP theme uses a sophisticated multi-database architecture:

## Database Responsibilities

### PostgreSQL (Primary CMS)
- Content management (articles, pages, portfolios)
- User management and authentication
- Media library and SEO data
- Site configuration and settings

### MySQL (WordPress Integration)
- WordPress compatibility layer
- Legacy content migration
- Plugin data support
- Theme settings

### MongoDB (Analytics)
- User behavior tracking
- Performance metrics
- Error logging
- Search analytics

This architecture provides optimal performance and scalability while maintaining WordPress compatibility.`,
              excerpt: 'Learn about the multi-database architecture powering NuxtWP theme.'
            },
            {
              lang: 'de',
              title: 'Multi-Datenbank-Architektur in NuxtWP',
              content: `# Multi-Datenbank-Architektur

Das NuxtWP-Theme verwendet eine ausgeklügelte Multi-Datenbank-Architektur:

## Datenbank-Zuständigkeiten

### PostgreSQL (Haupt-CMS)
- Content-Management (Artikel, Seiten, Portfolios)
- Benutzerverwaltung und Authentifizierung
- Medienbibliothek und SEO-Daten
- Site-Konfiguration und Einstellungen

### MySQL (WordPress-Integration)
- WordPress-Kompatibilitätsschicht
- Legacy-Content-Migration
- Plugin-Daten-Unterstützung
- Theme-Einstellungen

### MongoDB (Analytics)
- Benutzerverhalten-Tracking
- Performance-Metriken
- Fehler-Logging
- Such-Analytics

Diese Architektur bietet optimale Performance und Skalierbarkeit bei gleichzeitiger WordPress-Kompatibilität.`,
              excerpt: 'Erfahren Sie mehr über die Multi-Datenbank-Architektur des NuxtWP-Themes.'
            }
          ]
        },
        terms: {
          create: [{ termTaxonomyId: techCategory.id }, { termTaxonomyId: webDevCategory.id }]
        }
      }
    })

    // Create sample pages
    const _aboutPage = await prisma.page.create({
      data: {
        slug: 'about',
        status: 'PUBLISHED',
        authorId: authorUser.id,
        translations: {
          create: [
            {
              lang: 'en',
              title: 'About NuxtWP Multilang Theme',
              content: `# About NuxtWP Multilang Theme

Created by **Aleksandar Stajic**, the NuxtWP Multilang Theme represents the next generation of web development frameworks.

## Vision

To bridge the gap between modern JavaScript frameworks and traditional content management systems, providing developers with powerful tools while maintaining user-friendly content management.

## Technology Stack

- Nuxt 4.1.3 with TypeScript
- Multi-database architecture
- Advanced internationalization
- Modern security practices
- Performance optimization

## Contact

For inquiries about the theme, please visit our GitHub repository or contact the development team.`,
              excerpt: 'Learn about the vision and technology behind NuxtWP Multilang Theme.'
            },
            {
              lang: 'de',
              title: 'Über NuxtWP Multilang Theme',
              content: `# Über NuxtWP Multilang Theme

Erstellt von **Aleksandar Stajic**, repräsentiert das NuxtWP Multilang Theme die nächste Generation von Web-Entwicklungs-Frameworks.

## Vision

Die Lücke zwischen modernen JavaScript-Frameworks und traditionellen Content-Management-Systemen zu schließen und Entwicklern mächtige Tools zu bieten, während benutzerfreundliches Content-Management erhalten bleibt.

## Technologie-Stack

- Nuxt 4.1.3 mit TypeScript
- Multi-Datenbank-Architektur
- Erweiterte Internationalisierung
- Moderne Sicherheitspraktiken
- Performance-Optimierung

## Kontakt

Für Anfragen zum Theme besuchen Sie bitte unser GitHub-Repository oder kontaktieren Sie das Entwicklungsteam.`,
              excerpt:
                'Erfahren Sie mehr über die Vision und Technologie hinter dem NuxtWP Multilang Theme.'
            }
          ]
        }
      }
    })

    // Create sample portfolio items
    const _portfolioItem = await prisma.portfolio.create({
      data: {
        slug: 'nuxtwo-theme-showcase',
        status: 'PUBLISHED',
        authorId: authorUser.id,
        translations: {
          create: [
            {
              lang: 'en',
              title: 'NuxtWP Theme Showcase',
              content: `# NuxtWP Theme Portfolio

A comprehensive showcase of the NuxtWP Multilang Theme capabilities:

## Features Demonstrated

- Responsive sidebar navigation
- Multi-language content management
- Modern footer with author attribution
- Advanced database architecture
- Security hardening implementation

## Technologies Used

- Nuxt 4.1.3
- Vue 3 Composition API
- TypeScript ES Modules
- Prisma ORM
- Tailwind CSS
- Docker containerization

## Results

A production-ready, multilingual CMS that combines modern development practices with user-friendly content management.`,
              excerpt: 'Comprehensive showcase of NuxtWP theme capabilities and features.'
            }
          ]
        }
      }
    })

    // Create sample product
    const _product = await prisma.product.create({
      data: {
        slug: 'nuxtwo-pro-license',
        price: 99.99,
        currency: 'EUR',
        stock: 1000,
        vendorId: authorUser.id,
        translations: {
          create: [
            {
              lang: 'en',
              title: 'NuxtWP Pro License',
              description: `Professional license for the NuxtWP Multilang Theme including:

- Commercial use rights
- Premium support
- Advanced documentation
- Custom development consultation
- Priority updates and features`
            },
            {
              lang: 'de',
              title: 'NuxtWP Pro Lizenz',
              description: `Professionelle Lizenz für das NuxtWP Multilang Theme inklusive:

- Kommerzielle Nutzungsrechte
- Premium Support
- Erweiterte Dokumentation
- Custom Development Beratung
- Prioritäts-Updates und Features`
            }
          ]
        }
      }
    })

    // Create main navigation menu
    await prisma.menu.create({
      data: {
        slug: 'main-navigation',
        name: 'Main Navigation',
        items: {
          home: { label: 'Home', href: '/', icon: 'i-lucide-home' },
          blog: { label: 'Blog', href: '/blog', icon: 'i-lucide-book-open' },
          portfolio: { label: 'Portfolio', href: '/portfolio', icon: 'i-lucide-briefcase' },
          products: { label: 'Products', href: '/products', icon: 'i-lucide-shopping-cart' },
          about: { label: 'About', href: '/about', icon: 'i-lucide-user' },
          contact: { label: 'Contact', href: '/contact', icon: 'i-lucide-mail' }
        }
      }
    })

    // Create site settings
    await prisma.setting.createMany({
      data: [
        {
          key: 'site_title',
          value: {
            en: 'NuxtWP Multilang Theme',
            de: 'NuxtWP Multilang Theme',
            sr: 'NuxtWP Multilang Tema'
          }
        },
        {
          key: 'site_description',
          value: {
            en: 'Modern multilingual WordPress-inspired theme',
            de: 'Modernes mehrsprachiges WordPress-inspiriertes Theme'
          }
        },
        { key: 'site_author', value: 'Aleksandar Stajic' },
        { key: 'site_version', value: '1.0.0' },
        { key: 'default_language', value: 'en' },
        { key: 'supported_languages', value: ['en', 'de', 'sr', 'es', 'fr', 'it', 'ru'] },
        {
          key: 'theme_settings',
          value: {
            primaryColor: '#3b82f6',
            sidebarWidth: '280px',
            footerStyle: 'modern',
            headerStyle: 'fixed'
          }
        }
      ]
    })

    // Log successful seeding
    process.stdout.write('PostgreSQL CMS seeded successfully!\n')
    process.stdout.write('Created:\n')
    process.stdout.write('- 2 users (admin, aleksandar)\n')
    process.stdout.write('- 3 terms with taxonomies\n')
    process.stdout.write('- 2 articles with translations\n')
    process.stdout.write('- 1 page with translations\n')
    process.stdout.write('- 1 portfolio item\n')
    process.stdout.write('- 1 product\n')
    process.stdout.write('- 1 navigation menu\n')
    process.stdout.write('- 7 site settings\n')
  } catch (error) {
    process.stderr.write(`Error seeding PostgreSQL: ${error}\n`)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  seedPostgresCMS().catch((error) => {
    process.stderr.write(`Seed failed: ${error}\n`)
    process.exit(1)
  })
}

export default seedPostgresCMS
