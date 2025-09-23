export const useApi = () =>
  useNuxtApp().$api as ReturnType<typeof $fetch.create>;
