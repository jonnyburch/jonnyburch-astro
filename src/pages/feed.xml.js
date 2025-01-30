import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('posts');
  const activePosts = posts.filter(post => post.data.draft !== true)
    .sort((a, b) => b.data.date - a.data.date);
  return rss({
    title: 'Jonny Burch',
    description: 'Designer, Product Wonk, Founder, etc.',
    site: context.site,
    trailingSlash: false,
    items: activePosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/${post.id.split('.')[0]}/`
    })),
    customData: `<language>en-uk</language>`,
  });
}