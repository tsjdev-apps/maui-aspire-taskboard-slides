import { expect, test } from '@playwright/test'
import { parseSync } from '@slidev/parser'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

test('both sources contain the same 18 slide names and C# steps', async () => {
  const decks = await Promise.all(['en', 'de'].map(async language => {
    const path = resolve('decks', `${language}.md`)
    return parseSync(await readFile(path, 'utf8'), path)
  }))
  const names = decks.map(deck => deck.slides.map(slide => slide.frontmatter.name))
  expect(names[0]).toHaveLength(18)
  expect(names[0].every(name => typeof name === 'string')).toBe(true)
  expect(names[1]).toEqual(names[0])
  const snippets = decks.map(deck => deck.slides.flatMap(slide =>
    Array.from(slide.content.matchAll(/```csharp[^\n]*\n([\s\S]*?)\n```/g), match => match[1])))
  expect(snippets[0].length).toBeGreaterThan(8)
  expect(snippets[1]).toEqual(snippets[0])
})

test('landing page links to both decks', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'English' })).toHaveAttribute('href', 'en/1')
  await expect(page.getByRole('link', { name: 'Deutsch' })).toHaveAttribute('href', 'de/1')
})

test('language switch keeps the slide, click step and appearance', async ({ page }) => {
  await page.goto('/en/6?clicks=1')
  await expect(page.locator('.tsj-content:visible')).toContainText('Grow the AppHost')
  await page.getByRole('button', { name: 'Switch to dark theme', exact: true }).click()
  await expect(page.locator('html')).toHaveClass(/dark/)
  await page.getByRole('link', { name: 'Zu Deutsch wechseln', exact: true }).click()
  await expect(page).toHaveURL(/\/de\/6\?clicks=1$/)
  await expect(page.locator('.tsj-content:visible')).toContainText('Der AppHost wächst')
  await expect(page.locator('html')).toHaveClass(/dark/)
  await page.reload()
  await expect(page.locator('html')).toHaveClass(/dark/)
  await page.getByRole('button', { name: 'Zum Light-Theme wechseln', exact: true }).click()
  await expect(page.locator('html')).not.toHaveClass(/dark/)
  await page.getByRole('link', { name: 'Switch to English', exact: true }).click()
  await expect(page).toHaveURL(/\/en\/6\?clicks=1$/)
  await expect(page.locator('html')).not.toHaveClass(/dark/)
})

test('Magic Move changes actual code on each click', async ({ page }) => {
  await page.goto('/en/6')
  const code = page.locator('.shiki-magic-move-container:visible')
  await expect(code).toBeVisible()
  await expect(code).not.toContainText('AddProject')
  await page.keyboard.press('ArrowRight')
  await expect(code).toContainText('AddProject')
  await expect(code).not.toContainText('AddMauiProject')
  await page.keyboard.press('ArrowRight')
  await expect(code).toContainText('AddMauiProject')
  await expect(code).toContainText('WithReference')
  await expect(page).toHaveURL(/\/en\/6/)
})

test('code highlighting responds to color mode', async ({ page }) => {
  await page.goto('/en/9')
  const token = page.locator('.shiki:visible .line span').filter({ hasText: 'http' }).first()
  const lightColor = await token.evaluate(element => getComputedStyle(element).color)
  await page.getByRole('button', { name: 'Switch to dark theme', exact: true }).click()
  await expect.poll(() => token.evaluate(element => getComputedStyle(element).color)).not.toBe(lightColor)
})

for (const language of ['en', 'de']) {
  for (const appearance of ['light', 'dark'] as const) {
    test(`${language} / ${appearance}: all 18 slides render within their content boundaries`, async ({ page }) => {
      const errors: string[] = []
      const violations: string[] = []
      page.on('pageerror', error => errors.push(error.message))
      for (let slide = 1; slide <= 18; slide++) {
        await page.goto(`/${language}/${slide}?tsj-theme=${appearance}&clicks=99`)
        const frame = page.locator('.tsj-frame:visible')
        await expect(frame).toBeVisible()
        await expect(page.locator('html')).toHaveAttribute('lang', language)
        await expect(frame.locator('h1').first()).toBeVisible()
        await page.evaluate(() => document.fonts.ready)
        if (await frame.locator('.mermaid').count()) {
          await expect(frame.locator('.mermaid svg')).toBeVisible()
        }
        const geometry = await frame.evaluate(element => {
          const content = element.querySelector('.tsj-content')!
          const footer = element.querySelector('.tsj-footer')!.getBoundingClientRect()
          const frameBounds = element.getBoundingClientRect()
          const bounds = Array.from(content.querySelectorAll('h1,h2,p,li,pre,.tsj-card,.tsj-callout,.tsj-note,.tsj-source,.tsj-terminal,.tsj-palette,.shiki-magic-move-container,.mermaid'))
            .filter(node => {
              const style = getComputedStyle(node)
              return style.visibility !== 'hidden' && Number(style.opacity) > 0 && node.getBoundingClientRect().height > 0
            })
            .map(node => ({
              text: node.textContent?.slice(0, 90),
              bottom: node.getBoundingClientRect().bottom,
              right: node.getBoundingClientRect().right,
              left: node.getBoundingClientRect().left,
              overflow: node instanceof HTMLElement ? node.scrollWidth - node.clientWidth : 0,
            }))
          return { bounds, bottom: footer.top - 5, left: frameBounds.left, right: frameBounds.right }
        })
        for (const bound of geometry.bounds) {
          if (bound.bottom > geometry.bottom || bound.right > geometry.right
            || bound.left < geometry.left || bound.overflow > 2) {
            violations.push(`Slide ${slide}: ${bound.text} (footer overlap: ${Math.max(0, bound.bottom - geometry.bottom).toFixed(1)}px; horizontal overflow: ${bound.overflow}px)`)
          }
        }
        await expect(frame.locator('.tsj-page')).toHaveText(new RegExp(`${String(slide).padStart(2, '0')}\\s*/\\s*18`))
      }
      expect.soft(errors).toEqual([])
      expect(violations).toEqual([])
    })
  }
}
