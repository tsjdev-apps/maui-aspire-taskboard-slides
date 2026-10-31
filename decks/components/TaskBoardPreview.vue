<script setup lang="ts">
withDefaults(defineProps<{ language?: string }>(), { language: 'en' })
</script>

<template>
  <div class="board-preview" :aria-label="language === 'de' ? 'Illustrative TaskBoard-Vorschau, kein App-Screenshot' : 'Illustrative TaskBoard preview, not an app screenshot'">
    <div class="board-heading"><span>TaskBoard</span><span class="board-status">{{ language === 'de' ? 'Beispieldaten' : 'Sample data' }}</span></div>
    <div v-for="(task, index) in (language === 'de'
      ? ['API mit Aspire starten', 'MAUI-Client verbinden', 'Trace im Dashboard öffnen']
      : ['Start the API with Aspire', 'Connect the MAUI client', 'Open a dashboard trace'])" :key="task" class="board-task">
      <span class="board-check" :class="{ 'board-done': index === 0 }">{{ index === 0 ? '✓' : '' }}</span>
      <span>{{ task }}</span>
    </div>
    <div class="board-caption">{{ language === 'de' ? 'Illustration · kein Screenshot der App' : 'Illustration · not an app screenshot' }}</div>
  </div>
</template>

<style scoped>
.board-preview { border: 1px solid var(--tsj-border); background: var(--tsj-surface); border-radius: 24px; padding: 26px; box-shadow: var(--tsj-shadow); margin-top: 12px; }
.board-heading { display: flex; align-items: center; justify-content: space-between; gap: 8px; font-family: 'JetBrains Mono', monospace; font-size: 20px; margin-bottom: 25px; }
.board-status { font-family: 'Roboto', sans-serif; font-size: 11px; color: var(--tsj-accent-ink); background: var(--tsj-sand); padding: 5px 8px; border-radius: 8px; }
.board-task { border-top: 1px solid var(--tsj-border); padding: 16px 0; display: flex; align-items: center; gap: 14px; font-size: 15px; }
.board-check { width: 22px; height: 22px; flex-shrink: 0; border: 1px solid var(--tsj-border); border-radius: 7px; text-align: center; line-height: 22px; }
.board-done { color: var(--tsj-paper); background: var(--tsj-accent-ink); }
.board-caption { font-size: 11px; color: var(--tsj-muted); margin-top: 12px; }
</style>
