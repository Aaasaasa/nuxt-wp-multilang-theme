// ───────────────────────────────────────────────────────────── // File: components/AppSidebar.vue
// ─────────────────────────────────────────────────────────────
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from '#imports'
import { Home, Bot, Settings, PanelLeftClose, PanelLeftOpen } from 'lucide-vue-next'

const collapsed = ref(false)
const route = useRoute()

const nav = [
  { to: '/', label: 'Home', icon: Home },
  // { to: '/ai', label: 'AI', icon: Bot },
  // { to: '/chatgpt', label: 'ChatGPT', icon: Bot },
  { to: '/about', label: 'About', icon: Bot }
  // { to: '/settings', label: 'Settings', icon: Settings },
]

const actions = [
  { action: 'chatgptWeb', label: 'ChatGPT Web', icon: Bot },
  { action: 'deepseek', label: 'DeepSeek', icon: Bot }
]

//const isActive = (to: string) => computed(() => route.path === to)
const isActive = true

function handleAction(item: any) {
  if (item.action === 'chatgptWeb') {
    // (window as any)?.aaasaasa?.openChatGPT?.()
  }
  if (item.action === 'deepseek') {
    // (window as any)?.aaasaasa?.deepseek?.()
  }
}
</script>

<template>
  <aside
    :class="[
      'h-screen border-r bg-background transition-all duration-200',
      collapsed ? 'w-16' : 'w-56'
    ]"
  >
    <!-- Header -->
    <div class="h-14 flex items-center justify-between px-3">
      <span v-if="!collapsed" class="font-semibold text-primary">Aaasaasa</span>
      <UButton
        color="gray"
        variant="outline"
        size="xs"
        icon
        :title="collapsed ? 'Expand' : 'Collapse'"
        @click="collapsed = !collapsed"
      >
        <component :is="collapsed ? PanelLeftOpen : PanelLeftClose" class="w-4 h-4" />
      </UButton>
    </div>

    <UDivider />

    <!-- Scrollable nav -->
    <UScrollbar class="h-[calc(100vh-56px)]">
      <nav class="p-2 space-y-1">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors"
          :class="
            isActive(item.to).value
              ? 'bg-muted text-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          "
        >
          <UTooltip :text="collapsed ? item.label : ''" placement="right">
            <component :is="item.icon" class="w-5 h-5 shrink-0" />
          </UTooltip>
          <span v-if="!collapsed" class="truncate">{{ item.label }}</span>
        </NuxtLink>

        <UDivider class="my-2" />

        <!-- Actions -->
        <button
          v-for="item in actions"
          :key="item.action"
          class="group w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors text-left text-muted-foreground hover:bg-muted hover:text-foreground"
          @click="handleAction(item)"
        >
          <UTooltip :text="collapsed ? item.label : ''" placement="right">
            <component :is="item.icon" class="w-5 h-5 shrink-0" />
          </UTooltip>
          <span v-if="!collapsed" class="truncate">{{ item.label }}</span>
        </button>
      </nav>
    </UScrollbar>
  </aside>
</template>
