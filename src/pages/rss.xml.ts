import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { siteConfig } from '../config/site';

export async function GET(context: any) {
    const blog = await getCollection('blog');
    return rss({
        title: siteConfig.content.rssTitle,
        description: siteConfig.content.rssDescription,
        site: context.site || siteConfig.siteUrl,
        items: blog
            .filter((post) => !post.data.draft)
            .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
            .map((post) => ({
                title: post.data.title,
                pubDate: post.data.pubDate,
                description: post.data.description,
                link: `/blog/${post.slug}/`,
            })),
        customData: `
          <language>en-us</language>
          <managingEditor>${siteConfig.email} (${siteConfig.name})</managingEditor>
          <webMaster>${siteConfig.email} (${siteConfig.name})</webMaster>
          <copyright>${new Date().getFullYear()} ${siteConfig.name}</copyright>
        `,
    });
}
