# NuxtWP Multilang Theme - Production Ready

A modern **Nuxt 4** multilingual WordPress-inspired theme with advanced features, modern UI components, and multi-database support. Created by **Aleksandar Stajic**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Nuxt](https://img.shields.io/badge/nuxt-4.1.3-00DC82.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.6-blue.svg)

## 🚀 Features

### Core Framework

- **🔧 Nuxt 4.1.3** with Vue 3 Composition API and TypeScript ES Modules
- **🎨 Nuxt UI** components with Tailwind CSS and custom CSS variables
- **� Modern Layout System** with responsive sidebar navigation and mobile-first design
- **🖥️ AppSidebar & AppFooter** - Professional layout components with CMS integration

### Database & Backend

- **🗄️ Multi-Database Prisma Setup** - PostgreSQL (CMS), MySQL (WordPress), MongoDB
- **⚡ Prisma Client Generation** - Automated multi-schema client generation
- **🔄 Database Migrations** - Structured migration system with multi-environment support
- **📊 Prisma Studio Integration** - Visual database management interface
- **🔗 WordPress Migration** - Complete WordPress-to-PostgreSQL migration with term relationships
- **🎯 Content APIs** - RESTful APIs for Articles, Pages, Portfolios with full CMS features

### Internationalization & Content

- **🌍 Advanced i18n** - 7 languages (EN, DE, SR, ES, FR, IT, RU) with smart detection
- **📚 WordPress-like CMS** - Article/Page/Portfolio management with Prisma backend
- **🍽️ Dynamic Menu System** - WordPress menu integration with hierarchical navigation and API
- **📚 Blog System** - Complete blog functionality with categories and tags integration
- **🎨 Portfolio System** - Professional portfolio projects with custom taxonomies
- **🔗 Term Relationships** - Advanced category/tag system with 224+ content connections
- **📸 Media Management** - WebP optimization and featured images support
- **🎯 SEO Optimization** - Built-in SEO patterns and meta management

### Security & Quality

- **🛡️ Production Security** - CORS, CSP, HSTS, rate limiting, and security headers
- **🔐 Authentication System** - Full auth with user sessions and admin areas
- **🧪 Comprehensive Testing** - Vitest (unit) and Playwright (E2E) with coverage
- **✨ Code Quality** - ESLint, Prettier, Commitlint, and Husky hooks

### Development & Deployment

- **📦 Yarn Package Management** - Consistent dependency management across environments
- **🐳 Docker Support** - Multi-service containerization with development databases
- **🔧 GitHub Actions** - Automated CI/CD with linting, testing, and deployment
- **📱 Responsive Design** - Mobile-first approach with modern CSS Grid and Flexbox

## ⚡ Quick Start

### Prerequisites

- Node.js ≥ 22.0.0
- Yarn ≥ 1.22.0 (Package Manager)
- Docker (for multi-database setup)

### Setup

1. **Clone and install**

   ```bash
   git clone https://github.com/Aaasaasa/nuxt-wp-multilang-theme.git
   cd nuxt-wp-multilang-theme
   ./rename-project.sh my-awesome-project  # Optional: Rename project
   yarn install
   cp .env.example .env
   ```

2. **Start multi-database environment**

   ```bash
   docker compose up -d              # Start PostgreSQL, MySQL, MongoDB, Redis
   yarn prisma:generate              # Generate all Prisma clients
   yarn prisma:migrate              # Run database migrations
   ```

3. **Configure environment variables**

   ```bash
   # Copy and configure your environment
   cp .env.example .env

   # Essential variables:
   DATABASE_URL="postgresql://..."              # PostgreSQL for CMS
   MYSQL_DATABASE_URL="mysql://..."             # MySQL for WordPress integration
   MONGODB_DATABASE_URL="mongodb://..."         # MongoDB for analytics
   NUXT_SECRET_KEY="your-secret-key"            # Authentication secret
   ```

4. **Run development server**

   ```bash
   yarn dev --port 4000              # Start on port 4000
   # or
   yarn dev                          # Start on default port 3000
   ```

### 🌐 Access Points

- **Main Application**: http://localhost:4000 (or 3000)
- **Admin Dashboard**: http://localhost:4000/admin
- **Prisma Studio**: http://localhost:5555 (Database Admin)
- **API Documentation**: http://localhost:4000/api/docs (Development)
- **Database Adminer**: http://localhost:8080 (Multi-DB Admin)

### 🎯 Key Features Demo

- **Sidebar Navigation**: Click the hamburger menu to explore responsive sidebar
- **Multi-language**: Switch languages using the locale selector in header
- **Blog System**: Navigate to `/blog` to see WordPress-like article management
- **Admin Area**: Access `/admin` for CMS functionality (requires authentication)
- **Modern Footer**: Scroll down to see the new footer with author attribution

## 🛠️ Development Commands

### Development

```bash
yarn dev                      # Start development server
yarn build                    # Build for production
yarn preview                  # Preview production build
yarn lint                     # Run ESLint + Prettier
yarn lint:ci                  # CI-optimized linting
yarn typecheck                # TypeScript type checking
```

### Testing

```bash
yarn test                     # Run all tests (unit + E2E)
yarn test:unit                # Run unit tests only
yarn test:e2e                 # Run E2E tests only
yarn test:unit:coverage       # Run tests with coverage
```

### Database Management

```bash
yarn prisma:generate          # Generate all Prisma clients
yarn prisma:migrate           # Run database migrations
yarn prisma:studio            # Open Prisma Studio
yarn prisma:reset             # Reset databases (development only)
yarn prisma:deploy            # Deploy migrations (production)
yarn db:seed                  # Seed databases with sample data
```

### Code Quality & CI/CD

```bash
yarn lint:fix                 # Auto-fix linting issues
yarn format                   # Format code with Prettier
yarn commitlint               # Validate commit messages
yarn prepare                  # Setup Husky hooks
yarn clean                    # Clean build artifacts
```

## 📁 Project Structure

```
├── app/                      # Main Nuxt 4 Application
│   ├── components/           # Vue Components (Auto-imported)
│   │   ├── features/         # Feature-specific components
│   │   ├── layout/           # Layout components (AppSidebar, AppFooter)
│   │   └── ui/               # Reusable UI components
│   ├── composables/          # Vue Composables (Auto-imported)
│   │   ├── features/         # Feature-specific composables
│   │   ├── forms/            # Form handling composables
│   │   └── stores/           # Pinia store composables
│   ├── layouts/              # Layout Templates
│   │   └── default.vue       # Main layout with sidebar & modern footer
│   ├── pages/                # File-based Routing
│   │   ├── blog/             # Blog system pages
│   │   ├── admin/            # Admin dashboard pages
│   │   └── auth/             # Authentication pages
│   ├── assets/css/           # Styling
│   │   └── main.css          # Main CSS with consolidated styles
│   ├── middleware/           # Route Middleware
│   └── plugins/              # Nuxt Plugins
│
├── app/admin/                # Separate Admin Application
│   ├── components/           # Admin-specific components
│   ├── pages/                # Admin dashboard pages
│   ├── layouts/              # Admin layout templates
│   └── nuxt.config.ts        # Admin-specific configuration
│
├── shared/                   # Shared Code (Auto-imported)
│   ├── models/               # TypeScript Models & Interfaces
│   ├── types/                # Shared Type Definitions
│   ├── schemas/              # Validation Schemas (Zod)
│   ├── constants/            # Application Constants
│   └── utils/                # Utility Functions
│
├── server/                   # Server-side Code (Nitro)
│   ├── api/                  # API Routes (Auto-mapped)
│   │   ├── auth/             # Authentication endpoints
│   │   ├── blog/             # Blog API endpoints
│   │   └── admin/            # Admin API endpoints
│   ├── middleware/           # Server Middleware
│   ├── services/             # Business Logic Services
│   ├── utils/                # Server Utilities
│   └── types/                # Server-specific Types
│
├── lib/                      # Core Libraries
│   └── prisma.ts             # Prisma Client Configuration
│
├── prisma/                   # Multi-Database Configuration
│   ├── schema.prisma         # Main PostgreSQL Schema
│   ├── mysql/                # MySQL schemas for WordPress
│   ├── mongo/                # MongoDB schemas for analytics
│   ├── postgres-cms/         # PostgreSQL CMS schemas
│   ├── migrations/           # Database Migration History
│   ├── seed-data/            # Sample Data for Development
│   └── generated/            # Generated Prisma Clients
│
├── i18n/                     # Internationalization
│   ├── localeDetector.ts     # Smart Language Detection
│   └── locales/              # Translation Files (7 languages)
│       ├── en/               # English translations
│       ├── de/               # German translations
│       ├── sr/               # Serbian translations
│       └── ...               # + ES, FR, IT, RU
│
├── tests/                    # Testing Suite
│   ├── unit/                 # Vitest Unit Tests
│   ├── e2e/                  # Playwright E2E Tests
│   └── setup/                # Test Configuration
│
├── docs/                     # Comprehensive Documentation
│   ├── api.md                # API Documentation
│   ├── component-architecture.md # Component Patterns
│   ├── database-patterns.md  # Database Design Patterns
│   ├── wordpress-migration.md # WordPress Migration Guide
│   ├── internationalization.md # i18n Implementation Guide
│   └── ...                   # + Security, SEO, Testing patterns
│
├── scripts/                  # Development Scripts
├── .github/workflows/        # GitHub Actions CI/CD
└── docker-compose.yml        # Multi-service Docker Setup
```

## 🔧 Tech Stack

### Frontend & UI

- **Framework**: Nuxt 4.1.3 with Vue 3 Composition API
- **Language**: TypeScript with ES Modules
- **Styling**: Tailwind CSS 3.4+ with CSS Variables
- **Components**: Nuxt UI with custom AppSidebar & AppFooter
- **Icons**: Lucide Icons with auto-import support

### Backend & API

- **Server**: Nitro with H3 handlers
- **API**: RESTful endpoints with OpenAPI/Swagger documentation
- **Authentication**: nuxt-auth-utils with session management
- **Email**: Nodemailer integration for transactional emails
- **File Storage**: Built-in asset management

### Database Layer

- **Primary**: PostgreSQL with Prisma ORM v6
- **CMS Database**: PostgreSQL for content management
- **WordPress**: MySQL integration for WP compatibility
- **Analytics**: MongoDB for logging and analytics
- **Caching**: Redis for session and cache management
- **Admin**: Prisma Studio + Adminer for database management

### Internationalization

- **Framework**: @nuxtjs/i18n with advanced features
- **Languages**: 7 locales (EN, DE, SR, ES, FR, IT, RU)
- **Detection**: Smart browser/cookie-based locale detection
- **Routing**: Prefix-based routing with SEO optimization

### Security & Performance

- **Security**: nuxt-security (CORS, CSP, HSTS, rate limiting)
- **Authentication**: Session-based auth with CSRF protection
- **Headers**: Security headers with production-ready CSP
- **Rate Limiting**: Configurable request throttling

### Testing & Quality

- **Unit Testing**: Vitest with coverage reporting
- **E2E Testing**: Playwright (multi-browser support)
- **Linting**: ESLint with TypeScript support
- **Formatting**: Prettier with automated fixes
- **Git Hooks**: Husky with conventional commits
- **Type Checking**: TypeScript strict mode

### Development & Deployment

- **Package Manager**: Yarn for consistent dependency management
- **Containerization**: Docker with multi-service compose
- **CI/CD**: GitHub Actions with automated testing
- **Monitoring**: Built-in error tracking and logging
- **SEO**: @nuxtjs/seo with structured data support

## 🎛️ Configuration & Customization

### Environment Configuration

#### Development Environment

- **Database**: Docker containers for all database services
- **Security**: Relaxed CORS and CSP for development ease
- **Hot Reload**: Full TypeScript and component hot reloading
- **Debugging**: Integrated Prisma Studio and API documentation

#### Production Environment

- **Security**: Strict CSP, CORS, and security headers
- **Performance**: Optimized builds with code splitting
- **Monitoring**: Error tracking and performance monitoring
- **Caching**: Redis-based caching and session management

### Project Customization

#### Rename Project

```bash
# Use the built-in rename script
./rename-project.sh my-awesome-project

# This updates:
# - package.json name and description
# - Docker service names
# - Environment variable prefixes
# - Documentation references
```

#### Customize Layout Components

```bash
# AppSidebar customization
app/components/layout/AppSidebar.vue

# AppFooter customization
app/components/layout/AppFooter.vue

# Main layout
app/layouts/default.vue
```

#### Database Schema Customization

```bash
# Main CMS schema
prisma/schema.prisma

# WordPress integration schema
prisma/mysql/schema.prisma

# Analytics schema
prisma/mongo/schema.prisma

# After changes, regenerate clients:
yarn prisma:generate
yarn prisma:migrate
```

### Security Configuration

#### Production Security Features

- **CORS**: Environment-specific origin configuration
- **CSP**: Content Security Policy with Nuxt 4 optimization
- **Headers**: Complete security header suite (HSTS, X-Frame-Options, etc.)
- **Rate Limiting**: 150 requests per 5-minute window (configurable)
- **Authentication**: Secure session management with CSRF protection

#### Security Environment Variables

```bash
# Required for production
CORS_ORIGIN="https://yourdomain.com"
NUXT_SECRET_KEY="your-256-bit-secret-key"
RATE_LIMIT_MAX="150"
RATE_LIMIT_WINDOW="300000"

# Optional security enhancements
CSP_REPORT_URI="https://yourdomain.com/csp-report"
SECURITY_HEADERS_ENABLED="true"
```

### Advanced Customization

#### Multi-Database Setup

```bash
# Configure multiple databases
DATABASE_URL="postgresql://..."       # Main CMS
MYSQL_DATABASE_URL="mysql://..."      # WordPress integration
MONGODB_DATABASE_URL="mongodb://..."  # Analytics
REDIS_URL="redis://..."               # Caching & sessions
```

#### Internationalization Customization

```bash
# Add new languages in nuxt.config.ts
i18n: {
  locales: [
    // Add your custom locale
    {
      code: 'pt',
      name: 'Português',
      files: ['pt/common.json', 'pt/seo.json'],
      language: 'pt-BR'
    }
  ]
}

# Create translation files
i18n/locales/pt/common.json
i18n/locales/pt/seo.json
i18n/locales/pt/email.json
```

## 📚 Resources & Documentation

### Framework Documentation

- **[Nuxt 4 Documentation](https://nuxt.com/)** - Latest Nuxt framework features
- **[Vue 3 Composition API](https://vuejs.org/guide/introduction.html)** - Vue framework guide
- **[Nuxt UI Components](https://ui.nuxt.com/)** - Complete UI component library
- **[Tailwind CSS](https://tailwindcss.com/docs)** - Utility-first CSS framework

### Database & Backend

- **[Prisma Documentation](https://www.prisma.io/docs)** - Database ORM and migrations
- **[Nitro Documentation](https://nitro.unjs.io/)** - Universal server framework
- **[H3 Documentation](https://github.com/unjs/h3)** - HTTP framework for Nitro

### Internationalization

- **[@nuxtjs/i18n](https://i18n.nuxtjs.org/)** - Nuxt i18n module documentation
- **[Vue I18n](https://vue-i18n.intlify.dev/)** - Vue internationalization

### Testing & Quality

- **[Vitest Documentation](https://vitest.dev/)** - Unit testing framework
- **[Playwright Documentation](https://playwright.dev/)** - E2E testing framework
- **[ESLint Rules](https://eslint.org/docs/rules/)** - Linting configuration

### Project-Specific Documentation

- **[docs/](./docs/)** - Comprehensive project documentation
- **[WordPress Migration](./docs/wordpress-migration.md)** - Complete migration guide with 224 term relationships
- **[API Documentation](./docs/api.md)** - API endpoints for Articles/Pages/Portfolios with examples
- **[Component Architecture](./docs/component-architecture.md)** - Component design patterns
- **[Database Patterns](./docs/database-patterns.md)** - Multi-database design with current migration status
- **[Security Patterns](./docs/security-patterns.md)** - Security implementation guide

## 📊 Current Project Status

### WordPress Migration Results

✅ **Successfully Migrated:**

- **37 Articles** with full translations and featured images
- **12 Pages** with complete content hierarchy
- **10 Portfolio Projects** (Avada Portfolio integration)
- **191 Terms** (Categories, Tags, Portfolio Categories/Tags)
- **224 Term Relationships** connecting content with categories/tags
- **Featured Images** with WebP optimization (33% converted)

### Available Content APIs

| Endpoint          | Status     | Features                                                       |
| ----------------- | ---------- | -------------------------------------------------------------- |
| `/api/articles`   | ✅ Live    | Categories/Tags (141 relations), Featured Images, Translations |
| `/api/pages`      | ✅ Live    | Hierarchy, Menu Order, Featured Images (12 pages)              |
| `/api/portfolios` | ✅ Live    | Portfolio Categories/Tags (83 relations), Featured Images      |
| `/api/products`   | 🔄 Planned | E-commerce integration (schema ready)                          |

### Content Distribution

```bash
# Articles with categories/tags: 141 relationships
# Portfolio projects with categories/tags: 83 relationships
# Pages (typically no categories): 0 relationships
# Total term relationships: 224
```

## 🤝 Contributing

### Development Workflow

1. **Fork & Clone**: Fork the repository and clone your fork
2. **Branch**: Create a feature branch (`git checkout -b feature/amazing-feature`)
3. **Install**: Run `yarn install` to install dependencies
4. **Develop**: Make your changes following the coding standards
5. **Test**: Run `yarn test` to ensure all tests pass
6. **Lint**: Run `yarn lint` to check code quality
7. **Commit**: Use conventional commit format (enforced by Husky)
8. **Push**: Push to your fork and create a Pull Request

### Code Standards

- **TypeScript**: Use strict TypeScript with proper typing
- **Vue 3**: Prefer Composition API with `<script setup>` syntax
- **Components**: Follow the established component architecture
- **Styling**: Use Tailwind CSS classes, avoid custom CSS when possible
- **Testing**: Write unit tests for utilities, E2E tests for user flows

### Commit Message Format

```bash
# Format: type(scope): description
feat(auth): add OAuth2 Google integration
fix(sidebar): resolve mobile overlay z-index issue
docs(readme): update installation instructions
chore(deps): upgrade Nuxt to 4.1.3
```

### Pull Request Process

1. Ensure your PR description clearly describes the problem and solution
2. Include relevant issue numbers if applicable
3. Update documentation if you change APIs or add features
4. Make sure all CI checks pass (linting, testing, type checking)
5. Request review from project maintainers

### Getting Help

- **Issues**: Use GitHub Issues for bug reports and feature requests
- **Discussions**: Use GitHub Discussions for questions and community chat
- **Email**: Contact Aleksandar Stajic for direct project inquiries

## Commit Roules Husky

This project uses [Husky](https://typicode.github.io/husky/#/) to enforce commit message conventions. The commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.
To ensure your commit messages are valid, you can use the following format:

```<type>(<scope>): <subject>
[optional body]
[optional footer]
```

Where:

- `<type>`: The type of change (e.g., feat, fix, docs, chore, style, refactor, ci, test, revert, perf, vercel)
- `<scope>`: The scope of the change (optional)
- `<subject>`: A brief description of the change
- `[optional body]`: A more detailed description of the change (optional)
- `[optional footer]`: Any additional information, such as breaking changes or issues closed (optional)  
  You can also use the following commit types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `chore`: Maintenance tasks (e.g., build, CI, dependencies)
- `style`: Changes that do not affect the meaning of the code (e.g., formatting, missing semicolons)
- `refactor`: Code changes that neither fix a bug nor add a feature
- `ci`: Changes to CI configuration files and scripts
- `test`: Adding missing tests or correcting existing tests
- `revert`: Reverts a previous commit
- `perf`: A code change that improves performance
- `vercel`: Changes related to Vercel deployment

Overwriting the commit message rules is not allowed. If you try to commit a message that does not follow the rules, you will see an error message and your commit will be rejected.

# Commitlint Configuration

export default {
extends: ['@commitlint/config-conventional'],
rules: {
'type-enum': [
2,
'always',
[
'feat',
'fix',
'docs',
'chore',
'style',
'refactor',
'ci',
'test',
'revert',
'perf',
'vercel',
],
],
},
};

## 👤 Author

**Aleksandar Stajic**

- GitHub: [@Aaasaasa](https://github.com/Aaasaasa)
- Portfolio: Coming Soon
- Email: Contact via GitHub

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Nuxt Team** - For the amazing Nuxt 4 framework
- **Vue.js Team** - For Vue 3 and the Composition API
- **Prisma Team** - For the excellent ORM and database tools
- **Tailwind CSS** - For the utility-first CSS framework
- **Community Contributors** - Thank you for your contributions and feedback

## 📈 Project Status

- ✅ **Core Framework**: Nuxt 4.1.3 with TypeScript
- ✅ **Layout System**: Modern sidebar and footer components
- ✅ **Multi-Database**: PostgreSQL, MySQL, MongoDB integration
- ✅ **Internationalization**: 7 languages with smart detection
- ✅ **Authentication**: Complete auth system with admin areas
- ✅ **Testing**: Unit and E2E testing with coverage
- ✅ **CI/CD**: GitHub Actions with automated workflows
- 🔄 **Documentation**: Continuously improving
- 🔄 **Blog System**: WordPress-like CMS functionality
- 📋 **Admin Dashboard**: Full-featured admin interface

---

**Built with ❤️ by Aleksandar Stajic using Nuxt 4**

_NuxtWP Multilang Theme - A modern, multilingual, WordPress-inspired theme for Nuxt 4_
