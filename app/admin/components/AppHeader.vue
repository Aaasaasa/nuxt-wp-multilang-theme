<template>
  <header>
    <nav>
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="#">About</NuxtLink>
      <NuxtLink to="#">Blog</NuxtLink>
    </nav>
    <AdminNav />
    <LayoutThemeSwitcher />
    <LayoutLanguageSwitcher />
  </header>
</template>
<script lang="ts" setup>
import AdminNav from '@/components/AdminNav.vue'
// import AppSidebar from '@/components/AppSidebar.vue'
// import AppHeader from '@/components/AppHeader.vue'
// import AppFooter from '@/components/AppFooter.vue'
import LayoutThemeSwitcher from '@/components/layout/ThemeSwitcher.vue'
import LayoutLanguageSwitcher from '@/components/layout/LanguageSwitcher.vue'
// import { useI18n, useLocalePath } from '#imports'
// import { useHead } from '#imports'
// import { useHead } from '@unhead/vue'

// const localePath = useLocalePath()
// const { t } = useI18n()
</script>
