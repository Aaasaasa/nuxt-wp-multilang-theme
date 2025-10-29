// server/services/portfolio.service.ts
import prismaCms from '../lib/prismaCms'

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
    const portfolios = await prismaCms.portfolio.findMany({
      include: {
        author: true,
        translations: {
          where: { lang: 'de' },
          take: 1
        },
        metas: {
          where: { key: 'featured_image' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return portfolios.map((portfolio) => {
      const translation = portfolio.translations[0] || {}

      return {
        id: portfolio.id.toString(),
        title: translation.title || 'Untitled',
        slug: portfolio.slug,
        content: translation.content || '',
        excerpt: translation.excerpt || null,
        featuredImage: portfolio.metas?.[0]?.value ?
          (typeof portfolio.metas[0].value === 'string' ? portfolio.metas[0].value :
           typeof portfolio.metas[0].value === 'object' ? JSON.stringify(portfolio.metas[0].value) :
           String(portfolio.metas[0].value)) : null,
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
  } catch (error) {
    throw new Error('Failed to fetch portfolios from database')
  }
}
