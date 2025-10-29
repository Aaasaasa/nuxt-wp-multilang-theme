<script setup lang="ts">
const { loggedIn } = useUserSession()
const localePath = useLocalePath()
const { t } = useI18n()

// Load WordPress menu from API using our composable
const { getMenuAsSidebarItems } = useMenu()

// Load menu data
const wordpressMenuItems = ref<SidebarItem[]>([])
const menuLoading = ref(true)

// Fetch menu on component mount
onMounted(async () => {
  try {
    const items = await getMenuAsSidebarItems('main-menu')
    wordpressMenuItems.value = items
  } catch {
    // Silent fallback to default items
  } finally {
    menuLoading.value = false
  }
})

// Fallback sidebar items if menu loading fails
const fallbackItems = computed<SidebarItem[]>(() => [
  {
    label: t('navigation.home', 'Home'),
    href: localePath('/'),
    icon: 'i-lucide-home'
  },
  {
    label: t('navigation.blog', 'Blog'),
    href: localePath('/blog'),
    icon: 'i-lucide-book-open'
  },
  {
    label: t('navigation.portfolio', 'Portfolio'),
    href: localePath('/portfolio'),
    icon: 'i-lucide-briefcase'
  },
  {
    label: t('navigation.products', 'Products'),
    href: localePath('/products'),
    icon: 'i-lucide-shopping-cart'
  },
  {
    label: t('navigation.about', 'About'),
    href: localePath('/about'),
    icon: 'i-lucide-user'
  },
  {
    label: t('navigation.contact', 'Contact'),
    href: localePath('/contact'),
    icon: 'i-lucide-mail'
  }
])

// Use WordPress menu if available, otherwise fallback
const sidebarItems = computed<SidebarItem[]>(() => {
  return wordpressMenuItems.value.length > 0 ? wordpressMenuItems.value : fallbackItems.value
})

// Admin items for logged in users
const adminItems = computed<SidebarItem[]>(() =>
  loggedIn.value ? [
    {
      label: t('navigation.admin', 'Admin'),
      href: '/admin',
      icon: 'i-lucide-settings',
      children: [
        {
          label: t('navigation.dashboard', 'Dashboard'),
          href: '/admin/dashboard',
          icon: 'i-lucide-layout-dashboard'
        },
        {
          label: t('navigation.posts', 'Posts'),
          href: '/admin/posts',
          icon: 'i-lucide-file-text'
        },
        {
          label: t('navigation.users', 'Users'),
          href: '/admin/users',
          icon: 'i-lucide-users'
        }
      ]
    }
  ] : []
)

// Props for controlling sidebar
interface Props {
  modelValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const sidebarOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Close sidebar when clicking outside on mobile
const sidebarRef = ref<HTMLElement>()

// Use mounted to avoid SSR issues with window
onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (sidebarRef.value && !sidebarRef.value.contains(event.target as Node)) {
      if (window.innerWidth < 1024 && sidebarOpen.value) {
        sidebarOpen.value = false
      }
    }
  }

  document.addEventListener('click', handleClickOutside)

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>

<template>
  <div>
    <!-- Overlay for mobile -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/50 lg:hidden z-40"
      @click="sidebarOpen = false"
    />

    <!-- Sidebar -->
    <aside
      ref="sidebarRef"
      :class="[
        'fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 transform transition-transform duration-300 ease-in-out',
        'lg:translate-x-0 lg:static lg:inset-0 lg:z-auto',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
      style="width: 280px"
    >
      <!-- Header -->
      <div class="p-6 border-b border-gray-200 dark:border-gray-800">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ t('navigation.menu', 'Menu') }}
          </h2>
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            size="sm"
            class="lg:hidden"
            @click="sidebarOpen = false"
          />
        </div>
      </div>

      <!-- Navigation -->
      <nav class="p-4 space-y-2">
        <!-- Loading State -->
        <div v-if="menuLoading" class="space-y-1">
          <div class="animate-pulse space-y-2">
            <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>

        <!-- Main Navigation -->
        <div v-else class="space-y-1">
          <template v-for="item in sidebarItems" :key="item.href">
            <div>
              <!-- Main Menu Item -->
              <UButton
                :to="item.href"
                :icon="item.icon"
                color="neutral"
                variant="ghost"
                size="sm"
                class="w-full justify-start"
                @click="sidebarOpen = false"
              >
                {{ item.label }}
                <span v-if="item.badge" class="ml-auto text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                  {{ item.badge }}
                </span>
                <!-- Show dropdown indicator for items with children -->
                <UIcon
                  v-if="item.children && item.children.length > 0"
                  name="i-lucide-chevron-down"
                  class="ml-auto w-4 h-4"
                />
              </UButton>

              <!-- Sub-menu items -->
              <div v-if="item.children && item.children.length > 0" class="ml-6 mt-1 space-y-1">
                <UButton
                  v-for="child in item.children"
                  :key="child.href"
                  :to="child.href"
                  :icon="child.icon"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  class="w-full justify-start text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  @click="sidebarOpen = false"
                >
                  {{ child.label }}
                </UButton>
              </div>
            </div>
          </template>
        </div>

        <!-- WordPress Menu Status -->
        <div v-if="!menuLoading" class="pt-2 border-t border-gray-200 dark:border-gray-800">
          <p class="text-xs text-gray-400 dark:text-gray-500 px-3">
            <UIcon
              :name="wordpressMenuItems.length > 0 ? 'i-lucide-check-circle' : 'i-lucide-alert-circle'"
              :class="wordpressMenuItems.length > 0 ? 'text-green-500' : 'text-amber-500'"
              class="inline w-3 h-3 mr-1"
            />
            {{ wordpressMenuItems.length > 0 ? 'WordPress Menu' : 'Fallback Menu' }}
          </p>
        </div>

        <!-- Admin Section -->
        <div v-if="adminItems.length > 0" class="pt-4 border-t border-gray-200 dark:border-gray-800">
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-3">
            {{ t('navigation.admin', 'Admin') }}
          </p>
          <template v-for="item in adminItems" :key="item.href">
            <!-- Admin parent item -->
            <UButton
              :to="item.href"
              :icon="item.icon"
              color="neutral"
              variant="ghost"
              size="sm"
              class="w-full justify-start"
              @click="sidebarOpen = false"
            >
              {{ item.label }}
            </UButton>

            <!-- Admin sub-items -->
            <div v-if="item.children" class="ml-6 mt-1 space-y-1">
              <UButton
                v-for="child in item.children"
                :key="child.href"
                :to="child.href"
                :icon="child.icon"
                color="neutral"
                variant="ghost"
                size="xs"
                class="w-full justify-start"
                @click="sidebarOpen = false"
              >
                {{ child.label }}
              </UButton>
            </div>
          </template>
        </div>
      </nav>

      <!-- Footer -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800">
        <div class="text-xs text-gray-500 dark:text-gray-400 text-center">
          <p>NuxtWP Theme</p>
          <p>v{{ $config.public.version || '1.0.0' }}</p>
        </div>
      </div>
    </aside>
  </div>
</template>
