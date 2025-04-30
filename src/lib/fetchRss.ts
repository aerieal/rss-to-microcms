// src/lib/fetchRss.ts
import Parser from 'rss-parser';

export type RssItem = {
  title: string;
  link: string;
  contentSnippet?: string;
  pubDate?: string;
};

export async function fetchRssItems(url: string): Promise<RssItem[]> {
  const parser = new Parser();
  const feed = await parser.parseURL(url);
  console.log('feed', feed);
  return feed.items.map((item) => ({
    title: item.title || '',
    link: item.link || '',
    contentSnippet: item.contentSnippet,
    pubDate: item.pubDate,
  }));
}
