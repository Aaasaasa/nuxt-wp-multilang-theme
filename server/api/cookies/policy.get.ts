// server/api/cookies/policy.get.ts
import { cookieService } from '../../services/cookie.service'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const lang = (query.lang as string) || 'de'

    const policy = await cookieService.getActiveCookiePolicy(lang)

    if (!policy) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Keine aktive Cookie-Policy gefunden'
      })
    }

    return {
      success: true,
      data: policy
    }
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Fehler beim Laden der Cookie-Policy'
    })
  }
})
