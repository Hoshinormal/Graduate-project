document.addEventListener("DOMContentLoaded", function() {
    //抓取所有問題按鈕
    const question =document.querySelectorAll(".faq-question");

    question.forEach((question) => {
        question.addEventListener("click",function() {
            //找到此按鈕的父親元素(.faq-item)，並切換active class(為了讓箭頭轉向)
            const item = this.parentElement;
            item.classList.toggle("active");

            //找到此按鈕的下一個兄弟元素（.faq-answer）
            const answer = this.nextElementSibling;

            if(answer.style.maxHeight) {
                //如果已經有高度（代表是開的），那就把高度清空（關上）
                answer.style.maxHeight = null;
            } else {
                //如果沒有高度（代表是關的），那就把高度設為內容的高度（打開）
                //scrollHeight 是個屬性，能告訴我們內容如果不被隱藏會有幾px高
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });
}); 

document.addEventListener("DOMContentLoaded", function() {
  
    const elements =document.querySelectorAll('.fade-up, .fade-in');
    elements.forEach((el,index) => {
        if(el.classList.contains('fade-item')) {
            let delayTime =0.2 +(index*0.15);
            el.style.transitionDelay = `${delayTime}s`;
        }
        
        setTimeout(() => {
            el.classList.add('visible');
        },100);
    });
});