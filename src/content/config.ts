import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
    type: 'content',
    // Schema maps directly to the required frontmatter properties from the blueprint
    schema: ({ image }) => z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        author: z.string().default('Mahdi Khan'),
        image: z.object({
            src: image(),
            alt: z.string(),
        }).optional(),
        tags: z.array(z.string()).default([]),
        series: z.string().optional(),
        seriesOrder: z.number().optional(),
        draft: z.boolean().default(false),
        readingTime: z.number().optional(), // In minutes. Usually we'd auto-calculate, but we'll accept overrides
        canonical: z.string().url().optional()
    }),
});

export const collections = { blog };
