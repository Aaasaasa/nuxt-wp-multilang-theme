<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug as string;
</script>
<template>
  <article>
    <h1>Post: {{ slug }}</h1>
    <p>Content coming from API/WordPress…</p>
  </article>
</template>
