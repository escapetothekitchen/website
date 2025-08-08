import { defineCollection, z } from 'astro:content';

const recipes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    categories: z.array(z.string()).default([]),
    image: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const collections = { recipes }; 