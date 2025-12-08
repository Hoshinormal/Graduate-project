
// taiwan_50.js — 0050 頁面排序＋多因子（不含徽章版）

const table = document.querySelector('.stock-table');
const tbody = table.querySelector('tbody');
const ths = table.querySelectorAll('thead th');

// ----------- 排序樣式 ----------- //
function clearSortClasses(){
  ths.forEach(th=>th.classList.remove('sorted-asc','sorted-desc'));
}
function applySortClass(th, dir){
  clearSortClasses();
  if(dir==='asc') th.classList.add('sorted-asc');
  if(dir==='desc') th.classList.add('sorted-desc');
}

// ----------- 排序彈窗 ----------- //
const pop = document.createElement('div');
pop.className = 'sort-pop';
pop.style.display = 'none';
pop.innerHTML = `
  <button class="sp-btn" data-dir="asc">▲</button>
  <button class="sp-btn" data-dir="desc">▼</button>
  <button class="sp-btn sp-danger" data-dir="cancel">取消</button>
`;

let activeTH = null;

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

ths.forEach(th=>{
  if(!th.classList.contains('not-sort')){
    th.addEventListener('click',(e)=>{
      if(e.target.closest('.sort-pop')) return;
      if(activeTH === th) closePop(); else openPop(th);
    });
  }
});

pop.addEventListener('click',(e)=>{
  const btn = e.target.closest('button');
  if(!btn) return;

  const dir = btn.dataset.dir;
  if(dir === 'cancel'){
    if(activeTH) activeTH.classList.remove('sorted-asc','sorted-desc');
    closePop();
    return;
  }

  applySortClass(activeTH, dir);
  const idx = Array.from(activeTH.parentNode.children).indexOf(activeTH);
  const asc = dir === 'asc';

  const rows = Array.from(tbody.rows);
  rows.sort((a,b)=>{
    const va = a.cells[idx].textContent.trim().replace(/,/g,'');
    const vb = b.cells[idx].textContent.trim().replace(/,/g,'');
    const na = parseFloat(va), nb = parseFloat(vb);
    if(!isNaN(na) && !isNaN(nb)) return asc? na-nb : nb-na;
    return asc? va.localeCompare(vb,'zh') : vb.localeCompare(va,'zh');
  });

  rows.forEach((tr,i)=>{
    tr.cells[0].textContent = i+1;
    tbody.appendChild(tr);
  });
  closePop();
});

document.addEventListener('click',(e)=>{
  if(pop.style.display==='none') return;
  if(!e.target.closest('.stock-table') && !e.target.closest('.sort-pop')) closePop();
});

// ----------- 預設排序：公司代碼遞增 ----------- //
function resetDefault(){
  const idx = 1;
  const rows = Array.from(tbody.rows);
  rows.sort((a,b)=>{
    const na = parseInt(a.cells[idx].textContent.trim(),10);
    const nb = parseInt(b.cells[idx].textContent.trim(),10);
    return (isNaN(na)?0:na) - (isNaN(nb)?0:nb);
  });

  rows.forEach((tr,i)=>{
    tr.cells[0].textContent = i+1;
    tbody.appendChild(tr);
  });

  if(ths[1]) applySortClass(ths[1],'asc');
}

// ========== 會員功能（不含徽章） ========== //
const toggleBtn = document.getElementById('toggle-weight-panel');
const panel     = document.getElementById('weight-panel');
const applyBtn  = document.getElementById('apply-weight');
const resetBtn  = document.getElementById('reset-weight');
const factors   = Array.from(document.querySelectorAll('.factor'));

// 清除表頭高亮
function clearMfHead(){
  ths.forEach(th=> th.classList.remove('mf-active'));
}

// 表頭依選到因子變色（無徽章版）
function highlightSelectedFactors(){
  clearMfHead();
  const selected = activeFactors();
  selected.forEach(f=>{
    const colIndex = Number(f.dataset.col);
    const targetTh = ths[colIndex];
    if(targetTh){
      targetTh.classList.add('mf-active');
    }
  });
}

// 清除得分欄
function clearScoreOnly(){
  const scoreTh = table.querySelector('thead th.score-col');
  if(scoreTh) scoreTh.remove();

  Array.from(tbody.rows).forEach(tr=>{
    const sc = tr.querySelector('td.score-cell');
    if(sc) tr.removeChild(sc);
    tr.classList.remove('rank-1','rank-2','rank-3');
  });
}

