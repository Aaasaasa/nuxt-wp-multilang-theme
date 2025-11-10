# CLAUDE.md - NuxtWP Multilang Theme

## Project Overview

**NuxtWP Multilang Theme v1.0.0** - A modern, production-ready WordPress-inspired theme built with Nuxt 4, featuring advanced multi-database architecture and comprehensive multilingual support. Created by **Aleksandar Stajic**.

### Core Technologies

- **Nuxt 4.1.3** with Vue 3 Composition API and TypeScript ES Modules
- **Multi-Database Architecture**: PostgreSQL (CMS), MySQL (WordPress), MongoDB (Analytics)
- **Yarn Package Management**: Consistent dependency management across environments
- **Modern Layout System**: AppSidebar and AppFooter with responsive design
- **Advanced i18n**: 7 languages with smart detection and SEO optimization
- **Security Hardening**: Production-ready CORS, CSP, HSTS, rate limiting
- **Comprehensive Testing**: Vitest (unit) + Playwright (E2E) with coverage

### Major Features (v1.0.0)

- ✅ **Modern Layout Components**: AppSidebar with mobile overlay, AppFooter with author attribution
- ✅ **CSS Architecture Overhaul**: Eliminated @apply directives, implemented CSS variables
- ✅ **Multi-Database Prisma Setup**: Separate schemas for CMS, WordPress, Analytics
- ✅ **Yarn Migration**: Complete migration from mixed npm/pnpm to Yarn
- ✅ **GitHub Actions CI/CD**: Automated testing, linting, and deployment
- ✅ **WordPress Integration**: MySQL database support for WP compatibility

## Directory Structure

```
├── app/                           # Main Nuxt 4 Application
│   ├── components/layout/         # Modern Layout Components (NEW v1.0)
│   │   ├── AppSidebar.vue        # Responsive sidebar navigation
│   │   ├── AppFooter.vue         # Professional footer with author attribution
│   │   └── PreferencesControls.vue
│   ├── layouts/default.vue       # Main layout with sidebar integration
│   ├── assets/css/main.css       # Consolidated CSS (no @apply directives)
│   ├── pages/                    # File-based routing with i18n
│   ├── composables/              # Vue composables (auto-imported)
│   └── middleware/               # Route middleware (auth, guest)
│
├── app/admin/                     # Separate Admin Application
│   ├── components/               # Admin-specific components
│   ├── pages/                    # Admin dashboard pages
│   └── nuxt.config.ts           # Admin-specific configuration
│
├── shared/                       # Shared Code (Auto-imported)
│   ├── types/                   # TypeScript type definitions
│   ├── models/                  # Data models and interfaces
│   ├── schemas/                 # Zod validation schemas
│   └── utils/                   # Utility functions
│
├── server/                       # Server-side Code (Nitro)
│   ├── api/                     # API routes (auto-mapped)
│   │   ├── auth/               # Authentication endpoints
│   │   ├── blog/               # Blog/CMS API
│   │   └── admin/              # Admin API endpoints
│   ├── services/               # Business logic services
│   └── utils/                  # Server utilities
│
├── prisma/                      # Multi-Database Configuration (NEW v1.0)
│   ├── schema.prisma           # Main PostgreSQL CMS schema
│   ├── mysql/                  # WordPress integration schemas
│   ├── mongo/                  # Analytics and logging schemas
│   ├── postgres-cms/           # Extended CMS schemas
│   ├── generated/              # Generated Prisma clients
│   └── migrations/             # Database migration history
│
├── i18n/                       # Internationalization
│   ├── localeDetector.ts       # Smart locale detection
│   └── locales/               # 7 language translations (EN, DE, SR, ES, FR, IT, RU)
│
├── tests/                      # Comprehensive Testing
│   ├── unit/                  # Vitest unit tests
│   ├── e2e/                   # Playwright E2E tests
│   └── setup/                 # Test configuration
│
└── docs/                      # Documentation
    ├── component-architecture.md
    ├── database-patterns.md
    └── ...                    # Comprehensive guides
```

## Key Commands (Yarn-Based v1.0)

### Development Server

```bash
yarn dev                    # Start development server (port 3000)
yarn dev --port 4000       # Start on specific port
yarn build                 # Build for production
yarn preview               # Preview production build
```

### Code Quality & Testing

