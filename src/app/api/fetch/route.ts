// src/app/api/fetch/route.ts

import { fetchRss } from '@/lib/fetchRss';
import { postToMicrocms } from '@/lib/postToMicrocms';

export async function GET() {
  const grouped = await fetchRss();

  // サービスごとのRSSを投稿
  for (const [service, items] of Object.entries(grouped)) {
    for (const item of items) {
      try {
        await postToMicrocms({ ...item, service }); // ← 追加
      } catch (e) {
        console.error('投稿失敗:', e);
      }
    }
  }

  return Response.json({ success: true });
}
