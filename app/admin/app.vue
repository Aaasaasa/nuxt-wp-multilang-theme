<style>
html,
body,
#__nuxt,
#modal-root {
  height: 100%;
  margin: 0;
  box-sizing: border-box;
}
</style>

<template>
  <UApp class="bg-background text-foreground min-h-screen">
    <div>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
    <!-- 👇 Dodaj modal root ovde -->
    <div id="modal-root"></div>
  </UApp>
</template>
