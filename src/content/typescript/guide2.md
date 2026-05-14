---
title: 'TS記述のガイドライン'

publishDate: 2025-01-03

updatedDate: 2025-01-03

category: 'typescript'

order: 1
---

- [サブタイトルへ移動](#subtitle)
- [html](#html)
- [scss](#scss)
- [typescript](#typescript)

## subtitle

text

## html

```html
<body class="grid min-h-screen [grid-template-areas:'header'_'main'_'footer'] grid-rows-[auto_1fr_auto]">
    <header>header</header>
    <div class="max-w-4xl mx-auto px-4 pt-4 pb-8">
      <main class="mt-8">
        text
      </main>
    </div>
    <footer>footer</footer>
  </body>
```

## scss

```scss
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}

```

## typescript

```typescript
console.log('boo')
console.log('boo')
console.log('boo')
console.log('boo')
```