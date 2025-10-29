<template>
  <div class="min-h-screen flex">
    <!-- Sidebar -->
    <AppSidebar v-model="sidebarOpen" />

    <!-- Main Layout -->
    <div class="flex-1 flex flex-col">
      <UMain>
        <UHeader :to="localePath('/')">
          <template #title>
            <div class="flex items-center">
              <!-- Sidebar toggle button -->
              <UButton
                icon="i-lucide-menu"
                color="neutral"
                variant="ghost"
                size="sm"
                class="mr-3"
                @click="toggleSidebar"
              />
              <h1 class="text-2xl font-bold">
                <span class="text-primary">{{ appNameParts[0] }}</span>
                <span v-if="appNameParts[1]" class="text-secondary">{{ appNameParts[1] }}</span>
              </h1>
            </div>
          </template>

          <template #right>
            <!-- User menu when logged in -->
            <UDropdownMenu v-if="loggedIn" :items="items">
              <UAvatar
                :alt="user?.name"
                :src="'https://i.pravatar.cc/150?u=' + user?.email"
                size="sm"
                class="cursor-pointer"
              />
            </UDropdownMenu>

            <!-- Login button when not logged in -->
            <UButton
              v-else
              :to="localePath('/auth/login')"
              color="primary"
              variant="soft"
              size="sm"
              icon="i-lucide-log-in"
            >
              {{ t('auth.login.title') }}
            </UButton>

            <!-- Language Switcher -->
            <LanguageSwitcher />

            <UColorModeButton />
            <UButton
              color="neutral"
              variant="ghost"
              to="https://github.com/Aaasaasa/nuxt-wp-multilang-theme"
              target="_blank"
              icon="i-simple-icons-github"
              aria-label="GitHub"
            />
          </template>
        </UHeader>

        <slot />

        <!-- Modern Footer Component -->
        <AppFooter />
      </UMain>
    </div>

    <!-- Cookie Banner -->
    <CookieBanner />

    <!-- Simple Debug Cookie Banner (remove in production) -->
    <!-- <SimpleCookieBanner v-if="isDev" /> -->
  </div>
</template>

<script lang="ts" setup>
import type { DropdownMenuItem } from '@nuxt/ui'
// Explicit imports for layout components
import AppSidebar from '~/components/layout/AppSidebar.vue'
import AppFooter from '~/components/layout/AppFooter.vue'
import CookieBanner from '~/components/features/cookies/CookieBanner.vue'
import SimpleCookieBanner from '~/components/debug/SimpleCookieBanner.vue'
import LanguageSwitcher from '~/components/features/LanguageSwitcher.vue'

const { loggedIn, user, clear } = useUserSession()
const { t } = useI18n()
const localePath = useLocalePath()
const { success } = useNotifications()
const route = useRoute()

// Sidebar state management
const sidebarOpen = ref(false)

// Toggle sidebar function
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

// Close sidebar when route changes
watch(
  () => route.path,
  () => {
    sidebarOpen.value = false
  }
)

const handleLogout = async () => {
  try {
    clear()

    await $fetch('/api/auth/logout', { method: 'POST' })

    success({
      title: t('auth.logout.success.title'),
      message: t('auth.logout.success.message')
    })

    await navigateTo(localePath('/'))
  } catch {
    // Handle logout error silently for all cases
    clear()
    await navigateTo(localePath('/'))
  }
}

// Computed properties
const appNameParts = computed(() => {
  const name = t('app.name')
  return name.split(' ')
})

// Development mode check
const isDev = import.meta.dev

const items = ref<DropdownMenuItem[][]>([
  [
    {
      label: user.value?.name || user.value?.email,
      type: 'label',
      avatar: {
        src: `https://i.pravatar.cc/150?u=${user.value?.email}`
      }
    }
  ],
  [
    {
      label: t('auth.logout.title'),
      icon: 'i-lucide-log-out',
      onSelect: handleLogout
    }
  ]
])

// Head configuration
useHead({
  title: t('app.name'),
  meta: [
    { name: 'description', content: t('app.description') },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ]
})
</script>
