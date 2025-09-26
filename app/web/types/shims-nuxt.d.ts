declare module '#imports' {
  export * from 'nuxt/app'
  // export * from 'nuxt/schema'
  const _defaultImportsWeb: Record<string, any>
  export default _defaultImportsWeb
}

declare module '#app' {
  export * from 'nuxt/app'
  const _defaultAppWeb: Record<string, any>
  export default _defaultAppWeb
}
