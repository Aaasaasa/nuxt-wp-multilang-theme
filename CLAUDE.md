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

**Claude Context**: This is a production-ready Nuxt 4 theme with modern architecture, created by Aleksandar Stajic. Focus on the multi-database setup, modern layout components, and Yarn-based workflows when assisting with development.
