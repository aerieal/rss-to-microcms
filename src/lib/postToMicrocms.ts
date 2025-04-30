// src/lib/postToMicrocms.ts
import { RssItem } from './fetchRss';

const endpoint = process.env.MICROCMS_ENDPOINT!;
const apiKey = process.env.MICROCMS_API_KEY!;

export async function postToMicrocms(item: RssItem) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'X-API-KEY': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: item.title,
      body: item.contentSnippet || '',
      url: item.link,
      publishedAt: item.pubDate || new Date().toISOString(),
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error('microCMS投稿エラー:', error);
    throw new Error(`microCMS投稿失敗: ${res.status}`);
  }

  return res.json();
}
