import { z, defineCollection } from 'astro:content';

const postCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.optional(z.string()),
    categories: z.array(z.string()),
    shout: z.optional(z.string()),
    date: z.date(),
    draft: z.optional(z.boolean()),
    image: z.optional(
      z.object({
        src: image(),
        alt: z.optional(z.string()),
        caption: z.optional(z.string()),
    })),
    redirect_to: z.optional(z.string()),
  })
});

export const collections = {
  'posts': postCollection,
};