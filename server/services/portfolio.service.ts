// server/services/portfolio.service.ts
import prismaCms from '../utils/prismaCms'

// Types
interface PortfolioWithAuthor {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  featuredImage: string | null
  status: string
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
  author: {
    id: string
    login: string
    email: string
    displayName: string
  }
}

/**
 * Portfolio Service
 */

/**
 * Get all portfolios
 */
export async function getAllPortfolios(): Promise<PortfolioWithAuthor[]> {
  try {
    const portfolios = await prismaCms.portfolio.findMany({
      include: {
        author: true,
        translations: {
          where: { lang: 'de' }, // Default language
          take: 1
        },
        metas: {
          where: { key: 'featured_image' },
          include: {
            Media: {
              include: {
                sizes: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Map portfolios with featured images
    const portfoliosWithMedia = portfolios.map((portfolio) => {
      const translation = portfolio.translations[0] || {}
      const featuredImageMeta = portfolio.metas?.find((m) => m.key === 'featured_image')

      // Build featured image URL from Media relation (capital M)
      let featuredImage = null
      if (featuredImageMeta?.Media) {
        featuredImage = featuredImageMeta.Media.filePath
      }

      return {
        id: portfolio.id.toString(),
        title: translation.title || 'Untitled',
        slug: portfolio.slug,
        content: translation.content || '',
        excerpt: translation.excerpt || null,
        featuredImage,
        status: portfolio.status,
        publishedAt: portfolio.status === 'PUBLISHED' ? portfolio.createdAt : null,
        createdAt: portfolio.createdAt,
        updatedAt: portfolio.updatedAt,
        author: {
          id: portfolio.author.id.toString(),
          username: portfolio.author.displayName, // Show displayName instead of login
          email: portfolio.author.email,
          firstName: portfolio.author.firstName || null,
          lastName: portfolio.author.lastName || null
        }
      }
    })

    return portfoliosWithMedia
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Database error in getAllPortfolios:', error)
    throw new Error('Failed to fetch portfolios from database')
  }
}

/**
 * Get portfolio by slug
 */
export async function getPortfolioBySlug(slug: string): Promise<PortfolioWithAuthor | null> {
  try {
    const portfolio = await prismaCms.portfolio.findFirst({
      where: { slug },
      include: {
        author: true,
        translations: {
          where: { lang: 'de' }, // Default language
          take: 1
        },
        metas: {
          where: { key: 'featured_image' },
          include: {
            Media: {
              include: {
                sizes: true
              }
            }
          }
        }
      }
    })

    if (!portfolio) {
      return null
    }

    const translation = portfolio.translations[0] || {}
    const featuredImageMeta = portfolio.metas?.find((m) => m.key === 'featured_image')

    // Build featured image URL from Media relation (capital M)
    let featuredImage = null
    if (featuredImageMeta?.Media) {
      featuredImage = featuredImageMeta.Media.filePath
    }

    return {
      id: portfolio.id.toString(),
      title: translation.title || 'Untitled',
      slug: portfolio.slug,
      content: translation.content || '',
      excerpt: translation.excerpt || null,
      featuredImage,
      status: portfolio.status,
      publishedAt: portfolio.status === 'PUBLISHED' ? portfolio.createdAt : null,
      createdAt: portfolio.createdAt,
      updatedAt: portfolio.updatedAt,
      author: {
        id: portfolio.author.id.toString(),
        username: portfolio.author.displayName, // Show displayName instead of login
        email: portfolio.author.email,
        firstName: portfolio.author.firstName || null,
        lastName: portfolio.author.lastName || null
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Database error in getPortfolioBySlug:', error)
    return null
  }
}
