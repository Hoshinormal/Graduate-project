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