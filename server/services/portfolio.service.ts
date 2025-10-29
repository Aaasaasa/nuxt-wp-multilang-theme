// server/services/portfolio.service.ts
import prismaCms from '../lib/prismaCms'
import { MediaResolver } from '../utils/mediaResolver'

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
    username: string
    email: string
    firstName: string | null
    lastName: string | null
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
    const mediaResolver = new MediaResolver(prismaCms)

    const portfolios = await prismaCms.portfolio.findMany({
      include: {
        author: true,
        translations: {
          where: { lang: 'de' }, // Default language
          take: 1
        },
        metas: {
          where: { key: 'featured_image' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Resolve featured images asynchronously
    const portfoliosWithMedia = await Promise.all(
      portfolios.map(async (portfolio) => {
        const translation = portfolio.translations[0] || {}
        const featuredImageMeta = portfolio.metas?.find((m) => m.key === 'featured_image')

        // Resolve featured image
        const resolvedMedia = await mediaResolver.resolveFeaturedImage(
          featuredImageMeta?.value as any
        )

        return {
          id: portfolio.id.toString(),
          title: translation.title || 'Untitled',
          slug: portfolio.slug,
          content: translation.content || '',
          excerpt: translation.excerpt || null,
          featuredImage: resolvedMedia?.url || null,
          status: portfolio.status,
          publishedAt: portfolio.status === 'PUBLISHED' ? portfolio.createdAt : null,
          createdAt: portfolio.createdAt,
          updatedAt: portfolio.updatedAt,
          author: {
            id: portfolio.author.id.toString(),
            username: portfolio.author.login,
            email: portfolio.author.email,
            firstName: null,
            lastName: null
          }
        }
      })
    )

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
    const mediaResolver = new MediaResolver(prismaCms)

    const portfolio = await prismaCms.portfolio.findFirst({
      where: { slug },
      include: {
        author: true,
        translations: {
          where: { lang: 'de' }, // Default language
          take: 1
        },
        metas: {
          where: { key: 'featured_image' }
        }
      }
    })

    if (!portfolio) {
      return null
    }

    const translation = portfolio.translations[0] || {}
    const featuredImageMeta = portfolio.metas?.find((m) => m.key === 'featured_image')

    // Resolve featured image
    const resolvedMedia = await mediaResolver.resolveFeaturedImage(featuredImageMeta?.value as any)

    return {
      id: portfolio.id.toString(),
      title: translation.title || 'Untitled',
      slug: portfolio.slug,
      content: translation.content || '',
      excerpt: translation.excerpt || null,
      featuredImage: resolvedMedia?.url || null,
      status: portfolio.status,
      publishedAt: portfolio.status === 'PUBLISHED' ? portfolio.createdAt : null,
      createdAt: portfolio.createdAt,
      updatedAt: portfolio.updatedAt,
      author: {
        id: portfolio.author.id.toString(),
        username: portfolio.author.login,
        email: portfolio.author.email,
        firstName: null,
        lastName: null
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Database error in getPortfolioBySlug:', error)
    return null
  }
}
