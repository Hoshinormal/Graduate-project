const dataThreeFactor = {
    stocks: [
        {rank:1,code:"2303", name:"聯電", returns:[201.03,42.10,-33.13,38.72,-13.50]},
        {rank:2,code:"2317", name:"鴻海", returns:[6.50,17.14,1.05,9.64,80.73]},
        {rank:3,code:"2357", name:"華碩", returns:[14.99,62.31,-17.94,91.63,30.30]},
        {rank:4,code:"2603", name:"長榮", returns:[228.22,256.52,-40.11,53.95,64.83]},
        {rank:5,code:"2609", name:"陽明", returns:[305.69,313.68,-11.29,7.22,52.09]},
        {rank:6,code:"2615", name:"萬海", returns:[196.89,314.55,-49.50,-25.51,50.08]},
        {rank:7,code:"2883", name:"凱基金", returns:[1.93,95.64,-22.42,-0.40,41.66]},
        {rank:8,code:"2891", name:"中信金", returns:[-7.68,38.19,-10.05,33.50,44.51]},
        {rank:9,code:"3034", name:"聯詠", returns:[75.01,50.88,-28.61,79.14,2.55]},
        {rank:10,code:"3231", name:"緯創", returns:[15.82,1.41,10.34,243.88,8.01]},
    ],
    summary:{
        factorReturns:[103.84,119.24,-22.37,53.18,36.13],
        marketReturn:[20.91,22.18,-22.63,26.07,29.05]
    }
};

const dataTwoFactor = {
    stocks: [
        {rank:1,code:"2603", name:"長榮", returns:[228.22, 256.52, -40.11, 53.95, 64.83]},
        {rank:2,code:"3034", name:"聯詠", returns:[75.01, 50.88, -28.61, 79.14, 2.55]},
        {rank:3,code:"2615", name:"萬海", returns:[196.89,314.55,-49.50,-25.51,50.08]},
        {rank:4,code:"3017", name:"奇鋐", returns:[61.61,38.79,31.86,208.22,87.31]},
        {rank:5,code:"5871", name:"中租-KY", returns:[31.33,68.28,-11.09,-6.47,-37.72]},
        {rank:6,code:"3711", name:"日月光控股", returns:[0.59,35.41,-4.03,55.21,23.80]},
        {rank:7,code:"2891", name:"中信金", returns:[-7.68,38.19,-10.05,33.50,44.51]},
        {rank:8,code:"6669", name:"緯穎", returns:[14.03,63.74,-26.15,138.73,45.87]},
        {rank:9,code:"2383", name:"台光電", returns:[18.76,82.41,-34.75,127.61,65.45]},
        {rank:10,code:"2327", name:"國巨", returns:[22.44,-5.76,-21.88,35.09,11.19]},
    ],
    summary:{
        factorReturns:[64.12,94.30,-19.43,69.95,35.79],
        marketReturn:[20.91,22.18,-22.63,26.07,29.05]
    }
};
        


function switchFactor(type){
    document.querySelectorAll('.factor-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-${type}`).classList.add('active');
// B. 決定要用哪一組數據
    const currentData = (type === 2) ? dataTwoFactor : dataThreeFactor;

    // C. 渲染上方股票表格
    const stockTbody = document.getElementById('stock-tbody');
    stockTbody.innerHTML = ""; // 清空舊資料
    
    currentData.stocks.forEach(stock => {
        // 建立一行 HTML
        const row = `
            <tr>
                <td class=center sort-index></td>
                <td class=num code>${stock.code}</td>
                <td style="text-align:center;">${stock.name}</td>
                <td class=num>${stock.returns[0]}</td>
                <td class=num>${stock.returns[1]}</td>
                <td class=num>${stock.returns[2]}</td>
                <td class=num>${stock.returns[3]}</td>
                <td class=num>${stock.returns[4]}</td>
            </tr>
        `;
        stockTbody.innerHTML += row;
    });

    // D. 渲染下方總結表格
    const summaryTbody = document.getElementById('summary-tbody');
    summaryTbody.innerHTML = `
        <tr>
            <td style="background-color:#fff3cd; font-weight:bold">因子投資 ( 10 檔等權重 )</td>
            ${currentData.summary.factorReturns.map(val => `<td style="background-color:#fff3cd; font-weight:bold;text-align:right;">${val}</td>`).join('')}
        </tr>
        <tr>
            <td>加權指數 ( TWI )</td>
            ${currentData.summary.marketReturn.map(val => `<td style="text-align:right;">${val}</td>`).join('')}
        </tr>
    `;
}

// --- 3. 初始化 ---
// 網頁載入時，先執行一次以顯示「雙因子」的資料
window.onload = () => switchFactor(2);