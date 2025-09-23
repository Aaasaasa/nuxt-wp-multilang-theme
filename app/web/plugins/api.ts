export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const api = $fetch.create({
    baseURL: process.env.PUBLIC_API_BASE || "http://localhost:3001",
  });
  return { provide: { api } };
});
