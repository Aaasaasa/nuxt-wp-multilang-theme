export default defineEventHandler(() => {
  return { ping: 'pong', time: Date.now() }
})
