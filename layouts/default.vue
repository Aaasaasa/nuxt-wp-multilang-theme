<template>
  <div :class="isDark ? 'dark' : ''">
    <div class="min-h-screen bg-background text-gray-800 dark:bg-gray-900 dark:text-white">
      <header class="p-4 flex justify-between items-center">
        <img src="/logo.svg" alt="Logo" class="h-8">
        <div class="flex gap-4 items-center">
          <select v-model="$i18n.locale" class="bg-white text-black px-2 py-1 rounded">
            <option value="de">DE</option>
            <option value="en">EN</option>
            <option value="sr">SR</option>
          </select>
          <button @click="toggleTheme" class="px-3 py-1 border rounded">
            {{ isDark ? '☀️' : '🌙' }}
          </button>
        </div>
      </header>
      <main>
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const isDark = ref(false);

onMounted(() => {
  isDark.value = localStorage.theme === 'dark';
  document.documentElement.classList.toggle('dark', isDark.value);
});

const toggleTheme = () => {
  isDark.value = !isDark.value;
  localStorage.theme = isDark.value ? 'dark' : 'light';
  document.documentElement.classList.toggle('dark', isDark.value);
};
</script>