```bash
yarn lint                  # ESLint + Prettier
yarn lint:fix             # Auto-fix linting issues
yarn typecheck            # TypeScript validation
yarn test                 # Run all tests (unit + E2E)
yarn test:unit            # Vitest unit tests only
yarn test:e2e             # Playwright E2E tests only
yarn test:unit:coverage   # Unit tests with coverage
```

### Multi-Database Operations (NEW v1.0)

```bash
# Start multi-service environment
docker compose up -d      # PostgreSQL, MySQL, MongoDB, Redis, Adminer

# Database management
yarn prisma:generate      # Generate all Prisma clients
yarn prisma:migrate       # Run database migrations
yarn prisma:studio        # Open Prisma Studio (localhost:5555)
yarn prisma:reset         # Reset databases (development only)
yarn db:seed              # Seed with sample data

# Database-specific operations
yarn prisma generate --schema=prisma/schema.prisma        # PostgreSQL CMS
yarn prisma generate --schema=prisma/mysql/schema.prisma  # MySQL WordPress
yarn prisma generate --schema=prisma/mongo/schema.prisma  # MongoDB Analytics
```

### Package Management

```bash
yarn install              # Install dependencies
yarn add <package>        # Add dependency
yarn add -D <package>     # Add dev dependency
yarn remove <package>     # Remove dependency
yarn upgrade              # Upgrade all dependencies
```

### Git & CI/CD

```bash
yarn prepare              # Setup Husky git hooks
yarn commitlint           # Validate commit messages
yarn clean                # Clean build artifacts
```

## Patterns & Practices (Updated v1.0)

### Database Patterns

- **Multi-Database Architecture**: PostgreSQL (CMS), MySQL (WordPress), MongoDB (Analytics)
- **Client Singletons**: Separate clients in `server/lib/prisma-*.ts` for each database
- **Service Layer**: Database operations abstracted in `server/services/`
- **Type Safety**: Full TypeScript integration with generated Prisma clients

### Component Architecture

- **Modern Layout System**: AppSidebar and AppFooter with responsive design
- **Explicit Imports**: Layout components imported explicitly if auto-import fails
- **Composition API**: `<script setup>` syntax with proper TypeScript typing
- **Mobile-First**: Responsive design with mobile overlay and desktop panel modes

### CSS Architecture (Major Change v1.0)

- **No @apply Directives**: Eliminated Tailwind @apply - use CSS variables instead
- **CSS Custom Properties**: Theme switching with CSS variables
- **Consolidated Styles**: All styles in `app/assets/css/main.css`
- **Performance Optimized**: Reduced CSS bundle size and conflicts

### API & Security

- **RESTful API**: Standardized JSON responses `{ statusCode, data, message }`
- **Multi-Database APIs**: Separate endpoints for CMS, WordPress, Analytics
- **Security Headers**: Production-ready CORS, CSP, HSTS configuration
- **Rate Limiting**: 150 requests per 5-minute window (configurable)
- **Authentication**: Session-based auth with CSRF protection

### State Management

- **Pinia Stores**: Cookie persistence with `@pinia-plugin-persistedstate/nuxt`
- **Composables**: Vue composables for form handling, notifications, API calls
- **Auto-imports**: Configured for components, composables, stores, shared utils
- **Reactive Data**: Vue 3 reactivity with proper TypeScript typing

### Testing Strategy

- **Unit Tests**: Vitest for utilities, composables, and services
- **E2E Tests**: Playwright for user flows and component integration
- **Component Testing**: Layout components (AppSidebar, AppFooter)
- **Database Testing**: Multi-database operation testing

### Internationalization

- **7 Languages**: EN, DE, SR, ES, FR, IT, RU with smart detection
- **SEO Optimization**: Proper hreflang tags and localized meta data
- **Route-based**: Prefix-based routing with locale detection
- **Content Management**: Multi-language content in CMS database

## Environment Variables (Multi-Database v1.0)

### Core Database Connections

```bash
# PostgreSQL CMS (Primary)
DATABASE_URL="postgresql://user:password@localhost:5432/nuxt_cms"

# MySQL WordPress Integration
MYSQL_DATABASE_URL="mysql://user:password@localhost:3306/wordpress"

# MongoDB Analytics
MONGODB_DATABASE_URL="mongodb://localhost:27017/analytics"

# Redis Caching & Sessions
REDIS_URL="redis://localhost:6379"
```

### Security & Authentication

