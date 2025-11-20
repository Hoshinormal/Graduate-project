// intro.js

// 元素參考
const pills = document.querySelectorAll('.pill');
const currentFactor = document.getElementById('current-factor');
const detailBox = document.getElementById('detail-box');

// 因子詳細資料（每個因子：一句介紹、算法、特色、優點、限制）
const factorDetails = {
  '本益比（P/E）': {
    short: '股價相對於每股盈餘（EPS）的比值，用以評估估值高低。',
    formula: 'P/E = 股價 ÷ 每股盈餘',
    feature: '最常見的市場估值標準。',
    pros: ['直覺易懂、應用廣泛', '適合穩定獲利公司'],
    cons: ['對虧損公司不適用', '易受一次性損益影響'],
    usage: '常用於評估成熟企業的合理估值。',
    example: '例如：一家大型食品公司 P/E = 15，意味著投資人願意支付 15 倍的年度盈餘來持有股票。'
  },
  '股價營收比（P/S）': {
    short: '衡量公司股價相對於營收的估值指標（P/S）。',
    formula: 'P/S = 股價 ÷ 每股營收 或 公司市值 ÷ 年度營收',
    feature: '適合尚未獲利但營收成長快的公司。',
    pros: ['能反映營收驅動的成長潛力', '對新創與科技股有參考價值'],
    cons: ['未考慮獲利能力與成本結構'],
    usage: '常用於快速成長的科技股、電商或尚未獲利的新創公司估值。',
    example: '例如：某科技公司雖然尚未獲利，但營收快速成長，P/S 指標較低表示股價相對便宜，可作為投資參考。'
  },
  '股價淨值比（P/B）': {
    short: '公司股價相對於帳面淨值的比值。',
    formula: 'P/B = 股價 ÷ 每股淨值',
    feature: '用於評估資產導向型企業的便宜程度。',
    pros: ['能判斷公司是否低於清算價值', '常用於金融與地產業'],
    cons: ['無法反映無形資產價值', '對成長型公司參考性較低'],
    usage: '常用於銀行、保險、房地產等資產密集型產業。',
    example: '例如：某銀行 P/B = 0.8，意味著股價低於帳面資產，可能被低估。'
  },
  '帳面市值比（B/M）': {
    short: '股價相對於帳面價值的比率，反映市場對公司資產價值的評價。',
    formula: 'B/M = 每股淨值 ÷ 股價',
    feature: '常用於價值投資策略。',
    pros: ['能找到被低估的公司', '易於量化比較'],
    cons: ['不考慮未來成長性', '可能受會計政策影響'],
    usage: '價值型投資者常用來篩選低估股票。',
    example: '例如：B/M = 1.5 的股票被市場低估，可能存在投資機會。'
  },
  '盈餘殖利率': {
    short: '每股盈餘相對於股價的回報率。',
    formula: '盈餘殖利率 = 每股盈餘 ÷ 股價',
    feature: '反映以盈利為基礎的回報能力。',
    pros: ['可比較不同公司盈利性', '反映股價與盈利關係'],
    cons: ['盈餘受會計操控影響', '虧損公司無法使用'],
    usage: '常用於篩選高盈利回報的股票。',
    example: '例如：盈餘殖利率 8% 表示以當前盈餘計算，投資回報率約 8%。'
  },
  '自由現金流殖利率': {
    short: '自由現金流相對於股價的回報率。',
    formula: 'FCF Yield = 自由現金流 ÷ 市值',
    feature: '以現金流為基礎的估值指標。',
    pros: ['不易受會計操作影響', '反映企業現金創造能力'],
    cons: ['不適用於現金流波動大公司'],
    usage: '投資人用於評估公司現金產生能力與估值安全邊際。',
    example: '例如：FCF Yield = 5%，表示每投入 100 元股價可獲得 5 元自由現金流。'
  },
  '股價現金流比（P/CF）': {
    short: '公司股價相對於營業現金流的比值。',
    formula: 'P/CF = 股價 ÷ 每股現金流',
    feature: '以現金流衡量企業估值的穩健方法。',
    pros: ['不易受會計操作影響', '能反映企業現金創造能力'],
    cons: ['不適用於現金流波動大的公司'],
    usage: '常用於評估穩健現金流公司，如公用事業。',
    example: '例如：P/CF = 12，表示股價為每股現金流的 12 倍。'
  },
  '股息殖利率': {
    short: '公司每股現金股利相對於股價的回報率。',
    formula: '殖利率 = 每股股利 ÷ 股價',
    feature: '以穩定現金回報吸引長期投資者。',
    pros: ['提供穩定收益來源', '可作為防禦型投資指標'],
    cons: ['高殖利率可能因股價下跌造成假象'],
    usage: '常用於追求穩定現金流的投資策略。',
    example: '例如：殖利率 4%，表示投資人每年可獲得 4% 現金股利回報。'
  },
  '企業價值倍數（EV/EBITDA）': {
    short: '以公司整體價值相對於獲利能力的估值指標。',
    formula: 'EV/EBITDA =（市值 + 負債 - 現金）÷ EBITDA',
    feature: '適用跨產業比較的綜合性估值指標。',
    pros: ['能反映企業真實營運規模', '排除資本結構影響'],
    cons: ['需精確財報資料，計算較複雜'],
    usage: '常用於併購、行業比較或估值篩選。',
    example: '例如：EV/EBITDA = 8，意味企業價值約為年度 EBITDA 的 8 倍。'
  },
  '股東權益報酬率（ROE）': {
    short: '股東投入資本的回報率。',
    formula: 'ROE = 淨利 ÷ 股東權益',
    feature: '衡量企業盈利效率。',
    pros: ['反映資本使用效率', '可比較不同公司盈利能力'],
    cons: ['高負債公司 ROE 可能虛高'],
    usage: '投資人用於評估公司經營效率與股東回報。',
    example: '例如：ROE = 15%，表示每投入 100 元股東資本可獲利 15 元。'
  },

  // ===== 動能因子 =====
  '股價動能': {
    short: '以過去一段期間（例如12個月）的報酬率衡量趨勢延續。',
    formula: '股價動能 = (期末價 - 期初價) / 期初價 × 100%',
    feature: '最典型的動能策略核心因子。',
    pros: ['可捕捉強勢股趨勢', '與市場情緒高度相關'],
    cons: ['容易在反轉時期出現虧損'],
    usage: '短線操作或波段交易策略。',
    example: '例如：某股票過去12個月漲幅50%，動能因子高，投資人可能跟進持有。'
  },
  '短期動能': {
    short: '以近1至3個月的股價變化評估市場趨勢。',
    formula: '短期動能 = (近期股價 - 起始股價) / 起始股價 × 100%',
    feature: '反映資金流向與短線交易動能。',
    pros: ['能快速反映市場變化', '對波段操作有參考價值'],
    cons: ['噪音多、容易出現假突破'],
    usage: '常用於短線交易策略。',
    example: '例如：股價短期上漲10%，短期動能指標增加，短線交易者可能跟進。'
  },
  '價格乖離率': {
    short: '股價與移動平均線的偏離程度。',
    formula: '乖離率 = (股價 - MA) ÷ MA × 100%',
    feature: '用於判斷股價過熱或低估。',
    pros: ['簡單易用', '可提示短期反轉'],
    cons: ['震盪市容易出現假訊號'],
    usage: '常用於技術分析與短線反轉策略。',
    example: '股價上漲超過 MA 10%，乖離率過高可能短期回檔。'
  },
  '移動平均交叉': {
    short: '短期與長期均線交叉判斷趨勢方向。',
    formula: '短期MA上穿長期MA為買進訊號，下穿為賣出訊號。',
    feature: '直觀的趨勢確認工具。',
    pros: ['容易理解與應用', '可自動化交易'],
    cons: ['盤整時易假訊號'],
    usage: '常用於交易策略中判斷買賣點。',
    example: '短期MA上穿長期MA形成黃金交叉，為買進訊號。'
  },
  '平均報酬率動能': {
    short: '以過去一定期間平均報酬率衡量趨勢。',
    formula: '平均報酬率 = (期末價 - 期初價) ÷ 期間長度',
    feature: '平滑化價格波動，判斷整體趨勢。',
    pros: ['減少短期波動影響', '捕捉中期趨勢'],
    cons: ['延遲訊號'],
    usage: '常用於中期動能策略。',
    example: '例如：過去6個月平均報酬率為5%，顯示上升趨勢。'
  },
  '52週高低價距離': {
    short: '股價與52週最高最低價距離。',
    formula: '距離 = (股價 - 52週低) ÷ (52週高 - 52週低)',
    feature: '判斷股價位置相對波段高低。',
    pros: ['簡單直觀', '可作為買賣參考'],
    cons: ['不考慮基本面'],
    usage: '投資人用於辨識股價相對低估或高估。',
    example: '股價接近52週低點，可能有反彈機會。'
  },
  'EPS成長動能': {
    short: '公司每股盈餘成長趨勢。',
    formula: 'EPS成長率 = (本期EPS - 上期EPS) ÷ 上期EPS',
    feature: '衡量公司盈利增長動能。',
    pros: ['反映公司成長性', '適合成長型投資'],
    cons: ['盈餘易受一次性項目影響'],
    usage: '常用於篩選高速成長股。',
    example: '某公司EPS從2元增至3元，EPS成長率50%。'
  },
  '單月營收成長率': {
    short: '比較相鄰月份或去年同期的營收，判斷成長動能。',
    formula: '單月營收成長率 = (本月營收 - 上月或去年同月營收) ÷ 比較月營收',
    feature: '即時反映公司營運脈動的高頻指標。',
    pros: ['能快速捕捉營運動能變化', '適合成長型公司觀察'],
    cons: ['波動大、受季節與一次性因素影響'],
    usage: '用於觀察短期營運表現。',
    example: '例如：單月營收增長20%，顯示公司營運動能強。'
  },
  '資金流入動能': {
    short: '股價或股票資金流入方向與大小。',
    formula: '資金流入 = 成交量 × 價格變動',
    feature: '反映市場資金偏好。',
    pros: ['可提前察覺資金動向', '對短線操作有參考價值'],
    cons: ['噪音大、易被短期事件影響'],
    usage: '常用於短線交易策略。',
    example: '資金大量流入某股，短線可能上漲。'
  },
  '相對市場報酬': {
    short: '股價報酬相對市場指數的表現。',
    formula: '相對報酬 = 股票報酬率 - 市場報酬率',
    feature: '衡量個股跑贏或落後市場。',
    pros: ['可比較個股績效', '適合基金績效分析'],
    cons: ['不考慮公司基本面'],
    usage: '投資人用於選股或績效比較。',
    example: '某股票過去一年漲幅20%，大盤漲幅15%，相對報酬+5%。'
  },
  '短期反轉動能': {
    short: '近期股價短線波動後的反向修正。',
    formula: '反轉動能 = 過去N日報酬率的負值',
    feature: '利用短期價格修正獲利。',
    pros: ['可捕捉短線回檔機會', '適合波段操作'],
    cons: ['風險高，假反轉可能損失'],
    usage: '用於短期交易策略。',
    example: '股價短期下跌5%，可能出現短期反彈，適合短線操作。'
  },
  '相對強弱指標（RSI）': {
    short: '衡量股價近期漲跌力度的技術指標。',
    formula: 'RSI = 100 - (100 / (1 + RS))，RS = 平均漲幅 ÷ 平均跌幅',
    feature: '經典動能指標，常與MACD並用。',
    pros: ['可輔助短期買賣決策', '適合震盪盤使用'],
    cons: ['對趨勢行情的判斷力較弱'],
    usage: '短線交易、判斷超買超賣。',
    example: 'RSI > 70 表示超買，可能下跌；RSI < 30 表示超賣，可能反彈。'
  },
  '3月營收增長率': {
    short: '以最近3個月的營收變化衡量公司中短期成長動能。',
    formula: '3月增長率 = (最近3月總營收 - 前3月總營收) / 前3月總營收',
    feature: '比單月更穩定，能看出短期趨勢延續。',
    application: '適合觀察成長型公司或季節性營收波動。',
    example: '若公司1~3月營收合計為3000萬，前3月合計為2700萬，則3月增長率 = (3000-2700)/2700 = 11.1%',
    pros: ['比單月營收更平滑', '能捕捉短期成長趨勢'],
    cons: ['仍可能受季節性與基期效應影響']
  }
};

