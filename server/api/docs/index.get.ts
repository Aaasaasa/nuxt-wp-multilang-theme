import { defineEventHandler, createError } from 'h3'
import { generateSwaggerSpec, isSwaggerEnabled } from '~/lib/swagger.ts'
import { serverError } from '~/utils/response.ts'

// Documentation endpoint - not included in Swagger
export default defineEventHandler(async () => {
  // Check if documentation is accessible
  if (!isSwaggerEnabled()) {
    throw createError({
      statusCode: 403,
      statusMessage: 'API documentation is not available in production'
    })
  }

  try {
    const swaggerSpec = generateSwaggerSpec()

    // Return OpenAPI spec directly for Swagger UI
    return swaggerSpec
  } catch {
    throw serverError('Failed to generate API documentation')
  }
})