```bash
# Required for production
NUXT_SECRET_KEY="your-256-bit-secret-key"
CORS_ORIGIN="https://yourdomain.com"

# Rate limiting configuration
RATE_LIMIT_MAX="150"
RATE_LIMIT_WINDOW="300000"

# Security headers
CSP_REPORT_URI="https://yourdomain.com/csp-report"
```

### SEO & Site Configuration

```bash
# Site URL for SEO (defaults to localhost:3000 in dev)
NUXT_PUBLIC_SITE_URL="https://yourdomain.com"

# Site metadata
NUXT_PUBLIC_SITE_NAME="NuxtWP Multilang Theme"
NUXT_PUBLIC_SITE_DESCRIPTION="Modern multilingual WordPress-inspired theme"
```

### Testing Environment

```bash
# Test databases (separate from development)
TEST_DATABASE_URL="postgresql://user:password@localhost:5432/test_cms"
TEST_MYSQL_URL="mysql://user:password@localhost:3306/test_wp"
TEST_MONGODB_URL="mongodb://localhost:27017/test_analytics"
```

## Development Guidelines (Updated v1.0)

### Code Standards

- **TypeScript Strict Mode**: No `any` types - use proper interfaces
- **Vue 3 Composition API**: `<script setup>` syntax with TypeScript
- **Explicit Layout Imports**: Import AppSidebar/AppFooter explicitly if needed
- **CSS Variables**: Use CSS custom properties instead of @apply directives
- **Multi-Database**: Use appropriate service layer for database operations

### Package Management

- **Yarn Only**: Use Yarn exclusively - no npm or pnpm commands
- **Lock File**: Commit yarn.lock changes
- **Scripts**: All scripts use Yarn in package.json and CI/CD

### Commit Convention

```bash
# Conventional commits enforced by Husky
feat(sidebar): add mobile overlay functionality
fix(css): resolve bg-background variable conflicts
docs(readme): update multi-database setup instructions
chore(deps): upgrade Nuxt to 4.1.3
```

### Component Development

```vue
<!-- Layout Component Pattern -->
<script setup lang="ts">
// Explicit imports for layout components
import AppSidebar from '~/components/layout/AppSidebar.vue'
import AppFooter from '~/components/layout/AppFooter.vue'

interface Props {
  modelValue?: boolean
  variant?: 'default' | 'compact'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  variant: 'default'
})

// Composable integration
const { t } = useI18n()
const { loggedIn } = useUserSession()
const route = useRoute()
</script>
```

### CSS Guidelines

```css
/* ✅ Use CSS variables for theming */
.sidebar {
  background-color: var(--color-background);
  border-color: var(--color-border);
}

/* ❌ Avoid @apply directives (causes conflicts) */
.sidebar {
  @apply bg-background border-border; /* Don't use this */
}
```

### Database Operations

```typescript
// Use service layer pattern
import { getPostgresClient, getMySQLClient } from '~/server/lib/prisma-utils'

export class ArticleService {
  private cmsClient = getPostgresClient()
  private wpClient = getMySQLClient()

  async syncWordPressPost(wpId: string) {
    // Multi-database operation example
  }
}
```

## Quick Start Checklist

1. ✅ **Install Yarn**: `npm install -g yarn`
2. ✅ **Clone & Install**: `git clone ... && cd ... && yarn install`
3. ✅ **Environment**: `cp .env.example .env` and configure
4. ✅ **Databases**: `docker compose up -d`
5. ✅ **Generate Clients**: `yarn prisma:generate`
6. ✅ **Migrate**: `yarn prisma:migrate`
7. ✅ **Seed Data**: `yarn db:seed`
8. ✅ **Start Dev**: `yarn dev --port 4000`
9. ✅ **Verify**: Visit localhost:4000, check sidebar and footer

---

## 🔧 Problem-Lösungen & Langzeit-Gedächtnis

### WordPress Migration - Kritische Erkenntnisse (30.10.2025)

**WICHTIG**: Immer DB-Backup vor Änderungen!

```bash
PGPASSWORD="Utorak30Sep" pg_dump -h localhost -U usrcms -d nuxt_pg_cms_db \
  --format=custom --file=/tmp/nuxt_cms_backup_$(date +%Y%m%d_%H%M%S).dump
```

#### Content-Typen & URL-Struktur

