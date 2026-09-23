// 共用旅行房間：同一組代碼的人共用一份行程、清單、記帳
import { getStore } from '@netlify/blobs';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 去掉容易看錯的 0O1I
const newCode = () => Array.from({ length: 6 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join('');
const MAX_BYTES = 4 * 1024 * 1024;
const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'access-control-allow-headers': 'content-type',
  'cache-control': 'no-store',
};
const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { ...CORS, 'content-type': 'application/json' } });
const text = (msg, status) => new Response(msg, { status, headers: CORS });

export default async (req) => {
  // consistency: 'strong' → 剛寫好馬上就讀得到
  const store = getStore({ name: 'trip-rooms', consistency: 'strong' });
  const code = (new URL(req.url).searchParams.get('c') || '').toUpperCase();
  const valid = /^[A-Z2-9]{6}$/.test(code);

  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });

  // 建立房間：body 是第一份資料，回傳新代碼
  if (req.method === 'POST') {
    const body = await req.text();
    if (!body || body.length > MAX_BYTES) return text('bad body', 400);
    try { JSON.parse(body); } catch { return text('not json', 400); }
    let c = newCode();
    for (let i = 0; i < 5; i++) {
      if (!(await store.get(c, { type: 'text' }))) break;
      c = newCode();
    }
    await store.set(c, body, { metadata: { created: new Date().toISOString() } });
    return json({ code: c });
  }

  if (!valid) return text('bad code', 400);

  if (req.method === 'GET') {
    const data = await store.get(code, { type: 'text' });
    if (!data) return text('not found', 404);
    return new Response(data, { headers: { ...CORS, 'content-type': 'application/json' } });
  }

  // 覆蓋房間內容（App 端已先把雲端與本機合併過才送上來）
  if (req.method === 'PUT') {
    const body = await req.text();
    if (!body || body.length > MAX_BYTES) return text('bad body', 400);
    try { JSON.parse(body); } catch { return text('not json', 400); }
    if (!(await store.get(code, { type: 'text' }))) return text('not found', 404);
    await store.set(code, body, { metadata: { updated: new Date().toISOString() } });
    return json({ ok: true });
  }

  // 關掉房間：換新代碼時用，舊代碼與舊連結立刻失效
  if (req.method === 'DELETE') {
    await store.delete(code);
    return json({ ok: true });
  }

  return text('method not allowed', 405);
};

export const config = { path: '/api/room' };
