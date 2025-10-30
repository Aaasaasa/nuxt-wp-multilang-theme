// server/api/articles/index.get.ts
// GET /api/articles - Get all published articles

import { getAllPosts } from '../../services/post.service'

export default defineEventHandler(async () => {
  try {
    const articles = await getAllPosts()

    return {
      success: true,
      data: articles,
      total: articles.length,
      message: 'Articles retrieved successfully'
    }
  } catch (error) {
    console.error('Error fetching articles:', error)

    return {
      success: false,
      error: 'Failed to fetch articles',
      message: (error as Error).message,
      statusCode: 500
    }
  }
})
