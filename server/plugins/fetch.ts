// server/plugins/fetch.ts
// import { $fetch } from 'ofetch'

export default () => {
  // Force override of global fetch to avoid Undici Buffer bug
  /*if (typeof globalThis.fetch !== 'function' || process.env.FORCE_OFETCH === 'true') {
    console.warn('[Nitro] Overriding global fetch with ofetch')
    globalThis.fetch = $fetch as any
  }*/

}


