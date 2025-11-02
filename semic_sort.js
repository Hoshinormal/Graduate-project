// ========== 表格可滑動提示 ==========
window.addEventListener('load', ()=>{
  const wrapper = document.querySelector('.table-wrapper');
  if(!wrapper) return;
  const hint = document.createElement('div');
  hint.className = 'scroll-hint';
  hint.textContent = '💡 表格可左右滑動';
  wrapper.style.position = 'relative';
  wrapper.appendChild(hint);
  setTimeout(()=> hint.remove(), 4000);
});

// ========== 共用：抓表格 ==========
const table = document.querySelector('.stock-table');
const tbody = table.querySelector('tbody');
const getTHs = () => table.querySelectorAll('thead th');

// ========== A. 表頭排序（彈窗固定在 th 下方） ==========
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
  if(dir==='cancel'){ closePop(); return; }

  const ths = getTHs();
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
  rows.forEach((tr,i)=>{ tr.cells[0].textContent = i+1; tbody.appendChild(tr); });

  // 掛上排序高亮
  clearSortHighlights();
  activeTH.classList.add(asc ? 'sorted-asc' : 'sorted-desc');

  closePop();
});

document.addEventListener('click',(e)=>{
  if(pop.style.display==='none') return;
  if(!e.target.closest('.stock-table') && !e.target.closest('.sort-pop')) closePop();
});

// 預設：公司代碼遞增 + 表頭高亮
function resetDefault(){
  const ths = getTHs();
  const idx = 1; // 公司代碼欄
  const rows = Array.from(tbody.rows);
  rows.sort((a,b)=>{
    const na = parseInt(a.cells[idx].textContent.trim(),10);
    const nb = parseInt(b.cells[idx].textContent.trim(),10);
    return (isNaN(na)?0:na) - (isNaN(nb)?0:nb);
  });
  rows.forEach((tr,i)=>{ tr.cells[0].textContent=i+1; tbody.appendChild(tr); });
  clearSortHighlights();
  ths[idx].classList.add('sorted-asc'); // 顯示預設為公司代碼 ↑
}

// ========== B. 會員功能（多因子權重） ==========
// 元件
const toggleBtn = document.getElementById('toggle-weight-panel');
const panel     = document.getElementById('weight-panel');
const applyBtn  = document.getElementById('apply-weight');
const resetBtn  = document.getElementById('reset-weight');
const factors   = Array.from(document.querySelectorAll('.factor'));

// 權重輸入防呆：只允許 1~5
function clampTo15(n){ const v = parseInt(n,10); return isNaN(v)?1:Math.max(1,Math.min(5,v)); }
function attachWeightGuards(inp){
  inp.addEventListener('keydown', (e)=>{ if(['-','+','.','e','E'].includes(e.key)) e.preventDefault(); });
  inp.addEventListener('input',  ()=>{ inp.value = inp.value.replace(/[^\d]/g,''); if(inp.value!=='') inp.value=clampTo15(inp.value); updateFactorHighlights(); });
  inp.addEventListener('blur',   ()=>{ inp.value = clampTo15(inp.value || '1'); updateFactorHighlights(); });
}
document.querySelectorAll('.factor input').forEach(attachWeightGuards);

// —— 會員表頭高亮徽章（Wn + 低） —— //
function removeAllBadges(){
  getTHs().forEach(th=>{
    th.classList.remove('mf-active','mf-low');
    const badge = th.querySelector('.mf-badge');
    if(badge) badge.remove();
  });
}
function addBadgeToTH(th, weight, isLow){
  th.classList.add('mf-active');
  if(isLow) th.classList.add('mf-low');
  // 建立徽章元素
  const badge = document.createElement('span');
  badge.className = 'mf-badge';
  badge.innerHTML = `W${weight}${isLow ? '<span class="low-flag">低</span>' : ''}`;
  th.appendChild(badge);
}
function activeFactors(){ return factors.filter(f=>f.classList.contains('active')); }
function updateFactorHighlights(){
  removeAllBadges();
  activeFactors().forEach(f=>{
    const col = Number(f.dataset.col);
    const w = clampTo15((f.querySelector('input')?.value) || '1');
    const th = getTHs()[col];
    if(th) addBadgeToTH(th, w, f.classList.contains('low-better'));
  });
}

// 清空因子選取
function clearSelections(){
  factors.forEach(f=>{
    f.classList.remove('active');
    const input = f.querySelector('input');
    if(input){ input.value = 1; input.style.display = "none"; }
  });
  updateFactorHighlights();
}

// —— 清除結果：只清「得分」欄（表頭 + 每列），不動排序 —— //
function clearScoreOnly(){
  const scoreTh = table.querySelector('thead th.score-col');
  if(scoreTh) scoreTh.remove();
  Array.from(tbody.rows).forEach(tr=>{
    const scoreCell = tr.querySelector('td.score-cell');
    if(scoreCell) tr.removeChild(scoreCell);
    tr.classList.remove('rank-1','rank-2','rank-3');
  });
}
// 清除並回預設（只用在 reset / 收起面板）
function clearScoreAndReset(){ clearScoreOnly(); resetDefault(); }

// 展開/收起面板
toggleBtn.addEventListener('click',()=>{
  const opening = panel.style.display==='none';
  panel.style.display = opening ? 'block' : 'none';
  if(!opening){
    // 收起：清空選項與權重 + 清除得分並回到預設排序 + 清乾淨高亮
    clearSelections();
    removeAllBadges();
    clearScoreAndReset();
  }
});

