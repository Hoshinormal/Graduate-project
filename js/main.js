document.addEventListener("DOMContentLoaded", function() {
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {

        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
    }, { 
        threshold: 0.3  /* Adjust the threshold as needed */
    });

    const hiddenelements = document.querySelectorAll('.fade-up');
    hiddenelements.forEach((el) => observer.observe(el));

  });