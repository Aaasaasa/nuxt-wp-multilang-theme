// server/lib/swagger.ts
import type { OpenAPIObject } from 'openapi3-ts/oas31'

export function isSwaggerEnabled(): boolean {
  return process.env.NODE_ENV !== 'production'
}

export function generateSwaggerSpec(): OpenAPIObject {
  return {
    openapi: '3.1.0',
    info: {
      title: 'Nuxt API',
      version: '1.0.0',
      description: 'Auto-generated OpenAPI 3.1 spec for your Nitro endpoints'
    },
    servers: [
      {
        url: process.env.API_BASE_URL || 'http://localhost:4000',
        description: 'Local server'
      }
    ],
    paths: {
      '/api/health': {
        get: {
          summary: 'Health check endpoint',
          responses: {
            200: {
              description: 'Server is healthy'
            }
          }
        }
      },
      '/api/docs': {
        get: {
          summary: 'Returns OpenAPI JSON spec',
          responses: {
            200: {
              description: 'OpenAPI specification'
            }
          }
        }
      }
    }
  }
}
