export async function getArticles() {
  const endpoint = process.env.MICROCMS_ENDPOINT!;
  const apiKey = process.env.MICROCMS_API_KEY!;
  const res = await fetch(`${endpoint}?limit=100`, {
    headers: {
      'X-API-KEY': apiKey,
    },
  });

  if (!res.ok) {
    console.error('microCMSからの取得失敗:', await res.text());
    return [];
  }

  const data = await res.json();
  return data.contents;
}