**3 Haupt-Content-Typen** mit unterschiedlichen URL-Patterns:

1. **Articles** (Blog-Posts)
   - DB: `cms_articles` + `cms_article_translations`
   - URL: `/blog/{slug}` (z.B. `/blog/laravel-12-custom-cms-with-filament3`)
   - API: `/api/posts`
   - Slug in: `cms_articles.slug`

2. **Pages** (statische Seiten)
   - DB: `cms_pages` + `cms_page_translations`
   - URL: `/{slug}` (z.B. `/services-dienstleistungen-muenchen`)
   - API: `/api/pages`
   - Slug in: `cms_pages.slug`

3. **Portfolios** (Projekt-Showcase)
   - DB: `cms_portfolios` + `cms_portfolio_translations`
   - URL: `/our-work` (Übersichtsseite) + `/our-work/{slug}` (Einzelprojekt)
   - API: `/api/portfolios`
   - Slug in: `cms_portfolios.slug`
   - **Wichtig**: Portfolio-Übersicht ist eine **Page** mit slug `our-work`, Portfolio-Items haben eigene Slugs

#### Media & Featured Images - Kritische Fixes

**Problem**: PNG-Dateinamen in DB, aber WEBP-Dateien im Filesystem
**Lösung**: DB-Update (keine Migration neu!)

```sql
-- Media Haupttabelle
UPDATE cms_media
SET filename = REPLACE(filename, '.png', '.webp'),
    "filePath" = REPLACE("filePath", '.png', '.webp'),
    "mimeType" = 'image/webp'
WHERE filename LIKE '%.png';

-- Media Größen-Varianten
UPDATE cms_media_sizes
SET "filePath" = REPLACE("filePath", '.png', '.webp')
WHERE "filePath" LIKE '%.png';
```

**Featured Images Verbindung**:

- ArticleMeta.featuredImageId → Media.id
- PageMeta.featuredImageId → Media.id
- PortfolioMeta.featuredImageId → Media.id
- **Wichtig**: Relation heißt `Media` (capital M), nicht `media`!

#### Menü-System - Kritische Erkenntnisse

**Problem**: Menü in DB aber nicht angezeigt
**Root Causes**:

1. Menu.name muss mit API-Aufruf übereinstimmen (`'main-menu'` nicht `'Main Menu'`)
2. MenuItem.url muss aus Page/Article-Slug generiert werden
3. Service muss `translations` (plural!) inkludieren

**Lösung**:

```sql
-- 1. Menü-Namen normalisieren
UPDATE "Menu" SET name = 'main-menu' WHERE location = 'main-menu';

-- 2. URLs aus Content-Slugs generieren
UPDATE "MenuItem" mi
SET url = CONCAT('/', p.slug)
FROM cms_pages p
WHERE mi."pageId" = p.id AND (mi.url IS NULL OR mi.url = '');

UPDATE "MenuItem" mi
SET url = CONCAT('/blog/', a.slug)
FROM cms_articles a
WHERE mi."articleId" = a.id AND (mi.url IS NULL OR mi.url = '');

UPDATE "MenuItem" mi
SET url = CONCAT('/our-work/', po.slug)
FROM cms_portfolios po
WHERE mi."portfolioId" = po.id AND (mi.url IS NULL OR mi.url = '');
```

**Service Layer** (`server/services/menu.service.ts`):

```typescript
// RICHTIG: translations (plural) + URL-Generierung
include: {
  page: {
    include: {
      translations: { where: { lang: 'de' }, take: 1 }
    }
  },
  article: {
    include: {
      translations: { where: { lang: 'de' }, take: 1 }
    }
  },
  portfolio: {
    include: {
      translations: { where: { lang: 'de' }, take: 1 }
    }
  }
}

// URL-Generierung in buildMenuHierarchy()
let url = item.url || ''
if (!url && item.page?.translations?.[0]?.slug) {
  url = `/${item.page.translations[0].slug}`
} else if (!url && item.article?.translations?.[0]?.slug) {
  url = `/blog/${item.article.translations[0].slug}`
} else if (!url && item.portfolio?.translations?.[0]?.slug) {
  url = `/our-work/${item.portfolio.translations[0].slug}`
}
```

#### Auto-Drafts & Shortcodes - Migration-Filter

**WICHTIG**: Diese Filter in `migrate/migrate.ts` bei `migrateContent()`:

