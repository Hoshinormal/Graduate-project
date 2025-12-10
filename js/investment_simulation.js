// ========== 表格可滑動提示 ==========
window.addEventListener('load', ()=>{
  const wrapper = document.querySelector('.table-wrapper');
  if(!wrapper) return;
  const hint = document.createElement('div');
  hint.className = 'scroll-hint';
  hint.textContent = '💡 表格可左右滑動';
  wrapper.appendChild(hint);
  setTimeout(()=> hint.remove(), 4000);
});

// ========== 共用：抓表格 ==========
const table = document.querySelector('.stock-table');
const tbody = table.querySelector('tbody');
const getTHs = () => table.querySelectorAll('thead th');

// ========== A. 預設排序（依公司代碼遞增） ==========
function resetToDefaultSort(){
  const rows = Array.from(tbody.rows);
  rows.sort((a,b)=>{
    const ca = parseInt(a.querySelector('.code')?.textContent.trim() || '0', 10);
    const cb = parseInt(b.querySelector('.code')?.textContent.trim() || '0', 10);
    return ca - cb;
  });
  rows.forEach((tr, idx)=>{
    tbody.appendChild(tr);
    const sortCell = tr.querySelector('.sort-index');
    if(sortCell) sortCell.textContent = idx + 1;
  });
  clearSortHighlights();
}

// ========== B. 表頭排序（彈窗固定在 th 下方） ==========
const pop = document.createElement('div');
pop.className = 'sort-pop';
pop.style.display = 'none';
pop.innerHTML = `
  <button class="sp-btn" data-dir="asc"  title="遞增">▲</button>
  <button class="sp-btn" data-dir="desc" title="遞減">▼</button>
  <button class="sp-btn sp-danger" data-dir="cancel">取消</button>
`;
let activeTH = null;

function clearSortHighlights(){
  getTHs().forEach(th=> th.classList.remove('sorted-asc','sorted-desc','th-active'));
}
function openPop(th){
  closePop();
  activeTH = th;
  th.classList.add('th-active');
  th.appendChild(pop);
  pop.style.display = 'flex';
}
function closePop(){
  if (activeTH) activeTH.classList.remove('th-active');
  if (pop.parentNode) pop.parentNode.removeChild(pop);
  pop.style.display = 'none';
  activeTH = null;
}
pop.addEventListener('click', e => e.stopPropagation());

getTHs().forEach(th=>{
  if(!th.classList.contains('not-sort')){
    th.addEventListener('click', (e)=>{
      if (e.target.closest('.sort-pop')) return;
      if(activeTH===th) closePop(); else openPop(th);
    });
  }
});

pop.addEventListener('click',(e)=>{
  const btn = e.target.closest('button');
  if(!btn) return;
  const dir = btn.dataset.dir;

  if(dir === 'cancel'){
    resetToDefaultSort();
    closePop();
    return;
  }

  const idx = Array.from(activeTH.parentNode.children).indexOf(activeTH);
  const asc = dir==='asc';
  const rows = Array.from(tbody.rows);

  rows.sort((a,b)=>{
    const va = a.cells[idx].textContent.trim().replace(/,/g,'');
    const vb = b.cells[idx].textContent.trim().replace(/,/g,'');
    const na = parseFloat(va), nb = parseFloat(vb);
    if(!isNaN(na) && !isNaN(nb)) return asc ? na-nb : nb-na;
    return asc ? va.localeCompare(vb,'zh') : vb.localeCompare(va,'zh');
  });
  rows.forEach((tr,i)=>{
    const sortCell = tr.querySelector('.sort-index');
    if(sortCell) sortCell.textContent = i+1;
    tbody.appendChild(tr);
  });

  clearSortHighlights();
  activeTH.classList.add(asc ? 'sorted-asc' : 'sorted-desc');

  closePop();
});

document.addEventListener('click',(e)=>{
  if(pop.style.display==='none') return;
  if(!e.target.closest('.stock-table') && !e.target.closest('.sort-pop')) closePop();
});

// 頁面載入時先回預設排序一次
resetToDefaultSort();