// 初始化
function renderDetail(key) {
  const data = factorDetails[key] || null;
  currentFactor.textContent = key;

  if (!data) {
    detailBox.innerHTML = '<p>尚無詳細資料。</p>';
    return;
  }

  const html = `
  <p class="formula"><strong>計算公式：</strong> ${data.formula || '-'}</p>
  <p><strong>一句介紹：</strong> ${data.short || '-'}</p>
  <p><strong>特色：</strong> ${data.feature || '-'}</p>
    
    <p><strong>常應用地方：</strong> ${data.usage || '-'}</p>
    <p><strong>例子說明：</strong> ${data.example || '-'}</p>
    <p><strong>優點：</strong></p>
    <ul>${(data.pros || []).map(p => `<li>✅ ${p}</li>`).join('')}</ul>
    <p><strong>限制：</strong></p>
    <ul>${(data.cons || []).map(c => `<li>⚠️ ${c}</li>`).join('')}</ul>
  `;

  detailBox.innerHTML = html;
}

function setActivePill(clicked) {
  document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
  clicked.classList.add('active');

  const label = clicked.dataset.factor.trim();
  renderDetail(label);
}

pills.forEach(p => {
  p.addEventListener('click', () => setActivePill(p));
});

window.addEventListener('DOMContentLoaded', () => {
  renderDetail('本益比（P/E）');
});