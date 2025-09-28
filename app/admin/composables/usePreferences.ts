import { ref, watch } from 'vue'

const STORAGE_KEY = 'admin-preferences'

type ViewMode = 'list' | 'grid'
type DisplayMode = 'compact' | 'extended'

const postViewMode = ref<ViewMode>('list')
const postDisplayMode = ref<DisplayMode>('compact')

// 🔹 Učitaj iz localStorage kad se app pokrene (samo u browseru)
if (process.client) {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) {
    try {
      const saved = JSON.parse(raw) as {
        postViewMode?: ViewMode
        postDisplayMode?: DisplayMode
      }
      if (saved.postViewMode) postViewMode.value = saved.postViewMode
      if (saved.postDisplayMode) postDisplayMode.value = saved.postDisplayMode
    } catch (e) {
      console.warn('[usePreferences] Failed to parse localStorage:', e)
    }
  }
}

// 🔹 Reaktivno snimaj u localStorage
if (process.client) {
  watch([postViewMode, postDisplayMode], () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        postViewMode: postViewMode.value,
        postDisplayMode: postDisplayMode.value
      })
    )
  })
}

export function usePreferences() {
  function setPostViewMode(mode: ViewMode) {
    postViewMode.value = mode
  }

  function setPostDisplayMode(mode: DisplayMode) {
    postDisplayMode.value = mode
  }

  function resetPreferences() {
    postViewMode.value = 'list'
    postDisplayMode.value = 'compact'
    if (process.client) {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  return {
    postViewMode,
    postDisplayMode,
    setPostViewMode,
    setPostDisplayMode,
    resetPreferences
  }
}
