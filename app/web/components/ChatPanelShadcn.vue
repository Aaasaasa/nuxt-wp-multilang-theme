<template>
  <div class="flex flex-col h-[calc(100vh-56px)]">
    <UScrollArea class="flex-1 p-4 space-y-4">
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="text-sm whitespace-pre-wrap"
        :class="msg.role === 'user' ? 'text-right text-foreground font-medium' : 'text-left text-muted-foreground'"
      >
        {{ msg.content }}
      </div>
    </UScrollArea>

    <form @submit.prevent="onSend" class="p-4 border-t bg-background">
      <div class="flex gap-2">
        <UTextarea
          v-model="input"
          placeholder="Type your message..."
          rows="1"
          class="flex-1 resize-none min-h-[36px]"
          @keydown.enter.exact.prevent="onSend"
        />
        <UButton type="submit" :disabled="loading || !input.trim()">
          {{ loading ? '...' : 'Send' }}
        </UButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const input = ref('')
const loading = ref(false)
const messages = ref<{ id: string, role: 'user' | 'assistant', content: string }[]>([])

const onSend = async () => {
  if (!input.value.trim()) return
  const text = input.value.trim()
  input.value = ''
  loading.value = true

  const userMessage = { id: crypto.randomUUID(), role: 'user', content: text }
  messages.value.push(userMessage)

  try {
    const res = await $fetch('/api/aaasaasa/chat', {
      method: 'POST',
      body: {
        session_id: 'default',
        profile: 'local-ollama',
        prompt: text
      }
    })
    if (res?.text) {
      messages.value.push({ id: crypto.randomUUID(), role: 'assistant', content: res.text })
    }
  } catch (err) {
    messages.value.push({
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '⚠️ Error: ' + (err as any)?.message || err
    })
  } finally {
    loading.value = false
  }
}
</script>
