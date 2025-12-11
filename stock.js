const pills = document.querySelectorAll('.pill');
const currentFactor = document.getElementById('current-factor');
const detailBox = document.getElementById('detail-box');

// 因子詳細資料（每個股票）
const factorDetails = {
    '2330台積電': {
        price: '560',
        industry: '半導體',
        short: '全球最大的晶圓代工廠',
        feature: '技術領先、市場占有率高',
        taiwan50: '61.53%',
        chart: '<img src="img/2330.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.tsmc.com'
    },
    '2887台新新光金': {
        price: '25',
        industry: '金融業',
        short: '以銀行及保險業務為主的金融集團',
        feature: '資本穩健、金融服務多元',
        taiwan50: '0.71%',
        chart: '<img src="img/2887.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.taishin.com.tw'
    },
    '2891中信金': {
        price: '30',
        industry: '金融業',
        short: '中信金控',
        feature: '穩健經營',
        taiwan50: '1.34%',
        chart: '<img src="img/2891.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.ctbcholding.com/'
    },
    '2883凱基金': {
        price: '20',
        industry: '金融業',
        short: '凱基金控',
        feature: '多元業務',
        taiwan50: '0.43%',
        chart: '<img src="img/2883.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.kgi.com/'
    },
    '2884玉山金': {
        price: '22',
        industry: '金融業',
        short: '玉山金控',
        feature: '銀行與證券業務',
        taiwan50: '0.81%',
        chart: '<img src="img/2884.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.esunfhc.com/'
    },
    '2317鴻海': {
        price: '105',
        industry: '電子',
        short: '全球代工巨頭',
        feature: '製造能力強',
        taiwan50: '4.8%',
        chart: '<img src="img/2317.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.foxconn.com'
    },
    '2890永豐金': {
        price: '15',
        industry: '金融業',
        short: '永豐金控',
        feature: '銀行與證券',
        taiwan50: '0.56%',
        chart: '<img src="img/2890.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.sinotrade.com.tw/'
    },
    '2886兆豐金': {
        price: '28',
        industry: '金融業',
        short: '兆豐金控',
        feature: '銀行及保險',
        taiwan50: '0.82%',
        chart: '<img src="img/2886.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.megaholdings.com.tw/'
    },
    '2303聯電': {
        price: '60',
        industry: '半導體',
        short: '晶圓代工',
        feature: '穩定技術',
        taiwan50: '0.96%',
        chart: '<img src="img/2303.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.umc.com'
    },
    '2002中鋼': {
        price: '30',
        industry: '鋼鐵',
        short: '中鋼公司',
        feature: '鋼鐵製造',
        taiwan50: '0.37%',
        chart: '<img src="img/2002.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.csc.com.tw'
    },
    '2885元大金': {
        price: '18',
        industry: '金融業',
        short: '元大金控',
        feature: '證券與銀行',
        taiwan50: '0.69%',
        chart: '<img src="img/2885.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.yuanta.com/'
    },
    '2892第一金': {
        price: '19',
        industry: '金融業',
        short: '第一金控',
        feature: '銀行業務',
        taiwan50: '0.52',
        chart: '<img src="img/2892.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.firstholding.com.tw/'
    },
    '5880合庫金': {
        price: '21',
        industry: '金融業',
        short: '合作金庫金控',
        feature: '銀行及投資',
        taiwan50: '0.43%',
        chart: '<img src="img/5880.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.tcfhc.com.tw/'
    },
    '2882國泰金': {
        price: '50',
        industry: '金融業',
        short: '國泰金控',
        feature: '保險與銀行',
        taiwan50: '1.09%',
        chart: '<img src="img/2882.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.cathayholdings.com.tw'
    },
    '2880華南金': {
        price: '17',
        industry: '金融業',
        short: '華南金控',
        feature: '銀行業務',
        taiwan50: '0.49%',
        chart: '<img src="img/2880.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.hnfhc.com.tw/'
    },
    '2881富邦金': {
        price: '55',
        industry: '金融業',
        short: '富邦金控',
        feature: '保險與投資',
        taiwan50: '1.35%',
        chart: '<img src="img/2881.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.fubon.com'
    },
    '1303南亞': {
        price: '90',
        industry: '化學',
        short: '南亞塑膠',
        feature: '化學原料',
        taiwan50: '0.58%',
        chart: '<img src="img/1303.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.nanya.com.tw'
    },
    '1216統一': {
        price: '130',
        industry: '食品',
        short: '統一企業',
        feature: '食品與飲料',
        taiwan50: '0.64%',
        chart: '<img src="img/1216.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.uni-president.com.tw'
    },
    '1301台塑': {
        price: '110',
        industry: '化學',
        short: '台塑集團',
        feature: '化學製造',
        taiwan50: '0.32%',
        chart: '<img src="img/1301.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.fpg.com.tw'
    },
    '2412中華電': {
        price: '100',
        industry: '電信',
        short: '中華電信',
        feature: '電信服務',
        taiwan50: '0.86%',
        chart: '<img src="img/2412.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.cht.com.tw'
    },
    '5876上海商銀': {
        price: '25',
        industry: '銀行',
        short: '上海商業銀行',
        feature: '銀行業務',
        taiwan50: '0.26%',
        chart: '<img src="img/5876.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.scsb.com.tw/'
    },
    '3711日月光投控': {
        price: '105',
        industry: '半導體',
        short: '日月光投控',
        feature: '封測與代工',
        taiwan50: '1.3%',
        chart: '<img src="img/3711.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.aspeed.com.tw'
    },
    '3231緯創': {
        price: '60',
        industry: '電子',
        short: '緯創資通',
        feature: '電子製造',
        taiwan50: '0.77%',
        chart: '<img src="img/3231.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.wistron.com'
    },
    '2382廣達': {
        price: '55',
        industry: '電子',
        short: '廣達電腦',
        feature: '筆電製造',
        taiwan50: '1.34%',
        chart: '<img src="img/2382.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.quanta.com'
    },
    '2301光寶科': {
        price: '40',
        industry: '電子',
        short: '光寶科技',
        feature: '電子零組件',
        taiwan50: '0.54%',
        chart: '<img src="img/2301.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.liteon.com'
    },
    '4938和碩': {
        price: '110',
        industry: '電子',
        short: '和碩聯合科技',
        feature: '代工組裝',
        taiwan50: '0.24%',
        chart: '<img src="img/4938.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.pegatroncorp.com'
    },
    '2308台達電': {
        price: '220',
        industry: '電子',
        short: '台達電子',
        feature: '電源管理與自動化',
        taiwan50: '3.34%',
        chart: '<img src="img/2308.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.deltaww.com'
    },
    '4904遠傳': {
        price: '60',
        industry: '電信',
        short: '遠傳電信',
        feature: '電信服務',
        taiwan50: '0.27%',
        chart: '<img src="img/4904.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.fetnet.net.tw'
    },
    '2609陽明': {
        price: '110',
        industry: '運輸',
        short: '陽明海運',
        feature: '航運服務',
        taiwan50: '0.16%',
        chart: '<img src="img/2609.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.yangming.com'
    },
    '2327國巨': {
        price: '80',
        industry: '電子',
        short: '國巨',
        feature: '被動元件製造',
        taiwan50: '0.63%',
        chart: '<img src="img/2327.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.yageo.com'
    },
    '5871中租-KY': {
        price: '150',
        industry: '金融',
        short: '中租控股',
        feature: '租賃服務',
        taiwan50: '0.26%',
        chart: '<img src="img/5871.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.chaileaseholding.com/'
    },
    '2454聯發科': {
        price: '1000',
        industry: '半導體',
        short: '聯發科技',
        feature: 'IC設計',
        taiwan50: '3.57%',
        chart: '<img src="img/2454.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.mediatek.com'
    },
    '3045台灣大': {
        price: '110',
        industry: '電信',
        short: '台灣大哥大',
        feature: '電信服務',
        taiwan50: '0.26%',
        chart: '<img src="img/3045.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.taiwanmobile.com'
    },
    '2615萬海': {
        price: '90',
        industry: '運輸',
        short: '萬海航運',
        feature: '航運服務',
        taiwan50: '0.2%',
        chart: '<img src="img/2615.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.tonymarine.com'
    },
    '6505台塑化': {
        price: '95',
        industry: '化學',
        short: '台塑化',
        feature: '化學製造',
        taiwan50: '0.11%',
        chart: '<img src="img/6505.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.fpc.com.tw'
    },
    '2603長榮': {
        price: '110',
        industry: '運輸',
        short: '長榮海運',
        feature: '航運服務',
        taiwan50: '0.34%',
        chart: '<img src="img/2603.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.evergreen-marine.com'
    },
    '6919康霈': {
        price: '50',
        industry: '生技',
        short: '康霈生技',
        feature: '生技藥品',
        taiwan50: '0.28%',
        chart: '<img src="img/6919.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.caliwaybiopharma.com/'
    },
    '2357華碩': {
        price: '500',
        industry: '電子',
        short: '華碩電腦',
        feature: '筆電與主機板',
        taiwan50: '0.73',
        chart: '<img src="img/2357.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.asus.com'
    },
    '3034聯詠': {
        price: '280',
        industry: '電子',
        short: '聯詠科技',
        feature: '顯示晶片',
        taiwan50: '0.39%',
        chart: '<img src="img/3034.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.pixart.com.tw'
    },
    '2912統一超': {
        price: '240',
        industry: '零售',
        short: '統一超商',
        feature: '便利商店',
        taiwan50: '0.22%',
        chart: '<img src="img/2912.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.7-11.com.tw'
    },
    '2345智邦': {
        price: '150',
        industry: '電子',
        short: '智邦科技',
        feature: '網通設備',
        taiwan50: '0.85%',
        chart: '<img src="img/2345.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.abil.com.tw'
    },
    '2379瑞昱': {
        price: '500',
        industry: '電子',
        short: '瑞昱半導體',
        feature: '網路晶片',
        taiwan50: '0.45%',
        chart: '<img src="img/2379.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.realtek.com'
    },
    '2395研華': {
        price: '300',
        industry: '電子',
        short: '研華科技',
        feature: '工業自動化',
        taiwan50: '0.23%',
        chart: '<img src="img/2395.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.advantech.com'
    },
    '3017奇鋐': {
        price: '60',
        industry: '電子',
        short: '奇鋐科技',
        feature: 'IC設計',
        taiwan50: '0.77%',
        chart: '<img src="img/3017.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.avc.co/zh-tw/'
    },
    '2383台光電': {
        price: '55',
        industry: '電子',
        short: '台光電',
        feature: '光電元件',
        taiwan50: '0.69%',
        chart: '<img src="img/2383.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.emctw.com/zh-TW'
    },
    '2207和泰車': {
        price: '350',
        industry: '汽車',
        short: '和泰汽車',
        feature: '汽車製造與銷售',
        taiwan50: '0.28%',
        chart: '<img src="img/2207.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.hotaimotor.com.tw/'
    },
    '6669緯穎': {
        price: '600',
        industry: '電子',
        short: '緯穎科技',
        feature: '伺服器代工',
        taiwan50: '0.83%',
        chart: '<img src="img/6669.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.wiwynn.com/'
    },
    '3008大立光': {
        price: '7000',
        industry: '光學',
        short: '大立光電',
        feature: '光學鏡頭',
        taiwan50: '0.36%',
        chart: '<img src="img/3008.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.largan.com'
    },
    '3661世芯-KY': {
        price: '250',
        industry: '半導體',
        short: '世芯科技',
        feature: 'IC設計',
        taiwan50: '0.44%',
        chart: '<img src="img/3661.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.alchip.com/tw'
    },
    '2059川湖': {
        price: '35',
        industry: '電子',
        short: '川湖科技',
        feature: '被動元件',
        taiwan50: '0.34%',
        chart: '<img src="img/2059.png" style="max-width: 100%; height: auto;">',
        url: 'https://www.kingslide.com/'
    }
}

// 渲染右側詳細資料
function renderDetail(key) {
    const data = factorDetails[key] || null;
    currentFactor.textContent = key;

    if (!data) {
        detailBox.innerHTML = '<p>尚無詳細資料。</p>';
        return;
    }

    const html = `
    <h3>詳細說明</h3>
    <p><strong>現在市價：</strong> ${data.price || '-'}</p>
    <p><strong>產業：</strong> ${data.industry || '-'}</p>
    <p><strong>簡介：</strong> ${data.short || '-'}</p>
    <p><strong>特色：</strong> ${data.feature || '-'}</p>
    <p><strong>台灣50占比：</strong> ${data.taiwan50 || '-'}</p>

    <p><strong>股價圖表：</strong> ${data.chart || '-'}</p>
    <p><strong>公司網址：</strong> <a href="${data.url || '#'}" target="_blank">${data.url || '-'}</a></p>`;

    detailBox.innerHTML = html;
}

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