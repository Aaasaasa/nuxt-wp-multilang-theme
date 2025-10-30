// app/components/features/LanguageSwitcher.vue

<template>
  <UDropdownMenu :items="languageMenuItems">
    <UButton
      color="neutral"
      variant="ghost"
      size="sm"
      icon="i-lucide-globe"
      :label="currentLocale.code.toUpperCase()"
      trailing-icon="i-lucide-chevron-down"
    />
  </UDropdownMenu>
</template>

<script lang="ts" setup>
import type { DropdownMenuItem } from '@nuxt/ui'

const { locale, locales, setLocale } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const currentLocale = computed(() => {
  return locales.value.find((l) => l.code === locale.value) || locales.value[0]
})

const languageMenuItems = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: currentLocale.value.name,
      type: 'label',
      icon: 'i-lucide-globe'
    }
  ],
  locales.value.map((loc) => ({
    label: loc.name,
    icon: locale.value === loc.code ? 'i-lucide-check' : undefined,
    disabled: locale.value === loc.code,
    onSelect: () => {
      setLocale(loc.code)
      navigateTo(switchLocalePath(loc.code))
    }
  }))
])
</script>
