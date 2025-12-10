// novice_teaching.js
// 新手教學頁：模式切換 + 教學導覽 + 表格排序 + 會員多因子示範
// ---------------------------------------------------------------

// novice_teaching.js
// 新手教學頁：模式切換 + 教學導覽 + 表格排序 + 會員多因子示範
// ---------------------------------------------------------------
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    // ========== 教學模式切換與會員體驗解鎖 ==========
    const modeButtons = document.querySelectorAll('.mode-btn');
    const memberDemo = document.getElementById('member-demo');
    const chk = document.getElementById('member-tutorial-check');
    let currentMode = 'basic';

    // 教學是否在本次開啟期間已通過（僅記憶在本頁，不寫入 localStorage）
    let passedTutorial = false;

    if (chk) {
      // 一開始永遠保持未勾選，必須完成專業模式教學後才會自動打勾
      chk.checked = false;
      // 阻止使用者手動勾選，只能透過完成教學解鎖
      chk.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      });
    }

    function updateMemberVisibility() {
      // 控制會員功能的鎖定狀態與檢核框顯示
      const toggleBtn = document.getElementById('toggle-weight-panel');
      const locked = !passedTutorial && tutorialMode !== 'pro';

      if (toggleBtn) {
        toggleBtn.classList.toggle('is-locked', locked);
      }

      if (chk) {
        // 教學尚未通過：不勾選；完成專業教學或教學進行中（pro）才視為通過
        chk.checked = !locked;
      }
    }

// ========== 教學導覽（遮罩 + 步驟） ==========
    let tutorialMode = null;
    let tutorialSteps = [];
    let tutorialIndex = -1;
    let overlayEl = null;
    let highlightEl = null;
    let popEl = null;
    let skipBtn = null;
    let currentCleanup = null;
    let tutorialOnSort = null; // 由排序模組呼叫，用來判定 action 步驟是否完成
    let tutorialOnCalc = null;  // 由多因子計算呼叫，用來前進進階步驟
    let clickGuard = null;
    let allowedSelectors = [];
    let hoverTimer = null;
    let currentHighlightTarget = null;
    let factorStepTimer = null;

    function setAllowedSelectors(list) {
      allowedSelectors = (list || []).filter(Boolean);
    }

    function attachClickGuard() {
      // 教學期間不再限制點擊區域，避免擋到表頭操作
    }

    function detachClickGuard() {
      if (!clickGuard) return;
      document.removeEventListener('click', clickGuard, true);
      clickGuard = null;
    }

    // 教學步驟定義
    
    function buildTutorialSteps(mode) {
      if (mode === 'basic') {
        return [
          {
            selector: '#th-code',
            title: '步驟 1 / 5',
            text: '這裡是公司代碼，右邊則是公司名稱。<br>系統預設會依「公司代碼」由小到大排序，方便你快速找到想看的公司。',
            kind: 'button'
          },
          {
            selector: '#th-pe',
            title: '步驟 2 / 5',
            text: '每一個表頭上方都有欄位說明 Tooltip，可以幫助你快速理解指標的意義。<br>請先試著把游標停在「本益比（P/E）」這個表頭上方，確認有看到說明文字。',
            kind: 'hover',
            hoverSelector: '#th-pe'
          },
          {
            selector: '#th-pe',
            title: '步驟 3 / 5',
            text: '接著，我們來實際操作排序功能。<br>請點一下「本益比（P/E）」表頭，在跳出的小選單中選擇「▲ 遞增」。<br>本益比通常是「越低越好」，改用遞增排序，可以快速找出評價相對便宜的公司。<br><br>完成後系統會先自動將表格捲到左側讓你觀察排名，再自動捲到右側，帶你找到下一個指標。',
            kind: 'action',
            action: 'pe-asc'
          },
          {
            selector: '#th-roe',
            title: '步驟 4 / 5',
            text: '再來看看「股東權益報酬率（ROE）」，這個指標可以用來衡量公司運用股東資本的效率。<br>請點一下「股東權益報酬率（ROE）」表頭，在小選單中選擇「▼ 遞減」，讓獲利能力較好的公司排在前面。',
            kind: 'action',
            action: 'roe-desc'
          },
          {
            selector: null,
            title: '步驟 5 / 5',
            text: '一般模式教學到這裡結束。<br>你可以回到畫面實際多試幾種欄位排序方式。<br>熟悉操作之後，再進一步體驗「專業投資者」模式。',
            kind: 'button'
          }
        ];
      }

      if (mode === 'pro') {
        return [
          {
            selector: '#toggle-weight-panel',
            title: '步驟 1 / 5',
            text: '按一下這個按鈕，可以展開或收起下方的「多因子組合設定」面板。<br>請實際按一次，體驗面板開啟的效果。',
            kind: 'click',
            action: 'open-panel'
          },
          {
            selector: '.factor-list',
            title: '步驟 2 / 5',
            text: '現在請你自己試試看。<br>從下方指標中任意勾選 <b>2～3 個因子</b>。<br>當選擇的數量符合條件時，教學提示會自動移到「開始計算」按鈕，提醒你按下去。',
            kind: 'factor-select',
            action: 'free-select'
          },
          {
            selector: '#apply-weight',
            title: '步驟 2 / 5',
            text: '因子已經選好了。<br>請按一下下方醒目的「開始計算」按鈕，讓系統依照你選的因子計算每檔股票的綜合得分並重新排序。<br><br>計算完成後，畫面會自動捲到表格區停留幾秒，讓你觀察結果，再自動進入下一步。',
            kind: 'calc',
            action: 'free-calc'
          },
          {
            selector: '#reset-weight',
            title: '步驟 3 / 5',
            text: '看完這一輪排序之後，若想重新挑選指標，可以按「重設」：<br>系統會清除已勾選的因子、移除「得分」欄位，並將表格恢復為公司代碼的預設排序。<br>請實際按一次「重設」，完成後教學會自動前往下一步。',
            kind: 'click',
            action: 'reset'
          },
          {
            selector: '.mf-note .combo:last-of-type',
            title: '步驟 4 / 5',
            text: '接下來示範系統內建的推薦組合「杜邦模型」。<br>請先按下這行文字右邊的「套用」按鈕，系統會自動幫你勾選「股價淨值比（P/B）」、「股東權益報酬率（ROE）」與「稅後淨利成長率」等因子並填好權重。',
            kind: 'apply-combo',
            action: 'dupon-apply'
          },
          {
            selector: '#apply-weight',
            title: '步驟 4 / 5',
            text: '推薦組合已經套用完成。<br>現在請按「開始計算」，讓系統依照杜邦模型幫你計算每檔股票的綜合得分並重新排序。<br><br>計算完成後，畫面同樣會自動捲到表格區停留幾秒，讓你觀察結果，然後進入最後一步。',
            kind: 'calc',
            action: 'dupon-calc'
          },
          {
            selector: null,
            title: '步驟 5 / 5',
            text: '專業模式教學到這裡結束。<br>之後你可以自由選擇 2～3 個因子，或直接套用推薦組合，來找出符合自己投資風格的排序結果。<br><br>按下「完成教學」後，將會解鎖本頁面的「會員功能體驗」。',
            kind: 'button'
          }
        ];
      }
      return [];
    }
