/**
 * 切換新手 (newbie) 和老手 (expert) 模式
 * @param {string} mode - 'newbie' 或 'expert'
 */
function toggleMode(mode) {
    const body = document.getElementById('page-body');
    const recommendationList = document.querySelector('.recommendation-group-list');
    const factorSelection = document.querySelector('.factor-selection');

    function toggleMode(mode) {
    const body = document.getElementById('page-body');
    if(mode === 'newbie'){
        body.className = 'newbie-mode';
    } else if(mode === 'expert'){
        body.className = 'expert-mode';
    }
}
}

// 頁面載入時
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.factor-btn').forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });

    // 預設為新手模式
    toggleMode('newbie');
});
