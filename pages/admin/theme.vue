<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Theme-Einstellungen</h1>
    <form @submit.prevent="saveSettings" class="space-y-4 max-w-md">
      <div>
        <label class="block font-semibold mb-1">Primärfarbe (Hex)</label>
        <input v-model="settings.primary_color" type="text" class="w-full border rounded p-2" placeholder="#4F46E5" />
      </div>
      <div>
        <label class="block font-semibold mb-1">Standard-Modus</label>
        <select v-model="settings.default_mode" class="w-full border rounded p-2">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Speichern</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const settings = ref({
  primary_color: '#4F46E5',
  default_mode: 'light'
});

onMounted(async () => {
  const res = await $fetch('/api/db/theme');
  if (res) settings.value = res;
});

async function saveSettings() {
  await $fetch('/api/db/theme', {
    method: 'POST',
    body: settings.value
  });
  alert('Gespeichert');
}
</script>
