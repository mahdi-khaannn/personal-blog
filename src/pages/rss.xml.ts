import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: any) {
    const blog = await getCollection('blog');
    return rss({
        title: 'Mahdi Khan | Technical AI Agents Content',
        description: 'The practitioner\'s definitive source for AI agents analysis and tutorials.',
        site: context.site || 'https://mahdikhan.com',
        items: blog
            .filter((post) => !post.data.draft)
            .map((post) => ({
                title: post.data.title,
                pubDate: post.data.pubDate,
                description: post.data.description,
                link: `/blog/${post.slug}/`,
            })),
        customData: `<language>en-us</language>`,
    });
}
