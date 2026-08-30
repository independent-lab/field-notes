import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const categories = ['Thinking', 'Work', 'Technology', 'Culture', 'Life'] as const;

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    pubDate: z.coerce.date(),
    category: z.enum(categories),
    tags: z.array(z.string()).default([]),
    heroImage: z.string(),
    heroAlt: z.string(),
    description: z.string(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    sources: z.array(z.object({ label: z.string(), url: z.string().url() })).optional(),
  }),
});

export const collections = { posts };
