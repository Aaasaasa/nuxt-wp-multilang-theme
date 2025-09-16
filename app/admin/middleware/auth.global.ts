export default defineNuxtRouteMiddleware((to) => {
  const user = useState('authUser', () => null) // globalni state za usera

  // Ako nisi logovan i nisi na login strani → redirect
  if (!user.value && to.path !== '/login') {
    return navigateTo('/login')
  }

  // Ako si logovan i pokušaš na login → redirect na dashboard
  if (user.value && to.path === '/login') {
    return navigateTo('/')
  }
})

/*
const user = useState('authUser')
user.value = { id: 1, name: 'Admin' }
*/
