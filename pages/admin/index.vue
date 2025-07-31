<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Admin-Bereich</h1>
    <div v-if="auth.status === 'authenticated'">
      <p class="mb-2">Willkommen, <strong>{{ auth.data.user.name }}</strong></p>
      <p class="mb-4">Deine Rolle: <span class="font-semibold">{{ auth.data.user.role }}</span></p>
      <div class="border p-4 rounded shadow bg-white mb-6">
        <h2 class="text-lg font-semibold mb-2">Nutzer-Information</h2>
        <ul class="list-disc ml-6">
          <li><strong>ID:</strong> {{ auth.data.user.id }}</li>
          <li><strong>Email:</strong> {{ auth.data.user.email }}</li>
          <li><strong>Registriert:</strong> {{ auth.data.user.registered }}</li>
        </ul>
      </div>
      <div v-if="auth.data.user.role === 'administrator'" class="border p-4 rounded shadow bg-white mb-6">
        <h2 class="text-lg font-semibold mb-2">Letzte Beiträge aus Datenbank</h2>
        <ul v-if="posts.length" class="list-disc ml-6">
          <li v-for="post in posts" :key="post.ID">
            <strong>{{ post.post_title }}</strong>
            <span class="text-gray-500 text-sm ml-2">({{ post.post_date }})</span>
          </li>
        </ul>
        <p v-else class="text-sm text-gray-500">Keine Beiträge gefunden.</p>
      </div>
      <div v-if="auth.data.user.role === 'administrator'" class="border p-4 rounded shadow bg-white">
        <h2 class="text-lg font-semibold mb-2">Navigationseinträge</h2>
        <ul v-if="nav.length" class="list-disc ml-6">
          <li v-for="item in nav" :key="item.ID">
            {{ item.post_title }} → <code>{{ item.post_name }}</code>
          </li>
        </ul>
        <p v-else class="text-sm text-gray-500">Keine Navigation gefunden.</p>
      </div>
    </div>
    <div v-else>
      <p>Du bist nicht angemeldet.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
const auth = useAuth();
const posts = ref([]);
const nav = ref([]);

onMounted(async () => {
  if (auth.status.value === 'authenticated' && auth.data.value?.user?.role === 'administrator') {
    try {
      posts.value = await $fetch('/api/db/posts');
      nav.value = await $fetch('/api/db/nav');
    } catch (error) {
      console.error('Fehler beim Laden der Daten:', error);
    }
  }
});
</script>

<style scoped>
</style>
