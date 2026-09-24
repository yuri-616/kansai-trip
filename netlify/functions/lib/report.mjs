// 伺服器端：把房間裡的記帳做成 Excel，並用 Resend 寄出
// 金額規則和 App 完全一致：每筆先換成台幣四捨五入到整數，總計＝各筆整數相加

const xe = (s) => String(s == null ? '' : s)
  .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const col = (i) => String.fromCharCode(65 + i);
const roundHalfUp = (n) => Math.round(Number(n.toFixed(6)));
const isManual = (e) => e.currency === 'JPY' && Number.isInteger(e.twd) && e.twd > 0;
export const toTWD = (e, rate) => (e.currency === 'TWD' ? e.amount : isManual(e) ? e.twd : roundHalfUp(e.amount * rate));
const catLabel = (e) => (e.cat === '其他' && e.other ? `其他：${e.other}` : e.cat);

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
const crc32 = (buf) => {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
};

// 最小 ZIP（不壓縮）
function zip(files) {
  const now = new Date();
  const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
  const dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
  const parts = [], central = [];
  let offset = 0;
  for (const [name, text] of Object.entries(files)) {
    const nameBuf = Buffer.from(name, 'utf8');
    const data = Buffer.from(text, 'utf8');
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(20, 4); local.writeUInt16LE(0x0800, 6);
    local.writeUInt16LE(0, 8); local.writeUInt16LE(dosTime, 10); local.writeUInt16LE(dosDate, 12);
    local.writeUInt32LE(crc, 14); local.writeUInt32LE(data.length, 18); local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuf.length, 26); local.writeUInt16LE(0, 28);
    parts.push(local, nameBuf, data);
    const cd = Buffer.alloc(46);
    cd.writeUInt32LE(0x02014b50, 0); cd.writeUInt16LE(20, 4); cd.writeUInt16LE(20, 6); cd.writeUInt16LE(0x0800, 8);
    cd.writeUInt16LE(0, 10); cd.writeUInt16LE(dosTime, 12); cd.writeUInt16LE(dosDate, 14);
    cd.writeUInt32LE(crc, 16); cd.writeUInt32LE(data.length, 20); cd.writeUInt32LE(data.length, 24);
    cd.writeUInt16LE(nameBuf.length, 28); cd.writeUInt32LE(offset, 42);
    central.push(cd, nameBuf);
    offset += 30 + nameBuf.length + data.length;
  }
  const cdBuf = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(Object.keys(files).length, 8); end.writeUInt16LE(Object.keys(files).length, 10);
  end.writeUInt32LE(cdBuf.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...parts, cdBuf, end]);
}

