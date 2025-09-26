<script setup lang="ts">
const colorMode = useColorMode()

const themeItems = [
  {
    label: 'Light',
    icon: 'i-lucide-sun',
    click: () => (colorMode.preference = 'light')
  },
  {
    label: 'Dark',
    icon: 'i-lucide-moon',
    click: () => (colorMode.preference = 'dark')
  },
  {
    label: 'System',
    icon: 'i-lucide-laptop',
    click: () => (colorMode.preference = 'system')
  }
]

const currentIcon = computed(() => {
  switch (colorMode.preference) {
    case 'dark':
      return 'i-lucide-moon'
    case 'light':
      return 'i-lucide-sun'
    default:
      return 'i-lucide-laptop'
  }
})
</script>

<template>
  <ClientOnly>
    <UDropdownMenu :items="themeItems">
      <UButton
        :icon="currentIcon"
        color="gray"
        variant="ghost"
      />
    </UDropdownMenu>

    <template #fallback>
      <UButton icon="i-lucide-sun" color="gray" variant="ghost" disabled />
    </template>
  </ClientOnly>
</template>
