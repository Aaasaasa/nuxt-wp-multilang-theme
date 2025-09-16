<!-- app.vue -->
<script setup lang="ts">
import { onErrorCaptured } from 'vue'
import { useState } from '#imports'


onErrorCaptured((err) => {
  console.error('[UI Error]', err)
  return true
})

const isDark = useState('dark', () => false)

watch(isDark, (val) => {
  document.documentElement.classList.toggle('dark', val)
})
</script>

<template>
  <div :class="{ 'dark': isDark }" class="bg-background text-foreground min-h-screen">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
html, body, #__nuxt {
  height: 100%;
  margin: 0;
  box-sizing: border-box;
}
</style>