export function buildXlsx(doc) {
  const rate = doc.rate || 0.21;
  const rows = (doc.expenses || []).filter((e) => !e.deleted).slice().sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const cell = (ref, v, s = 0) => {
    if (v === '' || v == null) return s ? `<c r="${ref}" s="${s}"/>` : '';
    if (typeof v === 'number') return `<c r="${ref}" s="${s}"><v>${v}</v></c>`;
    if (typeof v === 'object') return `<c r="${ref}" s="${s}"><f>${xe(v.f)}</f><v>${v.v}</v></c>`;
    return `<c r="${ref}" s="${s}" t="inlineStr"><is><t xml:space="preserve">${xe(v)}</t></is></c>`;
  };
  const sheet = (data, widths, freeze) => {
    const body = data.map((r, ri) => `<row r="${ri + 1}">${r.map((c, ci) => {
      const [v, s] = Array.isArray(c) ? c : [c, 0];
      return cell(col(ci) + (ri + 1), v, s);
    }).join('')}</row>`).join('');
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
      + '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
      + (freeze ? '<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>' : '')
      + `<cols>${widths.map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`).join('')}</cols>`
      + `<sheetData>${body}</sheetData></worksheet>`;
  };
  const H = 1, N = 2, NB = 3, B = 4, R = 5;

  const d1 = [[['日期', H], ['分類', H], ['付款方式', H], ['說明', H], ['日幣金額', H], ['台幣金額', H], ['匯率', H], ['換算台幣', H], ['換算方式', H]]];
  rows.forEach((e, i) => {
    const r = i + 2;
    const twd = toTWD(e, rate);
    if (e.currency === 'TWD') d1.push([e.date, catLabel(e), e.pay, e.note, '', [e.amount, N], '', [{ f: `F${r}`, v: twd }, N], '台幣直接付']);
    else if (isManual(e)) d1.push([e.date, catLabel(e), e.pay, e.note, [e.amount, N], '', '', [twd, N], '手動輸入台幣']);
    else d1.push([e.date, catLabel(e), e.pay, e.note, [e.amount, N], '', [rate, R], [{ f: `ROUND(E${r}*G${r},0)`, v: twd }, N], '自動換算']);
  });
  const last = rows.length + 1;
  const sumJPY = rows.filter((e) => e.currency === 'JPY').reduce((s, e) => s + e.amount, 0);
  const sumTWDdirect = rows.filter((e) => e.currency === 'TWD').reduce((s, e) => s + e.amount, 0);
  const total = rows.reduce((s, e) => s + toTWD(e, rate), 0);
  d1.push([['合計', B], '', '', ['', B],
    [{ f: `SUM(E2:E${last})`, v: sumJPY }, NB], [{ f: `SUM(F2:F${last})`, v: sumTWDdirect }, NB], '',
    [{ f: `SUM(H2:H${last})`, v: total }, NB]]);

  const group = (keyFn) => {
    const m = new Map();
    rows.forEach((e) => {
      const k = keyFn(e);
      const g = m.get(k) || { n: 0, twd: 0 };
      g.n += 1; g.twd += toTWD(e, rate);
      m.set(k, g);
    });
    return [...m.entries()];
  };
  const d2 = [
    [['關西旅費統計', B]],
    ['產生時間', new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Tokyo' }) + '（日本時間）'],
    ['匯率（1 日圓 = ? 台幣）', [rate, R]],
    ['總筆數', [rows.length, N]],
    ['日幣支出合計', [sumJPY, N]],
    ['台幣直接支付合計', [sumTWDdirect, N]],
    [['總花費（換算台幣）', B], [total, NB]],
    [],
  ];
  const block = (title, entries) => {
    d2.push([[title, H], ['換算台幣', H], ['筆數', H]]);
    entries.forEach(([k, g]) => d2.push([k, [g.twd, N], [g.n, N]]));
    d2.push([['小計', B], [entries.reduce((s, [, g]) => s + g.twd, 0), NB], [entries.reduce((s, [, g]) => s + g.n, 0), NB]]);
    d2.push([]);
  };
  block('分類', group((e) => e.cat).sort((a, b) => b[1].twd - a[1].twd));
  block('付款方式', group((e) => e.pay).sort((a, b) => b[1].twd - a[1].twd));
  block('日期', group((e) => e.date).sort((a, b) => String(a[0]).localeCompare(String(b[0]))));

  const styles = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    + '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
    + '<numFmts count="2"><numFmt numFmtId="164" formatCode="#,##0"/><numFmt numFmtId="165" formatCode="0.0000"/></numFmts>'
    + '<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts>'
    + '<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>'
    + '<fill><patternFill patternType="solid"><fgColor rgb="FFF6E3E6"/><bgColor indexed="64"/></patternFill></fill></fills>'
    + '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>'
    + '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
    + '<cellXfs count="6">'
    + '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'
    + '<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/>'
    + '<xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>'
    + '<xf numFmtId="164" fontId="1" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1"/>'
    + '<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>'
    + '<xf numFmtId="165" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>'
    + '</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>';

  return {
    buffer: zip({
      '[Content_Types].xml': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
        + '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
        + '<Default Extension="xml" ContentType="application/xml"/>'
        + '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
        + '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
        + '<Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
        + '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'
        + '</Types>',
      '_rels/.rels': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        + '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'
        + '</Relationships>',
      'xl/workbook.xml': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        + '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
        + '<sheets><sheet name="明細" sheetId="1" r:id="rId1"/><sheet name="統計" sheetId="2" r:id="rId2"/></sheets>'
        + '<calcPr calcId="191029" fullCalcOnLoad="1"/></workbook>',
      'xl/_rels/workbook.xml.rels': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        + '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>'
        + '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/>'
        + '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'
        + '</Relationships>',
      'xl/styles.xml': styles,
      'xl/worksheets/sheet1.xml': sheet(d1, [12, 16, 10, 28, 12, 12, 9, 12, 13], true),
      'xl/worksheets/sheet2.xml': sheet(d2, [24, 14, 8], false),
    }),
    total, sumJPY, sumTWDdirect, count: rows.length, rate,
  };
}

const nf = (n) => Math.round(n).toLocaleString('en-US');
// 日本時間的今天，格式 2026-09-26
const tokyoDate = (d = new Date()) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);

// 信件內文：今天每一筆 + 今天小計 + 目前為止總花費 + 分類累計
export function buildMail(doc) {
  const rate = doc.rate || 0.21;
  const all = (doc.expenses || []).filter((e) => !e.deleted);
  const today = tokyoDate();
  const todays = all.filter((e) => e.date === today).sort((a, b) => (a.updatedAt || 0) - (b.updatedAt || 0));
  const todayTWD = todays.reduce((s, e) => s + toTWD(e, rate), 0);
  const total = all.reduce((s, e) => s + toTWD(e, rate), 0);
  const jpyTotal = all.filter((e) => e.currency === 'JPY').reduce((s, e) => s + e.amount, 0);

  const byCat = new Map();
  all.forEach((e) => byCat.set(e.cat, (byCat.get(e.cat) || 0) + toTWD(e, rate)));
  const cats = [...byCat.entries()].sort((a, b) => b[1] - a[1]);

  const line = (e) => {
    const orig = e.currency === 'JPY' ? `¥${nf(e.amount)}` : `NT$${nf(e.amount)}`;
    const conv = e.currency === 'JPY' ? `（NT$${nf(toTWD(e, rate))}）` : '';
    return `・${catLabel(e)}｜${e.note || '（沒寫說明）'}｜${orig}${conv}｜${e.pay}`;
  };

  const text = [
    `【${today} 的花費】`,
    todays.length ? todays.map(line).join('\n') : '（今天還沒有記帳）',
    '',
    `今天小計：NT$${nf(todayTWD)}`,
    '',
    '【目前為止總花費】',
    `NT$${nf(total)}　（共 ${all.length} 筆，其中日幣支出 ¥${nf(jpyTotal)}，匯率 1 円 = ${rate}）`,
    '',
    '【分類累計】',
    ...cats.map(([c, v]) => `・${c}：NT$${nf(v)}`),
    '',
    '附件 Excel 有「明細」和「統計」兩個分頁，每筆都列出日幣、台幣、匯率與換算結果。',
    '資料來自雲端共用房間；App 若沒有同步，這裡會是最後一次同步的內容。',
  ].join('\n');

  return { text, today, todays, todayTWD, total, count: all.length };
}

// 用 Resend 寄信（需要環境變數 RESEND_API_KEY）
export async function sendReport({ to, code, doc }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('伺服器還沒設定 RESEND_API_KEY');
  const { buffer, total, count, rate } = buildXlsx(doc);
  const mail = buildMail(doc);
  const today = new Date().toLocaleDateString('zh-TW', { timeZone: 'Asia/Tokyo' });
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: process.env.REPORT_FROM || 'onboarding@resend.dev',
      to: [to],
      subject: `關西旅費 ${today}｜今天 NT$${nf(mail.todayTWD)}・累計 NT$${nf(total)}`,
      text: mail.text + `\n\n共用代碼：${code}`,
      attachments: [{ filename: `關西旅費_${today.replace(/\//g, '-')}.xlsx`, content: buffer.toString('base64') }],
    }),
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`寄信失敗 ${res.status}：${body.slice(0, 200)}`);
  return { ok: true, count, total, today: mail.todayTWD, id: (() => { try { return JSON.parse(body).id; } catch { return ''; } })() };
}
