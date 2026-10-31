<script setup lang="ts">
withDefaults(defineProps<{ variant?: string }>(), { variant: 'default' })
</script>

<template>
  <div class="slidev-layout tsj-frame" :class="`tsj-${variant}`">
    <header class="tsj-header">
      <a class="tsj-brand" href="https://www.tsjdev-apps.de" aria-label="tsjdevapps website" @click.stop>
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path d="m16 2 12 7v14l-12 7-12-7V9Z" />
          <path d="m12 11-5 5 5 5m8-10 5 5-5 5" />
        </svg>
        <span>tsj<span class="tsj-brand-light">dev</span><span class="tsj-brand-apps">apps</span></span>
      </a>
      <DeckControls
        v-if="$renderContext === 'slide'"
        :language="$slidev.themeConfigs.language"
        :languages="$slidev.themeConfigs.languages"
      />
    </header>
    <div v-if="$frontmatter.section" class="tsj-eyebrow">{{ $frontmatter.section }}</div>
    <main class="tsj-content"><slot /></main>
    <footer class="tsj-footer">
      <span>{{ $slidev.configs.author || 'Thomas Sebastian Jensen' }} <span class="tsj-footer-dot">/</span> tsjdevapps</span>
      <span class="tsj-page">{{ String($page).padStart(2, '0') }} <span class="tsj-footer-dot">/</span> {{ $nav.total }}</span>
    </footer>
  </div>
</template>
