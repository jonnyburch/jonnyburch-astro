import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('posts');
  const activePosts = posts.filter(post => post.data.draft !== true);
  return rss({
    title: 'Jonny Burch',
    description: 'Designer, Product Wonk, Founder, etc.',
    site: context.site,
    items: activePosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/${post.id}/`
    })),
    customData: `<language>en-uk</language>`,
  });
}