```typescript
// WordPress Posts Query - NUR valide Content
WHERE post_type IN ('page', 'post', 'portfolio')
  AND post_status NOT IN ('auto-draft', 'trash', 'inherit')
  AND (post_name IS NOT NULL AND post_name != '')
```

**Shortcode-Stripping** (WordPress Fusion Builder):

```typescript
function stripShortcodes(content: string): string {
  if (!content) return ''

  // Remove fusion_builder shortcodes
  let cleaned = content.replace(/\[fusion_[^\]]+\]/g, '')

  // Remove all remaining shortcodes
  cleaned = cleaned.replace(/\[([^\]]+)\]/g, '')

  // Clean excessive whitespace
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim()

  return cleaned
}

// Anwenden bei ALLEN Translations:
translation: {
  upsert: {
    where: { articleId_lang: { articleId: article.id, lang: 'de' } },
    create: {
      lang: 'de',
      title: p.post_title || '',
      content: stripShortcodes(p.post_content || ''),
      excerpt: stripShortcodes(p.post_excerpt || '')
    }
  }
}
```

#### Vollständige Datenprüfung - Bevor Tests

**IMMER vor "fertig"-Meldung**:

```sql
-- Alle Content-Typen zählen
SELECT
  'Articles' as type,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE slug NOT LIKE 'post-%') as valid,
  COUNT(DISTINCT am."featuredImageId") as with_images
FROM cms_articles a
LEFT JOIN cms_article_metas am ON a.id = am."articleId"
UNION ALL
SELECT
  'Pages',
  COUNT(*),
  COUNT(*),
  COUNT(DISTINCT pm."featuredImageId")
FROM cms_pages p
LEFT JOIN cms_page_metas pm ON p.id = pm."pageId"
UNION ALL
SELECT
  'Portfolios',
  COUNT(*),
  COUNT(*),
  COUNT(DISTINCT pom."featuredImageId")
FROM cms_portfolios po
LEFT JOIN cms_portfolio_metas pom ON po.id = pom."portfolioId";

-- Menu-Items Vollständigkeit
SELECT
  COUNT(*) as total_items,
  COUNT(*) FILTER (WHERE url IS NOT NULL AND url != '') as with_urls,
  COUNT(*) FILTER (WHERE "pageId" IS NOT NULL) as page_links,
  COUNT(*) FILTER (WHERE "articleId" IS NOT NULL) as article_links,
  COUNT(*) FILTER (WHERE "portfolioId" IS NOT NULL) as portfolio_links
FROM "MenuItem";

-- Media Vollständigkeit
SELECT
  COUNT(*) as total_media,
  COUNT(*) FILTER (WHERE "mimeType" = 'image/webp') as webp_count,
  COUNT(*) FILTER (WHERE "mimeType" LIKE 'image/%') as all_images
FROM cms_media;
```

### Backup-System

**Automatisches Backup-Script**: `scripts/backup-databases.sh`

```bash
# Backup erstellen (beide Datenbanken)
bash /srv/proj/nuxt-wp-multilang-theme/scripts/backup-databases.sh
```

**Backup-Inhalt**:

- 🐘 PostgreSQL: `postgres_nuxt_pg_cms_db.dump` (Custom Format, ~1.2 MB)
- 🐬 MySQL: `mysql_sta3wp.sql` (SQL Dump, ~8.7 MB)
- 📝 Info-Datei: `backup_info.txt` (Restore-Befehle)

**Backup-Location**:

- Pfad: `/srv/proj/nuxt-wp-multilang-theme/backups/YYYYMMDD_HHMMSS/`
- Format: Timestamp-basierte Ordner (z.B. `20251030_145415`)
- Versionierung: Jedes Backup in eigenem Ordner

**Wiederherstellung**:

```bash
# PostgreSQL wiederherstellen
PGPASSWORD=Utorak30Sep pg_restore \
  -h localhost \
  -p 5432 \
  -U usrcms \
  -d nuxt_pg_cms_db \
  -c \
  /srv/proj/nuxt-wp-multilang-theme/backups/YYYYMMDD_HHMMSS/postgres_nuxt_pg_cms_db.dump

# MySQL wiederherstellen
docker exec -i nuxt_mysql mysql \
  -u root \
  -pFreitag0605 \
  sta3wp \
  < /srv/proj/nuxt-wp-multilang-theme/backups/YYYYMMDD_HHMMSS/mysql_sta3wp.sql
```

