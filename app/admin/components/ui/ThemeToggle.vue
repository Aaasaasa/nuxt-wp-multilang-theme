<script setup>
const isDark = useState("dark", () => false);
</script>

<template>
  <button
    class="text-foreground hover:text-primary p-2 rounded"
    @click="isDark = !isDark"
    :title="isDark ? 'Light mode' : 'Dark mode'"
  >
    <span v-if="isDark">🌙</span>
    <span v-else>☀️</span>
  </button>
</template>
