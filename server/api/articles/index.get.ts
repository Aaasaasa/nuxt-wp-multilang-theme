// server/api/articles/index.get.ts
// GET /api/articles - Articles with proper media resolution

import { Client } from 'pg'
import { MediaResolver } from '../../utils/mediaResolver'

// Database connection will be created per request

export default defineEventHandler(async () => {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'nuxt_pg_cms_db',
    user: 'usrcms',
    password: 'Utorak30Sep'
  })

  try {
    await client.connect()

    const mediaResolver = new MediaResolver(client) // Get articles with featured images
    const result = await client.query(`
      SELECT
        a.id,
        a.slug,
        a.status,
        a."createdAt",
        a."updatedAt",
        at.title,
        at.content,
        at.excerpt,
        am.value as featured_image,
        u.login as author_name,
        u.email as author_email
      FROM cms_articles a
      LEFT JOIN cms_article_translations at ON at."articleId" = a.id AND at.lang = 'de'
      LEFT JOIN cms_article_meta am ON am."articleId" = a.id AND am.key = 'featured_image'
      LEFT JOIN cms_users u ON u.id = a."authorId"
      WHERE a.status = 'PUBLISHED'
      ORDER BY a."createdAt" DESC
      LIMIT 50
    `)

    // Resolve featured images with media resolver
    const articlesWithMedia = await Promise.all(
      result.rows.map(async (article) => {
        let featuredImageData = null

        if (article.featured_image) {
          try {
            // Parse JSON if it's a JSON object, otherwise use as string
            if (typeof article.featured_image === 'object') {
              featuredImageData = article.featured_image
            } else if (
              typeof article.featured_image === 'string' &&
              article.featured_image.startsWith('{')
            ) {
              featuredImageData = JSON.parse(article.featured_image)
            } else {
              featuredImageData = article.featured_image
            }
          } catch {
            featuredImageData = article.featured_image
          }
        }

        const featuredMedia = await mediaResolver.resolveFeaturedImage(featuredImageData)

        return {
          id: article.id,
          slug: article.slug,
          title: article.title || 'Untitled',
          excerpt: article.excerpt,
          content: article.content?.substring(0, 500) + '...', // Truncate for list
          status: article.status,
          createdAt: article.createdAt,
          updatedAt: article.updatedAt,
          author: {
            name: article.author_name,
            email: article.author_email
          },
          // Enhanced featured image data
          featuredImage: featuredMedia?.url || null,
          featuredImageAlt: featuredMedia?.alt || null,
          featuredImageSizes: featuredMedia?.sizes || null,
          featuredImageId: featuredMedia?.id || null
        }
      })
    )

    return {
      success: true,
      data: articlesWithMedia,
      total: articlesWithMedia.length,
      message: 'Articles retrieved successfully'
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch articles',
      message: (error as Error).message,
      statusCode: 500
    }
  } finally {
    try {
      await client.end()
    } catch {
      // Connection might already be closed
    }
  }
})