**Wichtig**:

- `-c` Flag bei pg_restore: Löscht existierende Objekte vor Restore
- Docker Container Name: `nuxt_mysql` (nicht `nuxt-wp-multilang-theme-mysql-1`)
- Automatische Backup-Info mit allen Befehlen in `backup_info.txt`

### Arbeitsweise - Best Practices

1. **VOR jeder DB-Änderung**: Backup erstellen! (`bash scripts/backup-databases.sh`)
2. **VOR "fertig"-Meldung**: ALLE Datensätze prüfen (nicht nur 3-4)
3. **KEINE Migration neu** laufen lassen, wenn nur DB-Daten falsch sind
4. **Prisma Relations**: Immer Schema checken (plural vs singular!)
5. **API testen**: Vollständige Response prüfen, nicht nur erste Items
6. **Frontend testen**: Tatsächliche Seite im Browser checken
7. **Fehlende Content**: Prüfen ob in WordPress vorhanden war (nicht alles migriert!)
8. **Nach Portfolio-Import**: Shortcodes bereinigen (`yarn tsx scripts/clean-portfolio-shortcodes.ts`)

### Bekannte Einschränkungen (30.10.2025)

**Portfolio-System (Avada Theme Sonderfall)**:

- WordPress hatte **0 Standard-Portfolios** (post_type='portfolio')
- WordPress hatte **8 Avada-Portfolios** (post_type='avada_portfolio') - **Theme-spezifisch!**
- **WICHTIG**: `avada_portfolio` ist KEIN WordPress-Standard, sondern Avada-Theme-Feature
- Migration (`migrate.ts`) sucht nur nach Standard-Typen: 'page', 'post', 'portfolio'
- **Import-Script**: `scripts/import-avada-portfolios.ts` für Avada-spezifische Portfolios
- **Shortcode-Bereinigung**: `scripts/clean-portfolio-shortcodes.ts` nach Import ausführen
- ✅ **Status (30.10.2025)**: 8 Avada-Portfolios erfolgreich importiert, Shortcodes bereinigt
- `/portfolio` Page existiert und funktioniert (zeigt importierte Portfolios)
- Page-Slug geändert: `/our-work` → `/portfolio` (damit Nuxt-Route matcht)
- Portfolio-Routes: `/portfolio` (index), `/portfolio/[slug]` (detail)
- Featured Images: Alle 8 Portfolios haben WEBP-Bilder via `_thumbnail_id` Meta

**Menu-Items ohne URLs** (6 Stück):

- Titel: "Firmenwebseite AJM", "Solr Suggester", "Lokales Unternehmen", etc.
- Grund: Verlinkte WordPress-Posts existieren in source DB nicht mehr
- Lösung: Manuelle Pflege oder Entfernung dieser Items

**Blog/Articles**:

- ✅ 37 Articles migriert
- ✅ 36 mit Featured Images
- ✅ URLs funktionieren: `/blog/{slug}`
- ✅ Deutsche Übersetzungen vorhanden

### Debugging-Strategie

...

1. **API-Ebene**: `curl http://localhost:4000/api/posts | jq '.data | length'`
2. **DB-Ebene**: Komplette Queries mit JOINs und Counts
3. **Service-Ebene**: Console.log entfernen, TypeScript-Errors beachten
4. **Frontend-Ebene**: Browser DevTools Network Tab

---

## Role-Based Access Control (RBAC) System

### Implementierung (10. November 2025)

Ein vollständiges rollenbasiertes Zugriffssystem wurde implementiert mit drei Benutzerrollen:

#### 1. Layouts

Drei dedizierte Layouts für unterschiedliche Benutzerrollen:

- **`app/layouts/superadmin.vue`**: Purple/Indigo Theme mit Shield-Icon
  - Vollständiger Systemzugriff
  - Database Health Monitoring
  - User Management
  - System Settings

- **`app/layouts/admin.vue`**: Blue/Cyan Theme mit Settings-Icon
  - Content Management (Artikel, Seiten, Media)
  - User Moderation
  - Kommentarverwaltung

- **`app/layouts/customer.vue`**: Green/Teal Theme mit User-Icon
  - Profilverwaltung
  - Bestellungen
  - Account Settings

**Wichtig**: Alle Layouts verwenden die einheitliche Struktur:

