<!-- layouts/default.vue -->
<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-900">
    <header
      class="py-4 px-4 flex justify-between items-center border-b border-neutral-200 dark:border-neutral-800"
    >
      <NuxtLink
        :to="localePath('index')"
        class="text-xl font-bold text-secondary-500 dark:text-secondary-400"
      >
        {{ t('app.name') }}
      </NuxtLink>

      <nav v-if="menu?.items" class="flex gap-6">
        <NuxtLink
          v-for="item in menu.items"
          :key="item.id"
          :to="'/' + item.slug"
          class="hover:underline"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>



      <div class="flex items-center gap-4">
        <LayoutThemeSwitcher />
        <LayoutLanguageSwitcher />
      </div>
    </header>

    <div class="mx-auto">
      <main>
        <slot />
      </main>

      <footer class="py-6 border-t border-neutral-200 dark:border-neutral-800">
        <p class="text-neutral-600 dark:text-neutral-400 text-center">
          {{ t('app.footer') }}
        </p>
      </footer>
    </div>
  </div>
</template>

<script lang="ts" setup>
const config = useRuntimeConfig()

//const { data: menu } = await useFetch('@@/server/api/menu')
const { data: menu, error } = await useFetch(`${config.public.apiBase}/wp/menu`, {
  query: { slug: 'main-menu' }
})
console.log('MENU from API:', menu.value)
// console.error('Fetch error:', error.value)
// import AppSidebar from "~/components/AppSidebar.vue";
// import AppHeader from "~/components/AppHeader.vue";
// import AppFooter from "~/components/AppFooter.vue";
import LayoutThemeSwitcher from "~/components/layout/ThemeSwitcher.vue"
import LayoutLanguageSwitcher from "~/components/layout/LanguageSwitcher.vue"
import { useI18n, useLocalePath } from "#imports"
// import { useHead } from '@unhead/vue'
import { useHead } from "#imports"


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
