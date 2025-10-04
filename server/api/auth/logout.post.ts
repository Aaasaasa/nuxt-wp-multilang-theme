// server/api/auth/logout.post.ts
import { defineEventHandler } from "h3"
import { clearUserSession } from "../../utils/session.ts"
import { createApiResponse, HTTP_STATUS } from "../../utils/response.ts"

export default defineEventHandler(async (event) => {
  clearUserSession(event)

  return createApiResponse(
    { success: true },
    HTTP_STATUS.OK,
    "Logout successful"
  )
})