// （以下為會員投資試算功能，已暫時停用並以區塊註解保留原始程式碼）
/*
// ==========C. 會員功能：投資試算 ==========
const toggleBtn = document.getElementById('toggle-sim-panel');
const panel     = document.getElementById('sim-panel');
const runBtn    = document.getElementById('run-simulation');
const resetBtn  = document.getElementById('reset-simulation');
const simCells  = Array.from(document.querySelectorAll('.sim-cell'));
const pointInputs = Array.from(document.querySelectorAll('.point-input'));
const selectedCountSpan = document.getElementById('selected-count');
const pointSumSpan      = document.getElementById('point-sum');
const pointRemainSpan   = document.getElementById('point-remain');
const resultPanel       = document.getElementById('result-panel');

// 基準指數（0050 & 大盤 TWI）2020–2024 + 2025（上半年簡易試算用）
const BENCHMARK_RETURNS = {
  '0050': { y2020:30.11, y2021:19.87, y2022:-21.75, y2023:26.89, y2024:49.20, y2025:-1.20 },
  'TWI':  { y2020:20.91, y2021:22.18, y2022:-22.63, y2023:26.07, y2024:29.05, y2025:-1.12 }
};

// 個股 2025 上半年報酬率（一點視為 1 萬元投資）
const HALF_2025_RETURNS = {
  '0050': -1.2,
  '2059': 31.29,
  '2357': 10.09,
  '2379': -0.18,
  '2383': 42.72,
  '2603': 1.97,
  '2609': -6.08,
  '2615': 13.8,
  '2881': -3.32,
  '2882': -2.93,
  '2883': -8.14,
  'TWI': -1.12
};

function getActiveCells(){
  return simCells.filter(c => c.classList.contains('sim-active'));
}

// 更新「已選數量」「點數總和」「剩餘點數」
function updateSummary(){
  const active = getActiveCells();
  const totalPoints = active.reduce((sum, cell) => {
    const input = cell.querySelector('.point-input');
    const v = parseInt((input && input.value) ? input.value : '0', 10);
    return sum + (isNaN(v) ? 0 : v);
  }, 0);

  if(selectedCountSpan) selectedCountSpan.textContent = String(active.length);
  if(pointSumSpan)      pointSumSpan.textContent      = String(totalPoints);

  if(pointRemainSpan){
    const remain = 100 - totalPoints;
    pointRemainSpan.textContent = String(remain);
    pointRemainSpan.classList.remove('remain-over','remain-zero');
    if(remain < 0) pointRemainSpan.classList.add('remain-over');
    else if(remain === 0) pointRemainSpan.classList.add('remain-zero');
  }
}

// 初始：所有輸入欄位鎖定
pointInputs.forEach(input => {
  // 一開始鎖定，需點選投資欄位才可啟用
  input.disabled = true;
  input.setAttribute('inputmode', 'numeric');

  // 只允許輸入 1～100 的整數
  input.addEventListener('input', () => {
    let val = input.value || '';

    // 移除非數字字元（英文字母、符號、小數點、負號等）
    val = val.replace(/[^0-9]/g, '');

    // 避免多個前導 0，例如 001 -> 1
    val = val.replace(/^0+(\d)/, '$1');

    if (val === '') {
      input.value = '';
      updateSummary();
      return;
    }

    let num = parseInt(val, 10);
    if (isNaN(num)) {
      input.value = '';
      updateSummary();
      return;
    }

    if (num < 1) num = 1;
    if (num > 100) num = 100;

    input.value = String(num);
    updateSummary();
  });

  // 失焦時再做一次界線修正
  input.addEventListener('blur', () => {
    let val = (input.value || '').trim();
    if (val === '') {
      updateSummary();
      return;
    }
    let num = parseInt(val, 10);
    if (isNaN(num) || num < 1) num = 1;
    if (num > 100) num = 100;
    input.value = String(num);
    updateSummary();
  });
});

// 點擊投資設定欄：啟用 / 取消
simCells.forEach(cell => {
  const checkbox = cell.querySelector('.row-select');
  const input    = cell.querySelector('.point-input');

  cell.addEventListener('click', e => {
    // 點到輸入框本身時，不做啟用/取消切換
    if(e.target.closest('.point-input')) return;

    const isActive = cell.classList.contains('sim-active');

    if(!isActive){
      // 準備啟用：檢查已選數量
      const activeCount = getActiveCells().length;
      if(activeCount >= 5){
        alert('一次最多選擇 5 檔股票進行試算。');
        return;
      }
      cell.classList.add('sim-active');
      if(checkbox) checkbox.checked = true;
      if(input){
        if(!input.value) input.value = '10'; // 預設 10 點，可再自行調整
        input.disabled = false;
        input.focus();
        input.select();
      }
    }else{
      // 再點一次：取消選取 + 清空並鎖定
      cell.classList.remove('sim-active');
      if(checkbox) checkbox.checked = false;
      if(input){
        input.value = '';
        input.disabled = true;
        input.blur();
      }
    }

    updateSummary();
  });
});

// 展開/收起面板，同時控制表格是否顯示「投資設定」欄位
if(toggleBtn && panel && table){
  panel.style.display = 'none'; // 確保初始為收起
  table.classList.remove('table-show-sim');

  toggleBtn.addEventListener('click', () => {
    const opening = panel.style.display === 'none';
    panel.style.display = opening ? 'block' : 'none';
    table.classList.toggle('table-show-sim', opening);
  });
}

// 重設
function resetSimulation(){
  simCells.forEach(cell => {
    cell.classList.remove('sim-active');
    const checkbox = cell.querySelector('.row-select');
    const input    = cell.querySelector('.point-input');
    if(checkbox) checkbox.checked = false;
    if(input){
      input.value = '';
      input.disabled = true;
    }
  });
  if(resultPanel) resultPanel.textContent = '';
  updateSummary();
}
if(resetBtn){
  resetBtn.addEventListener('click', resetSimulation);
}

// 小工具：數字格式化
function formatMoney(value){
  return value.toLocaleString('zh-TW', { maximumFractionDigits: 0 });
}
function formatPercent(value){
  return value.toFixed(2) + '%';
}

// 試算按鈕：檢查輸入並依 2025 上半年報酬率估算
if(runBtn){
  runBtn.addEventListener('click', () => {
    const active = getActiveCells();
    if(active.length === 0){
      alert('請先在「投資設定」欄位選擇至少 1 檔股票。');
      return;
    }

    let totalPoints = 0;
    const investments = [];
    const missingCodes = [];

    for(const cell of active){
      const input = cell.querySelector('.point-input');
      if(!input || !input.value){
        alert('已啟用的「投資設定」欄位，其投資點數不得為空白。');
        return;
      }

      const v = parseInt(input.value, 10);
      if(isNaN(v) || v < 1 || v > 100){
        alert('投資點數必須介於 1～100 之間。');
        return;
      }
      totalPoints += v;

      const row   = cell.closest('tr');
      const codeEl = row ? row.querySelector('.code') : null;
      const nameEl = row ? row.querySelector('.name') : null;
      const code  = codeEl ? codeEl.textContent.trim() : '';
      const name  = nameEl ? nameEl.textContent.trim() : '';

      const r = Object.prototype.hasOwnProperty.call(HALF_2025_RETURNS, code) ? HALF_2025_RETURNS[code] : null;
      if(typeof r !== 'number'){
        missingCodes.push(code || '（未知代碼）');
      } else {
        investments.push({ code, name, points: v, halfReturn: r });
      }
    }

    if(missingCodes.length > 0){
      const unique = Array.from(new Set(missingCodes));
      alert('找不到下列股票的 2025 年上半年報酬率資料，請檢查代碼是否正確：\n' + unique.join('、'));
      return;
    }

    // 強制總點數必須剛好等於 100 點
    if(totalPoints !== 100){
      if(totalPoints < 100){
        alert(`目前投資點數總和為 ${totalPoints} 點，必須剛好等於 100 點才能開始試算。`);
      }else{
        alert(`目前投資點數總和為 ${totalPoints} 點，已超過 100 點，請調整為剛好 100 點。`);
      }
      updateSummary();
      return;
    }

    updateSummary();

    const totalInvest = totalPoints * 10000; // 一點視為一萬
    const weightedReturn = investments.reduce((sum, item) => sum + item.points * item.halfReturn, 0) / totalPoints;
    const finalPortfolio = totalInvest * (1 + weightedReturn / 100);

    const bench0050 = BENCHMARK_RETURNS['0050'].y2025;
    const benchTWI  = BENCHMARK_RETURNS['TWI'].y2025;
    const final0050 = totalInvest * (1 + bench0050 / 100);
    const finalTWI  = totalInvest * (1 + benchTWI / 100);

    if(resultPanel){
      resultPanel.innerHTML = `
        <h4>2025 上半年投資組合試算結果</h4>
        <p>本次試算共選擇 <b>${active.length}</b> 檔股票，總投資點數 <b>${totalPoints}</b> 點，假設每點代表 <b>10,000</b> 元，投入資金共 <b>${formatMoney(totalInvest)}</b> 元。</p>
        <table class="result-table" aria-label="2025 上半年報酬比較">
          <thead>
            <tr>
              <th>比較標的</th>
              <th>2025 上半年報酬率</th>
              <th>期末資產（約）</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>你的投資組合</td>
              <td>${formatPercent(weightedReturn)}</td>
              <td>${formatMoney(finalPortfolio)} 元</td>
            </tr>
            <tr>
              <td>0050 ETF</td>
              <td>${formatPercent(bench0050)}</td>
              <td>${formatMoney(final0050)} 元</td>
            </tr>
            <tr>
              <td>加權指數（TWI）</td>
              <td>${formatPercent(benchTWI)}</td>
              <td>${formatMoney(finalTWI)} 元</td>
            </tr>
          </tbody>
        </table>
        <p class="result-note">※ 試算結果以 2025 年上半年報酬率估算，僅供學習與模擬使用，非實際投資建議。</p>
      `;
    }
  });
}

// 初始化畫面
updateSummary();

*/
