# Escape To The Kitchen

A static site built with Astro. Recipes are plain Markdown files.

## Prerequisites
- Node.js 18+ (recommended: 20)

## Develop locally
```bash
npm install
npm run dev
# open http://localhost:4321
```

## Build/preview
```bash
npm run build
npm run preview
# open http://localhost:4321
```

## Add a recipe
Create a Markdown file in `src/content/recipes/`. The filename becomes the URL slug.

Template:
```markdown
---
title: "My New Recipe"
date: 2025-08-08
categories:
  - appetizer
  - snack
description: Short teaser for search results.
---
Ingredients
- 1 cup …

Instructions
1. Do this…
```

Images: place under `public/assets/images/` and reference as `/assets/images/your_image.jpg`.

Suggested categories: `appetizer`, `main`, `salad`, `soup`, `bread`, `sauce`, `snack`, `dessert`, `breakfast`.

## Deploy (GitHub Pages)
- Deploys on push to the `master` branch
- Workflow: `.github/workflows/deploy.yml`
- GitHub Pages source: “GitHub Actions”
- Custom domain configured via `public/CNAME` 