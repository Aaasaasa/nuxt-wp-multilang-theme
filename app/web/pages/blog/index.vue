<script setup lang="ts">
const posts = ref([{ slug: "hello", title: "Hello" }]);
</script>
<template>
  <div>
    <h1>Blog</h1>
    <ul>
      <li
        v-for="p in posts"
        :key="p.slug"
      >
        <NuxtLink :to="`/blog/${p.slug}`">
          {{ p.title }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
