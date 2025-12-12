const pills = document.querySelectorAll('.pill');
const currentFactor = document.getElementById('current-factor');
const detailBox = document.getElementById('detail-box');

let yahooIntervalId = null;  // 用來紀錄目前的即時股價更新計時器

// 備份保險版：CMoney 技術分析頁（外部 iframe）
function buildCmoneyIframe(code){
    if(!code) return '<p>暫時無法載入圖表（缺少股票代碼）。</p>';
    const src = `https://www.cmoney.tw/finance/${encodeURIComponent(code)}/technicalanalysis`;
    return `<iframe class="chart-frame" src="${src}" loading="lazy" referrerpolicy="no-referrer"></iframe>`;
}


// 因子詳細資料（每個股票）
const factorDetails = {
    '2330台積電': {
        price: '1480',
        tvSymbol: 'TWSE:2330',
        industry: '半導體',
        short: '全球最大的晶圓代工廠',
        feature: '技術領先、市場占有率高',
        taiwan50: '61.53%',
        chart: '<img src="img/2330.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.tsmc.com'
    },
    '2887台新新光金': {
        price: '19.4',
        tvSymbol: 'TWSE:2887',
        industry: '金融業',
        short: '以銀行及保險業務為主的金融集團',
        feature: '資本穩健、金融服務多元',
        taiwan50: '0.71%',
        chart: '<img src="img/2887.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.taishin.com.tw'
    },
    '2891中信金': {
        price: '46.5',
        tvSymbol: 'TWSE:2891',
        industry: '金融業',
        short: '中信金控',
        feature: '穩健經營',
        taiwan50: '1.34%',
        chart: '<img src="img/2891.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.ctbcholding.com/'
    },
    '2883凱基金': {
        price: '17.05',
        tvSymbol: 'TWSE:2883',
        industry: '金融業',
        short: '凱基金控',
        feature: '多元業務',
        taiwan50: '0.43%',
        chart: '<img src="img/2883.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.kgi.com/'
    },
    '2884玉山金': {
        price: '32.8',
        tvSymbol: 'TWSE:2884',
        industry: '金融業',
        short: '玉山金控',
        feature: '銀行與證券業務',
        taiwan50: '0.81%',
        chart: '<img src="img/2884.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.esunfhc.com/'
    },
    '2317鴻海': {
        price: '227',
        tvSymbol: 'TWSE:2317',
        industry: '電子',
        short: '全球代工巨頭',
        feature: '製造能力強',
        taiwan50: '4.8%',
        chart: '<img src="img/2317.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.foxconn.com'
    },
    '2890永豐金': {
        price: '27.6',
        tvSymbol: 'TWSE:2890',
        industry: '金融業',
        short: '永豐金控',
        feature: '銀行與證券',
        taiwan50: '0.56%',
        chart: '<img src="img/2890.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.sinotrade.com.tw/'
    },
    '2886兆豐金': {
        price: '41.15',
        tvSymbol: 'TWSE:2886',
        industry: '金融業',
        short: '兆豐金控',
        feature: '銀行及保險',
        taiwan50: '0.82%',
        chart: '<img src="img/2886.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.megaholdings.com.tw/'
    },
    '2303聯電': {
        price: '48.8',
        tvSymbol: 'TWSE:2303',
        industry: '半導體',
        short: '晶圓代工',
        feature: '穩定技術',
        taiwan50: '0.96%',
        chart: '<img src="img/2303.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.umc.com'
    },
    '2002中鋼': {
        price: '18.75',
        tvSymbol: 'TWSE:2002',
        industry: '鋼鐵',
        short: '中鋼公司',
        feature: '鋼鐵製造',
        taiwan50: '0.37%',
        chart: '<img src="img/2002.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.csc.com.tw'
    },
    '2885元大金': {
        price: '38.05',
        tvSymbol: 'TWSE:2885',
        industry: '金融業',
        short: '元大金控',
        feature: '證券與銀行',
        taiwan50: '0.69%',
        chart: '<img src="img/2885.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.yuanta.com/'
    },
    '2892第一金': {
        price: '28.35',
        tvSymbol: 'TWSE:2892',
        industry: '金融業',
        short: '第一金控',
        feature: '銀行業務',
        taiwan50: '0.52',
        chart: '<img src="img/2892.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.firstholding.com.tw/'
    },
    '5880合庫金': {
        price: '24.45',
        tvSymbol: 'TWSE:5880',
        industry: '金融業',
        short: '合作金庫金控',
        feature: '銀行及投資',
        taiwan50: '0.43%',
        chart: '<img src="img/5880.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.tcfhc.com.tw/'
    },
    '2882國泰金': {
        price: '70.1',
        tvSymbol: 'TWSE:2882',
        industry: '金融業',
        short: '國泰金控',
        feature: '保險與銀行',
        taiwan50: '1.09%',
        chart: '<img src="img/2882.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.cathayholdings.com.tw'
    },
    '2880華南金': {
        price: '30.95',
        tvSymbol: 'TWSE:2880',
        industry: '金融業',
        short: '華南金控',
        feature: '銀行業務',
        taiwan50: '0.49%',
        chart: '<img src="img/2880.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.hnfhc.com.tw/'
    },
    '2881富邦金': {
        price: '96.8',
        tvSymbol: 'TWSE:2881',
        industry: '金融業',
        short: '富邦金控',
        feature: '保險與投資',
        taiwan50: '1.35%',
        chart: '<img src="img/2881.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.fubon.com'
    },
    '1303南亞': {
        price: '61.1',
        tvSymbol: 'TWSE:1303',
        industry: '化學',
        short: '南亞塑膠',
        feature: '化學原料',
        taiwan50: '0.58%',
        chart: '<img src="img/1303.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.nanya.com.tw'
    },
    '1216統一': {
        price: '74.9',
        tvSymbol: 'TWSE:1216',
        industry: '食品',
        short: '統一企業',
        feature: '食品與飲料',
        taiwan50: '0.64%',
        chart: '<img src="img/1216.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.uni-president.com.tw'
    },
    '1301台塑': {
        price: '39.9',
        tvSymbol: 'TWSE:1301',
        industry: '化學',
        short: '台塑集團',
        feature: '化學製造',
        taiwan50: '0.32%',
        chart: '<img src="img/1301.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.fpg.com.tw'
    },
    '2412中華電': {
        price: '130.5',
        tvSymbol: 'TWSE:2412',
        industry: '電信',
        short: '中華電信',
        feature: '電信服務',
        taiwan50: '0.86%',
        chart: '<img src="img/2412.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.cht.com.tw'
    },
    '5876上海商銀': {
        price: '40.05',
        tvSymbol: 'TWSE:5876',
        industry: '銀行',
        short: '上海商業銀行',
        feature: '銀行業務',
        taiwan50: '0.26%',
        chart: '<img src="img/5876.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.scsb.com.tw/'
    },
    '3711日月光投控': {
        price: '243.5',
        tvSymbol: 'TWSE:3711',
        industry: '半導體',
        short: '日月光投控',
        feature: '封測與代工',
        taiwan50: '1.3%',
        chart: '<img src="img/3711.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.aspeed.com.tw'
    },
    '3231緯創': {
        price: '143.5',
        tvSymbol: 'TWSE:3231',
        industry: '電子',
        short: '緯創資通',
        feature: '電子製造',
        taiwan50: '0.77%',
        chart: '<img src="img/3231.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.wistron.com'
    },
    '2382廣達': {
        price: '286.5',
        tvSymbol: 'TWSE:2382',
        industry: '電子',
        short: '廣達電腦',
        feature: '筆電製造',
        taiwan50: '1.34%',
        chart: '<img src="img/2382.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.quanta.com'
    },
    '2301光寶科': {
        price: '153.5',
        tvSymbol: 'TWSE:2301',
        industry: '電子',
        short: '光寶科技',
        feature: '電子零組件',
        taiwan50: '0.54%',
        chart: '<img src="img/2301.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.liteon.com'
    },
    '4938和碩': {
        price: '68.9',
        tvSymbol: 'TWSE:4938',
        industry: '電子',
        short: '和碩聯合科技',
        feature: '代工組裝',
        taiwan50: '0.24%',
        chart: '<img src="img/4938.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.pegatroncorp.com'
    },
    '2308台達電': {
        price: '938',
        tvSymbol: 'TWSE:2308',
        industry: '電子',
        short: '台達電子',
        feature: '電源管理與自動化',
        taiwan50: '3.34%',
        chart: '<img src="img/2308.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.deltaww.com'
    },
    '4904遠傳': {
        price: '86.8',
        tvSymbol: 'TWSE:4904',
        industry: '電信',
        short: '遠傳電信',
        feature: '電信服務',
        taiwan50: '0.27%',
        chart: '<img src="img/4904.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.fetnet.net.tw'
    },
    '2609陽明': {
        price: '50.8',
        tvSymbol: 'TWSE:2609',
        industry: '運輸',
        short: '陽明海運',
        feature: '航運服務',
        taiwan50: '0.16%',
        chart: '<img src="img/2609.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.yangming.com'
    },
    '2327國巨': {
        price: '237.5',
        tvSymbol: 'TWSE:2327',
        industry: '電子',
        short: '國巨',
        feature: '被動元件製造',
        taiwan50: '0.63%',
        chart: '<img src="img/2327.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.yageo.com'
    },
    '5871中租-KY': {
        price: '102',
        tvSymbol: 'TWSE:5871',
        industry: '金融',
        short: '中租控股',
        feature: '租賃服務',
        taiwan50: '0.26%',
        chart: '<img src="img/5871.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.chaileaseholding.com/'
    },
    '2454聯發科': {
        price: '1405',
        tvSymbol: 'TWSE:2454',
        industry: '半導體',
        short: '聯發科技',
        feature: 'IC設計',
        taiwan50: '3.57%',
        chart: '<img src="img/2454.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.mediatek.com'
    },
    '3045台灣大': {
        price: '105.5',
        tvSymbol: 'TWSE:3045',
        industry: '電信',
        short: '台灣大哥大',
        feature: '電信服務',
        taiwan50: '0.26%',
        chart: '<img src="img/3045.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.taiwanmobile.com'
    },
    '2615萬海': {
        price: '78.2',
        tvSymbol: 'TWSE:2615',
        industry: '運輸',
        short: '萬海航運',
        feature: '航運服務',
        taiwan50: '0.2%',
        chart: '<img src="img/2615.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.tonymarine.com'
    },
    '6505台塑化': {
        price: '48.8',
        tvSymbol: 'TWSE:6505',
        industry: '化學',
        short: '台塑化',
        feature: '化學製造',
        taiwan50: '0.11%',
        chart: '<img src="img/6505.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.fpc.com.tw'
    },
    '2603長榮': {
        price: '183',
        tvSymbol: 'TWSE:2603',
        industry: '運輸',
        short: '長榮海運',
        feature: '航運服務',
        taiwan50: '0.34%',
        chart: '<img src="img/2603.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.evergreen-marine.com'
    },
    '6919康霈': {
        price: '166.5',
        tvSymbol: 'TWSE:6919',
        industry: '生技',
        short: '康霈生技',
        feature: '生技藥品',
        taiwan50: '0.28%',
        chart: '<img src="img/6919.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.caliwaybiopharma.com/'
    },
    '2357華碩': {
        price: '588',
        tvSymbol: 'TWSE:2357',
        industry: '電子',
        short: '華碩電腦',
        feature: '筆電與主機板',
        taiwan50: '0.73',
        chart: '<img src="img/2357.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.asus.com'
    },
    '3034聯詠': {
        price: '373',
        tvSymbol: 'TWSE:3034',
        industry: '電子',
        short: '聯詠科技',
        feature: '顯示晶片',
        taiwan50: '0.39%',
        chart: '<img src="img/3034.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.pixart.com.tw'
    },
    '2912統一超': {
        price: '228',
        tvSymbol: 'TWSE:2912',
        industry: '零售',
        short: '統一超商',
        feature: '便利商店',
        taiwan50: '0.22%',
        chart: '<img src="img/2912.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.7-11.com.tw'
    },
    '2345智邦': {
        price: '1155',
        tvSymbol: 'TWSE:2345',
        industry: '電子',
        short: '智邦科技',
        feature: '網通設備',
        taiwan50: '0.85%',
        chart: '<img src="img/2345.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.abil.com.tw'
    },
    '2379瑞昱': {
        price: '528',
        tvSymbol: 'TWSE:2379',
        industry: '電子',
        short: '瑞昱半導體',
        feature: '網路晶片',
        taiwan50: '0.45%',
        chart: '<img src="img/2379.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.realtek.com'
    },
    '2395研華': {
        price: '280',
        tvSymbol: 'TWSE:2395',
        industry: '電子',
        short: '研華科技',
        feature: '工業自動化',
        taiwan50: '0.23%',
        chart: '<img src="img/2395.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.advantech.com'
    },
    '3017奇鋐': {
        price: '1425',
        tvSymbol: 'TWSE:3017',
        industry: '電子',
        short: '奇鋐科技',
        feature: 'IC設計',
        taiwan50: '0.77%',
        chart: '<img src="img/3017.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.avc.co/zh-tw/'
    },
    '2383台光電': {
        price: '1605',
        tvSymbol: 'TWSE:2383',
        industry: '電子',
        short: '台光電',
        feature: '光電元件',
        taiwan50: '0.69%',
        chart: '<img src="img/2383.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.emctw.com/zh-TW'
    },
    '2207和泰車': {
        price: '595',
        tvSymbol: 'TWSE:2207',
        industry: '汽車',
        short: '和泰汽車',
        feature: '汽車製造與銷售',
        taiwan50: '0.28%',
        chart: '<img src="img/2207.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.hotaimotor.com.tw/'
    },
    '6669緯穎': {
        price: '4405',
        tvSymbol: 'TWSE:6669',
        industry: '電子',
        short: '緯穎科技',
        feature: '伺服器代工',
        taiwan50: '0.83%',
        chart: '<img src="img/6669.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.wiwynn.com/'
    },
    '3008大立光': {
        price: '2060',
        tvSymbol: 'TWSE:3008',
        industry: '光學',
        short: '大立光電',
        feature: '光學鏡頭',
        taiwan50: '0.36%',
        chart: '<img src="img/3008.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.largan.com'
    },
    '3661世芯-KY': {
        price: '3220',
        tvSymbol: 'TWSE:3661',
        industry: '半導體',
        short: '世芯科技',
        feature: 'IC設計',
        taiwan50: '0.44%',
        chart: '<img src="img/3661.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.alchip.com/tw'
    },
    '2059川湖': {
        price: '3740',
        industry: '電子',
        short: '川湖科技',
        feature: '被動元件',
        taiwan50: '0.34%',
        chart: '<img src="img/2059.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.kingslide.com/'
    }
}
// 自動補上 TradingView 的 symbol（若資料內未指定）
// 目前先預設為 TWSE:代碼；若未來有上櫃股票，再針對該檔手動改成 TPEX:代碼
Object.keys(factorDetails).forEach((k) => {
    const d = factorDetails[k];
    if (!d) return;
    const m = k.match(/^\d+/);
    if (!m) return;
    if (!d.tvSymbol) d.tvSymbol = `TWSE:${m[0]}`;
});


