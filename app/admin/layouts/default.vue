<!-- layouts/default.vue -->
<template>
  <div class="grid grid-cols-[auto_1fr] min-h-screen">
    <UTooltipProvider>
      <div class="flex">
        <AppSidebar />
        <!--
        <div class="flex-1">
          <NuxtPage />
        </div>
        -->
      </div>
    </UTooltipProvider>
    <div class="flex flex-col">
      <div class="flex items-center gap-4">
        <AppHeader />
        <!--<AdminNav />
        <LayoutThemeSwitcher />
        <LayoutLanguageSwitcher />
        -->
      </div>

      <main class="p-0">
        <slot />
      </main>
      <p class="text-neutral-600 dark:text-neutral-400 text-center">
        <AppFooter />
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import AdminNav from '@/components/AdminNav.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
//import LayoutThemeSwitcher from '@/components/layout/ThemeSwitcher.vue'
// import LayoutLanguageSwitcher from '@/components/layout/LanguageSwitcher.vue'
import { useI18n, useLocalePath } from '#imports'
import { useHead } from '#imports'
// import { useHead } from '@unhead/vue'

const localePath = useLocalePath()
const { t } = useI18n()

useHead({
  title: t('app.name'),
  meta: [
    { name: 'description', content: t('app.description') },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ]
})
</script>
