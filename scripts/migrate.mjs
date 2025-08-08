import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import removeMarkdown from 'remove-markdown';

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, '_posts');
const OUT_DIR = path.join(ROOT, 'src', 'content', 'recipes');
const SRC_ASSETS = path.join(ROOT, 'assets');
const DEST_ASSETS = path.join(ROOT, 'public', 'assets');

function toSlug(name) {
  return name
    .toLowerCase()
    .replace(/^\d{4}-\d{2}-\d{2}-/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function parseJekyllDate(value) {
  if (!value) return new Date();
  if (value instanceof Date && !isNaN(value.getTime())) return value;
  const raw = String(value).trim();
  // Pattern: YYYY-MM-DD or YYYY-MM-DD -0400
  const tzMatch = raw.match(/^(\d{4}-\d{2}-\d{2})\s+([+-])(\d{2})(\d{2})$/);
  if (tzMatch) {
    const [, d, sign, hh, mm] = tzMatch;
    const iso = `${d}T00:00:00${sign}${hh}:${mm}`;
    const dt = new Date(iso);
    if (!isNaN(dt.getTime())) return dt;
  }
  const simple = raw.match(/^(\d{4}-\d{2}-\d{2})$/);
  if (simple) {
    const iso = `${simple[1]}T00:00:00Z`;
    const dt = new Date(iso);
    if (!isNaN(dt.getTime())) return dt;
  }
  const dt = new Date(raw);
  if (!isNaN(dt.getTime())) return dt;
  return new Date();
}

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function copyDir(src, dest) {
  await ensureDir(dest);
  const entries = await fs.readdir(src, { withFileTypes: true }).catch(() => []);
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      const data = await fs.readFile(srcPath);
      await ensureDir(path.dirname(destPath));
      await fs.writeFile(destPath, data);
    }
  }
}

async function migrate() {
  await ensureDir(OUT_DIR);
  // Copy assets so existing image URLs keep working
  await copyDir(SRC_ASSETS, DEST_ASSETS);

  const files = await fs.readdir(POSTS_DIR);
  for (const file of files) {
    if (!file.endsWith('.markdown') && !file.endsWith('.md')) continue;
    const full = path.join(POSTS_DIR, file);
    const src = await fs.readFile(full, 'utf8');
    const parsed = matter(src);
    const fm = parsed.data || {};
    const body = parsed.content.trim();
    const date = parseJekyllDate(fm.date);
    const title = fm.title || toSlug(file).replace(/-/g, ' ');
    const categories = Array.isArray(fm.categories)
      ? fm.categories
      : (typeof fm.categories === 'string' && fm.categories ? [fm.categories] : []);
    const description = removeMarkdown(body).split('\n').find(Boolean)?.slice(0, 180) || '';

    const slug = toSlug(file.replace(/\.(md|markdown)$/i, ''));
    const outPath = path.join(OUT_DIR, `${slug}.md`);
    const data = {
      title,
      date: date.toISOString(),
      categories,
      description,
    };
    const out = matter.stringify(body + '\n', data);
    await fs.writeFile(outPath, out, 'utf8');
    console.log('Migrated', file, '->', outPath);
  }
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
}); 