// 渲染右側詳細資料
function renderDetail(key) {
    const data = factorDetails[key] || null;
    currentFactor.textContent = key;

    if (!data) {
        detailBox.innerHTML = '<p>尚無詳細資料。</p>';
        return;
    }

    // 從標籤文字中抓出股票代碼（前面的數字），例如「2330台積電」→ 2330
    const codeMatch = key.match(/^\d+/);
    const code = codeMatch ? codeMatch[0] : null;
    const yahooSymbol = code ? `${code}.TW` : null;

    // 從標籤文字中抓出公司名稱（去掉前面的股票代碼），例如「2330台積電」→ 「台積電」
    const companyName = key.replace(/^\d+/, '') || '';

    // 公司網址 HTML：有網址就顯示「點我前往XXX」，沒有則顯示「（無官方網站）」 
    const urlHtml = data.url
        ? `<a href="${data.url}" target="_blank" rel="noopener">點我前往${companyName || '公司網站'}</a>`
        : '（無官方網站）';

    // 這次渲染使用新的容器 id，避免 TradingView widget 快取導致不更新
    const tvContainerId = `tvchart-${Date.now()}`;

    const html = `
    <h3>詳細說明</h3>
    <p><strong>目前股價：</strong> <span id="current-price"></span></p>
    <p><strong>產業：</strong> ${data.industry || '-'}</p>
    <p><strong>簡介：</strong> ${data.short || '-'}</p>
    <p><strong>特色：</strong> ${data.feature || '-'}</p>
    <p><strong>台灣50占比：</strong> ${data.taiwan50 || '-'}</p>

    <div class="stock-chart">
      <p><strong>股價圖表：</strong></p>
      <div class="chart-hint" role="note">
        <div class="hint-row">
          <div class="hint-text">
            <strong>操作提示：</strong>此股價圖為外部網站嵌入，請在<strong>圖表內</strong>向下滑動，即可看到股價圖（K 線 / 技術分析）。
          </div>
          <div class="hint-actions">
            <span class="hint-arrow"><i>⬇</i> 往下滑</span>
            <button type="button" class="hint-jump" id="hint-jump">帶我到圖表</button>
          </div>
        </div>
      </div>
      <div id="chart-anchor"></div>
      ${buildCmoneyIframe(code)}
    </div>
    <p><strong>公司網址：</strong> ${urlHtml}</p>`;

    detailBox.innerHTML = html;

    // 不要在切換股票時「強制」把頁面往下捲（避免使用者覺得畫面被拉走）。
    // 若需要快速定位，改由使用者點「帶我到圖表」手動觸發。

    // 「帶我到圖表」按鈕：捲到圖表區塊（不再用 1/3 的固定位置）
    const jumpBtn = document.getElementById('hint-jump');
    if (jumpBtn) {
        jumpBtn.addEventListener('click', () => {
            const anchor = document.getElementById('chart-anchor');
            if (!anchor) return;

            // 使用 scrollIntoView 對齊區塊上緣；再額外往上留一點空間（避免被 header 壓到）
            try {
                anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setTimeout(() => {
                    try { window.scrollBy({ top: -16, behavior: 'smooth' }); } catch (e) { window.scrollBy(0, -16); }
                }, 120);
            } catch (e) {
                const rect = anchor.getBoundingClientRect();
                const scrollY = window.scrollY || window.pageYOffset || 0;
                const targetTop = Math.max(0, rect.top + scrollY - 16);
                window.scrollTo(0, targetTop);
            }
        });
    }

    // 清除上一檔股票的即時股價更新計時器
    if (yahooIntervalId) {
        clearInterval(yahooIntervalId);
        yahooIntervalId = null;
    }

    // 嘗試從 Yahoo Finance 抓取最新股價，並每 5 秒更新一次
    if (yahooSymbol) {
        // 先立即抓一次
        fetchYahooPrice(yahooSymbol, data.price);

        // 再設定每 5 秒更新
        yahooIntervalId = setInterval(() => {
            fetchYahooPrice(yahooSymbol, data.price);
        }, 5000);
    }
}


