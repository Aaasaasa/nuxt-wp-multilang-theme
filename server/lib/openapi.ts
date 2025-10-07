// server/lib/openapi.ts
import { OpenApiBuilder } from 'openapi3-ts/oas31'

export function generateOpenApiSpec() {
  const builder = new OpenApiBuilder()
    .addInfo({
      title: 'Nuxt API',
      version: '1.0.0',
      description: 'Auto-generated OpenAPI spec for Nitro server'
    })
    .addServer({
      url: process.env.API_BASE_URL || 'http://localhost:4000',
      description: 'Local development server'
    })
    .addPath('/api/health', {
      get: {
        summary: 'Health check endpoint',
        responses: {
          200: {
            description: 'Server is healthy'
          }
        }
      }
    })

  return builder.getSpec()
}
