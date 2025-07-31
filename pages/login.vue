
<template>
  <div class="max-w-md mx-auto mt-10 bg-white dark:bg-gray-800 p-6 rounded shadow">
    <h1 class="text-xl font-semibold mb-4">Login</h1>
    <form @submit.prevent="handleLogin">
      <label class="block mb-2">Benutzername
        <input v-model="username" class="w-full mt-1 px-3 py-2 border rounded" required>
      </label>
      <label class="block mb-4">Passwort
        <input type="password" v-model="password" class="w-full mt-1 px-3 py-2 border rounded" required>
      </label>
      <button type="submit" class="bg-primary text-white px-4 py-2 rounded">Einloggen</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const username = ref('');
const password = ref('');
const { signIn, status, data } = useAuth();
const { $auth } = useNuxtApp();

const handleLogin = async () => {
  await signIn('credentials', {
    username: username.value,
    password: password.value,
    callbackUrl: '/admin'
  });
};
</script>
