// server/services/page.service.ts
import prismaCms from '../utils/prismaCms'
import { toPublicUser } from '~~/shared/models/user'
import {
  badRequestError,
  serverError,
  notFoundError,
  forbiddenError
} from '../utils/errors'
import { ERROR_CODES } from '../constants/errors'

// Types
interface PageWithAuthor {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  featuredImage: string | null
  status: string
  menuOrder: number
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
 * Page Service - Pure business logic without validation
 */

/**
 * Get all pages
 */
export async function getAllPages(): Promise<PageWithAuthor[]> {
  try {
    const pages = await prismaCms.page.findMany({
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
      orderBy: { menuOrder: 'asc' }
    })

    return pages.map((page) => {
      const translation = page.translations[0] || {}

      return {
        id: page.id.toString(),
        title: translation.title || 'Untitled',
        slug: page.slug,
        content: translation.content || '',
        excerpt: translation.excerpt || null,
        featuredImage: page.metas?.[0]?.value ?
          (typeof page.metas[0].value === 'string' ? page.metas[0].value :
           typeof page.metas[0].value === 'object' ? JSON.stringify(page.metas[0].value) :
           String(page.metas[0].value)) : null,
        status: page.status,
        menuOrder: page.menuOrder,
        publishedAt: page.status === 'PUBLISHED' ? page.createdAt : null,
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
        author: {
          id: page.author.id.toString(),
          username: page.author.login,
          email: page.author.email,
          firstName: null, // TODO: Extract from displayName
          lastName: null
        }
      }
    })
  } catch (error) {
    console.error('Database error in getAllPages:', error)
    throw new Error('Failed to fetch pages from database')
  }
}

/**
 * Get page by slug
 */
export async function getPageBySlug(slug: string): Promise<PageWithAuthor | null> {
  try {
    const page = await prismaCms.page.findFirst({
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

    if (!page) {
      return null
    }

    const translation = page.translations[0] || {}

    return {
      id: page.id.toString(),
      title: translation.title || 'Untitled',
      slug: page.slug,
      content: translation.content || '',
      excerpt: translation.excerpt || null,
      featuredImage: page.metas?.[0]?.value ?
        (typeof page.metas[0].value === 'string' ? page.metas[0].value :
         typeof page.metas[0].value === 'object' ? JSON.stringify(page.metas[0].value) :
         String(page.metas[0].value)) : null,
      status: page.status,
      menuOrder: page.menuOrder,
      publishedAt: page.status === 'PUBLISHED' ? page.createdAt : null,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
      author: {
        id: page.author.id.toString(),
        username: page.author.login,
        email: page.author.email,
        firstName: null, // TODO: Extract from displayName
        lastName: null
      }
    }
  } catch (error) {
    console.error('Database error in getPageBySlug:', error)
    return null
  }
}
