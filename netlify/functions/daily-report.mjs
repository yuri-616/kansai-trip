// 每天日本時間 22:00（UTC 13:00）自動寄出記帳報表
import { getStore } from '@netlify/blobs';
import { sendReport } from './lib/report.mjs';

export default async () => {
  const reports = getStore({ name: 'trip-reports', consistency: 'strong' });
  const rooms = getStore({ name: 'trip-rooms', consistency: 'strong' });
  const { blobs } = await reports.list();
  const done = [];

  for (const b of blobs) {
    const setting = await reports.get(b.key, { type: 'json' });
    if (!setting || !setting.enabled || !setting.email) continue;
    const raw = await rooms.get(b.key, { type: 'text' });
    if (!raw) { done.push(`${b.key}: 房間已不存在，略過`); continue; }
    try {
      const r = await sendReport({ to: setting.email, code: b.key, doc: JSON.parse(raw) });
      done.push(`${b.key} → ${setting.email}：${r.count} 筆 / NT$${r.total}`);
    } catch (e) {
      done.push(`${b.key} 失敗：${String(e.message || e)}`);
    }
  }
  console.log('每日記帳報表', done.length ? done.join(' | ') : '沒有需要寄的房間');
  return new Response(JSON.stringify({ sent: done }), { headers: { 'content-type': 'application/json' } });
};

export const config = { schedule: '0 13 * * *' };