// 完整重置
function clearScoreAndReset(){
  clearScoreOnly();
  clearMfHead();
  resetDefault();
}

// 展開/收起面板
if(toggleBtn){
  toggleBtn.addEventListener('click',()=>{
    const opening = panel.style.display === 'none';
    panel.style.display = opening? 'block':'none';
    if(!opening) clearScoreAndReset();
  });
}

// 重設按鈕
if(resetBtn){
  resetBtn.addEventListener('click',()=>{
    factors.forEach(f=> f.classList.remove('active'));
    clearScoreAndReset();
  });
}

// 限制：最多 3、至少 2
function activeFactors(){ return factors.filter(f=>f.classList.contains('active')); }

factors.forEach(f=>{
  f.addEventListener('click',()=>{
    const willActivate = !f.classList.contains('active');
    if(willActivate && activeFactors().length >= 3){
      alert('一次僅能選擇 2～3 個因子');
      return;
    }
    f.classList.toggle('active');
    highlightSelectedFactors();
  });
});

// 推薦組合
document.querySelectorAll('.apply-combo').forEach(btn=>{
  btn.addEventListener('click',()=>{
    clearScoreOnly();
    factors.forEach(f=> f.classList.remove('active'));

    const cols = btn.dataset.cols.split(',').map(s=>Number(s.trim()));
    cols.forEach(col=>{
      const target = factors.find(f=> Number(f.dataset.col) === col);
      if(target) target.classList.add('active');
    });

    highlightSelectedFactors();
  });
});

// ----------- 名次計算 ----------- //
function buildRankPoints(colIndex, lowBetter){
  const rows = Array.from(tbody.rows);
  const values = rows.map((tr,i)=>{
    const raw = tr.cells[colIndex].textContent.trim().replace(/,/g,'');
    let v = parseFloat(raw);
    if(isNaN(v)) v = lowBetter? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
    return {i, v};
  });

  values.sort((a,b)=> lowBetter? a.v-b.v : b.v-a.v);

  const N = values.length;
  const points = new Array(N);
  values.forEach((item,rankIdx)=>{
    points[item.i] = N - rankIdx;
  });
  return points;
}

// ----------- 主計算 ----------- //
function doCalculate(){
  clearScoreOnly();
  const picked = activeFactors();
  if(picked.length < 2 || picked.length > 3){
    alert('請選擇 2～3 個因子');
    return;
  }

  const cols = picked.map(f=>Number(f.dataset.col));
  const lows = picked.map(f=>f.classList.contains('low-better'));
  const pointsList = cols.map((c,i)=> buildRankPoints(c,lows[i]));

  let scoreTh = table.querySelector('thead th.score-col');
  if(!scoreTh){
    scoreTh = document.createElement('th');
    scoreTh.textContent = '得分';
    scoreTh.className = 'score-col';
    table.querySelector('thead tr').insertBefore(scoreTh, table.querySelector('thead tr').firstChild);
  }

  clearSortClasses();
  scoreTh.classList.add('sorted-desc');

  const rows = Array.from(tbody.rows);
  rows.forEach((tr,i)=>{
    const score = pointsList.reduce((s,arr)=> s+(arr[i]||0), 0);
    let td = tr.querySelector('td.score-cell');
    if(!td){
      td = document.createElement('td');
      td.className = 'score-cell num';
      tr.insertBefore(td, tr.firstChild);
    }
    td.textContent = String(score);
  });

  rows.sort((a,b)=>{
    const sa = parseFloat(a.querySelector('.score-cell').textContent)||0;
    const sb = parseFloat(b.querySelector('.score-cell').textContent)||0;
    return sb - sa;
  });

  rows.forEach((tr,i)=>{
    tbody.appendChild(tr);
    tr.cells[1].textContent = i+1;
    tr.classList.remove('rank-1','rank-2','rank-3');
    if(i===0) tr.classList.add('rank-1');
    else if(i===1) tr.classList.add('rank-2');
    else if(i===2) tr.classList.add('rank-3');
  });
}

// 綁定開始計算
if(applyBtn){
  applyBtn.addEventListener('click',()=>{
    highlightSelectedFactors();
    doCalculate();
  });
}

// 初始化
resetDefault();
