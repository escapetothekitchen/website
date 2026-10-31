import { getCollection } from 'astro:content';
import { makeExcerpt } from '../lib/text';
import { recipeImage } from '../lib/recipeImage';

export async function GET() {
  const recipes = await getCollection('recipes');
  const sorted = recipes.sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
  const data = sorted.map(r => ({
    id: r.slug,
    slug: r.slug,
    title: r.data.title,
    date: r.data.date,
    categories: r.data.categories,
    image: recipeImage(r.body || '', r.data.image),
    description: makeExcerpt(r.body || ''),
    body: r.body,
  }));
  return new Response(JSON.stringify(data), {
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}
