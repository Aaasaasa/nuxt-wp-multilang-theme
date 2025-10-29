# 📖 NuxtWP Multilang Theme - Documentation

Comprehensive implementation guide and advanced usage patterns for the NuxtWP Multilang Theme by **Aleksandar Stajic**.

> For quick setup and basic commands, see [README.md](../README.md) and [CLAUDE.md](../CLAUDE.md)

## 🎯 What's New in v1.1.0

### WordPress Migration & Content APIs

- **Complete WordPress Migration**: Successfully migrated 37 articles, 12 pages, 10 portfolios from WordPress
- **Term Relationships**: 224 category/tag connections linking content with taxonomies
- **Content APIs**: Full RESTful APIs for Articles, Pages, Portfolios with service layer architecture
- **WebP Optimization**: Featured images with progressive WebP conversion (33% complete)
- **Portfolio Support**: Avada Portfolio post type integration with custom taxonomies

### Content Management System

- **191 Terms Migrated**: Categories, tags, portfolio categories/tags from WordPress
- **Multilingual Content**: Full translation support for all migrated content
- **Featured Images**: WebP-optimized images with relative path handling
- **Service Layer**: Business logic separation for all content types

## 🎯 What's New in v1.0.0

### Major Features

- **Modern Layout System**: AppSidebar and AppFooter components with responsive design
- **Multi-Database Architecture**: PostgreSQL, MySQL, MongoDB integration with Prisma
- **Yarn Package Management**: Migrated from mixed npm/pnpm to consistent Yarn workflow
- **CSS Architecture Overhaul**: Eliminated @apply directives, implemented CSS variables
- **Advanced i18n**: 7 languages with smart detection and SEO optimization

### Migration Results

✅ **Successfully Migrated:**

- **37 Articles** with 141 category/tag relationships
- **12 Pages** with complete content hierarchy
- **10 Portfolio Projects** with 83 category/tag relationships
- **191 Terms** (categories, tags, portfolio taxonomies)
- **224 Term Relationships** connecting content with taxonomies

### Breaking Changes