function createTutorialUI() {
      if (overlayEl) return;

      overlayEl = document.createElement('div');
      overlayEl.className = 'tutorial-mask';

      highlightEl = document.createElement('div');
      highlightEl.className = 'tutorial-highlight';

      popEl = document.createElement('div');
      popEl.className = 'tutorial-pop';

      skipBtn = document.createElement('button');
      skipBtn.className = 'tutorial-skip';
      skipBtn.type = 'button';
      skipBtn.textContent = '跳過教學';
      skipBtn.addEventListener('click', function () {
        // 專業模式若選擇跳過，提醒使用者本次不會解鎖會員體驗
        if (tutorialMode === 'pro') {
          const ok = window.confirm(
            '若跳過專業模式教學，本次將無法在此頁免費體驗會員功能。\n\n' +
            '建議至少完整操作一次，之後再自由使用會員功能。\n\n' +
            '確定要跳過嗎？'
          );
          if (!ok) return;

          // 中途跳過專業教學：清除得分欄與金銀銅標記，並將表格恢復為預設排序
          try {
            clearSelections && clearSelections();
          } catch (e) {}
          try {
            removeAllBadges && removeAllBadges();
          } catch (e) {}
          try {
            clearScoreAndReset && clearScoreAndReset();
          } catch (e) {}
        }
        stopTutorial(false);
      });

      document.body.appendChild(overlayEl);
      document.body.appendChild(highlightEl);
      document.body.appendChild(popEl);
      popEl.appendChild(skipBtn);
    }

    function clearStepSideEffects() {
      if (hoverTimer) {
        clearTimeout(hoverTimer);
        hoverTimer = null;
      }
      if (currentCleanup) {
        try {
          currentCleanup();
        } catch (e) {
          // ignore
        }
        currentCleanup = null;
      }
      if (factorStepTimer) {
        clearTimeout(factorStepTimer);
        factorStepTimer = null;
      }
      if (currentHighlightTarget) {
        currentHighlightTarget.classList.remove('tutorial-target-glow');
        currentHighlightTarget = null;
      }
      tutorialOnSort = null;
      tutorialOnCalc = null;
    }

    function scrollTableToShow(target) {
      if (!target) return;
      const wrapper = target.closest('.table-wrapper');
      if (!wrapper) return;
      const wrapperRect = wrapper.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const currentScroll = wrapper.scrollLeft;
      const offsetLeft = targetRect.left - wrapperRect.left + currentScroll;
      const newScroll = offsetLeft - wrapperRect.width / 2 + targetRect.width / 2;
      wrapper.scrollLeft = newScroll;
    }

    function goTutorialStep(idx) {
      if (!tutorialSteps || idx < 0 || idx >= tutorialSteps.length) {
        stopTutorial(true);
        return;
      }
      clearStepSideEffects();
      tutorialIndex = idx;
      const step = tutorialSteps[idx];
      const target = step.selector ? document.querySelector(step.selector) : null;
      const isTableTarget = target && target.closest('.stock-table');

      if (currentHighlightTarget) {
        currentHighlightTarget.classList.remove('tutorial-target-glow');
        currentHighlightTarget = null;
      }

      if (target) {
        if (isTableTarget) {
          // 表格內目標：用相對 glow，不用獨立 highlight 框，避免滑動問題
          highlightEl.style.display = 'none';
          target.classList.add('tutorial-target-glow');
          currentHighlightTarget = target;
          setAllowedSelectors([step.selector, '.sort-pop', '.tutorial-pop']);
        } else {
          const rect = target.getBoundingClientRect();
          const padding = 6;
          const scrollY = window.scrollY || window.pageYOffset;
          highlightEl.style.display = 'block';
          highlightEl.style.left = (rect.left - padding) + 'px';
          highlightEl.style.top = (rect.top - padding + scrollY) + 'px';
          highlightEl.style.width = (rect.width + padding * 2) + 'px';
          highlightEl.style.height = (rect.height + padding * 2) + 'px';
          setAllowedSelectors([step.selector, '.tutorial-pop']);
        }

        // 本益比那一步：自動滾動表格讓欄位完整顯示
        if (step.action === 'pe-asc') {
          scrollTableToShow(target);
        }
      } else {
        highlightEl.style.display = 'none';
        setAllowedSelectors(['.tutorial-pop']);
      }

      const title = step.title || '';
      const text = step.text || '';
      const isLast = (idx === tutorialSteps.length - 1);

      let actionsHTML = '';
      if (step.kind === 'button') {
        actionsHTML =
          '<div class="tutorial-actions">' +
          '<button type="button" class="tutorial-next">' +
          (isLast ? '完成教學' : '下一步') +
          '</button>' +
          '</div>';
      } else if (step.kind === 'hover' || step.kind === 'action' || step.kind === 'calc' || step.kind === 'click' || step.kind === 'factor-select' || step.kind === 'apply-combo') {
        actionsHTML =
          '<div class="tutorial-actions tutorial-actions-hint">' +
          '<span>請依照上方提示操作，完成後會自動進入下一步。</span>' +
          '</div>';
      }

      popEl.innerHTML =
        '<div class="tutorial-title">' + title + '</div>' +
        '<div class="tutorial-body">' + text + '</div>' +
        actionsHTML;

      // 把跳過按鈕重新掛回提示框右下角
      popEl.appendChild(skipBtn);
      // 一般模式的最後一步（步驟 5 / 5）不需要「跳過教學」按鈕，只保留「完成教學」
      if (isLast && step.kind === 'button' && tutorialMode === 'basic') {
        skipBtn.style.display = 'none';
      } else {
        skipBtn.style.display = 'inline-block';
      }

      // 計算提示框位置：盡量貼近教學目標上下方，避免遮住重點
      (function placeTutorialPop(step, target) {
        const popRect = popEl.getBoundingClientRect();
        const viewportH = window.innerHeight || document.documentElement.clientHeight || 600;
        const viewportW = window.innerWidth || document.documentElement.clientWidth || 800;
        const scrollY = window.scrollY || window.pageYOffset || 0;
        const scrollX = window.scrollX || window.pageXOffset || 0;

        let top;
        let left = scrollX + (viewportW - popRect.width) / 2;

        // 專業模式：步驟 4 / 5（計算結果）與 步驟 5 / 5（說明）
        // 會遮住表格前幾名，因此改為固定錨點：表格第 3 列下方
        const isProResultStep =
          tutorialMode === 'pro' &&
          (step.action === 'dupon-calc' ||
            (step.kind === 'button' && !step.selector));

        if (isProResultStep) {
          const tableEl = document.querySelector('.stock-table');
          const tbodyEl = tableEl && tableEl.querySelector('tbody');
          const thirdRow = tbodyEl && tbodyEl.rows[2];

          if (thirdRow) {
            const rowRect = thirdRow.getBoundingClientRect();
            // 在第三名列的「上方」顯示教學框，避免把按鈕或排序結果切到
            // 先以第三列頂端為基準，再往上留一點間距，之後會再透過 clamp 確保不超出視窗
            top = scrollY + rowRect.top - popRect.height - 24;
          } else {
            // 安全備援：退回原本置中偏下
            top = scrollY + Math.max(40, viewportH * 0.6 - popRect.height / 2);
          }
        } else if (target) {
          const rect = target.getBoundingClientRect();

          // === 初階教學特例 ===
          // basic 模式：步驟 2（hover）＆步驟 3（排序）都鎖在 #th-pe
          // 步驟 2：教學框固定在表頭下方 7px
          // 步驟 3：教學框固定在表頭下方 10px（與前一步有一點高度差）
          const isBasicStep2 =
            tutorialMode === 'basic' &&
            step.selector === '#th-pe' &&
            step.kind === 'hover' &&
            !step.action;
          const isBasicStep3 =
            tutorialMode === 'basic' &&
            step.selector === '#th-pe' &&
            step.action === 'pe-asc';
          const isBasicStep4 =
            tutorialMode === 'basic' &&
            step.selector === '#th-roe' &&
            step.action === 'roe-desc';

          if (isBasicStep2 || isBasicStep3) {
            // 初階步驟 2 / 3：同一欄位，但高度略有差異（45px / 50px）
            const offset = isBasicStep2 ? 45 : 50;
            top = scrollY + rect.bottom + offset;
          } else if (isBasicStep4) {
            // 初階步驟 4：ROE 欄位說明，同樣固定在表頭下方 50px
            top = scrollY + rect.bottom + 50;
          } else {
            const margin = 16;
            const spaceBelow = viewportH - rect.bottom;
       const spaceAbove = rect.top;

            if (spaceBelow >= popRect.height + margin) {
              // 優先放在目標下方
              top = scrollY + rect.bottom + margin;
            } else if (spaceAbove >= popRect.height + margin) {
              // 否則放在目標上方
              top = scrollY + rect.top - popRect.height - margin;
            } else {
              // 空間不足時採用原本的置中偏下策略
              top = scrollY + Math.max(40, viewportH * 0.6 - popRect.height / 2);
            }
          }
        } else {
          // 沒有特定目標時，維持原本的置中偏下
          top = scrollY + Math.max(40, viewportH * 0.6 - popRect.height / 2);
        }

        const minTop = scrollY + 20;
        const maxTop = scrollY + viewportH - popRect.height - 20;

        if (!isFinite(top)) {
          top = scrollY + 80;
        } else {
          if (top < minTop) top = minTop;
          if (top > maxTop) top = maxTop;
        }
        if (!isFinite(left)) left = 12;

        popEl.style.top = top + 'px';
        popEl.style.left = Math.max(12, left) + 'px';
      })(step, target);
      const nextBtn = popEl.querySelector('.tutorial-next');
      if (nextBtn && step.kind === 'button') {
        nextBtn.addEventListener('click', function () {
          goTutorialStep(tutorialIndex + 1);
        });
      }

      // Hover 型步驟：偵測滑鼠停留（約 2～3 秒）
      if (step.kind === 'hover' && step.hoverSelector) {
        const hoverTarget = document.querySelector(step.hoverSelector);
        if (hoverTarget) {
          const enterHandler = function () {
            if (hoverTimer) clearTimeout(hoverTimer);
            hoverTimer = setTimeout(function () {
              if (tutorialIndex === idx) {
                goTutorialStep(idx + 1);
              }
            }, 2500);
          };
          const leaveHandler = function () {
            if (hoverTimer) {
              clearTimeout(hoverTimer);
              hoverTimer = null;
            }
          };
          hoverTarget.addEventListener('mouseenter', enterHandler);
          hoverTarget.addEventListener('mouseleave', leaveHandler);
          currentCleanup = function () {
            hoverTarget.removeEventListener('mouseenter', enterHandler);
            hoverTarget.removeEventListener('mouseleave', leaveHandler);
          };
        }
      }

      // Action 型步驟：等排序條件達成（排序後先停留約 2～3 秒，讓使用者看結果）
      if (step.kind === 'action' && step.action) {
        tutorialOnSort = function (th, dir) {
          if (!th) return;

          const advanceAfterDelay = function () {
            setTimeout(function () {
              if (tutorialIndex === idx) {
                // 若是從「本益比（P/E）」這一步前進，先把表格捲到右側，帶出 ROE 欄位
                if (step.action === 'pe-asc') {
                  const roeTh = document.getElementById('th-roe');
                  if (roeTh) {
                    const wrapperForRoe = roeTh.closest('.table-wrapper');
                    if (wrapperForRoe) {
                      try {
                        wrapperForRoe.scrollTo({ left: wrapperForRoe.scrollWidth, behavior: 'smooth' });
                      } catch (e) {
                        wrapperForRoe.scrollLeft = wrapperForRoe.scrollWidth;
                      }
                    }
                  }
                }
                else if (step.action === 'roe-desc' && tutorialMode === 'basic') {
                  const tableWrapper = document.querySelector('.table-wrapper');
                  if (tableWrapper) {
                    try {
                      tableWrapper.scrollTo({ left: 0, behavior: 'smooth' });
                    } catch (e) {
                      tableWrapper.scrollLeft = 0;
                    }
                  }
                }

                goTutorialStep(idx + 1);
              }
            }, 2500);
          };

          if (step.action === 'roe-desc' && th.id === 'th-roe' && dir === 'desc') {
            if (tutorialIndex === idx) {
              // ROE 排序完成後，先把表格滑回左邊，讓使用者看到排名結果
              const wrapper = th.closest('.table-wrapper');
              if (wrapper) {
                wrapper.scrollLeft = 0;
              }
              advanceAfterDelay();
            }
          } else if (step.action === 'pe-asc' && th.id === 'th-pe' && dir === 'asc') {
            if (tutorialIndex === idx) {
              // 排完本益比後，先把表格滑回左邊，讓使用者看到排序結果
              const wrapper = th.closest('.table-wrapper');
              if (wrapper) {
                wrapper.scrollLeft = 0;
              }
              advanceAfterDelay();
            }
          }
        };
      }

      // Calc 型步驟：等多因子計算完成後，自動捲動到表格並前進
      if (step.kind === 'calc' && step.action) {
        tutorialOnCalc = function (ctx) {
          if (tutorialIndex !== idx) return;

          const scrollAndAdvance = function () {
            const tableWrapper = document.querySelector('.table-wrapper');
            if (tableWrapper) {
              const rect = tableWrapper.getBoundingClientRect();
              const scrollY = window.scrollY || window.pageYOffset;
              const viewportH = window.innerHeight || document.documentElement.clientHeight;
              let targetTop = rect.top + scrollY - viewportH * 0.33;
              if (targetTop < 0) targetTop = 0;
              try {
                window.scrollTo({ top: targetTop, behavior: 'smooth' });
              } catch (e) {
                window.scrollTo(0, targetTop);
              }
            }
            setTimeout(function () {
              if (tutorialIndex === idx) {
                goTutorialStep(idx + 1);
              }
            }, 2500);
          };

          // free-calc：只要有合法計算就前進
          if (step.action === 'free-calc') {
            scrollAndAdvance();
            return;
          }

          // dupon-calc：若有傳入 activeCols，可以略為檢查；不符合也照樣前進，避免卡死
          if (step.action === 'dupon-calc') {
            if (ctx && Array.isArray(ctx.activeCols)) {
              const cols = ctx.activeCols.slice().sort().join(',');
              const expected = '5,8,11';
              // 就算不是完全相同，也不阻擋，最多用來未來 debug
              // if (cols !== expected) console.warn('dupon-calc 使用的欄位與預期不同：', cols);
            }
            scrollAndAdvance();
            return;
          }
        };
      }
    }
    function startTutorial(mode) {
      tutorialMode = mode;
      updateMemberVisibility();
      tutorialSteps = buildTutorialSteps(mode);
      if (!tutorialSteps.length) return;
      createTutorialUI();
      overlayEl.style.display = 'block';
      highlightEl.style.display = 'block';
      popEl.style.display = 'block';
      document.body.classList.add('is-tutorial-running');
      attachClickGuard();

      // ⭐ 教學啟動時：先把整個表格區塊捲到畫面中央偏上，避免只看到一半
      const tableWrapper = document.querySelector('.table-wrapper');
      if (tableWrapper) {
        // 無論目前表格被滑到多右邊，一律先拉回最左側，避免第一步看不到左邊欄位
        tableWrapper.scrollLeft = 0;

        const rect = tableWrapper.getBoundingClientRect();
        const scrollY = window.scrollY || window.pageYOffset;
        const viewportH = window.innerHeight || document.documentElement.clientHeight;
        let targetTop = rect.top + scrollY - viewportH * 0.33; // 只露出表格約 2/3 高度
        if (targetTop < 0) targetTop = 0;
        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });
      }

      goTutorialStep(0);
    }

    function stopTutorial(completed) {
      // 在清除狀態前，先記錄本次是否完整完成「專業模式」教學
      const finishedPro = completed && (tutorialMode === 'pro');

      tutorialMode = null;
      tutorialSteps = [];
      tutorialIndex = -1;
      clearStepSideEffects();

      if (overlayEl) overlayEl.style.display = 'none';
      if (highlightEl) highlightEl.style.display = 'none';
      if (popEl) popEl.style.display = 'none';

      document.body.classList.remove('is-tutorial-running');
      detachClickGuard();

      // 只有完整跑完一次專業教學才解鎖會員體驗（本次開啟期間有效）
      if (finishedPro) {
        passedTutorial = true;
      }

      // 完成或跳過教學後，更新會員功能鎖定狀態
      updateMemberVisibility();
      // 教學結束或被跳過後，一律收合會員面板，避免未解鎖時仍停留在開啟狀態
      if (panel) {
        panel.style.display = 'none';
      }

    }


    // 點選模式按鈕：確認後啟動對應教學
    modeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const m = btn.getAttribute('data-mode');
        if (!m) return;

        const label = (m === 'basic') ? '一般模式教學' : '專業模式教學';
        const confirmText = '是否要選擇「' + label + '」？';
        if (!window.confirm(confirmText)) return;

        currentMode = m;
        modeButtons.forEach(b => b.classList.toggle('is-active', b === btn));
        updateMemberVisibility();
        startTutorial(m);
      });
    });

    updateMemberVisibility();

    // ========== 表格滑動提示 ==========
    (function showScrollHint() {
      const wrapper = document.querySelector('.table-wrapper');
      if (!wrapper) return;
      const hint = document.createElement('div');
      hint.className = 'scroll-hint';
      hint.textContent = '💡 表格可左右滑動';
      wrapper.style.position = 'relative';
      wrapper.appendChild(hint);
      setTimeout(() => hint.remove(), 4000);
    })();

    // ========== 共用：抓表格 ==========
    const table = document.querySelector('.stock-table');
    if (!table) return; // 沒有表格就不繼續後面邏輯
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

    function clearSortHighlights() {
      getTHs().forEach(th => th.classList.remove('sorted-asc', 'sorted-desc', 'th-active'));
    }

    function openPop(th){
  closePop();
  activeTH = th;
  th.classList.add('th-active');
  th.appendChild(pop);
  pop.style.display = 'flex';
  const best = th.dataset.best;
  const ascBtn = pop.querySelector('button[data-dir="asc"]');
  const descBtn = pop.querySelector('button[data-dir="desc"]');
  if(ascBtn) ascBtn.style.display = '';
  if(descBtn) descBtn.style.display = '';
  if(best === 'high' && ascBtn) ascBtn.style.display = 'none';
  if(best === 'low' && descBtn) descBtn.style.display = 'none';
}

    function closePop() {
      if (activeTH) activeTH.classList.remove('th-active');
      if (pop.parentNode) pop.parentNode.removeChild(pop);
      pop.style.display = 'none';
      activeTH = null;
    }

    pop.addEventListener('click', e => e.stopPropagation());

    getTHs().forEach(th => {
      if (!th.classList.contains('not-sort')) {
        th.addEventListener('click', (e) => {
          if (e.target.closest('.sort-pop')) return;
          if (activeTH === th) {
            closePop();
          } else {
            openPop(th);
          }
        });
      }
    });

    pop.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const dir = btn.dataset.dir;
      if (dir === 'cancel') {
        closePop();
        return;
      }

      const ths = getTHs();
      const idx = Array.from(activeTH.parentNode.children).indexOf(activeTH);
      const asc = dir === 'asc';
      const rows = Array.from(tbody.rows);

      rows.sort((a, b) => {
        const va = a.cells[idx].textContent.trim().replace(/,/g, '');
        const vb = b.cells[idx].textContent.trim().replace(/,/g, '');
        const na = parseFloat(va);
        const nb = parseFloat(vb);
        if (!isNaN(na) && !isNaN(nb)) return asc ? na - nb : nb - na;
        return asc ? va.localeCompare(vb, 'zh') : vb.localeCompare(va, 'zh');
      });

      rows.forEach((tr, i) => {
        tr.cells[0].textContent = i + 1;
        tbody.appendChild(tr);
      });

      // 掛上排序高亮
      clearSortHighlights();
      activeTH.classList.add(asc ? 'sorted-asc' : 'sorted-desc');

      // 若目前在教學模式中，通知教學模組本次排序結果
      if (typeof tutorialOnSort === 'function') {
        tutorialOnSort(activeTH, dir);
      }

      closePop();
    });

    // 點表格外關閉排序選單
    document.addEventListener('click', (e) => {
      if (pop.style.display === 'none') return;
      if (!e.target.closest('.stock-table') && !e.target.closest('.sort-pop')) {
        closePop();
      }
    });

    // 預設：公司代碼遞增 + 表頭高亮
    function resetDefault() {
      const ths = getTHs();
      const idx = 1; // 公司代碼欄
      const rows = Array.from(tbody.rows);
      rows.sort((a, b) => {
        const na = parseInt(a.cells[idx].textContent.trim(), 10);
        const nb = parseInt(b.cells[idx].textContent.trim(), 10);
        return (isNaN(na) ? 0 : na) - (isNaN(nb) ? 0 : nb);
      });
      rows.forEach((tr, i) => {
        tr.cells[0].textContent = i + 1;
        tbody.appendChild(tr);
      });
      clearSortHighlights();
      if (ths[idx]) {
        ths[idx].classList.add('sorted-asc'); // 顯示預設為公司代碼 ↑
      }
    }

    // ========== B. 會員功能（多因子權重） ==========
    const toggleBtn = document.getElementById('toggle-weight-panel');
    const panel = document.getElementById('weight-panel');
    const applyBtn = document.getElementById('apply-weight');
    const resetBtn = document.getElementById('reset-weight');
    const factors = Array.from(document.querySelectorAll('.factor'));

    // 權重輸入防呆：只允許 1~5
    function clampTo15(n) {
      const v = parseInt(n, 10);
      return isNaN(v) ? 1 : Math.max(1, Math.min(5, v));
    }

    function attachWeightGuards(inp) {
      inp.addEventListener('keydown', (e) => {
        if (['-', '+', '.', 'e', 'E'].includes(e.key)) e.preventDefault();
      });
      inp.addEventListener('input', () => {
        inp.value = inp.value.replace(/[^\d]/g, '');
        if (inp.value !== '') inp.value = clampTo15(inp.value);
        updateFactorHighlights();
      });
      inp.addEventListener('blur', () => {
        inp.value = clampTo15(inp.value || '1');
        updateFactorHighlights();
      });
    }

    document.querySelectorAll('.factor input').forEach(attachWeightGuards);

    // —— 會員表頭高亮徽章（Wn + 低） —— //
    
    function removeAllBadges() {
      getTHs().forEach(th => {
        th.classList.remove('mf-active', 'mf-low');
      });
    }

    // 只保留表頭底色高亮，不再顯示 W1 小圓標籤
    function addBadgeToTH(th, weight, isLow) {
      th.classList.add('mf-active');
      if (isLow) th.classList.add('mf-low');
    }

    function activeFactors() {
      return factors.filter(f => f.classList.contains('active'));
    }

    function updateFactorHighlights() {
      removeAllBadges();
      activeFactors().forEach(f => {
        const col = Number(f.dataset.col);
        const th = getTHs()[col];
        if (th) addBadgeToTH(th, 1, f.classList.contains('low-better'));
      });
    }

    // 清空因子選取
    function clearSelections() {
      factors.forEach(f => {
        f.classList.remove('active');
        const input = f.querySelector('input');
        if (input) {
          input.value = 1;
          input.style.display = 'none';
        }
      });
      updateFactorHighlights();
    }

    // —— 清除結果：只清「得分」欄（表頭 + 每列），不動排序 —— //
    function clearScoreOnly() {
      const scoreTh = table.querySelector('thead th.score-col');
      if (scoreTh) scoreTh.remove();
      Array.from(tbody.rows).forEach(tr => {
        const scoreCell = tr.querySelector('td.score-cell');
        if (scoreCell) tr.removeChild(scoreCell);
        tr.classList.remove('rank-1', 'rank-2', 'rank-3');
      });
    }

    // 清除並回預設（只用在 reset / 收起面板）
    function clearScoreAndReset() {
      clearScoreOnly();
      resetDefault();
    }

    // 展開/收起面板
    if (toggleBtn && panel) {
      toggleBtn.addEventListener('click', () => {
        const inProTutorial = (tutorialMode === 'pro');
        const locked = !passedTutorial && !inProTutorial;

        // 尚未通過專業教學且不在專業教學流程中：只提示，不開啟會員面板
        if (locked) {
          alert('請先完成一次「進階專業」教學，才能體驗會員功能。');
          const intro = document.querySelector('.intro-mode');
          if (intro && intro.scrollIntoView) {
            try {
              intro.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } catch (e) {
              intro.scrollIntoView();
            }
          }
          return;
        }

        const opening = panel.style.display === 'none';
        panel.style.display = opening ? 'block' : 'none';
        if (!opening) {
          // 收起：清空選項與權重 + 清除得分並回到預設排序 + 清乾淨高亮
          clearSelections();
          removeAllBadges();
          clearScoreAndReset();
        }
        // 進階教學：步驟 1 要求實際按一次按鈕，按下後自動前往下一步
        if (
          tutorialMode === 'pro' &&
          tutorialSteps &&
          tutorialIndex >= 0 &&
          tutorialSteps[tutorialIndex] &&
          tutorialSteps[tutorialIndex].action === 'open-panel'
        ) {
          setTimeout(() => {
            if (
              tutorialMode === 'pro' &&
              tutorialSteps &&
              tutorialIndex >= 0 &&
              tutorialSteps[tutorialIndex] &&
              tutorialSteps[tutorialIndex].action === 'open-panel'
            ) {
              goTutorialStep(tutorialIndex + 1);
            }
          }, 300);
        }

});
    }


    
    // 重設按鈕：清空選取與得分，並在專業教學的對應步驟中自動前往下一步
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        clearSelections();
        removeAllBadges();
        clearScoreAndReset();

        if (
          tutorialMode === 'pro' &&
          tutorialSteps &&
          tutorialIndex >= 0 &&
          tutorialSteps[tutorialIndex] &&
          tutorialSteps[tutorialIndex].action === 'reset'
        ) {
          setTimeout(() => {
            if (
              tutorialMode === 'pro' &&
              tutorialSteps &&
              tutorialIndex >= 0 &&
              tutorialSteps[tutorialIndex] &&
              tutorialSteps[tutorialIndex].action === 'reset'
            ) {
              goTutorialStep(tutorialIndex + 1);
            }
          }, 300);
        }
      });
    }

