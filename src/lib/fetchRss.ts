// src/lib/fetchRss.ts

import Parser from 'rss-parser';

export type RssItem = {
  title: string;
  link: string;
  contentSnippet?: string;
  pubDate?: string;
  service: string;
};

const feedUrls = [
  'https://qiita.com/tags/react/feed',
  'https://qiita.com/tags/typescript/feed',
  'https://qiita.com/tags/javascript/feed',
  'https://dev.to/feed/react',
  'https://dev.to/feed/frontend',
  'https://dev.to/feed/tag/webdev',
];

const parser = new Parser();

function getServiceName(url: string): string {
  if (url.includes('qiita.com')) return 'qiita';
  if (url.includes('dev.to')) return 'devto';
  return 'other';
}

export async function fetchRss(): Promise<Record<string, RssItem[]>> {
  const allItems: RssItem[] = [];

  await Promise.all(
    feedUrls.map(async (url) => {
      try {
        const feed = await parser.parseURL(url);
        const service = getServiceName(url);

        const items = (feed.items || []).map((item) => ({
          title: item.title || '',
          link: item.link || '',
          contentSnippet: item.contentSnippet,
          pubDate: item.pubDate,
          service,
        }));

        allItems.push(...items);
      } catch (error) {
        console.error(`Failed to fetch RSS from ${url}`, error);
      }
    })
  );

  // サービスごとに分類して返す
  const grouped: Record<string, RssItem[]> = {};
  for (const item of allItems) {
    if (!grouped[item.service]) {
      grouped[item.service] = [];
    }
    grouped[item.service].push(item);
  }

  return grouped;
}
