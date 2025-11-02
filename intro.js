// intro.js


// 元素參考
const pills = document.querySelectorAll('.pill');
const currentFactor = document.getElementById('current-factor');
const detailBox = document.getElementById('detail-box');


// 因子詳細資料（每個因子：一句介紹、算法、優點、限制）
const factorDetails = {
'股價營收比': {
short: '衡量公司股價相對於營收水準的估值指標（P/S）。',
formula: 'P/S = 公司市值 / 年度營收 或 P/S = 股價 / 每股營收',
pros: ['適合用於仍處於成長但尚未獲利的公司', '以營收為基準，對於營收成長的公司較有參考價值'],
cons: ['不考慮獲利能力與成本結構', '若毛利率差異大，P/S 可能失真']
},
'本益比（P/E）': {
short: '股價相對於每股盈餘（EPS）的比值，用以評估估值高度。',
formula: 'P/E = 股價 / 每股盈餘 或 P/E = 公司市值 / 淨利',
pros: ['廣泛使用、易於理解', '適合評估穩定獲利公司的估值'],
cons: ['對於虧損或EPS波動大的公司不適用', '會被稀釋或一次性損益影響']
},
'市淨率（P/B）': {
short: '公司市值相對於淨資產的比值，常用於資產導向行業。',
formula: 'P/B = 公司市值 / 淨資產 或 P/B = 股價 / 每股淨值',
pros: ['適合資產密集型公司（例如金融、地產）', '可判斷公司是否被低估'],
cons: ['帳面資產可能與實際價值不同', '對無形資產比重高的公司不適用']
},
'現金股利率': {
short: '公司配發現金股利相對於股價的回報率。',
formula: '現金股利率 = 每股現金股利 / 股價',
pros: ['直接反映現金回報，適合追求收益的投資人'],
cons: ['股利政策可變，可能不穩定', '不代表公司成長性']
},
'單月營收成長率': {
short: '比較相鄰月份或去年同期的營收，判斷成長動能。',
formula: '單月營收成長率 = (本月營收 - 上月或去年同月營收) / 比較月營收',
pros: ['能即時反映營運動能', '對於季節性或事件驅動型成長敏感'],
cons: ['單月資料波動大，需注意季節性', '可能被一次性事件扭曲']
},
'3月營收增長率': {
short: '以近3個月或季節營收變化衡量中短期動能。',
formula: '3月增長率 = (近3月總營收 - 前3月總營收) / 前3月總營收',
pros: ['比單月更平滑、能看短期趨勢'],
cons: ['仍可能受季節性與基期效應影響']
},
'股價動能': {
short: '以過去一段時間的股價表現衡量趨勢延續性。',
formula: '可用累積報酬率或N日漲幅表示（例如：近12個月報酬）',
pros: ['能捕捉價格趨勢與市場情緒'],
cons: ['易受短期波動、新聞事件影響', '可能出現反轉風險']
},
'相對強弱指標（RSI）': {
short: '衡量價格近期漲跌力度的指標，判斷超買或超賣。',
formula: 'RSI = 100 - (100 / (1 + RS))，RS = 平均漲幅 / 平均跌幅',
pros: ['可輔助判斷短期超買/超賣狀態'],
cons: ['須搭配其他指標，對震盪市較不可靠']
}
};


// 初始化：將 detail 填入預設的股價營收比資訊
function renderDetail(key) {
const data = factorDetails[key] || null;
currentFactor.textContent = key;


if (!data) {
detailBox.innerHTML = '<p>尚無詳細資料。</p>';
return;
}


// 組成 HTML
const html = `
<p><strong>一句介紹：</strong> ${data.short}</p>
<p><strong>計算公式：</strong> ${data.formula}</p>
<p><strong>優點：</strong></p>
<ul>${(data.pros || []).map(p => `<li>✅ ${p}</li>`).join('')}</ul>
<p><strong>限制：</strong></p>
<ul>${(data.cons || []).map(c => `<li>⚠️ ${c}</li>`).join('')}</ul>
`;


detailBox.innerHTML = html;
}


function setActivePill(clicked) {
  // 取消其他所有 pill 的 active
  document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
  clicked.classList.add('active');

  const label = clicked.dataset.factor.trim();   // ✅ 用 data-factor 對應 JS 資料的 key
  renderDetail(label);
}


// 啟動：綁定所有 pill 的點擊事件
pills.forEach(p => {
p.addEventListener('click', () => setActivePill(p));
});


window.addEventListener('DOMContentLoaded', () => {
  renderDetail('股價營收比');
});