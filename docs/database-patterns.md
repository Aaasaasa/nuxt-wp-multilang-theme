# 🗃️ Multi-Database Architecture

Advanced multi-database system using Prisma ORM with PostgreSQL, MySQL, and MongoDB integration for comprehensive CMS and analytics capabilities.

## 🏗️ Multi-Database Architecture

```
prisma/
├── schema.prisma              # Main PostgreSQL CMS schema
├── mysql/                     # WordPress integration
│   ├── schema.prisma         # MySQL WordPress schema
│   └── migrations/           # WordPress-specific migrations
├── mongo/                     # Analytics & logging
│   ├── schema.prisma         # MongoDB schema
│   └── seed-data/            # MongoDB sample data
├── postgres-cms/              # CMS-specific schemas
│   ├── schema.prisma         # Extended CMS schema
│   ├── migrations/           # CMS migration history
│   └── seed-data/            # CMS sample data
├── generated/                 # Generated Prisma clients
│   ├── postgres-cms/         # PostgreSQL client
│   ├── mysql/                # MySQL client
│   └── mongo/                # MongoDB client
└── adapters/                  # Database adapters & utilities

lib/
├── prisma.ts                  # Multi-client configuration
├── prisma-cms.ts             # CMS client singleton
├── prisma-wp.ts              # WordPress client singleton
└── prisma-mongo.ts           # MongoDB client singleton

server/
├── utils/
│   ├── database.ts           # Database utility functions
│   └── sync.ts               # Cross-database synchronization
└── services/
    ├── cms.ts                # CMS service layer
    ├── wordpress.ts          # WordPress integration service
    └── analytics.ts          # Analytics service layer
```

### Database Responsibilities

#### PostgreSQL (Primary CMS)

- **Content Management**: Articles, pages, portfolios, categories, tags
- **User Management**: Authentication, profiles, permissions
- **Media Library**: File uploads, image metadata, WebP optimization
- **SEO Data**: Meta descriptions, structured data
- **Site Configuration**: Settings, themes, plugins
- **Term Relationships**: Content ↔ Categories/Tags connections
- **Multilingual**: Full translation support for all content types

#### MySQL (WordPress Integration)

- **WordPress Compatibility**: WP posts, users, options tables
- **Legacy Content**: Existing WordPress content migration
- **Plugin Data**: WordPress plugin-specific data
- **Theme Settings**: WordPress theme configurations

#### MongoDB (Analytics & Logging)

- **User Analytics**: Page views, user behavior tracking
- **Performance Metrics**: Server response times, database queries
- **Error Logging**: Application errors, stack traces
- **Content Analytics**: Popular articles, engagement metrics
- **Search Analytics**: Search queries, result interactions

## 🔧 Multi-Database Prisma Setup

### Client Configuration

**Multi-Client Singleton Pattern**

```typescript
// server/lib/prisma-utils.ts - Main configuration
import { PrismaClient as PostgresCMSClient } from '@/prisma/generated/postgres-cms'
import { PrismaClient as MySQLClient } from '@/prisma/generated/mysql'
import { PrismaClient as MongoClient } from '@/prisma/generated/mongo'

// Singleton instances for each database
let postgresClient: PostgresCMSClient
let mysqlClient: MySQLClient
let mongoClient: MongoClient

export const getPostgresClient = () => {
  if (!postgresClient) {
    postgresClient = new PostgresCMSClient({
      datasources: {
        db: { url: process.env.DATABASE_URL }
      }
    })
  }
  return postgresClient
}

export const getMySQLClient = () => {
  if (!mysqlClient) {
    mysqlClient = new MySQLClient({
      datasources: {
        db: { url: process.env.MYSQL_DATABASE_URL }
      }
    })
  }
  return mysqlClient
}

export const getMongoClient = () => {
  if (!mongoClient) {
    mongoClient = new MongoClient({
      datasources: {
        db: { url: process.env.MONGODB_DATABASE_URL }
      }
    })
  }
  return mongoClient
}
```

### Database Service Layer

**Abstracted Database Operations**

