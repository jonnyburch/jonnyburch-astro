import { z, defineCollection } from 'astro:content';

const postCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.optional(z.string()),
    categories: z.array(z.string()),
    shout: z.optional(z.string()),
    date: z.date(),
    draft: z.optional(z.boolean()),
    images: z.optional(
      z.array(z.object({
        src: z.string(),
        alt: z.string(),
    }))),
  })
});

export const collections = {
  'posts': postCollection,
};