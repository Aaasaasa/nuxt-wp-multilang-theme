<style>
html,
body,
#__nuxt,
#modal-root {
  height: 100%;
  margin: 0;
  box-sizing: border-box;
}
</style>

<template>
  <UApp :locale="locales[locale]">
    <UiProvider>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    </UiProvider>
  </UApp>
</template>

<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'
import { useI18n } from "@nuxtjs/i18n"
// import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
</script>
