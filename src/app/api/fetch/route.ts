// src/app/api/fetch/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fetchRssItems } from '@/lib/fetchRss';
import { postToMicrocms } from '@/lib/postToMicrocms';

export async function GET(req: NextRequest) {
  const feedUrl = 'https://qiita.com/tags/react/feed'; // 好きなRSSに変更可
  const items = await fetchRssItems(feedUrl);

  const results = [];
  for (const item of items) {
    try {
      const result = await postToMicrocms(item);
      results.push(result);
    } catch (err) {
      console.error('投稿失敗:', err);
    }
  }

  return NextResponse.json({ message: '完了', count: results.length });
}
