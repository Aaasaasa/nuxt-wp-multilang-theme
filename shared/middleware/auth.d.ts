// shared/middleware/auth.ts
/*
import { defineNuxtRouteMiddleware, navigateTo, useNuxtApp } from 'nuxt/app';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { $auth } = useNuxtApp(); // Access nuxt-auth-utils
  const user = $auth?.user; // Get user from session

  // Check if user is authenticated
  if (!user && to.path.startsWith('/admin')) {
    return navigateTo('/login');
  }

  // Example: Database-driven role check (assumes API in server workspace)
  if (to.path.startsWith('/admin')) {
    try {
      const response = await $fetch('/api/auth/verify', {
        method: 'GET',
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const { role } = response; // Assume API returns user role
      if (!['admin', 'superadmin'].includes(role)) {
        return navigateTo('/forbidden', { replace: true });
      }
    } catch (error) {
      console.error('Auth verification failed:', error);
      return navigateTo('/login', { replace: true });
    }
  }
});
*/

export function sharedAuthGuard(to: any, from: any) {
  const user = useState('authUser', () => null)

  if (!user.value && to.path !== '/login') {
    return navigateTo('/login')
  }
  if (user.value && to.path === '/login') {
    return navigateTo('/')
  }
}



