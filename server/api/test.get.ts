import { defineEventHandler } from 'h3'
export default defineEventHandler(() => {
  return { ping: 'pong', time: Date.now() }
})