- Package manager migration to Yarn (see [Migration Guide](#migration-from-v09))
- Layout system now includes sidebar navigation
- CSS classes updated for CSS variable compatibility
- Multi-database environment variable structure

## 📚 Implementation Patterns

### Core Architecture

- **[🧩 Component Architecture](./component-architecture.md)** - AppSidebar, AppFooter, and component composition patterns
- **[🎨 Layout System](./layout-patterns.md)** - Modern responsive layout with sidebar navigation
- **[🗃️ Database Patterns](./database-patterns.md)** - Multi-database Prisma patterns and optimization
- **[📱 Responsive Design](./responsive-patterns.md)** - Mobile-first CSS Grid and Flexbox patterns

### Advanced Features

- **[📝 Form Patterns](./form-patterns.md)** - Advanced form validation with Zod and Vue composables
- **[🔔 Notification System](./notification-system.md)** - Toast notifications with i18n support
- **[🗂️ Pinia Patterns](./pinia-patterns.md)** - State management with persistence and SSR
- **[🛡️ Security Patterns](./security-patterns.md)** - Authentication, CORS, CSP, and rate limiting
- **[🧪 Testing Patterns](./testing-patterns.md)** - Comprehensive testing with Vitest and Playwright

### Content Management

- **[� Content APIs](./content-apis.md)** - Articles, Pages, Portfolios APIs with 224 term relationships
- **[🔄 WordPress Migration](./wordpress-migration.md)** - Complete migration guide with term relationships
- **[�📚 CMS Integration](./cms-patterns.md)** - WordPress-like content management with Prisma
- **[📝 Blog System](./blog-patterns.md)** - Article management, categories, and tags
- **[🖼️ Media Management](./media-patterns.md)** - File uploads, image optimization, and WebP conversion
- **[👥 User Management](./user-patterns.md)** - Authentication, roles, and permissions

### System Features

- **[📧 Email System](./email-system.md)** - Handlebars templates with multi-language support
- **[🌍 Internationalization](./internationalization.md)** - Advanced i18n with 7 languages and locale detection
- **[🔍 SEO Patterns](./seo-patterns.md)** - SEO optimization with structured data and hreflang
- **[🔄 Auto-imports](./auto-imports.md)** - Optimized imports with tree-shaking and performance

### DevOps & Operations

- **[🚀 Deployment Guide](./deployment-guide.md)** - Production deployment with Docker and CI/CD
- **[� Monitoring](./monitoring-patterns.md)** - Error tracking, performance monitoring, and analytics
- **[🔒 Security Hardening](./security-hardening.md)** - Production security configuration
- **[⚡ Performance Optimization](./performance-patterns.md)** - Bundle optimization and caching strategies

## 🔧 Developer Tools

### Package Management

- **Yarn Workflows**: Consistent dependency management across environments
- **Script Organization**: Standardized npm scripts for development and production
- **Dependency Management**: Automated updates with Renovate and security scanning

### Code Quality

- **ESLint Configuration**: TypeScript-optimized linting rules
- **Prettier Integration**: Automated code formatting with Git hooks
- **Commitlint**: Conventional commit message validation
- **Husky Hooks**: Pre-commit and pre-push validation

### Development Environment

- **Docker Compose**: Multi-service development environment
- **Hot Reload**: Component and TypeScript hot reloading
- **Database Management**: Prisma Studio and Adminer integration
- **API Documentation**: OpenAPI/Swagger with development UI

## � Quick Reference

### Essential Commands

```bash
# Development
yarn dev --port 4000           # Start development server
yarn build                     # Production build
yarn preview                   # Preview production build

# Database
yarn prisma:generate           # Generate all Prisma clients
yarn prisma:migrate           # Run database migrations
yarn prisma:studio            # Open Prisma Studio

# Code Quality
yarn lint                      # Run ESLint + Prettier
yarn test                      # Run all tests
yarn typecheck               # TypeScript validation
```

### Environment Variables

```bash
# Core
DATABASE_URL="postgresql://..."              # PostgreSQL CMS
MYSQL_DATABASE_URL="mysql://..."             # MySQL WordPress
MONGODB_DATABASE_URL="mongodb://..."         # MongoDB Analytics
NUXT_SECRET_KEY="your-secret-key"            # Auth secret

# Security
CORS_ORIGIN="https://yourdomain.com"         # Production CORS
RATE_LIMIT_MAX="150"                         # Rate limiting
```

### Project Structure Highlights

```
app/
├── components/layout/         # AppSidebar, AppFooter
├── layouts/default.vue        # Main layout with sidebar
├── assets/css/main.css       # Consolidated CSS
└── pages/                    # File-based routing

prisma/
├── schema.prisma             # PostgreSQL CMS
├── mysql/                    # WordPress schemas
└── postgres-cms/             # Generated clients

docs/                         # This documentation
i18n/locales/                # 7 language translations
```

## 🔄 Migration from v0.9

### Package Manager Migration

```bash
# Remove old lock files
rm package-lock.json pnpm-lock.yaml

# Install Yarn and dependencies
npm install -g yarn
yarn install

# Update CI/CD scripts
# Replace 'npm' with 'yarn' in GitHub Actions
```

### Layout Updates

```bash
# Update existing pages that depend on old layout
# New default layout includes AppSidebar
# May need CSS adjustments for sidebar spacing
```

### Environment Variables

```bash
# Add new database URLs
MYSQL_DATABASE_URL="mysql://user:pass@localhost:3306/wordpress"
MONGODB_DATABASE_URL="mongodb://localhost:27017/analytics"
REDIS_URL="redis://localhost:6379"
```

## 🆘 Troubleshooting

### Common Issues

- **CSS bg-background errors**: Resolved in v1.0.0 with CSS variable system
- **Component auto-import failures**: Use explicit imports if needed
- **Prisma client generation**: Run `yarn prisma:generate` after schema changes
- **Port conflicts**: Use `--port` flag or update `nuxt.config.ts`

### Debug Tools

- **Nuxt DevTools**: Press `Shift + Alt + D` in browser
- **Prisma Studio**: Visual database browser at `localhost:5555`
- **Vue DevTools**: Browser extension for Vue debugging
- **Network Tab**: Monitor API calls and performance

## 📡 API Reference

- **[📡 API Documentation](./api.md)** - Complete OpenAPI specification and endpoint reference
- **[🔌 Webhook Integration](./webhook-patterns.md)** - External service integration patterns
- **[🔄 Data Synchronization](./sync-patterns.md)** - Multi-database synchronization strategies

---

**Created by Aleksandar Stajic** | **Powered by Nuxt 4 + TypeScript**
