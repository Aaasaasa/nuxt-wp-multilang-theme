import { validateBody } from "../../utils/validation.ts" // ✅ bez @@server

import { defineEventHandler } from "h3"
import { authenticateUser } from "../../services/user.service.ts"
import { setUserSession } from "../../utils/session.ts"
import { createApiResponse, createCreatedResponse, HTTP_STATUS, serverError } from "../../utils/response.ts"

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 */
const loginUserSchema: any = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string' }
  }
}

export default defineEventHandler(async event => {

  try {
    const { email, password } = await validateBody(event, loginUserSchema)

    const user = await authenticateUser(email, password)

    await setUserSession(event, {
      user,
      loggedInAt: new Date()
    })

    return createApiResponse(user, HTTP_STATUS.OK, 'Login successful')
  } catch (error: any) {
    if (error.statusCode) throw error
    throw serverError('Login failed')
  }
})
