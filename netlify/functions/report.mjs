// 每日記帳報表：註冊信箱、預覽 Excel、立即試寄
import { getStore } from '@netlify/blobs';
import { buildXlsx, buildMail, sendReport } from './lib/report.mjs';

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET,POST,OPTIONS',
  'access-control-allow-headers': 'content-type',
  'cache-control': 'no-store',
};
const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { ...CORS, 'content-type': 'application/json' } });
const text = (m, status) => new Response(m, { status, headers: CORS });
const okMail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s || '');

export default async (req) => {
  const rooms = getStore({ name: 'trip-rooms', consistency: 'strong' });
  const reports = getStore({ name: 'trip-reports', consistency: 'strong' });
  const url = new URL(req.url);
  const code = (url.searchParams.get('c') || '').toUpperCase();

  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (!/^[A-Z2-9]{6}$/.test(code)) return text('bad code', 400);

  // 設定：開啟／關閉每日寄信
  if (req.method === 'POST') {
    let body;
    try { body = JSON.parse(await req.text()); } catch { return text('not json', 400); }
    const enabled = !!body.enabled;
    if (enabled && !okMail(body.email)) return json({ error: '請填正確的 Email' }, 400);
    if (!(await rooms.get(code, { type: 'text' }))) return json({ error: '找不到這個共用代碼' }, 404);
    await reports.setJSON(code, { email: String(body.email || '').trim(), enabled, updated: new Date().toISOString() });
    return json({ ok: true, enabled, email: body.email || '' });
  }

  if (req.method !== 'GET') return text('method not allowed', 405);

  const setting = (await reports.get(code, { type: 'json' })) || { email: '', enabled: false };
  const raw = await rooms.get(code, { type: 'text' });
  const doc = raw ? JSON.parse(raw) : null;

  // 下載今天的 Excel（用來驗證內容正確）
  if (url.searchParams.get('preview') === '1') {
    if (!doc) return text('找不到這個共用代碼', 404);
    const { buffer } = buildXlsx(doc);
    return new Response(buffer, {
      headers: { ...CORS, 'content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'content-disposition': 'attachment; filename="report.xlsx"' },
    });
  }

  // 看信件內文（純文字）
  if (url.searchParams.get('mail') === '1') {
    if (!doc) return text('找不到這個共用代碼', 404);
    return new Response(buildMail(doc).text, { headers: { ...CORS, 'content-type': 'text/plain; charset=utf-8' } });
  }

  // 立即試寄一封
  if (url.searchParams.get('send') === '1') {
    if (!doc) return json({ error: '找不到這個共用代碼' }, 404);
    const to = url.searchParams.get('to') || setting.email;
    if (!okMail(to)) return json({ error: '還沒設定收件信箱' }, 400);
    try {
      const r = await sendReport({ to, code, doc });
      return json({ ok: true, to, ...r });
    } catch (e) { return json({ error: String(e.message || e) }, 500); }
  }

  return json({ email: setting.email || '', enabled: !!setting.enabled, hasRoom: !!doc });
};

export const config = { path: '/api/report' };
