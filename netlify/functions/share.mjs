// 短網址：把行程存到 Netlify 雲端儲存，換一組 6 碼代號
import { getStore } from '@netlify/blobs';

// 去掉容易看錯的 0O1I
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const newCode = () => Array.from({ length: 6 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join('');
const MAX_BYTES = 2 * 1024 * 1024;

export default async (req) => {
  const store = getStore('trip-shares');
  const cors = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-allow-headers': 'content-type',
  };

  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

  if (req.method === 'GET') {
    const code = (new URL(req.url).searchParams.get('c') || '').toUpperCase();
    if (!/^[A-Z2-9]{6}$/.test(code)) return new Response('bad code', { status: 400, headers: cors });
    const data = await store.get(code, { type: 'text' });
    if (!data) return new Response('not found', { status: 404, headers: cors });
    return new Response(data, { headers: { ...cors, 'content-type': 'application/json', 'cache-control': 'no-store' } });
  }

  if (req.method === 'POST') {
    const body = await req.text();
    if (!body || body.length > MAX_BYTES) return new Response('bad body', { status: 400, headers: cors });
    try { JSON.parse(body); } catch { return new Response('not json', { status: 400, headers: cors }); }
    let code = newCode();
    for (let i = 0; i < 5; i++) {
      if (!(await store.get(code, { type: 'text' }))) break;
      code = newCode();
    }
    await store.set(code, body, { metadata: { created: new Date().toISOString() } });
    return new Response(JSON.stringify({ code }), { headers: { ...cors, 'content-type': 'application/json' } });
  }

  return new Response('method not allowed', { status: 405, headers: cors });
};

export const config = { path: '/api/share' };
