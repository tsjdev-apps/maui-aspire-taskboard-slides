import { useDarkMode } from '@slidev/client'
import { defineMermaidSetup } from '@slidev/types'

export default defineMermaidSetup(() => {
  const { isDark } = useDarkMode()
  const paper = isDark.value ? '#16212b' : '#fffdf9'
  const ink = isDark.value ? '#eef4f3' : '#1f2933'
  const accent = isDark.value ? '#6ee7d2' : '#00695c'
  const sand = isDark.value ? '#0f1720' : '#f5efe7'
  return {
    theme: 'base',
    fontFamily: 'Roboto, sans-serif',
    themeVariables: {
      primaryColor: paper,
      primaryTextColor: ink,
      primaryBorderColor: accent,
      lineColor: accent,
      secondaryColor: sand,
      tertiaryColor: sand,
      noteBkgColor: sand,
      noteTextColor: ink,
      noteBorderColor: accent,
      actorBkg: paper,
      actorTextColor: ink,
      actorBorder: accent,
      signalColor: ink,
      signalTextColor: ink,
    },
  }
})
