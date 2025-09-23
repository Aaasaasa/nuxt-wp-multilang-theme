// shared/i18n/config.ts
export function createI18nConfig(messages: any) {
  return defineI18nConfig(() => ({
    legacy: false,
    locale: "en",
    fallbackLocale: "en",
    messages,
  }));
}
