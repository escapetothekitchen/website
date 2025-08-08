import { getCollection } from 'astro:content';

export async function GET() {
  const recipes = await getCollection('recipes');
  const data = recipes.map(r => ({
    id: r.slug,
    slug: r.slug,
    title: r.data.title,
    date: r.data.date,
    categories: r.data.categories,
    description: r.data.description,
    body: r.body,
  }));
  return new Response(JSON.stringify(data), {
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
} 