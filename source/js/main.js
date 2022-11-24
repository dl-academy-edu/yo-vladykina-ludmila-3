// слайдер

(function mainSlider() {
    let mainSlider = document.querySelector('.slider-js');
    let wrapper = mainSlider.querySelector(".slider__wrapper");
    let container = mainSlider.querySelector(".slider__container"); 
    let pagination = mainSlider.querySelector(".slider__pagination");
    let buttonLeft = mainSlider.querySelector(".slider__button_left");
    let buttonRight = mainSlider.querySelector(".slider__button_right"); 
    let slides = mainSlider.querySelectorAll(".slider__slide");

    let slideWidth = +getComputedStyle(wrapper).width.split("px")[0];  
    let numberSlides = container.childElementCount - 1;
    let activeSlide = 0; 
    localStorage.getItem("activeSlide", 0);
    if (!localStorage.getItem('activeSlide')) {
        changeToSlide(activeSlide);
    } else {
        activeSlide = +localStorage.getItem('activeSlide');
        changeToSlide(activeSlide);
    }

    function changeToSlide (index) {
        container.style.transition = "transform .4s";
        container.style.transform = `translate(${-slideWidth * activeSlide}px)`;
        localStorage.setItem("activeSlide", index);
    };    

    function addWidthSlides () {
        for (slide of slides) {
        slide.style.width = `${slideWidth}px`;
        };
    };

    function changeActiveDot (index) {
        
        let activeDot = document.querySelector(".slider__dot_active");
                
        if (activeDot) {
            activeDot.classList.remove("slider__dot_active");
        };

        pagination.children[index].classList.add("slider__dot_active");
        localStorage.setItem("activeSlide", index);
    };

    function addDot () {

        for (let i = 0; i < container.children.length; i++) {

            let buttonDot = document.createElement("button");
            buttonDot.classList.add("slider__dot");

            if (i === activeSlide) {
                buttonDot.classList.add("slider__dot_active");
            };
            
            buttonDot.addEventListener("click", () => {
                activeSlide = i;
                changeToSlide ();
                changeActiveDot(activeSlide);
            });

            pagination.append(buttonDot);
        };
    };
    addDot ();
    
    buttonRight.addEventListener("click", function () {

        if (activeSlide < numberSlides) {
            activeSlide += 1;
            changeToSlide ();
            changeActiveDot (activeSlide); 
        };
    });

    buttonLeft.addEventListener("click", function () {

        if (activeSlide > 0) {
            activeSlide -= 1;
            changeToSlide ();
            changeActiveDot (activeSlide);
        };
    });
   
    window.addEventListener("resize", function () {
        slideWidth = +getComputedStyle(wrapper).width.split("px")[0];
        addWidthSlides();
        if (activeSlide > 0) {
            changeToSlide ();          
            container.style.transform = `translate(${-slideWidth * activeSlide}px)`;
        };
    });
})();


// слайдер swiper

let mySwiper = new Swiper('.swiper', {

    // направление
    direction: 'horizontal',

    // чувствительность свайпа
    touchPatio: 1,

    // угол срабатывания свайпа
    touchAngle: 45,

    // курсор перетаскивания
    grabCursor: true,   
  
    // навигация
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
});

