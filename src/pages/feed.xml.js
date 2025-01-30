import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
const parser = new MarkdownIt();

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
      link: `/${post.id.split('.')[0]}/`,
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      content: sanitizeHtml(parser.render(post.body || ''), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
      }),
    })),
    customData: `<language>en-uk</language>`,
  });
}