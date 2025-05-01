import { RssItem } from './fetchRss';

const endpoint = process.env.MICROCMS_ENDPOINT!;
const apiKey = process.env.MICROCMS_API_KEY!;

// microCMSに同じURLが既に存在するかチェック
async function isDuplicate(url: string): Promise<boolean> {
  const searchUrl = `${endpoint}?filters=url[equals]${encodeURIComponent(url)}`;
  const res = await fetch(searchUrl, {
    headers: {
      'X-API-KEY': apiKey,
    },
  });

  if (!res.ok) {
    console.error('重複チェック失敗:', await res.text());
    return false; // 念のため処理継続
  }

  const data = await res.json();
  return data.totalCount > 0;
}

export async function postToMicrocms(item: RssItem) {
  const duplicate = await isDuplicate(item.link);
  if (duplicate) {
    console.log('既に投稿済み（スキップ）:', item.link);
    return;
  }

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
      source: item.service,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error('microCMS投稿エラー:', error);
    throw new Error(`microCMS投稿失敗: ${res.status}`);
  }

  return res.json();
}
