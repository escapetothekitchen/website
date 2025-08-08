import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

const ROOT = process.cwd();
const RECIPES_DIR = path.join(ROOT, 'src', 'content', 'recipes');

const keywordToCategory = [
  [/cookie|cookies|brownie|cupcake|frosting|buttercream|cake|pudding|ice cream|dessert/i, 'dessert'],
  [/salsa|dip|hummus|appetizer|deviled eggs|cheese ball/i, 'appetizer'],
  [/salad/i, 'salad'],
  [/soup|minestrone/i, 'soup'],
  [/bread|muffin|loaf|cornbread|buckwheat/i, 'bread'],
  [/taco|beef|chicken|lamb|meatball|italian beef/i, 'main'],
  [/sauce|seasoning|jerk|quesadilla sauce/i, 'sauce'],
  [/granola|snack|cluster/i, 'snack'],
  [/pancake|breakfast/i, 'breakfast'],
];

function suggestCategories(title, body) {
  const candidates = new Set();
  for (const [re, cat] of keywordToCategory) {
    if (re.test(title) || re.test(body)) candidates.add(cat);
  }
  return Array.from(candidates);
}

async function run() {
  const files = (await fs.readdir(RECIPES_DIR)).filter(f => f.endsWith('.md'));
  for (const file of files) {
    const full = path.join(RECIPES_DIR, file);
    const src = await fs.readFile(full, 'utf8');
    const parsed = matter(src);
    const fm = parsed.data || {};
    const body = parsed.content || '';

    const existing = Array.isArray(fm.categories) ? fm.categories.map(String) : [];
    const suggested = suggestCategories(String(fm.title || file), body);
    const merged = Array.from(new Set([...(existing||[]).map(s=>s.toLowerCase()), ...suggested])).filter(Boolean);

    if (merged.length === 0) continue;
    fm.categories = merged;
    const out = matter.stringify(parsed.content, fm);
    await fs.writeFile(full, out, 'utf8');
    console.log('Updated categories:', file, '->', merged.join(', '));
  }
}

run().catch(err => { console.error(err); process.exit(1); }); 