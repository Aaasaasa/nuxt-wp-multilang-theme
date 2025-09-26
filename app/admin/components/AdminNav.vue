<script setup lang="ts">
import { User, LogOut, LayoutDashboard, FileText, Users } from 'lucide-vue-next'

const user = {
  name: 'Aleksandar',
  email: 'aleksandar@example.com',
  avatar: 'https://i.pravatar.cc/40?u=aleksandar'
}

const nav = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
  { label: 'Posts', to: '/admin/posts', icon: FileText },
  { label: 'Users', to: '/admin/users', icon: Users }
]
</script>

<template>
  <nav class="flex items-center gap-8">
    <!-- Main nav links -->
    <div class="hidden md:flex gap-8 text-sm font-medium">
      <ULink
        v-for="item in nav"
        :key="item.to"
        :to="item.to"
        active-class="text-primary font-semibold"
        class="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
      >
        <component :is="item.icon" class="w-4 h-4" />
        <span>{{ item.label }}</span>
      </ULink>
    </div>
<ClientOnly>
    <!-- Profile dropdown -->
    <UDropdownMenu
      :items="[
        [{ label: user.name, slot: 'account', disabled: true }],
        [
          { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
          { label: 'Posts', to: '/admin/posts', icon: FileText },
          { label: 'Users', to: '/admin/users', icon: Users }
        ],
        [
          { label: 'Profile', to: '/profile', icon: User },
          { label: 'Sign out', to: '/logout', icon: LogOut }
        ]
      ]"
      class="ml-2"
    >
      <UAvatar :src="user.avatar" size="sm" />

      <!-- ovo je slot, i ovo je jedini drugi <template> koji je dozvoljen -->
      <template #account>
        <div class="flex flex-col">
          <span class="text-sm font-medium">{{ user.name }}</span>
          <span class="text-xs text-muted-foreground">{{ user.email }}</span>
        </div>
      </template>
    </UDropdownMenu>
</ClientOnly>

<ClientOnly>
  <UDropdownMenu :items="dropdownItems">
    <UButton icon="i-lucide-user" color="gray" variant="ghost" />
  </UDropdownMenu>

  <template #fallback>
    <UButton icon="i-lucide-user" color="gray" variant="ghost" disabled />
  </template>
</ClientOnly>
  </nav>
</template>
