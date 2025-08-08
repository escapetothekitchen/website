# Escape To The Kitchen

A static site built with Astro. Content is Markdown in a content collection. Deployed to GitHub Pages via GitHub Actions.

## Prerequisites
- Node.js 18+ (recommended: 20)

## Quick start
```bash
# Install dependencies
npm install

# (Optional) Migrate existing Jekyll posts from _posts/ to Astro content
npm run migrate

# Start local dev server
npm run dev
# open http://localhost:4321
```

## Build & preview locally
```bash
# Build for production
npm run build

# Preview the built site locally
npm run preview
# open http://localhost:4321
```

## Deploy (GitHub Pages)
- On push to `main` or `refactor`, GitHub Actions builds and deploys the site.
- Workflow: `.github/workflows/deploy.yml`
- Ensure GitHub Pages is set to use the “GitHub Actions” source in repository settings.
- Custom domain `escapetothekitchen.com` is configured via `public/CNAME`.

## Content model
Recipes live in `src/content/recipes/` as Markdown with YAML frontmatter. The filename (without extension) becomes the URL slug.

Frontmatter fields:
- `title` (string) – required
- `date` (YYYY-MM-DD or ISO) – required
- `categories` (string[]) – optional
- `description` (string) – optional short teaser for search

Example recipe:
```markdown
---
title: "My New Recipe"
date: 2025-08-08
categories:
  - dessert
  - gluten-free
description: Short teaser for search results.
---
Ingredients
- 1 cup ...

Instructions
1. Do this…
```

Images: place under `public/assets/images/` and reference as `/assets/images/your_image.jpg`.

## Adding a new recipe
1. Create a new file in `src/content/recipes/`, e.g. `my-new-recipe.md`.
2. Add the frontmatter and body (see example above).
3. Commit and push. CI will build and deploy; locally, `npm run dev` will hot-reload.

## Adding a new page
- Static page: add an `.astro` file under `src/pages/`, e.g. `src/pages/faq.astro`.
- Use the base layout:
```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---
<BaseLayout title="FAQ">
  <h1>FAQ</h1>
  <p>…content…</p>
</BaseLayout>
```
- The route is based on the file path (e.g. `src/pages/faq.astro` -> `/faq`).

## Categories
- Assign categories in frontmatter (array of strings).
- Categories index: `/categories`
- Per-category pages: `/categories/<category>`

## Search
- Client-side search over a prebuilt JSON index at `/search-index.json`.
- Search UI: `/recipes` and quick search on the homepage.

## Project structure (key paths)
- `src/pages/` – page routes (e.g., home, categories, recipes)
- `src/layouts/BaseLayout.astro` – site shell
- `src/content/recipes/` – recipe markdown files (content collection)
- `public/` – static assets (served at site root)
- `scripts/migrate.mjs` – one-time migration from Jekyll `_posts/` to `src/content/recipes/`

## Troubleshooting
- Node version: use 18+ (`node -v`).
- Port conflicts: change dev port in `astro.config.mjs` or stop the conflicting process.
- If search returns nothing, ensure the site built successfully (creates `/search-index.json`). 