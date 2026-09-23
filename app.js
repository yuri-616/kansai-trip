(function () {
  'use strict';

  const STORE_KEY = 'kansai-trip-v1';
  // 細線圖示（跟著文字顏色走）
  const svg = (d) => `<svg viewBox="0 0 24 24" class="ico">${d}</svg>`;
  const ICON = {
    am: svg('<path d="M12 4.5v3M4.5 13H3M21 13h-1.5M6.4 7.4 5.3 6.3M17.6 7.4l1.1-1.1"/><path d="M8 13a4 4 0 0 1 8 0"/><path d="M3 17h18M6 20.5h12"/>'),
    lunch: svg('<path d="M4 11h16a8 8 0 0 1-16 0Z"/><path d="M2.5 20h19"/><path d="M9 7.5c0-1.2.8-1.8.8-3M13 7.5c0-1.2.8-1.8.8-3"/>'),
    pm: svg('<circle cx="12" cy="12" r="3.8"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4"/>'),
    dinner: svg('<path d="M7 3v7a2 2 0 0 0 4 0V3M9 12v9"/><path d="M17.5 3c-1.6 1-2.3 2.6-2.3 5s.8 3.2 2.3 3.2V21"/>'),
    night: svg('<path d="M20.5 14.8A8.6 8.6 0 0 1 9.2 3.5a8.6 8.6 0 1 0 11.3 11.3Z"/>'),
    hotel: svg('<path d="M2.5 19v-5a2 2 0 0 1 2-2h15a2 2 0 0 1 2 2v5"/><path d="M2.5 19h19M4.5 12V7.5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2V12"/><path d="M8 9.5h3.5M12.5 9.5H16"/>'),
    plus: svg('<path d="M12 5.5v13M5.5 12h13"/>'),
    pencil: svg('<path d="m4 20 4-1L19 8l-3-3L5 16l-1 4Z"/>'),
    cloud: svg('<path d="M7.5 18.5h9.5a3.8 3.8 0 0 0 .3-7.6 6 6 0 0 0-11.6 1.4 3.3 3.3 0 0 0 1.8 6.2Z"/>'),
    pin: svg('<path d="M12 21s6.5-6 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 15 12 21 12 21Z"/><circle cx="12" cy="10.3" r="2.3"/>'),
    link: svg('<path d="M10.5 13.2a3.8 3.8 0 0 0 5.6.4l2-2a3.8 3.8 0 0 0-5.4-5.4l-1 1"/><path d="M13.5 10.8a3.8 3.8 0 0 0-5.6-.4l-2 2a3.8 3.8 0 0 0 5.4 5.4l1-1"/>'),
    trash: svg('<path d="M4 7h16M9.5 7V4.8h5V7M6.5 7l.9 13h9.2l.9-13"/>'),
    check: svg('<path d="M4 12.5 9 17.5 20 6.5"/>'),
    search: svg('<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>'),
    share: svg('<path d="M12 15.5V4M8.5 7.5 12 4l3.5 3.5"/><path d="M5 14v5.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V14"/>'),
    import: svg('<path d="M12 4v11.5M8.5 12 12 15.5 15.5 12"/><path d="M5 14v5.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V14"/>'),
    sheet: svg('<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M9.5 9.5v10M3.5 14.5h17"/>'),
    reset: svg('<path d="M4.5 12a7.5 7.5 0 1 0 2.4-5.5"/><path d="M4 4.5v4h4"/>'),
    sound: svg('<path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1Z"/><path d="M15.5 9.5a3.5 3.5 0 0 1 0 5M18 7a7 7 0 0 1 0 10"/>'),
    left: svg('<path d="M14.5 5 8 12l6.5 7"/>'),
    right: svg('<path d="M9.5 5 16 12l-6.5 7"/>'),
    // 記帳分類
    餐飲: svg('<path d="M4 11h16a8 8 0 0 1-16 0Z"/><path d="M2.5 20h19"/><path d="M9 7.5c0-1.2.8-1.8.8-3M13 7.5c0-1.2.8-1.8.8-3"/>'),
    交通: svg('<rect x="5" y="3.5" width="14" height="13" rx="3"/><path d="M5 11h14M8 20l-1.5 1.5M16 20l1.5 1.5M7 16.5h10"/><circle cx="8.6" cy="13.8" r="1"/><circle cx="15.4" cy="13.8" r="1"/>'),
    門票: svg('<path d="M4 7.5h16v3a1.7 1.7 0 0 0 0 3.4v3H4v-3a1.7 1.7 0 0 0 0-3.4v-3Z"/><path d="M13 8.5v1.5M13 14v1.5"/>'),
    伴手禮: svg('<rect x="3.5" y="9" width="17" height="11" rx="1.6"/><path d="M3 9h18M12 9v11"/><path d="M12 9c-2.5 0-4.5-.8-4.5-2.4S9 4.5 12 9Zm0 0c2.5 0 4.5-.8 4.5-2.4S15 4.5 12 9Z"/>'),
    購物: svg('<path d="M5 8h14l1 12H4L5 8Z"/><path d="M8.5 8V6a3.5 3.5 0 0 1 7 0v2"/>'),
    藥妝: svg('<rect x="3" y="8.5" width="18" height="7" rx="3.5" transform="rotate(-38 12 12)"/><path d="M9.4 9.4 14.6 14.6"/>'),
    住宿: svg('<path d="M2.5 19v-5a2 2 0 0 1 2-2h15a2 2 0 0 1 2 2v5"/><path d="M2.5 19h19M4.5 12V7.5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2V12"/>'),
    其他: svg('<path d="M3.5 8 12 4l8.5 4v8L12 20l-8.5-4V8Z"/><path d="M3.5 8 12 12l8.5-4M12 12v8"/>'),
  };
  const SECTIONS = [
    ['am', '上午'], ['lunch', '午餐'], ['pm', '下午'],
    ['dinner', '晚餐'], ['night', '晚上'], ['hotel', '住宿'],
  ];
  const CATS = ['餐飲', '交通', '門票', '伴手禮', '購物', '藥妝', '住宿', '其他'];
  const PAYS = ['信用卡', '現金', '西瓜卡'];
  const WEEK = ['日', '一', '二', '三', '四', '五', '六'];

  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const catIcon = (c) => ICON[c] || ICON['其他'];
  const fmt = (n) => Math.round(n).toLocaleString('en-US');
  const todayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const dayLabel = (date) => {
    const d = new Date(date + 'T00:00:00');
    return { md: `${d.getMonth() + 1}/${d.getDate()}`, wk: WEEK[d.getDay()] };
  };

  // ---------- 資料 ----------
  let state = load();
  let ui = { view: 'trip', dayIdx: pickToday(), moneyBy: 'cat' };
  setTimeout(() => save(), 0); // 第一次打開就存檔，之後才認得出是哪個版本的資料

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s && Array.isArray(s.days)) return mergeSeed(normalize(s));
      }
    } catch (e) { /* 讀不到就用初始資料 */ }
    return normalize(clone(window.SEED));
  }
  // 手機裡已經有資料時，把「初始清單」後來新增的項目補進去（不動使用者自己改的）
  function mergeSeed(s) {
    const seed = window.SEED;
    if (!seed || s.seedVersion === window.SEED_VERSION) return s;
    const have = new Set((s.checklist || []).map((x) => x.text));
    let added = 0;
    seed.checklist.forEach((x) => {
      if (!have.has(x.text)) { s.checklist.push(Object.assign({}, x, { id: uid() })); added++; }
    });
    s.seedVersion = window.SEED_VERSION;
    try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch (e) { /* 存不了就下次再補 */ }
    if (added) setTimeout(() => toast(`清單補上 ${added} 個新項目`), 400);
    return s;
  }
  // 舊資料升級：ICOCA 改名西瓜卡、拿掉照片欄位、金額一律整數
  function normalize(s) {
    s.expenses = (s.expenses || []).map((e) => {
      const x = Object.assign({}, e);
      if (x.pay === 'ICOCA') x.pay = '西瓜卡';
      if (!PAYS.includes(x.pay)) x.pay = '現金';
      x.amount = Math.round(Number(x.amount) || 0);
      x.other = x.cat === '其他' ? (x.other || '') : '';
      if (!(x.currency === 'JPY' && Number.isInteger(x.twd) && x.twd > 0)) delete x.twd;
      delete x.photoId;
      return x;
    });
    return s;
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
    catch (e) { toast('儲存失敗：手機空間可能不足'); }
  }
  function pickToday() {
    const t = todayStr();
    const i = state.days.findIndex((d) => d.date === t);
    if (i >= 0) return i;
    return t > state.days[state.days.length - 1].date ? state.days.length - 1 : 0;
  }
  // 金額計算規則（App 畫面與 Excel 共用，保證兩邊數字一致）：
  // 每筆先換成台幣並四捨五入到整數，總計 = 各筆整數相加
  // toFixed(6) 先消掉浮點誤差，避免 1250 × 0.21 = 262.4999… 被捨成 262
  const roundHalfUp = (n) => Math.round(Number(n.toFixed(6)));
  // 日幣記帳如果有「手動台幣金額」（e.twd，例如刷卡帳單的實際金額），就用它，不套匯率
  const isManual = (e) => e.currency === 'JPY' && Number.isInteger(e.twd) && e.twd > 0;
  const autoTWD = (e) => roundHalfUp(e.amount * state.rate);
  const toTWD = (e) => (e.currency === 'TWD' ? e.amount : isManual(e) ? e.twd : autoTWD(e));
  const toJPY = (e) => (e.currency === 'JPY' ? e.amount : roundHalfUp(e.amount / state.rate));
  // 金額欄只收整數：全形轉半形；小數點後捨去（避免 12.5 被讀成 125）；逗號等其他字元去掉
  const parseAmt = (str) => {
    const s = String(str).replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0))
      .split(/[.．]/)[0].replace(/\D/g, '');
    return s ? parseInt(s, 10) : 0;
  };
  const catLabel = (e) => (e.cat === '其他' && e.other ? `其他：${e.other}` : e.cat);

  // ---------- 提示與復原 ----------
  let toastTimer = null;
  let undoFn = null;
  function toast(msg, onUndo, onExpire) {
    const el = $('#toast');
    if (undoFn && undoFn.expire) undoFn.expire();
    clearTimeout(toastTimer);
    undoFn = onUndo ? { undo: onUndo, expire: onExpire } : null;
    el.innerHTML = `<span>${esc(msg)}</span>${onUndo ? '<button id="undoBtn">復原</button>' : ''}`;
    el.hidden = false;
    if (onUndo) {
      $('#undoBtn').onclick = () => {
        const u = undoFn; undoFn = null;
        el.hidden = true; clearTimeout(toastTimer);
        u.undo();
      };
    }
    toastTimer = setTimeout(() => {
      el.hidden = true;
      if (undoFn && undoFn.expire) undoFn.expire();
      undoFn = null;
    }, onUndo ? 6000 : 2500);
  }
  // 刪除前先拍快照，按「復原」就整份還原
  function removeWithUndo(label, mutate, onExpire) {
    const snap = clone(state);
    mutate();
    save(); render();
    toast(`已刪除「${label}」`, () => { state = snap; save(); render(); toast('已復原'); }, onExpire);
  }

  // ---------- 底部面板 ----------
  function openSheet(html, bind) {
    const sh = $('#sheet');
    sh.innerHTML = `<div class="grab"></div>${html}`;
    sh.hidden = false; $('#sheetBackdrop').hidden = false;
    document.body.style.overflow = 'hidden';
    if (bind) bind(sh);
  }
  function closeSheet() {
    $('#sheet').hidden = true; $('#sheetBackdrop').hidden = true;
    document.body.style.overflow = '';
  }
  $('#sheetBackdrop').onclick = closeSheet;

  // 可橫向滑動的列：左右箭頭，滑到底時箭頭自動隱藏
  const scroller = (inner, cls) => `<div class="scroller ${cls}">
    <button class="scroll-btn left" data-scroll="-1" aria-label="往左" hidden>${ICON.left}</button>
    ${inner}
    <button class="scroll-btn right" data-scroll="1" aria-label="往右" hidden>${ICON.right}</button>
  </div>`;
  function initScrollers(root) {
    root.querySelectorAll('.scroller').forEach((sc) => {
      const row = sc.querySelector('.scroll-row');
      const L = sc.querySelector('.scroll-btn.left');
      const R = sc.querySelector('.scroll-btn.right');
      const update = () => {
        const more = row.scrollWidth - row.clientWidth;
        L.hidden = row.scrollLeft <= 2;
        R.hidden = more <= 2 || row.scrollLeft >= more - 2;
      };
      sc.querySelectorAll('[data-scroll]').forEach((b) => (b.onclick = () => {
        row.scrollBy({ left: +b.dataset.scroll * row.clientWidth * 0.7, behavior: 'smooth' });
        setTimeout(update, 400);
      }));
      row.addEventListener('scroll', update, { passive: true });
      update();
      setTimeout(update, 60); // 等字體載完寬度才準
    });
  }

  function chipGroup(sh, name, onPick) {
    sh.querySelectorAll(`[data-chip="${name}"] button`).forEach((b) => {
      b.onclick = () => {
        sh.querySelectorAll(`[data-chip="${name}"] button`).forEach((x) => x.classList.remove('active'));
        b.classList.add('active');
        onPick(b.dataset.v);
      };
    });
  }

  // ---------- 行程 ----------
  function renderTrip() {
    const el = $('#view-trip');
    const d = state.days[ui.dayIdx];
    const t = todayStr();
    const chips = state.days.map((x, i) => {
      const l = dayLabel(x.date);
      return `<button class="day-chip${i === ui.dayIdx ? ' active' : ''}${x.date === t ? ' today' : ''}" data-day="${i}">
        <small>${l.wk}</small><b>${l.md}</b><i class="dot"></i></button>`;
    }).join('');
    const l = dayLabel(d.date);
    const weather = `https://www.google.com/search?q=${encodeURIComponent(d.city + ' 天氣')}`;
    const secs = SECTIONS.map(([k, name]) => {
      const items = d.sections[k] || [];
      const rows = items.map((it, i) => `
        <div class="item${it.star ? ' star' : ''}" data-edit="${k}:${i}">
          <div class="body">
            ${it.star ? '<span class="badge">建議</span>' : ''}${it.time ? `<span class="time">${esc(it.time)}</span>` : ''}${esc(it.text)}
            ${it.note ? `<div class="note">${esc(it.note)}</div>` : ''}
          </div>
          ${it.link ? `<a class="icon-btn" href="${esc(it.link)}" target="_blank" rel="noopener" aria-label="開啟連結">${ICON.link}</a>` : ''}
          ${it.place ? `<a class="icon-btn" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(it.place)}" target="_blank" rel="noopener" aria-label="地圖">${ICON.pin}</a>` : ''}
        </div>`).join('');
      return `<section class="sec">
        <div class="sec-head"><span class="sec-name">${ICON[k]}${name}</span>
          <button class="add" data-add="${k}" aria-label="新增${name}">${ICON.plus}</button></div>
        <div class="card${items.length ? '' : ' hollow'}">${rows || `<button class="add-block" data-add="${k}">${ICON.plus}新增${name}</button>`}</div>
      </section>`;
    }).join('');
    el.innerHTML = `
      ${scroller(`<div class="days scroll-row">${chips}</div>`, 'days-wrap')}
      <div class="day-head">
        <div class="t">
          <div class="eyebrow">DAY ${ui.dayIdx + 1}　${d.date.replace(/-/g, '/')}（${l.wk}）</div>
          <h2>${esc(d.title)}</h2>
          <div class="meta">${ICON.pin}${esc(d.city)}</div>
        </div>
        <div class="day-acts">
          <button class="pill" id="editDay" aria-label="編輯這天">${ICON.pencil}</button>
          <a class="pill" href="${weather}" target="_blank" rel="noopener">${ICON.cloud}天氣</a>
        </div>
      </div>
      ${secs}
      <p class="foot-note">行程與時間可自由調整・餐廳請自行確認營業與預約<br>
        <span class="ok">${ICON.check}資料保存在這支手機</span></p>`;

    el.querySelectorAll('[data-day]').forEach((b) => (b.onclick = () => { ui.dayIdx = +b.dataset.day; render(); window.scrollTo(0, 0); }));
    el.querySelectorAll('[data-add]').forEach((b) => (b.onclick = () => editItem(b.dataset.add, -1)));
    el.querySelectorAll('[data-edit]').forEach((row) => (row.onclick = (ev) => {
      if (ev.target.closest('a')) return; // 點地圖、連結不開編輯
      const [k, i] = row.dataset.edit.split(':');
      editItem(k, +i);
    }));
    $('#editDay').onclick = editDay;
    const act = el.querySelector('.day-chip.active');
    if (act) act.scrollIntoView({ inline: 'center', block: 'nearest' });
    initScrollers(el);
  }

  function editDay() {
    const d = state.days[ui.dayIdx];
    openSheet(`
      <h3>編輯 Day ${ui.dayIdx + 1}</h3>
      <div class="field"><label>今天的主題</label><input id="f-title" value="${esc(d.title)}"></div>
      <div class="field"><label>城市（天氣按鈕用這個查詢）</label><input id="f-city" value="${esc(d.city)}"></div>
      <div class="sheet-actions"><button class="btn" id="f-cancel">取消</button><button class="btn primary" id="f-save">儲存</button></div>`,
    (sh) => {
      $('#f-cancel', sh).onclick = closeSheet;
      $('#f-save', sh).onclick = () => {
        d.title = $('#f-title', sh).value.trim() || d.title;
        d.city = $('#f-city', sh).value.trim() || d.city;
        save(); closeSheet(); render(); toast('已儲存');
      };
    });
  }

  function editItem(sec, idx) {
    const d = state.days[ui.dayIdx];
    const list = d.sections[sec] || (d.sections[sec] = []);
    const isNew = idx < 0;
    const it = isNew ? { id: uid(), time: '', text: '', place: '', note: '', link: '', star: false } : list[idx];
    const secOpts = SECTIONS.map(([k, n]) => `<option value="${k}"${k === sec ? ' selected' : ''}>${n}</option>`).join('');
    openSheet(`
      <h3>${isNew ? '新增' : '編輯'}行程</h3>
      <div class="field"><label>內容</label><input id="f-text" value="${esc(it.text)}" placeholder="例如：清水寺"></div>
      <div class="row2">
        <div class="field"><label>時間（可空白）</label><input id="f-time" type="time" value="${esc(it.time)}"></div>
        <div class="field"><label>時段</label><select id="f-sec">${secOpts}</select></div>
      </div>
      <div class="field">
        <label>地點</label>
        <input id="f-place" value="${esc(it.place)}" placeholder="例如：金閣寺、Hotel Universal Port">
        <div class="hint">填了名稱就會出現 ${ICON.pin} 按鈕，點了直接用這個名稱開 Google Maps
          <button type="button" class="link-btn" id="f-useText">${ICON.pin}用上面的內容當地點</button></div>
      </div>
      <div class="field"><label>備註</label><textarea id="f-note">${esc(it.note)}</textarea></div>
      <div class="field"><label>連結（可空白）</label><input id="f-link" type="url" value="${esc(it.link)}" placeholder="https://"></div>
      ${isNew ? '' : `<div class="field"><label>在這個時段裡的順序</label>
        <div class="move"><button class="btn" id="f-up">↑ 往前</button><button class="btn" id="f-down">↓ 往後</button></div></div>`}
      <div class="sheet-actions">
        ${isNew ? '<button class="btn" id="f-cancel">取消</button>' : `<button class="btn danger" id="f-del">${ICON.trash}刪除</button>`}
        <button class="btn primary" id="f-save">儲存</button>
      </div>`,
    (sh) => {
      if (isNew) $('#f-cancel', sh).onclick = closeSheet;
      else {
        $('#f-del', sh).onclick = () => {
          closeSheet();
          removeWithUndo(it.text || '行程', () => list.splice(idx, 1));
        };
        const move = (dir) => {
          const j = idx + dir;
          if (j < 0 || j >= list.length) return;
          [list[idx], list[j]] = [list[j], list[idx]];
          save(); closeSheet(); render();
        };
        $('#f-up', sh).onclick = () => move(-1);
        $('#f-down', sh).onclick = () => move(1);
      }
      // 懶人鍵：直接把「內容」當成地點
      $('#f-useText', sh).onclick = () => {
        const v = $('#f-text', sh).value.trim();
        if (!v) { $('#f-text', sh).focus(); return; }
        $('#f-place', sh).value = v;
      };
      $('#f-save', sh).onclick = () => {
        const text = $('#f-text', sh).value.trim();
        if (!text) { $('#f-text', sh).focus(); return; }
        const next = Object.assign({}, it, {
          text,
          time: $('#f-time', sh).value,
          place: $('#f-place', sh).value.trim(),
          note: $('#f-note', sh).value.trim(),
          link: $('#f-link', sh).value.trim(),
        });
        const newSec = $('#f-sec', sh).value;
        if (!isNew) list.splice(idx, 1);
        const target = d.sections[newSec] || (d.sections[newSec] = []);
        if (!isNew && newSec === sec) target.splice(idx, 0, next);
        else target.push(next);
        save(); closeSheet(); render(); toast('已儲存');
      };
      if (isNew) setTimeout(() => $('#f-text', sh).focus(), 50);
    });
  }

  // 左右滑動切換天
  (function swipe() {
    let x0 = null, y0 = null;
    const el = $('#view-trip');
    el.addEventListener('touchstart', (e) => {
      if (e.target.closest('.days')) { x0 = null; return; }
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
    }, { passive: true });
    el.addEventListener('touchend', (e) => {
      if (x0 == null) return;
      const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      x0 = null;
      if (Math.abs(dx) < 70 || Math.abs(dy) > Math.abs(dx) * 0.6) return;
      const n = ui.dayIdx + (dx < 0 ? 1 : -1);
      if (n >= 0 && n < state.days.length) { ui.dayIdx = n; render(); window.scrollTo(0, 0); }
    }, { passive: true });
  })();

  // ---------- 記帳 ----------
  function renderMoney() {
    const el = $('#view-money');
    const ex = state.expenses;
    const twd = ex.reduce((s, e) => s + toTWD(e), 0);
    const jpy = ex.reduce((s, e) => s + toJPY(e), 0);

    const keyOf = { cat: (e) => e.cat, pay: (e) => e.pay, day: (e) => e.date };
    const groups = {};
    ex.forEach((e) => { const k = keyOf[ui.moneyBy](e); groups[k] = (groups[k] || 0) + toTWD(e); });
    let keys = Object.keys(groups);
    keys = ui.moneyBy === 'day' ? keys.sort() : keys.sort((a, b) => groups[b] - groups[a]);
    const max = Math.max(1, ...keys.map((k) => groups[k]));
    const label = (k) => {
      if (ui.moneyBy === 'cat') return `${catIcon(k)} ${esc(k)}`;
      if (ui.moneyBy === 'day') { const l = dayLabel(k); return `${l.md}（${l.wk}）`; }
      return esc(k);
    };
    const bars = keys.map((k) => `<div class="bar-row"><span>${label(k)}</span><div class="bar"><i style="width:${(groups[k] / max) * 100}%"></i></div><span class="num">NT$${fmt(groups[k])}</span></div>`).join('');

    const byDate = {};
    ex.forEach((e, i) => (byDate[e.date] = byDate[e.date] || []).push(i));
    const dates = Object.keys(byDate).sort().reverse();
    const list = dates.map((dt) => {
      const l = dayLabel(dt);
      const sum = byDate[dt].reduce((s, i) => s + toTWD(ex[i]), 0);
      const rows = byDate[dt].slice().reverse().map((i) => {
        const e = ex[i];
        const main = e.currency === 'JPY' ? `¥${fmt(e.amount)}` : `NT$${fmt(e.amount)}`;
        const alt = e.currency === 'TWD' ? `≈ ¥${fmt(toJPY(e))}`
          : isManual(e) ? `NT$${fmt(e.twd)}<span class="tag">手動</span>` : `≈ NT$${fmt(toTWD(e))}`;
        return `<div class="exp" data-exp="${i}">
          <span class="cat-ico">${catIcon(e.cat)}</span>
          <div class="body"><div>${esc(e.note || catLabel(e))}</div><div class="sub2">${esc(catLabel(e))}・${esc(e.pay)}</div></div>
          <div class="amt">${main}<small>${alt}</small></div>
        </div>`;
      }).join('');
      return `<section class="sec">
        <div class="sec-head"><span class="sec-name">${l.md}（${l.wk}）<small>NT$${fmt(sum)}</small></span></div>
        <div class="card">${rows}</div></section>`;
    }).join('');

    el.innerHTML = `
      <div class="view-head">
        <div class="eyebrow">TOTAL　共 ${ex.length} 筆</div>
        <h2 class="big">NT$${fmt(twd)}</h2>
        <div class="meta">≈ ¥${fmt(jpy)}・匯率 1 円 = ${state.rate} 台幣</div>
      </div>
      <section class="sec">
        <div class="sec-head"><span class="sec-name">${ICON.sheet}統計</span></div>
        <div class="seg" id="moneyBy">
          <button data-by="cat" class="${ui.moneyBy === 'cat' ? 'active' : ''}">依分類</button>
          <button data-by="pay" class="${ui.moneyBy === 'pay' ? 'active' : ''}">依付款</button>
          <button data-by="day" class="${ui.moneyBy === 'day' ? 'active' : ''}">依天數</button>
        </div>
        <div class="card" style="padding:8px 0">${bars || '<div class="empty" style="padding:8px 16px">還沒有記帳</div>'}</div>
      </section>
      ${list || ''}`;

    el.querySelectorAll('[data-by]').forEach((b) => (b.onclick = () => { ui.moneyBy = b.dataset.by; render(); }));
    el.querySelectorAll('[data-exp]').forEach((r) => (r.onclick = () => editExpense(+r.dataset.exp)));
  }

  function editExpense(idx) {
    const isNew = idx < 0;
    const t = todayStr();
    const e = isNew
      ? { id: uid(), date: t, amount: '', currency: 'JPY', cat: '餐飲', other: '', pay: '信用卡', note: '' }
      : clone(state.expenses[idx]);
    const chips = (name, arr, cur) => `<div class="chips" data-chip="${name}">${arr.map((v) => {
      const ico = name === 'cat' ? catIcon(v) : '';
      return `<button type="button" data-v="${esc(v)}" class="${v === cur ? 'active' : ''}">${ico}${esc(v)}</button>`;
    }).join('')}</div>`;

    openSheet(`
      <h3>${isNew ? '記一筆' : '編輯記帳'}</h3>
      <div class="field"><label>金額</label>
        <div class="amount-wrap">
          <input id="f-amt" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" value="${esc(e.amount)}" placeholder="0">
          <div class="seg" data-chip="cur">
            <button type="button" data-v="JPY" class="${e.currency === 'JPY' ? 'active' : ''}">¥</button>
            <button type="button" data-v="TWD" class="${e.currency === 'TWD' ? 'active' : ''}">NT$</button>
          </div>
        </div>
        <div class="twd-box">
          <div class="line"><span id="f-convlabel"></span><b id="f-conv"></b></div>
          <div id="f-manualwrap">
            <button type="button" class="link-btn" id="f-twdtoggle"></button>
            <input id="f-twd" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" placeholder="刷卡帳單或實際換匯的台幣金額" hidden>
          </div>
        </div>
      </div>
      <div class="field"><label>分類</label>${chips('cat', CATS, e.cat)}</div>
      <div class="field" id="f-other-wrap"${e.cat === '其他' ? '' : ' hidden'}><label>其他是什麼？</label><input id="f-other" value="${esc(e.other)}" placeholder="例如：寄物櫃、洗衣、置物"></div>
      <div class="field"><label>付款方式</label>${chips('pay', PAYS, e.pay)}</div>
      <div class="field"><label>日期</label><input id="f-date" type="date" value="${esc(e.date)}"></div>
      <div class="field"><label>備註（店名、買了什麼）</label><input id="f-note" value="${esc(e.note)}" placeholder="例如：一蘭拉麵"></div>
      <div class="sheet-actions">
        ${isNew ? '<button class="btn" id="f-cancel">取消</button>' : `<button class="btn danger" id="f-del">${ICON.trash}刪除</button>`}
        <button class="btn primary" id="f-save">儲存</button>
      </div>`,
    (sh) => {
      const amtEl = $('#f-amt', sh);
      const twdEl = $('#f-twd', sh);
      let manual = isManual(e);
      if (manual) twdEl.value = e.twd;
      const readAmt = () => parseAmt(amtEl.value);
      const intOnly = (el) => { const a = parseAmt(el.value); const v = a ? String(a) : ''; if (el.value !== v) el.value = v; };
      // 換算區：日幣 → 顯示自動換算，可切換成自己填台幣；台幣 → 只顯示約合日幣
      const conv = () => {
        const a = readAmt();
        const jpy = e.currency === 'JPY';
        $('#f-manualwrap', sh).hidden = !jpy;
        twdEl.hidden = !(jpy && manual);
        $('#f-twdtoggle', sh).innerHTML = manual ? `${ICON.reset}改回自動換算` : `${ICON.pencil}自己填台幣金額（依實際匯率）`;
        if (!jpy) {
          $('#f-convlabel', sh).textContent = '約合日幣';
          $('#f-conv', sh).textContent = a ? `¥${fmt(toJPY({ amount: a, currency: 'TWD' }))}` : '—';
        } else if (manual) {
          $('#f-convlabel', sh).textContent = '台幣（手動輸入）';
          const m = parseAmt(twdEl.value);
          $('#f-conv', sh).textContent = m ? `NT$${fmt(m)}` : '請在下面輸入';
        } else {
          $('#f-convlabel', sh).textContent = `自動換算（1 円 = ${state.rate}）`;
          $('#f-conv', sh).textContent = a ? `NT$${fmt(autoTWD({ amount: a }))}` : '—';
        }
      };
      amtEl.oninput = () => { intOnly(amtEl); conv(); };
      twdEl.oninput = () => { intOnly(twdEl); conv(); };
      $('#f-twdtoggle', sh).onclick = () => {
        manual = !manual;
        // 打開手動時先帶入自動換算的值，改幾個數字就好
        if (manual && !twdEl.value && readAmt()) twdEl.value = autoTWD({ amount: readAmt() });
        conv();
        if (manual) setTimeout(() => twdEl.focus(), 30);
      };
      conv();
      chipGroup(sh, 'cur', (v) => { e.currency = v; conv(); });
      chipGroup(sh, 'cat', (v) => {
        e.cat = v;
        $('#f-other-wrap', sh).hidden = v !== '其他';
        if (v === '其他') setTimeout(() => $('#f-other', sh).focus(), 30);
      });
      chipGroup(sh, 'pay', (v) => (e.pay = v));

      if (isNew) {
        $('#f-cancel', sh).onclick = closeSheet;
        setTimeout(() => amtEl.focus(), 50);
      } else {
        $('#f-del', sh).onclick = () => {
          const old = state.expenses[idx];
          closeSheet();
          removeWithUndo(old.note || catLabel(old), () => state.expenses.splice(idx, 1));
        };
      }
      $('#f-save', sh).onclick = () => {
        const amt = readAmt();
        if (!(amt > 0)) { amtEl.focus(); toast('請輸入金額'); return; }
        const other = $('#f-other', sh).value.trim();
        if (e.cat === '其他' && !other) { $('#f-other', sh).focus(); toast('請輸入「其他」是什麼'); return; }
        if (e.currency === 'JPY' && manual) {
          const m = parseAmt(twdEl.value);
          if (!(m > 0)) { twdEl.focus(); toast('請輸入台幣金額，或改回自動換算'); return; }
          e.twd = m;
        } else delete e.twd;
        e.amount = amt;
        e.other = e.cat === '其他' ? other : '';
        e.date = $('#f-date', sh).value || t;
        e.note = $('#f-note', sh).value.trim();
        if (isNew) state.expenses.push(e); else state.expenses[idx] = e;
        save(); closeSheet(); render(); toast('已記帳');
      };
    });
  }

  // ---------- 清單 ----------
  function renderList() {
    const el = $('#view-list');
    const cl = state.checklist;
    const done = cl.filter((x) => x.done).length;
    const cats = [...new Set(cl.map((x) => x.cat))];
    const groups = cats.map((cat) => {
      const rows = cl.map((x, i) => [x, i]).filter(([x]) => x.cat === cat).map(([x, i]) => `
        <label class="chk${x.done ? ' done' : ''}${x.important ? ' important' : ''}">
          <input type="checkbox" data-chk="${i}"${x.done ? ' checked' : ''}>
          <span class="txt">${esc(x.text)}</span>
          <button class="icon-btn" data-edit-chk="${i}" aria-label="編輯">${ICON.pencil}</button>
        </label>`).join('');
      const n = cl.filter((x) => x.cat === cat);
      return `<section class="sec">
        <div class="sec-head">
          <span class="sec-name">${esc(cat)}<small>${n.filter((x) => x.done).length}/${n.length}</small></span>
          <button class="add" data-add-chk="${esc(cat)}" aria-label="新增">${ICON.plus}</button>
        </div>
        <div class="card">${rows}</div></section>`;
    }).join('');
    el.innerHTML = `
      <div class="view-head">
        <div class="eyebrow">CHECKLIST　紅字＝最重要</div>
        <h2 class="big">${done} / ${cl.length}</h2>
        <div class="progress"><i style="width:${cl.length ? (done / cl.length) * 100 : 0}%"></i></div>
      </div>
      ${groups}
      <button class="btn" id="addCat">${ICON.plus}新增類別</button>`;

    el.querySelectorAll('[data-chk]').forEach((c) => (c.onchange = () => { cl[+c.dataset.chk].done = c.checked; save(); render(); }));
    el.querySelectorAll('[data-edit-chk]').forEach((b) => (b.onclick = (ev) => { ev.preventDefault(); editCheck(+b.dataset.editChk); }));
    el.querySelectorAll('[data-add-chk]').forEach((b) => (b.onclick = () => editCheck(-1, b.dataset.addChk)));
    $('#addCat').onclick = () => editCheck(-1, '');
  }

  function editCheck(idx, cat) {
    const isNew = idx < 0;
    const x = isNew ? { id: uid(), cat: cat || '', text: '', done: false, important: false } : clone(state.checklist[idx]);
    const cats = [...new Set(state.checklist.map((c) => c.cat))];
    openSheet(`
      <h3>${isNew ? '新增項目' : '編輯項目'}</h3>
      <div class="field"><label>項目</label><input id="f-text" value="${esc(x.text)}" placeholder="例如：暖暖包"></div>
      <div class="field"><label>類別（可以直接打新的類別）</label><input id="f-cat" list="catList" value="${esc(x.cat)}">
        <datalist id="catList">${cats.map((c) => `<option value="${esc(c)}">`).join('')}</datalist></div>
      <div class="field check-line"><input id="f-imp" type="checkbox"${x.important ? ' checked' : ''}><label for="f-imp" style="margin:0;color:var(--text)">標成重要（紅字）</label></div>
      <div class="sheet-actions">
        ${isNew ? '<button class="btn" id="f-cancel">取消</button>' : `<button class="btn danger" id="f-del">${ICON.trash}刪除</button>`}
        <button class="btn primary" id="f-save">儲存</button>
      </div>`,
    (sh) => {
      if (isNew) $('#f-cancel', sh).onclick = closeSheet;
      else $('#f-del', sh).onclick = () => { closeSheet(); removeWithUndo(x.text, () => state.checklist.splice(idx, 1)); };
      $('#f-save', sh).onclick = () => {
        const text = $('#f-text', sh).value.trim();
        if (!text) { $('#f-text', sh).focus(); return; }
        x.text = text;
        x.cat = $('#f-cat', sh).value.trim() || '其他';
        x.important = $('#f-imp', sh).checked;
        if (isNew) state.checklist.push(x); else state.checklist[idx] = x;
        save(); closeSheet(); render(); toast('已儲存');
      };
      setTimeout(() => $('#f-text', sh).focus(), 50);
    });
  }

  // ---------- 日語 ----------
  // 朗讀日文（iPhone Safari、Android Chrome 都內建）
  function speak(text) {
    if (!('speechSynthesis' in window)) { toast('這支手機不支援朗讀'); return; }
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ja-JP';
      u.rate = 0.85; // 慢一點，方便對方聽懂
      const v = (speechSynthesis.getVoices() || []).find((x) => /^ja/i.test(x.lang));
      if (v) u.voice = v;
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    } catch (e) { toast('朗讀失敗：' + e.message); }
  }
  if ('speechSynthesis' in window) speechSynthesis.getVoices(); // 先喚醒語音清單

  function renderJp() {
    const el = $('#view-jp');
    const q = (ui.jpQ || '').trim().toLowerCase();
    const all = window.PHRASES || [];
    const cat = ui.jpCat && all.some((g) => g.cat === ui.jpCat) ? ui.jpCat : '';
    let n = 0;
    const tabs = scroller(`<div class="jp-cats scroll-row"><button class="jp-cat${cat ? '' : ' active'}" data-cat="">全部</button>${
      all.map((g) => `<button class="jp-cat${cat === g.cat ? ' active' : ''}" data-cat="${esc(g.cat)}">${esc(g.cat)}</button>`).join('')}</div>`, 'cats-wrap');
    const groups = all.filter((g) => !cat || g.cat === cat).map((g) => {
      const items = g.items.filter((p) => !q || (p.tw + p.jp + p.rm + p.note).toLowerCase().includes(q));
      if (!items.length) return '';
      n += items.length;
      return `<section class="sec">
        <div class="sec-head"><span class="sec-name">${esc(g.cat)}</span></div>
        <div class="card${g.star ? ' star-card' : ''}">
        ${items.map((p) => `<div class="phrase" data-jp="${esc(p.jp)}" data-tw="${esc(p.tw)}" data-rm="${esc(p.rm)}">
          <div class="p-body">
            <div class="tw">${esc(p.tw)}</div>
            <div class="jp">${esc(p.jp)}</div>
            <div class="rm">${esc(p.rm)}</div>
            ${p.note ? `<div class="note">${esc(p.note)}</div>` : ''}
          </div>
          <button class="icon-btn say" data-say="${esc(p.jp)}" aria-label="朗讀">${ICON.sound}</button>
        </div>`).join('')}
      </div></section>`;
    }).join('');
    el.innerHTML = `
      <div class="view-head">
        <div class="eyebrow">JAPANESE　${n} 句</div>
        <h2>旅遊日語</h2>
        <div class="meta">點句子 → 放大給店員看；點 ${ICON.sound} 唸出來</div>
      </div>
      <div class="field search-field"><input id="jpSearch" type="search" placeholder="搜尋：素、廁所、多少錢…" value="${esc(ui.jpQ || '')}"></div>
      ${tabs}
      ${groups || '<div class="card"><div class="empty" style="padding:16px">找不到，換個字試試</div></div>'}`;

    const s = $('#jpSearch', el);
    s.oninput = () => {
      ui.jpQ = s.value;
      const pos = s.selectionStart;
      renderJp();
      const s2 = $('#jpSearch');
      s2.focus(); s2.setSelectionRange(pos, pos);
    };
    el.querySelectorAll('.jp-cat').forEach((b) => (b.onclick = () => {
      ui.jpCat = b.dataset.cat;
      renderJp();
      window.scrollTo(0, 0);
    }));
    initScrollers(el);
    const act = el.querySelector('.jp-cat.active');
    if (act && cat) act.scrollIntoView({ inline: 'center', block: 'nearest' });
    el.querySelectorAll('.phrase').forEach((p) => (p.onclick = (ev) => {
      const say = ev.target.closest('[data-say]');
      if (say) { speak(say.dataset.say); return; }
      showCard(p.dataset.jp, p.dataset.tw, p.dataset.rm);
    }));
  }

  // 大字卡：拿給日本人看
  function showCard(jp, tw, rm) {
    const v = $('#cardView');
    v.innerHTML = `<div class="card-inner">
      <div class="card-jp">${esc(jp)}</div>
      <div class="card-tw">${esc(tw)}</div>
      <div class="card-rm">${esc(rm)}</div>
      <button class="btn primary" id="cardSay">${ICON.sound}唸出來</button>
      <button class="btn" id="cardClose">關閉</button>
    </div>`;
    v.hidden = false;
    $('#cardSay', v).onclick = () => speak(jp);
    $('#cardClose', v).onclick = () => (v.hidden = true);
    v.onclick = (ev) => { if (ev.target === v) v.hidden = true; };
  }

  // ---------- 設定 ----------
  function renderSettings() {
    const el = $('#view-settings');
    el.innerHTML = `
      <div class="view-head">
        <div class="eyebrow">SETTINGS</div>
        <h2>設定</h2>
        <div class="meta">匯率、備份、分享給旅伴</div>
      </div>
      <section class="sec">
        <div class="sec-head"><span class="sec-name">匯率</span></div>
        <div class="card"><div class="set-row">
          <div class="field" style="margin:0"><label>1 日圓 = ? 台幣</label>
            <input id="s-rate" type="number" inputmode="decimal" step="0.001" min="0" value="${state.rate}"></div>
          <p>換好日幣後，照你實際換到的匯率改，所有換算會跟著更新。單筆想用別的金額，在記帳裡按「自己填台幣金額」。</p>
        </div></div>
      </section>
      <section class="sec">
      <div class="sec-head"><span class="sec-name">分享給旅伴 / 備份</span></div>
      <div class="card"><div class="set-row">
        <button class="btn primary" id="s-link">${ICON.link}產生分享連結給旅伴</button>
        <button class="btn" id="s-export">${ICON.share}匯出行程與記帳（JSON）</button>
        <label class="btn">${ICON.import}匯入 JSON<input id="s-import" type="file" accept="application/json,.json" hidden></label>
        <button class="btn" id="s-xlsx">${ICON.sheet}匯出記帳 Excel</button>
        <p>分享連結最方便：旅伴點開就會問要不要匯入你的行程與清單（他的記帳不受影響）。你之後改了行程，要再傳一次新連結。<br>
        Excel 有兩個分頁：「明細」每筆都列出日幣、台幣、匯率與換算結果；「統計」依分類、付款方式、日期加總。</p>
      </div></div>
      </section>
      <section class="sec">
      <div class="sec-head"><span class="sec-name">其他</span></div>
      <div class="card"><div class="set-row">
        <button class="btn" id="s-refresh">${ICON.reset}更新行程內容（保留記帳與清單）</button>
        <button class="btn danger" id="s-reset">重設全部（會清掉所有修改與記帳）</button>
        <p>行程、清單、記帳都存在這支手機。清單如果有新項目，App 會自動幫你補上；行程要拿到新版本，就按上面的「更新行程內容」。<br>
        加到主畫面：iPhone 用 Safari 按「分享 → 加入主畫面」；Android 用 Chrome 按「⋮ → 加到主畫面」。</p>
      </div></div>
      </section>`;

    $('#s-rate').onchange = (ev) => {
      const v = parseFloat(ev.target.value);
      if (v > 0) { state.rate = v; save(); toast('匯率已更新'); } else ev.target.value = state.rate;
    };
    $('#s-link').onclick = makeShareLink;
    $('#s-export').onclick = () => shareFile(`kansai-trip-${todayStr()}.json`, JSON.stringify(state, null, 1), 'application/json');
    $('#s-xlsx').onclick = () => {
      if (!state.expenses.length) { toast('還沒有記帳'); return; }
      shareFile(`關西旅費_${todayStr()}.xlsx`, buildXlsx(), 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    };
    $('#s-import').onchange = async (ev) => {
      const f = ev.target.files && ev.target.files[0];
      ev.target.value = '';
      if (!f) return;
      try {
        const s = JSON.parse(await f.text());
        if (!s || !Array.isArray(s.days) || !Array.isArray(s.expenses) || !Array.isArray(s.checklist)) throw new Error('檔案格式不對');
        if (!confirm(`要用「${f.name}」覆蓋目前所有資料嗎？`)) return;
        state = normalize(s); ui.dayIdx = Math.min(ui.dayIdx, s.days.length - 1);
        save(); render(); toast('匯入完成');
      } catch (err) { toast('匯入失敗：' + err.message); }
    };
    $('#s-refresh').onclick = () => {
      if (!confirm('把行程換成最新的建議版本？你的記帳和清單會保留，但行程上自己改過的內容會被覆蓋。')) return;
      state.days = clone(window.SEED.days);
      ui.dayIdx = pickToday();
      save(); render(); toast('行程已更新');
    };
    $('#s-reset').onclick = () => {
      if (!confirm('確定要重設？所有修改和記帳都會消失。')) return;
      state = normalize(clone(window.SEED)); ui.dayIdx = pickToday();
      save(); render(); toast('已重設');
    };
  }

  // ---------- Excel 匯出（自己產生 .xlsx，不靠外部套件，離線也能用）----------
  // 數字一律用「數字格式」寫入（不是文字），Excel 可以直接加總；
  // 換算欄同時寫公式與算好的值：Excel 會重算，手機預覽沒公式引擎也看得到數字
  function buildXlsx() {
    const rate = state.rate;
    const rows = state.expenses.slice().sort((a, b) => a.date.localeCompare(b.date));
    const xe = (s) => String(s).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const col = (i) => String.fromCharCode(65 + i);
    // 儲存格：字串 / 數字 / {f: 公式, v: 值}；s = 樣式編號
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
    // 樣式：1 表頭　2 整數千分位　3 粗體整數（合計）　4 粗體文字　5 匯率
    const H = 1, N = 2, NB = 3, B = 4, R = 5;

    // 分頁一：明細
    const d1 = [[['日期', H], ['分類', H], ['付款方式', H], ['說明', H], ['日幣金額', H], ['台幣金額', H], ['匯率', H], ['換算台幣', H], ['換算方式', H]]];
    rows.forEach((e, i) => {
      const r = i + 2;
      const twd = toTWD(e);
      if (e.currency === 'TWD') d1.push([e.date, catLabel(e), e.pay, e.note, '', [e.amount, N], '', [{ f: `F${r}`, v: twd }, N], '台幣直接付']);
      else if (isManual(e)) d1.push([e.date, catLabel(e), e.pay, e.note, [e.amount, N], '', '', [twd, N], '手動輸入台幣']);
      else d1.push([e.date, catLabel(e), e.pay, e.note, [e.amount, N], '', [rate, R], [{ f: `ROUND(E${r}*G${r},0)`, v: twd }, N], '自動換算']);
    });
    const last = rows.length + 1;
    const sumJPY = rows.filter((e) => e.currency === 'JPY').reduce((s, e) => s + e.amount, 0);
    const sumTWDdirect = rows.filter((e) => e.currency === 'TWD').reduce((s, e) => s + e.amount, 0);
    const total = rows.reduce((s, e) => s + toTWD(e), 0);
    d1.push([['合計', B], '', '', ['', B],
      [{ f: `SUM(E2:E${last})`, v: sumJPY }, NB], [{ f: `SUM(F2:F${last})`, v: sumTWDdirect }, NB], '',
      [{ f: `SUM(H2:H${last})`, v: total }, NB]]);

    // 分頁二：統計
    const group = (keyFn) => {
      const m = new Map();
      rows.forEach((e) => {
        const k = keyFn(e);
        const g = m.get(k) || { n: 0, twd: 0 };
        g.n += 1; g.twd += toTWD(e);
        m.set(k, g);
      });
      return [...m.entries()];
    };
    const d2 = [
      [['關西旅費統計', B]],
      ['匯出日期', todayStr()],
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
    block('日期', group((e) => e.date).sort((a, b) => a[0].localeCompare(b[0])));

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
    const files = {
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
    };
    return zip(files);
  }

  // 最小 ZIP 產生器（不壓縮）
  const CRC_TABLE = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })();
  function crc32(buf) {
    let c = 0xFFFFFFFF;
    for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }
  function zip(files) {
    const enc = new TextEncoder();
    const now = new Date();
    const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
    const dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
    const parts = [], central = [];
    let offset = 0;
    Object.entries(files).forEach(([name, text]) => {
      const nameBuf = enc.encode(name);
      const data = enc.encode(text);
      const crc = crc32(data);
      const local = new DataView(new ArrayBuffer(30));
      local.setUint32(0, 0x04034b50, true); local.setUint16(4, 20, true); local.setUint16(6, 0x0800, true);
      local.setUint16(8, 0, true); local.setUint16(10, dosTime, true); local.setUint16(12, dosDate, true);
      local.setUint32(14, crc, true); local.setUint32(18, data.length, true); local.setUint32(22, data.length, true);
      local.setUint16(26, nameBuf.length, true); local.setUint16(28, 0, true);
      parts.push(new Uint8Array(local.buffer), nameBuf, data);
      const cd = new DataView(new ArrayBuffer(46));
      cd.setUint32(0, 0x02014b50, true); cd.setUint16(4, 20, true); cd.setUint16(6, 20, true); cd.setUint16(8, 0x0800, true);
      cd.setUint16(10, 0, true); cd.setUint16(12, dosTime, true); cd.setUint16(14, dosDate, true);
      cd.setUint32(16, crc, true); cd.setUint32(20, data.length, true); cd.setUint32(24, data.length, true);
      cd.setUint16(28, nameBuf.length, true); cd.setUint32(42, offset, true);
      central.push(new Uint8Array(cd.buffer), nameBuf);
      offset += 30 + nameBuf.length + data.length;
    });
    const cdSize = central.reduce((s, b) => s + b.length, 0);
    const end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true);
    end.setUint16(8, Object.keys(files).length, true); end.setUint16(10, Object.keys(files).length, true);
    end.setUint32(12, cdSize, true); end.setUint32(16, offset, true);
    return new Blob([...parts, ...central, new Uint8Array(end.buffer)]);
  }

  // ---------- 分享連結：把行程與清單壓進網址，朋友點開就能匯入 ----------
  const b64url = (bytes) => {
    let s = '';
    for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };
  const unb64url = (str) => {
    const s = atob(str.replace(/-/g, '+').replace(/_/g, '/'));
    const b = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i);
    return b;
  };
  async function packData(str) {
    const bytes = new TextEncoder().encode(str);
    if (typeof CompressionStream === 'function') {
      const buf = await new Response(new Blob([bytes]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer();
      return 'g' + b64url(new Uint8Array(buf)); // g = 壓縮過
    }
    return 'r' + b64url(bytes); // r = 沒壓縮（舊瀏覽器）
  }
  async function unpackData(code) {
    const bytes = unb64url(code.slice(1));
    if (code[0] === 'g') {
      const buf = await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
      return new TextDecoder().decode(buf);
    }
    return new TextDecoder().decode(bytes);
  }
  async function makeShareLink() {
    const payload = { v: 1, days: state.days, checklist: state.checklist, rate: state.rate };
    const json = JSON.stringify(payload);
    const base = `${location.origin}${location.pathname}`;
    let url = '';
    // 先試短網址（行程存在雲端，只帶 6 碼）；失敗就退回把資料塞進網址的長版
    try {
      const res = await fetch('/api/share', { method: 'POST', headers: { 'content-type': 'application/json' }, body: json });
      if (res.ok) {
        const { code } = await res.json();
        if (/^[A-Z2-9]{6}$/.test(code || '')) url = `${base}#s=${code}`;
      }
    } catch (e) { /* 沒網路或功能沒上線，走下面的長網址 */ }
    if (!url) url = `${base}#d=${await packData(json)}`;
    try {
      if (navigator.share) { await navigator.share({ title: '關西旅行行程', url }); return; }
    } catch (err) {
      if (err && err.name === 'AbortError') return;
    }
    try {
      await navigator.clipboard.writeText(url);
      toast('連結已複製，貼給旅伴就好');
    } catch (err) {
      prompt('複製這條連結傳給旅伴：', url);
    }
  }
  // 開啟時如果網址帶著分享碼，問過使用者再匯入（記帳不動）
  async function importFromHash() {
    const short = /^#s=([A-Za-z2-9]{6})$/.exec(location.hash || '');
    const long = /^#d=(.+)$/.exec(location.hash || '');
    if (!short && !long) return;
    history.replaceState(null, '', location.pathname + location.search);
    try {
      let raw;
      if (short) {
        const res = await fetch(`/api/share?c=${short[1].toUpperCase()}`);
        if (res.status === 404) throw new Error('這個分享碼已經找不到了，請旅伴重傳');
        if (!res.ok) throw new Error('連不上伺服器，請確認有網路');
        raw = await res.text();
      } else {
        raw = await unpackData(long[1]);
      }
      const data = JSON.parse(raw);
      if (!Array.isArray(data.days) || !Array.isArray(data.checklist)) throw new Error('連結內容不完整');
      if (!confirm('要匯入旅伴分享的行程與清單嗎？\n你自己的記帳不會被動到，但行程與清單會被覆蓋。')) return;
      state.days = data.days;
      state.checklist = data.checklist;
      if (data.rate > 0) state.rate = data.rate;
      ui.dayIdx = pickToday();
      save(); render(); toast('已匯入旅伴的行程');
    } catch (err) { toast('連結讀不到：' + err.message); }
  }

  async function shareFile(name, content, type) {
    const file = new File([content], name, { type });
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: name });
        return;
      }
    } catch (err) {
      if (err && err.name === 'AbortError') return; // 使用者自己取消
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  // ---------- 分頁 ----------
  function render() {
    document.querySelectorAll('.view').forEach((v) => v.classList.toggle('active', v.id === 'view-' + ui.view));
    document.querySelectorAll('.tabbar button').forEach((b) => b.classList.toggle('active', b.dataset.view === ui.view));
    $('#fab').hidden = ui.view !== 'money';
    ({ trip: renderTrip, money: renderMoney, list: renderList, jp: renderJp, settings: renderSettings })[ui.view]();
  }
  document.querySelectorAll('.tabbar button').forEach((b) => (b.onclick = () => { ui.view = b.dataset.view; render(); window.scrollTo(0, 0); }));
  $('#fab').onclick = () => editExpense(-1);

  render();
  importFromHash();

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
