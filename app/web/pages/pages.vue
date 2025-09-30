<script setup lang="ts">
const { data: pages } = await useFetch('/api/wp/pages')
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">WordPress Pages</h1>
    <ul v-if="pages">
      <li v-for="p in pages" :key="p.ID">
        <NuxtLink :to="'/' + p.post_name">
          {{ p.post_title }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
