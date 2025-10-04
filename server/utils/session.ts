// server/utils/session.ts
import { H3Event, setCookie, getCookie, deleteCookie } from 'h3'

interface UserSession {
  user: any
  loggedInAt: Date
}

/**
 * Zapisuje korisničku sesiju u cookie.
 */
export async function setUserSession(event: H3Event, session: UserSession) {
  const payload = JSON.stringify(session)

  setCookie(event, 'session', payload, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 // 1 dan
  })
}

/**
 * Čita korisničku sesiju iz cookie-ja.
 */
export function getUserSession(event: H3Event): UserSession | null {
  const cookie = getCookie(event, 'session')
  if (!cookie) return null

  try {
    return JSON.parse(cookie) as UserSession
  } catch {
    return null
  }
}

/**
 * Briše korisničku sesiju (logout).
 */
export function clearUserSession(event: H3Event) {
  deleteCookie(event, 'session')
}
