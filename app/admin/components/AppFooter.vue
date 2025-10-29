<script setup lang="ts">
import { Github, Twitter, Globe } from 'lucide-vue-next'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t bg-background mt-auto">
    <UContainer class="py-6 md:py-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <!-- Left: Branding & Copy -->
        <div class="flex flex-col gap-2 text-sm text-muted-foreground">
          <span class="font-semibold text-foreground">NuxtWP</span>
          <span>© {{ year }} Stajic Aleksandar. All rights reserved.</span>
        </div>

        <!-- Center: Navigation links -->
        <nav class="flex gap-4 text-sm text-muted-foreground">
          <ULink to="/about" active-class="text-primary font-medium">About</ULink>
          <ULink to="/blog" active-class="text-primary font-medium">Blog</ULink>
          <ULink to="/privacy" active-class="text-primary font-medium">Privacy</ULink>
          <ULink to="/terms" active-class="text-primary font-medium">Terms</ULink>
        </nav>

        <!-- Right: Social & Language -->
        <div class="flex items-center gap-4">
          <ULink
            to="https://github.com/Aaasaasa/nuxt-wp-multilang-theme"
            external
            aria-label="GitHub"
          >
            <Github class="w-5 h-5 hover:text-primary transition-colors" />
          </ULink>
          <ULink to="https://x.com/Aaasaasa" external aria-label="X (Twitter)">
            <Twitter class="w-5 h-5 hover:text-primary transition-colors" />
          </ULink>
          <ULink to="/language" aria-label="Language">
            <Globe class="w-5 h-5 hover:text-primary transition-colors" />
          </ULink>
        </div>
      </div>
    </UContainer>
  </footer>
</template>