```typescript
// server/services/cms.ts - CMS service layer
import { getPostgresClient } from '~/server/lib/prisma-utils'

export class CMSService {
  private client = getPostgresClient()

  async getArticles(params: ArticleQuery) {
    return await this.client.article.findMany({
      where: {
        published: true,
        language: params.locale,
        category: params.category
      },
      include: {
        author: true,
        tags: true,
        category: true
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  async createArticle(data: CreateArticleData) {
    return await this.client.article.create({
      data: {
        ...data,
        slug: await this.generateSlug(data.title),
        publishedAt: new Date()
      }
    })
  }
}
```

### Cross-Database Synchronization

**WordPress Integration Service**

```typescript
// server/services/wordpress.ts - WordPress sync service
import { getPostgresClient, getMySQLClient } from '~/server/lib/prisma-utils'

export class WordPressService {
  private cmsClient = getPostgresClient()
  private wpClient = getMySQLClient()

  async syncPost(wpPostId: string) {
    // Get WordPress post
    const wpPost = await this.wpClient.wp_posts.findUnique({
      where: { ID: parseInt(wpPostId) }
    })

    if (!wpPost) return null

    // Create/update in CMS
    return await this.cmsClient.article.upsert({
      where: { wpPostId: wpPost.ID.toString() },
      create: {
        title: wpPost.post_title,
        content: wpPost.post_content,
        slug: wpPost.post_name,
        wpPostId: wpPost.ID.toString(),
        published: wpPost.post_status === 'publish'
      },
      update: {
        title: wpPost.post_title,
        content: wpPost.post_content,
        published: wpPost.post_status === 'publish'
      }
    })
  }
}
```

### Benefits of Multi-Database Architecture

- ✅ **Database Specialization**: Each database optimized for specific use cases
- ✅ **Scalability**: Separate scaling strategies for different data types
- ✅ **WordPress Compatibility**: Direct WordPress database integration
- ✅ **Analytics Isolation**: Separate analytics data from core CMS
- ✅ **Hot Reload Safe**: Singleton pattern prevents connection issues
- ✅ **Type Safety**: Full TypeScript support across all databases

## 📊 Schema Definition

### Current Model

**Implementation**: See `prisma/schema.prisma` for complete database schema definition.

### TypeScript Integration

**Implementation**: See `shared/models/` for TypeScript interfaces that mirror the Prisma schema.

## 🐳 Docker Setup

### Development Environment

**Setup**: Use `docker compose up -d` to start PostgreSQL. Database accessible at localhost:5432, Prisma Studio at localhost:5555.

### Environment Variables

**Configuration**: See `.env.example` for database environment variables configuration.

## 🔄 Migration Workflow

### Development Workflow

1. Modify schema in `prisma/schema.prisma`
2. Generate and apply migration: `npx prisma migrate dev --name describe_your_changes`
3. Generate Prisma client: `npm run db:generate`
4. Update TypeScript models in `shared/models/` if needed

### Production Deployment

1. Apply pending migrations: `npx prisma migrate deploy`
2. Generate client: `npx prisma generate`

## 🛠️ Multi-Database Commands

### Yarn-Based Database Operations

```bash
# Generate all Prisma clients (PostgreSQL, MySQL, MongoDB)
yarn prisma:generate

# Run migrations for all databases
yarn prisma:migrate

# Reset all databases (development only - ⚠️ data loss)
yarn prisma:reset

# Open Prisma Studio (multi-database support)
yarn prisma:studio

# Seed all databases with sample data
yarn db:seed
```

### Database-Specific Commands

```bash
# PostgreSQL CMS operations
yarn prisma generate --schema=prisma/schema.prisma
yarn prisma migrate dev --schema=prisma/schema.prisma --name cms_update

# MySQL WordPress operations
yarn prisma generate --schema=prisma/mysql/schema.prisma
yarn prisma db push --schema=prisma/mysql/schema.prisma

# MongoDB Analytics operations
yarn prisma generate --schema=prisma/mongo/schema.prisma
yarn prisma db push --schema=prisma/mongo/schema.prisma
```

### Schema Management