// 從 Yahoo Finance 取得最新股價並更新畫面
// async function fetchYahooPrice(symbol, fallbackPrice) {
//     const priceSpan = document.getElementById('current-price');
//     if (!priceSpan) return;

//     try {
//         const response = await fetch(
//             `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbol)}`
//         );
//         if (!response.ok) throw new Error('Network response was not ok');

//         const json = await response.json();
//         const result = json?.quoteResponse?.result?.[0];

//         const price =
//             (result && (result.regularMarketPrice ?? result.postMarketPrice ?? result.preMarketPrice)) ??
//             null;

//         if (price != null) {
//             // 四捨五入到小數點兩位
//             priceSpan.textContent = price.toFixed(2);
//         } else if (fallbackPrice) {
//             priceSpan.textContent = fallbackPrice;
//         } else {
//             priceSpan.textContent = '-';
//         }
//     } catch (error) {
//         console.error('取得 Yahoo 股價失敗：', error);
//         if (fallbackPrice) {
//             priceSpan.textContent = fallbackPrice;
//         } else {
//             priceSpan.textContent = '-';
//         }
//     }
// }

async function fetchYahooPrice(symbol, fallbackPrice) {
    const priceSpan = document.getElementById('current-price');
    if (!priceSpan) return;

    // 1. 改用 v8 Chart API (比 v7 quote 更穩定，不容易被擋)
    // 加上 timestamp 防止瀏覽器讀到舊的快取資料
    const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&events=history&_=${new Date().getTime()}`;
    
    // 使用 corsproxy.io 繞過瀏覽器限制
    const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(targetUrl);

    try {
        const response = await fetch(proxyUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        
        // v8 API 的資料結構比較深，要從 meta 裡面抓
        const meta = json?.chart?.result?.[0]?.meta;
        
        if (!meta) throw new Error('Yahoo API 回傳格式錯誤或無資料');

        // 取得價格與昨日收盤價
        const price = meta.regularMarketPrice;
        const previousClose = meta.chartPreviousClose;

        // 計算漲跌 (v8 meta 裡面沒有直接給漲跌額，要自己算)
        const change = price - previousClose;

        if (price != null) {
            // 四捨五入到小數點兩位
            priceSpan.textContent = price.toFixed(2);

            // 加入漲跌顏色邏輯 (台股：紅漲綠跌)
            priceSpan.style.fontWeight = 'bold';
            priceSpan.style.padding = '2px 6px';
            priceSpan.style.borderRadius = '4px';
            
            if (change > 0) {
                // 漲：紅色字，淺紅底
                priceSpan.style.color = '#e63946'; 
                priceSpan.style.backgroundColor = '#ffe5e5';
                priceSpan.textContent += ' ▲';
            } else if (change < 0) {
                // 跌：綠色字，淺綠底
                priceSpan.style.color = '#2a9d8f';
                priceSpan.style.backgroundColor = '#e0f2f1';
                priceSpan.textContent += ' ▼';
            } else {
                // 平盤：灰色
                priceSpan.style.color = '#555';
                priceSpan.style.backgroundColor = 'transparent';
            }
            
            // 成功抓到資料，不用做其他事了
            return; 

        } 
        
        // 如果 price 是 null，就會往下走到 fallback

    } catch (error) {
        // ★ 如果失敗，這裡會在瀏覽器 F12 的 Console 印出具體原因
        console.error('即時股價抓取失敗，已切換至備用價格。錯誤原因：', error);
    }

    // --- 失敗後的備案 (Fallback) ---
    if (fallbackPrice) {
        priceSpan.textContent = fallbackPrice;
        priceSpan.style.color = ''; 
        priceSpan.style.backgroundColor = '';
        // 可以在這裡加個小標記，自己除錯用 (Demo前可以拿掉)
        // priceSpan.title = "目前顯示的是備用價格 (即時連線失敗)"; 
    } else {
        priceSpan.textContent = '-';
    }
}
// 使用 TradingView Widget 繪製股價圖表
// 使用 TradingView Widget 繪製股價圖表


// 設置按鈕 active
function setActivePill(clicked) {
    pills.forEach(p => p.classList.remove('active'));
    clicked.classList.add('active');

    const label = clicked.dataset.factor.trim();
    renderDetail(label);
}

// 監聽按鈕點擊
pills.forEach(p => {
    p.addEventListener('click', () => setActivePill(p));
});

// 初始化：顯示第一個有資料的股票，並設置 active
window.addEventListener('DOMContentLoaded', () => {
    const firstPill = Array.from(pills).find(p => factorDetails[p.dataset.factor]);
    if (firstPill) setActivePill(firstPill);
});
