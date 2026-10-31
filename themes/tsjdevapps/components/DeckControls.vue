<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useDarkMode, useNav } from '@slidev/client'

interface LanguageOption {
  code: string
  label: string
  path: string
  devPort?: number
}

const props = withDefaults(defineProps<{
  language?: string
  languages?: LanguageOption[]
}>(), {
  language: 'en',
  languages: () => [],
})

const { isDark } = useDarkMode()
const { currentPage } = useNav()
const themeLabel = computed(() => props.language === 'de'
  ? (isDark.value ? 'Zum Light-Theme wechseln' : 'Zum Dark-Theme wechseln')
  : (isDark.value ? 'Switch to light theme' : 'Switch to dark theme'))

onMounted(() => {
  // Dev decks run on separate origins; carry the chosen appearance across ports.
  const url = new URL(location.href)
  const appearance = url.searchParams.get('tsj-theme')
  if (appearance === 'light' || appearance === 'dark') {
    isDark.value = appearance === 'dark'
    url.searchParams.delete('tsj-theme')
    history.replaceState(history.state, '', url)
  }
})

function languageUrl(target: LanguageOption): string {
  const url = new URL(location.href)
  const base = import.meta.env.BASE_URL
  const parent = base.slice(0, base.lastIndexOf('/', base.length - 2) + 1)
  const route = url.pathname.startsWith(base)
    ? url.pathname.slice(base.length)
    : String(currentPage.value)
  url.pathname = `${parent}${target.path.replace(/^\/|\/$/g, '')}/${route}`
  if (import.meta.env.DEV && target.devPort) {
    url.port = String(target.devPort)
  }
  url.searchParams.set('tsj-theme', isDark.value ? 'dark' : 'light')
  return url.href
}
</script>

<template>
  <nav class="tsj-controls" :aria-label="language === 'de' ? 'Präsentationseinstellungen' : 'Presentation settings'" @keydown.stop>
    <div v-if="languages.length > 1" class="tsj-language-switch">
      <template v-for="option in languages" :key="option.code">
        <span v-if="option.code === language" class="is-selected" aria-current="true">{{ option.label }}</span>
        <a v-else :href="languageUrl(option)" :hreflang="option.code" :aria-label="option.code === 'de' ? 'Zu Deutsch wechseln' : 'Switch to English'" @click.stop>
          {{ option.label }}
        </a>
      </template>
    </div>
    <button class="tsj-theme-toggle" type="button" :aria-label="themeLabel" :title="themeLabel" :aria-pressed="isDark" @click.stop="isDark = !isDark">
      <svg v-if="isDark" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
      </svg>
      <svg v-else viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z" />
      </svg>
      <span>{{ isDark ? 'Dark' : 'Light' }}</span>
    </button>
  </nav>
</template>