```bash
# Format all schema files
yarn prisma format --schema=prisma/schema.prisma
yarn prisma format --schema=prisma/mysql/schema.prisma
yarn prisma format --schema=prisma/mongo/schema.prisma

# Validate all schemas
yarn prisma validate --schema=prisma/schema.prisma
yarn prisma validate --schema=prisma/mysql/schema.prisma
yarn prisma validate --schema=prisma/mongo/schema.prisma

# Pull schemas from existing databases
yarn prisma db pull --schema=prisma/mysql/schema.prisma
```

### Development Workflow

```bash
# 1. Start multi-database environment
docker compose up -d

# 2. Generate all clients
yarn prisma:generate

# 3. Run migrations
yarn prisma:migrate

# 4. Seed with sample data
yarn db:seed

# 5. Open database management
yarn prisma:studio  # PostgreSQL CMS
# Navigate to http://localhost:8080 for Adminer (all databases)
```

### Production Deployment

```bash
# Deploy all database migrations
yarn prisma migrate deploy --schema=prisma/schema.prisma
yarn prisma migrate deploy --schema=prisma/mysql/schema.prisma

# Generate production clients
NODE_ENV=production yarn prisma:generate

# Verify database connections
yarn db:status
```

### Backup & Restore Operations

```bash
# Backup all databases
yarn db:backup

# Restore from backup
yarn db:restore --backup-file=backup-2025-10-29.sql

# Export data for migration
yarn db:export --database=postgres --format=json
yarn db:export --database=mysql --format=sql
```

## 🚀 API Integration

### Server Route Example

**Implementation**: See `server/api/posts/` for complete CRUD API examples with Prisma integration.

### Error Handling

**Implementation**: See API routes for Prisma error handling patterns with proper HTTP status codes.

## 🧪 Testing

### Test Database Isolation

**Implementation**: Tests use separate `TEST_DATABASE_URL` for isolation when implemented.

## � Current Migration Status

### WordPress to PostgreSQL Migration Results

✅ **Successfully Migrated:**

- **37 Articles** with full translations and featured images
- **12 Pages** with complete content hierarchy
- **10 Portfolios** (Avada Portfolio Projects with metadata)
- **191 Terms** (Categories, Tags, Portfolio Categories/Tags)
- **224 Term Relationships** (Content ↔ Categories/Tags connections)
- **1 User** with complete metadata
- **Featured Images** with WebP optimization (33% converted to WebP)

### Content Distribution by Type

```sql
-- Articles with Categories/Tags: 141 relationships
SELECT COUNT(*) FROM "TermRelationship" WHERE "articleId" IS NOT NULL;

-- Portfolio projects with Categories/Tags: 83 relationships
SELECT COUNT(*) FROM "TermRelationship" WHERE "portfolioId" IS NOT NULL;

-- Pages (typically no categories): 0 relationships
SELECT COUNT(*) FROM "TermRelationship" WHERE "pageId" IS NOT NULL;
```

### Term System Analytics

| Taxonomy Type        | Count | Used in Content |
| -------------------- | ----- | --------------- |
| `category`           | ~50   | Articles        |
| `post_tag`           | ~100  | Articles        |
| `portfolio_category` | ~20   | Portfolio       |
| `portfolio_tags`     | ~20   | Portfolio       |

### API Endpoints Status

| Endpoint          | Status     | Features                                       |
| ----------------- | ---------- | ---------------------------------------------- |
| `/api/articles`   | ✅ Active  | Categories/Tags, Featured Images, Translations |
| `/api/pages`      | ✅ Active  | Hierarchy, Menu Order, Featured Images         |
| `/api/portfolios` | ✅ Active  | Portfolio Categories/Tags, Featured Images     |
| `/api/products`   | 🔄 Planned | E-commerce integration                         |

## �🔍 Best Practices

1. **Migration Names** - Use descriptive names for migrations
2. **Schema Changes** - Always use migrations, avoid `db push` in production
3. **Client Import** - Use absolute path `~/server/lib/prisma-utils` for consistency
4. **Error Handling** - Handle Prisma-specific errors appropriately
5. **Type Safety** - Keep TypeScript models in sync with Prisma schema
6. **Connection Management** - Use singleton pattern to avoid connection issues
7. **Term Relationships** - Always migrate term relationships after content migration
8. **WebP Optimization** - Implement progressive image format conversion

## 📚 Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
