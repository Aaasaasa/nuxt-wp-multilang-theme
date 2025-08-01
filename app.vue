<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
onMounted(() => {
  const mode = localStorage.getItem('theme') || 'light'
  document.documentElement.className = mode
})
</script>
