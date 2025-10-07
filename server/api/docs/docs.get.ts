import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async () => {
  try {
    // 🧩 динамички import — спречава Rollup циклично увлачење
    const { generateOpenApiSpec } = await import('../../lib/openapi.ts')
    const spec = await generateOpenApiSpec()
    return spec
  } catch (err) {
    console.error('[swagger] failed to generate spec:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate OpenAPI spec'
    })
  }
})
