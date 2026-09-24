// 初始資料：來自使用者的 Google 試算表 + ★ 建議（star: true）
// 在 App 裡改的內容存在手機，不會改到這個檔案；「設定 → 重設資料」才會回到這裡
(function () {
  let n = 0;
  const id = () => 's' + (n++).toString(36);
  // it(時間, 內容, { place, note, link, star })
  const it = (time, text, o = {}) => ({ id: id(), time, text, place: o.place || '', note: o.note || '', link: o.link || '', star: !!o.star });
  const tip = (time, text, o = {}) => it(time, text, Object.assign({ star: true }, o));
  const day = (date, title, city, s) => ({
    date, title, city,
    sections: Object.assign({ am: [], lunch: [], pm: [], dinner: [], night: [], hotel: [] }, s),
  });

  const HANA = { place: '嵐山温泉 花伝抄' };
  const KIORI = { place: 'KIORI Hotel Higashino Toin' };
  const USJ_HOTEL = { place: 'Hotel Universal Port' };

  const days = [
    day('2026-09-26', '抵達・直衝嵐山', '京都 嵐山', {
      am: [
        it('04:50', '抵達高雄國際機場', { place: '高雄國際機場' }),
        it('06:55', '班機 IT284', { note: '台灣虎航' }),
        it('10:55', '抵達 KIX 大阪關西國際機場', { place: '関西国際空港' }),
        tip('', '買 HARUKA 車票 → HARUKA 到京都 → JR 嵯峨野線到嵯峨嵐山', { note: '約 2 小時；HARUKA 是特急，要另外買票，嵯峨野線可以直接刷西瓜卡' }),
      ],
      lunch: [
        it('', 'Onigiri Burger（飛機上或路上先墊）', { note: '原表午餐' }),
        it('', "Ermine's Kitchen（素・已預約）", { place: "Ermine's Kitchen", note: '★ 出發前再確認預約時間；抵達嵐山約 14:00' }),
      ],
      pm: [
        it('', '直接殺去嵐山'),
        tip('', '先到花傳抄寄放行李', HANA),
        tip('', '渡月橋、嵐山商店街散步', { place: '渡月橋' }),
        it('', 'マルシェすみのくら（買明天早餐的麵包）', { place: 'マルシェ すみのくら 嵐山', note: '★ 買前先看成分，有些麵包含奶蛋或豬油' }),
      ],
      dinner: [
        it('', '湯豆腐 嵯峨野（素）', { place: '湯豆腐 嵯峨野', note: '★ 11:00–18:30（最後點餐 17:30），豆腐賣完提早收；可線上訂位。湯底要問是昆布還是柴魚' }),
        it('', 'Kijurou（和牛）／ベジタリアン（同行者吃和牛時的選擇）', { note: '★ 和牛店多半要訂位' }),
        tip('', '或確認花傳抄有沒有附晚餐', { note: '溫泉旅館常含會席料理，先確認才不會訂重複' }),
      ],
      night: [tip('', '泡溫泉、早點睡', { note: '明天一早去竹林' })],
      hotel: [it('', '京都嵐山溫泉 花傳抄', Object.assign({ note: 'NT$20,667・2 晚' }, HANA))],
    }),
    day('2026-09-27', '竹林・小火車・保津川', '京都 嵐山', {
      am: [
        tip('07:30', '竹林小徑（越早人越少）', { place: '竹林の小径' }),
        it('09:00', '嵯峨野小火車 嵯峨 → 09:25 龜岡', { place: 'トロッコ嵯峨駅', note: '一大早的竹林之後' }),
        it('10:00', '京都・龜岡 保津川遊船', { place: '保津川下り 乗船場', note: '約 2 小時回到嵐山' }),
      ],
      lunch: [tip('', '鯛匠 HANANA 鯛魚茶泡飯，或嵐山湯豆腐', { place: '鯛匠HANANA', note: 'HANANA 常要排隊' })],
      pm: [
        it('', '嵐山拜託有來日本嵐山的～'),
        it('', '祐斎亭', { place: '祐斎亭', note: '★ 需事先預約' }),
      ],
      dinner: [tip('', '旅館晚餐或嵐山商店街')],
      hotel: [it('', '京都嵐山溫泉 花傳抄', HANA)],
    }),
    day('2026-09-28', '貴船・鞍馬（★和原本的 9/29 對調）', '京都 鞍馬', {
      am: [
        it('', '殺飯店（花傳抄退房）'),
        tip('', '行李先送到 KIORI，或請旅館寄送，不要帶上山'),
        tip('', '★ 這天改去貴船・鞍馬：雍州路週二公休，原本排的 9/29 剛好是週二', { note: '金閣寺、銀閣寺改到 9/29' }),
        it('', '出町柳搭叡山電鐵 → 貴船口', { place: '出町柳駅' }),
        it('', '貴船神社', { place: '貴船神社' }),
      ],
      lunch: [
        it('', '雍州路（鞍馬寺山門・精進料理，全素）', { place: '雍州路 鞍馬', note: '★ 10:00–18:00、週二公休。位置在鞍馬寺不是貴船，從貴船走山路約 1 小時，或搭叡電到鞍馬站' }),
        tip('', '或貴船川床料理', { note: '川床只到 9/30，要預約；素食要事先講，湯底常是柴魚' }),
      ],
      pm: [
        tip('', '鞍馬寺（雍州路就在山門口，順便參拜）', { place: '鞍馬寺' }),
        it('', '鴨川公園（出町柳）體驗跳烏龜石', { place: '鴨川デルタ' }),
        it('', '賀茂御祖神社（下鴨神社）・糺之森', { place: '下鴨神社' }),
      ],
      dinner: [
        it('', 'TU CASA（素）', { place: 'TU CASA 京都' }),
        it('', 'cafe vegan terrace', { place: 'cafe vegan terrace 京都' }),
        tip('', '或河原町、木屋町一帶', { place: '木屋町' }),
      ],
      hotel: [it('', 'KIORI 飯店 東野東院', Object.assign({ note: 'NT$5,818・2 晚' }, KIORI))],
    }),
    day('2026-09-29', '金閣寺・銀閣寺・剪髮（★和原本的 9/28 對調）', '京都', {
      am: [
        it('', 'Veg Out（素・早餐 9:00–11:00）', { place: 'Veg Out 京都', note: '京阪七條站走 2 分鐘，鴨川旁' }),
        it('', '金閣寺', { place: '金閣寺' }),
        it('', '預約剪髮 hair salon Yoi', { note: '★ 把剪髮時間填進來，其他行程配合它排' }),
      ],
      lunch: [
        it('', 'Sabo Kinkaku-an（金閣寺附近）', { place: '茶房 金閣庵' }),
        it('', '拉麵 KAZU 金閣寺店（葷素都有）', { place: 'ラーメンKAZU 金閣寺店' }),
        it('', 'Sabanjii（牛肉麵）／Dainoji（燒）：同行者的選擇'),
      ],
      pm: [
        it('', '銀閣寺', { place: '銀閣寺' }),
        tip('', '哲學之道 → 南禪寺（散步約 30–40 分）', { place: '哲学の道' }),
      ],
      dinner: [
        it('', '松葉亭 Matsubatei（葷素都有）', { place: '松葉亭 京都' }),
        it('', 'Kyoya（葷素都有）', { place: 'Kyoya 京都' }),
        tip('', '或祇園、先斗町', { place: '先斗町' }),
      ],
      hotel: [it('', 'KIORI 飯店 東野東院', KIORI)],
    }),
    day('2026-09-30', '京都購物 → 移動到環球', '京都', {
      am: [
        it('', '新京極商店街、錦市場、高島屋、大丸百貨、河原町 OPA shopping', { place: '錦市場' }),
        tip('', '錦市場早點去，10 點後人潮很多'),
      ],
      lunch: [
        it('', '日本混合麵條 maruta（葷素都有）', { place: 'maruta 京都' }),
        it('', '和牛拉麵 笑門（同行者的選擇）', { place: '和牛ラーメン 笑門 京都' }),
        tip('', '或錦市場邊走邊吃', { note: '錦市場多數是熟食小攤，素食選擇有限，先吃正餐比較保險' }),
      ],
      pm: [
        it('', 'shopping'),
        it('15:30', '殺環球飯店', USJ_HOTEL),
        tip('', '路線：JR 京都 → 大阪 → 轉 JR 夢咲線到環球城', { note: '約 1 小時' }),
      ],
      dinner: [tip('', '環球城 CityWalk', { place: 'ユニバーサル・シティウォーク大阪' })],
      night: [tip('', '早點睡；先下載 USJ App、確認門票')],
      hotel: [it('', '環球影城港灣酒店', Object.assign({ note: 'NT$8,660・2 晚' }, USJ_HOTEL))],
    }),
    day('2026-10-01', 'USJ 環球影城', '大阪 此花區', {
      am: [
        it('07:30', '入口排隊', { note: '園區常常比公告時間早開', place: 'ユニバーサル・スタジオ・ジャパン' }),
        it('', '進場前先打開 App 看整理券或抽選'),
        it('07:20', 'USJ 抽券教學', { note: '原表有連結，點「編輯」可以貼上網址' }),
        it('', '開園衝「哈利波特禁忌之旅」或咚奇剛瘋狂礦車（有抽到任天堂的話）'),
        it('', 'Resident Evil Requiem 深淵絕境', { note: '請在 App 確認當天有沒有開，以及需不需要整理券' }),
        it('', '恐怖工廠'),
        it('', '侏羅紀公園乘船遊', { note: '走單人通道' }),
      ],
      lunch: [
        it('11:00', '芙莉蓮餐廳午餐（11:00–11:30）', { note: '★ 主題餐廳素食選擇少，先看官網菜單；不行就改下面兩間' }),
        it('', 'Saizeriya（義式，有蔬菜、披薩、義大利麵）', { place: 'サイゼリヤ ユニバーサルシティ' }),
        it('', 'Shake Shack The Park Front 飯店店', { place: 'Shake Shack ユニバーサル・シティウォーク大阪' }),
      ],
      pm: [
        it('', '芙莉蓮追憶之旅、小小兵區'),
        it('14:30', '任天堂、瑪利歐賽車（14:30–15:00）'),
        it('', '庫巴的挑戰書'),
        it('16:00', '咚奇剛瘋狂礦車'),
        it('18:00', '殭屍遊行（18:20、18:50）'),
        it('', '退稅（14–21 點）在入口處', { note: '記得帶護照' }),
        it('', '航海王劇場', { note: '付費對號座表演，要事先購票；當天只有還有空位才會現場販售' }),
      ],
      night: [
        it('', '買任天堂夜燈和周邊'),
        it('', '爆米花：加油站前、舞台 18 前的推車', { note: '舞台 18 那台 18 點前要去' }),
      ],
      hotel: [it('', '環球影城港灣酒店', USJ_HOTEL)],
    }),
    day('2026-10-02', '難波購物日', '大阪 難波', {
      am: [
        tip('', '退房 → 環球城轉西九條到難波（約 25 分），行李寄放蒙特利飯店', { note: '飯店和 JR 難波站直接相連' }),
        it('', 'shopping'),
        tip('', '黑門市場', { place: '黒門市場' }),
      ],
      lunch: [tip('', '黑門市場吃海鮮')],
      pm: [
        it('', 'shopping'),
        tip('', '心齋橋、道頓堀藥妝、難波 Parks', { place: '心斎橋筋商店街' }),
        tip('', '退稅要帶護照'),
      ],
      dinner: [tip('', '道頓堀：燒肉、串炸、章魚燒', { place: '道頓堀' })],
      night: [tip('', '打包行李、確認明天 08:00 出發')],
      hotel: [it('', '大阪蒙特利格拉斯米爾飯店', { place: 'Hotel Monterey Grasmere Osaka', note: 'NT$5,176・1 晚' })],
    }),
    day('2026-10-03', '回台灣', '大阪 難波', {
      am: [
        tip('08:00', '出發：飯店旁 OCAT 搭利木津巴士到關西機場，或南海難波搭 Rapi:t', { note: '巴士約 50 分、Rapi:t 約 40 分，出發前請再查時刻表' }),
        it('09:50', '抵達 KIX 大阪關西國際機場', { place: '関西国際空港 第1ターミナル' }),
        it('11:55', '班機 IT285（第 1 航廈）'),
      ],
      pm: [
        it('14:00', '高雄國際機場'),
        it('17:00', '接貓咪'),
        it('19:00', '回家'),
      ],
    }),
  ];

  const e = (date, amount, note) => ({ id: id(), date, amount, currency: 'TWD', cat: '住宿', pay: '信用卡', note, other: '' });
  const expenses = [
    e('2026-09-26', 20667, '京都嵐山溫泉 花傳抄（2 晚）'),
    e('2026-09-28', 5818, 'KIORI 飯店 東野東院（2 晚）'),
    e('2026-09-30', 8660, '環球影城港灣酒店（2 晚）'),
    e('2026-10-02', 5176, '大阪蒙特利格拉斯米爾飯店（1 晚）'),
  ];

  window.SEED = { version: 1, rate: 0.21, days, expenses };
})();