// 重設：清選擇 & 回預設
resetBtn.addEventListener('click',()=>{
  clearSelections();
  removeAllBadges();
  clearScoreAndReset();
});

// 限制最多 2 個因子 + 阻止點到 input 觸發切換
factors.forEach(f=>{
  f.addEventListener('click',(e)=>{
    if (e.target.closest('input')) return;
    const willActivate = !f.classList.contains('active');
    if(willActivate && activeFactors().length>=2){
      alert('一次僅能選擇 2 個因子'); return;
    }
    f.classList.toggle('active');
    const input=f.querySelector('input');
    if(input) input.style.display = f.classList.contains('active') ? "inline-block" : "none";
    updateFactorHighlights();
  });
  const inp=f.querySelector('input');
  if(inp){ ['click','mousedown','focus','input'].forEach(ev=>inp.addEventListener(ev, e=>e.stopPropagation())); }
});

// 推薦組合：只選因子＋填權重，不直接算、且清舊得分
document.querySelectorAll('.apply-combo').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    closePop();          // 防止表頭彈窗干擾
    clearScoreOnly();    // 清掉舊得分，但不重排

    // 取消所有選擇
    clearSelections();

    // 依 data-cols 重新選兩個
    const pairs = btn.dataset.cols.split(',').map(s=>s.split(':').map(Number));
    pairs.forEach(([col, w])=>{
      const target = factors.find(f=>Number(f.dataset.col)===col);
      if(target){
        target.classList.add('active');
        const input=target.querySelector('input');
        if(input){ input.value = clampTo15(w||1); input.style.display="inline-block"; }
      }
    });
    updateFactorHighlights();
  });
});

// 計名次（由低到高 1..N；低佳欄位最後反轉）— 注意得分欄插入後的位移
function buildRankPoints(colIndex, lowBetter){
  const rows = Array.from(tbody.rows);
  const hasScoreCol = !!table.querySelector('thead th.score-col');
  const offset = hasScoreCol ? 1 : 0;
  const targetCellIndex = colIndex + offset;

  const values = rows.map((tr, i)=>{
    const cell = tr.cells[targetCellIndex];
    const raw = (cell ? cell.textContent : '').trim().replace(/,/g,'');
    const v = parseFloat(raw);
    return { i, v: isNaN(v) ? Number.POSITIVE_INFINITY : v };
  });

  values.sort((a,b)=>a.v - b.v); // 低→高
  const N = values.length, points = new Array(N);
  values.forEach((item, rankIdx)=>{
    const base = rankIdx + 1;                   // 1..N
    points[item.i] = lowBetter ? (N - base + 1) // 低佳：反轉
                               : base;
  });
  return points;
}

// 主計算流程
function doCalculate(){
  closePop(); // 先關掉表頭小選單
  const picked = activeFactors();
  if(picked.length !== 2){ alert('請選擇正好 2 個因子'); return; }

  // 兩個因子的欄位與權重
  const c1 = Number(picked[0].dataset.col);
  const c2 = Number(picked[1].dataset.col);
  const w1 = clampTo15(picked[0].querySelector('input').value || '1');
  const w2 = clampTo15(picked[1].querySelector('input').value || '1');
  const low1 = picked[0].classList.contains('low-better');
  const low2 = picked[1].classList.contains('low-better');

  // 計名次分數（在尚未插入得分欄之前做，避免索引偏移）
  const p1 = buildRankPoints(c1, low1);
  const p2 = buildRankPoints(c2, low2);

  // 建立表頭「得分」欄（若尚未建立）
  if(!table.querySelector('thead th.score-col')){
    const th=document.createElement('th');
    th.textContent='得分';
    th.className='score-col';
    table.querySelector('thead tr').insertBefore(th, table.querySelector('thead tr').firstChild);
  }

  // 寫入分數
  const rows = Array.from(tbody.rows);
  rows.forEach((tr, i)=>{
    const score = (p1[i]*w1 + p2[i]*w2);
    let td = tr.querySelector('td.score-cell');
    if(!td){
      td = document.createElement('td');
      td.className = 'score-cell num';
      tr.insertBefore(td, tr.firstChild); // 放在最左邊（排序左側）
    }
    td.textContent = String(score);
  });

  // 依得分由高到低排序 + 標金銀銅 + 更新「排序」序號
  rows.sort((a,b)=> (parseFloat(b.querySelector('td.score-cell').textContent)||0) - (parseFloat(a.querySelector('td.score-cell').textContent)||0));
  rows.forEach((tr,i)=>{
    tbody.appendChild(tr);
    tr.cells[1].textContent = i+1;        // 0=得分，1=排序
    tr.classList.remove('rank-1','rank-2','rank-3');
    if(i===0) tr.classList.add('rank-1');
    else if(i===1) tr.classList.add('rank-2');
    else if(i===2) tr.classList.add('rank-3');
  });

  // 視覺：清除一般排序高亮，改亮起「得分」表頭為由高到低
  clearSortHighlights();
  const thScore = getTHs()[0];
  if(thScore) thScore.classList.add('sorted-desc');
}
applyBtn.addEventListener('click', doCalculate);

// 初始化：預設排序 & 準備高亮
resetDefault();
updateFactorHighlights();