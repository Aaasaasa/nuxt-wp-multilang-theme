// types/nuxt-globals.d.ts
declare global {
  const defineEventHandler: typeof import('h3').defineEventHandler
  const getQuery: typeof import('h3').getQuery
  const readBody: typeof import('h3').readBody
}
export {}
