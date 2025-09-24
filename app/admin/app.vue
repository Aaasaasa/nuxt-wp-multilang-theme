<!-- app.vue -->
<script setup lang="ts">
import { onErrorCaptured } from 'vue'
import { useState } from '#imports'

// import { useState } from '#imports'

onErrorCaptured(err => {
  console.error('[UI Error]', err)
  return true
})

const isDark = useState('dark', () => false)

watch(isDark, val => {
  document.documentElement.classList.toggle('dark', val)
})

console.log(
  'Loaded components: skipping dynamic import because CommonJS build does not support import.meta'
)
</script>

<template>
  <UApp :class="{ dark: isDark }" class="bg-background text-foreground min-h-screen">
    <div>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </UApp>
</template>

<style>
html,
body,
#__nuxt {
  height: 100%;
  margin: 0;
  box-sizing: border-box;
}
</style>
