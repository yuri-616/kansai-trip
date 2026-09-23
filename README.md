# 關西 8 日旅行 App（2026/09/26 – 10/03）

手機網頁（PWA）：行程、記帳、攜帶清單、旅遊日語。純 HTML / CSS / JavaScript，沒有任何套件與建置流程，整個資料夾就是網站本身。

## 部署

Netlify 直接發佈這個資料夾即可：

- Build command：留空
- Publish directory：`kansai-trip-app`（若此資料夾是倉庫根目錄則填 `.`）

推送到 main 後 Netlify 會自動重新部署。

## 檔案

| 檔案 | 用途 |
|---|---|
| `index.html` | 頁面骨架、底部分頁 |
| `app.js` | 全部邏輯：行程、記帳（含 Excel 匯出）、清單、日語、分享連結 |
| `seed.js` | 初始行程、清單、已付住宿費。改內容要把 `SEED_VERSION` +1，使用者的清單才會自動補上新項目 |
| `phrases.js` | 旅遊日語 113 句 |
| `style.css` | 樣式（含深色模式） |
| `sw.js` | 離線快取。**每次改檔都要把 `CACHE` 版本號 +1**，手機才會抓到新版 |
| `manifest.webmanifest`、`icons/` | 加到主畫面用 |

## 資料存放

使用者的行程修改、記帳、清單勾選都存在手機的 localStorage，不會上傳到任何地方。分享給旅伴是靠「設定 → 產生分享連結」，把行程與清單壓縮進網址。