// 限制最多 2 個因子 + 阻止點到 input 觸發切換
    factors.forEach(f => {
      f.addEventListener('click', (e) => {
        if (e.target.closest('input')) return;
        const willActivate = !f.classList.contains('active');
        if (willActivate && activeFactors().length >= 3) {
          alert('一次最多選擇 3 個因子');
          return;
        }
        f.classList.toggle('active');
        const input = f.querySelector('input');
        if (input) input.style.display = f.classList.contains('active') ? 'inline-block' : 'none';
        updateFactorHighlights();

        // 進階教學：步驟 2-1
        // 選 2 個因子：啟動 3 秒倒數，若期間再加選第 3 個，立即前往下一步
        // 選滿 3 個因子：略等 0.3 秒後直接前往下一步
        if (
          tutorialMode === 'pro' &&
          tutorialSteps &&
          tutorialIndex >= 0 &&
          tutorialSteps[tutorialIndex] &&
          tutorialSteps[tutorialIndex].kind === 'factor-select' &&
          tutorialSteps[tutorialIndex].action === 'free-select'
        ) {
          const count = activeFactors().length;

          // 任何次數變化都先清掉舊的計時器
          if (factorStepTimer) {
            clearTimeout(factorStepTimer);
            factorStepTimer = null;
          }

          if (count === 3) {
            // 已選 3 個：給使用者一小點緩衝再往下一步
            factorStepTimer = setTimeout(() => {
              if (
                tutorialMode === 'pro' &&
                tutorialSteps &&
                tutorialIndex >= 0 &&
                tutorialSteps[tutorialIndex] &&
                tutorialSteps[tutorialIndex].kind === 'factor-select' &&
                tutorialSteps[tutorialIndex].action === 'free-select'
              ) {
                goTutorialStep(tutorialIndex + 1);
              }
            }, 300);
          } else if (count === 2) {
            // 只選 2 個：啟動 3 秒倒數，讓使用者有時間決定要不要再加 1 個
            factorStepTimer = setTimeout(() => {
              if (
                tutorialMode === 'pro' &&
                tutorialSteps &&
                tutorialIndex >= 0 &&
                tutorialSteps[tutorialIndex] &&
                tutorialSteps[tutorialIndex].kind === 'factor-select' &&
                tutorialSteps[tutorialIndex].action === 'free-select'
              ) {
                goTutorialStep(tutorialIndex + 1);
              }
            }, 3000);
          }
        }
      });
      const inp = f.querySelector('input');
      if (inp) {
        ['click', 'mousedown', 'focus', 'input'].forEach(ev =>
          inp.addEventListener(ev, e => e.stopPropagation())
        );
      }
    });

    // 推薦組合：只選因子＋填權重，不直接算、且清舊得分
    document.querySelectorAll('.apply-combo').forEach(btn => {
      btn.addEventListener('click', () => {
        closePop();          // 防止表頭彈窗干擾
        clearScoreOnly();    // 清掉舊得分，但不重排

        // 取消所有選擇
        clearSelections();

        // 依 data-cols 重新選兩個
        const pairs = btn.dataset.cols.split(',').map(s => s.split(':').map(Number));
        pairs.forEach(([col, w]) => {
          const target = factors.find(f => Number(f.dataset.col) === col);
          if (target) {
            target.classList.add('active');
            const input = target.querySelector('input');
            if (input) {
              input.value = clampTo15(w || 1);
              input.style.display = 'inline-block';
            }
          }
        });
        updateFactorHighlights();

        // 進階教學：步驟 4-1，按下推薦組合「套用」後，自動把提示移到「開始計算」按鈕
        if (
          tutorialMode === 'pro' &&
          tutorialSteps &&
          tutorialIndex >= 0 &&
          tutorialSteps[tutorialIndex] &&
          tutorialSteps[tutorialIndex].kind === 'apply-combo' &&
          tutorialSteps[tutorialIndex].action === 'dupon-apply'
        ) {
          setTimeout(() => {
            if (
              tutorialMode === 'pro' &&
              tutorialSteps &&
              tutorialIndex >= 0 &&
              tutorialSteps[tutorialIndex] &&
              tutorialSteps[tutorialIndex].kind === 'apply-combo' &&
              tutorialSteps[tutorialIndex].action === 'dupon-apply'
            ) {
              goTutorialStep(tutorialIndex + 1);
            }
          }, 300);
        }
      });
    });

    // 計名次（由低到高 1..N；低佳欄位最後反轉）— 注意得分欄插入後的位移
    function buildRankPoints(colIndex, lowBetter) {
      const rows = Array.from(tbody.rows);
      const hasScoreCol = !!table.querySelector('thead th.score-col');
      const offset = hasScoreCol ? 1 : 0;
      const targetCellIndex = colIndex + offset;

      const values = rows.map((tr, i) => {
        const cell = tr.cells[targetCellIndex];
        const raw = (cell ? cell.textContent : '').trim().replace(/,/g, '');
        const v = parseFloat(raw);
        return { i, v: isNaN(v) ? Number.POSITIVE_INFINITY : v };
      });

      values.sort((a, b) => a.v - b.v); // 低→高
      const N = values.length;
      const points = new Array(N);
      values.forEach((item, rankIdx) => {
        const base = rankIdx + 1;                   // 1..N
        points[item.i] = lowBetter ? (N - base + 1) // 低佳：反轉
                                   : base;
      });
      return points;
    }

    // 主計算流程
    
    function doCalculate() {
      closePop(); // 先關掉表頭小選單
      const picked = activeFactors();

      // 必須介於 2～3 個因子之間
      if (picked.length < 2 || picked.length > 3) {
        alert('請選擇 2～3 個因子');
        return;
      }

      const rows = Array.from(tbody.rows);

      // 為每個被選到的因子建立名次分數（同權重加總）
      const rankLists = picked.map(f => {
        const colIndex = Number(f.dataset.col);
        const lowBetter = f.classList.contains('low-better');
        return buildRankPoints(colIndex, lowBetter);
      });

      // 建立表頭「得分」欄（若尚未建立）
      if (!table.querySelector('thead th.score-col')) {
        const th = document.createElement('th');
        th.textContent = '得分';
        th.className = 'score-col';
        table.querySelector('thead tr').insertBefore(th, table.querySelector('thead tr').firstChild);
      }

      // 寫入分數（各因子名次等權加總）
      rows.forEach((tr, i) => {
        const score = rankLists.reduce((sum, arr) => sum + (arr[i] || 0), 0);
        let td = tr.querySelector('td.score-cell');
        if (!td) {
          td = document.createElement('td');
          td.className = 'score-cell num';
          tr.insertBefore(td, tr.firstChild); // 放在最左邊（排序左側）
        }
        td.textContent = String(score);
      });

      // 依得分由高到低排序 + 標金銀銅 + 更新「排序」序號
      rows.sort((a, b) => (parseFloat(b.querySelector('td.score-cell').textContent) || 0) -
        (parseFloat(a.querySelector('td.score-cell').textContent) || 0));
      rows.forEach((tr, i) => {
        tbody.appendChild(tr);
        tr.cells[1].textContent = i + 1;        // 0=得分，1=排序
        tr.classList.remove('rank-1', 'rank-2', 'rank-3');
        if (i === 0) tr.classList.add('rank-1');
        else if (i === 1) tr.classList.add('rank-2');
        else if (i === 2) tr.classList.add('rank-3');
      });

      // 視覺：清除一般排序高亮，改亮起「得分」表頭為由高到低
      clearSortHighlights();
      const thScore = getTHs()[0];
      if (thScore) thScore.classList.add('sorted-desc');

      // 若正在進階教學中，通知教學模組本次計算已完成
      if (typeof tutorialOnCalc === 'function') {
        const activeCols = picked.map(f => Number(f.dataset.col));
        tutorialOnCalc({ activeCols });
      }
    }

    if (applyBtn) {
      applyBtn.addEventListener('click', doCalculate);
    }

    // 初始化：預設排序 & 準備高亮
    resetDefault();
    updateFactorHighlights();
  });
})();