- `AppSidebar`: Responsive Navigation
- `UHeader`: Gradient-Header mit Rolle-spezifischen Farben
- `UMain`: Content-Bereich
- `AppFooter`: Footer-Komponente

**User Type Problem**: Der `nuxt-auth-utils` User-Type enthält KEINE Properties wie `name`, `email`, `role`. Diese wurden aus allen Layouts entfernt, um TypeScript-Fehler zu vermeiden.

#### 2. Middleware

Drei Route-Guards für rollenbasierte Zugriffskontrolle:

- **`app/middleware/role-superadmin.ts`**
  - Prüft Login-Status
  - TODO: Role-Check wenn User-Type erweitert ist

- **`app/middleware/role-admin.ts`**
  - Prüft Login-Status
  - TODO: Check ADMIN oder SUPERADMIN role

- **`app/middleware/role-customer.ts`**
  - Nur Login-Check
  - Alle authentifizierten User erlaubt

**Naming Convention**: Nuxt erwartet kebab-case für Middleware Auto-Import:

- ✅ `role-superadmin.ts` → `middleware: 'role-superadmin'`
- ❌ `role.superadmin.ts` (funktioniert nicht mit Auto-Import)

#### 3. Dashboard Pages

Drei Dashboard-Seiten mit Role-spezifischem Content:

- **`app/pages/superadmin/index.vue`**
  - System Status, User Count, Database Statistics
  - Schnellzugriff: DB Health Check, User Management, Settings, Logs
  - Route: `/superadmin`

- **`app/pages/admin/index.vue`**
  - Content Stats (37 Artikel, 12 Seiten, 104 Media)
  - Schnellzugriff: Neuer Artikel, User verwalten, Media Library, Kommentare
  - Route: `/admin`

- **`app/pages/customer/index.vue`**
  - Profil, Bestellungen, Nachrichten
  - Schnellzugriff: Profil bearbeiten, Passwort ändern, Bestellungen, Favoriten
  - Route: `/customer`

#### 4. TypeScript Type Generation

Nach dem Erstellen neuer Layouts/Middleware **IMMER** Typen neu generieren:

```bash
yarn nuxi prepare
```

Dies aktualisiert:

- `.nuxt/types/layouts.d.ts` → `LayoutKey = "admin" | "customer" | "default" | "superadmin"`
- `.nuxt/types/middleware.d.ts` → `MiddlewareKey = "auth" | "guest" | "role-admin" | "role-customer" | "role-superadmin"`

**Problem**: VSCode/ESLint cache kann alte Typen behalten → Dev-Server neu starten

#### 5. Offene Aufgaben (TODOs)

- [ ] **User Type Extension**: `types/auth.d.ts` mit `role: 'SUPERADMIN' | 'ADMIN' | 'EDITOR' | 'CUSTOMER' | 'GUEST'`
- [ ] **Server-Side Role Checking**: `server/middleware/role-check.ts` für API-Level Protection
- [ ] **Session Integration**: User role in Session speichern
- [ ] **Role Enforcement**: Middleware mit tatsächlichem Role-Check implementieren
- [ ] **Tests**: E2E-Tests für rollenbasierte Navigation

#### 6. Session Management & Mobile Apps

**Redis Discussion** (31. Oktober 2025):

- User Concern: "wie ist es mit mobile App wenn ich Redis habe? Es wird ohne Net nicht funktionieren"
- **Lösung**: JWT-basierte Sessions als Alternative für Mobile Offline-Szenarien
- **Architektur**: Frontend (PWA/Capacitor) → Nuxt API → Databases (kein direkter DB-Zugriff)
- **Sicherheit**: Capacitor App nutzt nur Nuxt API, nicht direkt Redis

**Redis vs. JWT**:

- **Redis**: Stateful sessions, server-side control, session revocation
- **JWT**: Stateless tokens, offline-fähig, kein Backend-Call für Validation
- **Empfehlung**: Hybrid-Ansatz möglich (Redis für Web, JWT für Mobile)

---

**Claude Context**: This is a production-ready Nuxt 4 theme with modern architecture, created by Aleksandar Stajic. Focus on the multi-database setup, modern layout components, and Yarn-based workflows when assisting with development.

**WICHTIG**: Lies IMMER diese Problem-Lösungen BEVOR du Code änderst! Portfolios sind eigener Content-Typ mit `/our-work/*` URLs!
