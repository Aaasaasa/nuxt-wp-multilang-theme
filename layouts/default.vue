<template>
  <div :class="theme">
    <header class="p-4 flex justify-between items-center shadow">
      <nav>
        <ul class="flex space-x-4">
          <li v-for="item in nav" :key="item.ID">
            <NuxtLink :to="'/' + item.post_name">{{ item.post_title }}</NuxtLink>
          </li>
        </ul>
      </nav>
      <button @click="toggleTheme" class="px-3 py-1 border rounded">{{ theme === 'dark' ? '☀️' : '🌙' }}</button>
    </header>
    <main class="p-6">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const theme = ref('light');
const nav = ref([]);

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', theme.value);
  document.documentElement.className = theme.value;
};

onMounted(async () => {
  theme.value = localStorage.getItem('theme') || 'light';
  document.documentElement.className = theme.value;
  nav.value = await $fetch('/api/db/nav');
});
</script>

<style>
html.dark {
  background: #1a202c;
  color: #f7fafc;
}
html.light {
  background: #fff;
  color: #1a202c;
}
</style>


// 3. pages/index.vue
<template>
  <div>
    <h1 class="text-3xl font-bold">Willkommen auf Stajic Web</h1>
    <p class="mt-4 text-lg">Diese Seite lädt ihr Menü und Theme dynamisch.</p>
  </div>
</template>