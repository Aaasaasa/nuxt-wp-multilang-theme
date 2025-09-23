import { ref } from "vue";
const token = ref<string | null>(null);
export function useAuth() {
  return {
    token,
    login: (t: string) => (token.value = t),
    logout: () => (token.value = null),
  };
}
