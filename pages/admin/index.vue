
<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Admin-Dashboard</h1>
    <p class="mb-4">Willkommen im Adminbereich. Hier kannst du WordPress-Daten einsehen und verwalten.</p>
    <div class="grid gap-6">
      <div class="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h2 class="text-xl font-semibold mb-2">Letzte Beiträge</h2>
        <ul>
          <li v-for="post in posts" :key="post.ID">
            <strong>{{ post.post_title }}</strong>
            <p class="text-sm text-gray-600 dark:text-gray-300">{{ post.post_excerpt }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '#auth';
import { ref, onMounted } from 'vue';
const { status } = useAuth();
const posts = ref([]);

onMounted(async () => {
  if (status.value === 'authenticated') {
    const res = await fetch('/api/db/posts');
    posts.value = await res.json();
  }
});
</script>
