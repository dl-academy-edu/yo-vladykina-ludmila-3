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


// button-fixed

(function buttonScrollFixed() {
    let buttonScroll = document.querySelector(".button-scroll_js");

    if (buttonScroll) {
        
        buttonScroll.addEventListener('click', function () {
            window.scrollTo({ 
                top: 0, 
                behavior: "smooth" 
            });
        });
        
        window.addEventListener('scroll', function () {
            if (window.pageYOffset > 1500) {
            buttonScroll.classList.remove("button-fixed__hidden");
            } else {
            buttonScroll.classList.add("button-fixed__hidden");
            }
        });
    };
})();


// модалки
const popup = document.querySelector('.popup');
const popups = document.querySelectorAll('.popup');
const popupOverlay = document.querySelector('.overlay');

const server = 'https://academy.directlinedev.com';
const preloader = document.querySelector('.preloader');

const registerForm = document.forms.registerForm;
const signInForm = document.forms.signInForm;
const sendMessageForm = document.forms.sendMessageForm;

const requiredRegister = registerForm.elements.required;
const requiredSendMessage = sendMessageForm.elements.required;

const buttonRegister = registerForm.querySelector('.button-reg-js');
const buttonSignIn = signInForm.querySelector('.button-signIn-js');
const buttonSendMessage = sendMessageForm.querySelector('.button-sendMessage-js');
updateHeaderLinks();

// Вход пользователя
(function loginUser() {
    const popupOpenSign = document.querySelector('.button_sign-js');
    const popupFormSign = document.querySelector('.popup_sign');
    const popupCloseSign = document.querySelector('.popup_close_sign-js');
    const inputSign = popupFormSign.querySelector('input');
    const preloaderSingInForm = popupFormSign.querySelector('.signIn-preloader-js');

    popupOpenSign.addEventListener('click', function () {
        closePreloader(preloaderSingInForm);
        togglePopup(popupFormSign);
        inputSign.focus();
        
    });

    popupCloseSign.addEventListener('click', function () {
        togglePopup(popupFormSign);
    });

    
    // Форма логина
    function signIn(e) {
        e.preventDefault();
        openPreloader(preloaderSingInForm);
        const signInData = getValueForm(signInForm);
        sendRequestFetch({
            method: 'POST',
            url: '/api/users/login',
            body: JSON.stringify(signInData),
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Что-то пошло не так');
            }
        })
        .then(response => {
            localStorage.setItem('userId', response.data.userId);
            localStorage.setItem('token', response.data.token);
            updateHeaderLinks();
            togglePopup(popupFormSign);
            setTimeout(() => {
                closePreloader(preloaderSingInForm);
                location.pathname = '/pages/profile/index.html';
            }, 2000);
        })
        .catch(err => {
            alert(err);
            closePreloader(preloaderSingInForm);
        });
    }

    signInForm.addEventListener('submit', (e) => {
        signIn(e);
    })
})();

// Регистрация пользователя
(function registerUser() {
    const popupOpenRegister = document.querySelector('.button_register-js');
    const popupFormRegister = document.querySelector('.popup_register');
    const popupCloseRegister = document.querySelector('.popup_close_register-js');
    const inputRegister = popupFormRegister.querySelector('input');
    const preloaderRegisterForm =popupFormRegister.querySelector('.register-preloader-js');

    popupOpenRegister.addEventListener('click', function () {
        closePreloader(preloaderRegisterForm);
        togglePopup(popupFormRegister);
        inputRegister.focus();
        
    });

    popupCloseRegister.addEventListener('click', function () {
        togglePopup(popupFormRegister);
    });

    // Форма регистрации пользователя
    disableButton(buttonRegister, requiredRegister);

    function register(e) {
        e.preventDefault();
        openPreloader(preloaderRegisterForm);
        const registrationData = getValueForm(registerForm);
        sendRequestFetch({
            method: 'POST',
            url: '/api/users',
            body: JSON.stringify(registrationData),
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Что-то пошло не так');
            }
        })
        .then(response => {
            alert(`Вы успешно зарегистрировались! Ваш id: ${response.data.id}`);
            togglePopup(popupFormRegister);
            closePreloader(preloaderRegisterForm);
        })
        .catch(err => {
            alert(err);
            e.target.reset();
            closePreloader(preloaderRegisterForm);
        });
    }

    registerForm.addEventListener('submit', (e) => {
        register(e);
    });
})();


// Отправка сообщения
(function sendMessage() {
    const popupOpenSend = document.querySelector('.button_send-js');
    const popupFormSend = document.querySelector('.popup_send');
    const popupCloseSend = document.querySelector('.popup_close_send-js');
    const inputSend = popupFormSend.querySelector('input');
    const preloaderSendMessage = popupFormSend.querySelector('.sendMessage-preloader-js');

    popupOpenSend.addEventListener('click', function () {
        closePreloader(preloaderSendMessage);
        togglePopup(popupFormSend);
        inputSend.focus();
    });

    popupCloseSend.addEventListener('click', function () {
        togglePopup(popupFormSend);
    });

    // Форма отправки сообщений
    disableButton(buttonSendMessage, requiredSendMessage);

    function sendMessage(e) {
        e.preventDefault();
        openPreloader(preloaderSendMessage);
        const sendMessageData = getValueForm(sendMessageForm);
        const data = {
            to: sendMessageData.email,
            body: JSON.stringify(sendMessageData),
        };
        sendRequestFetch({
            method: 'POST',
            url: '/api/emails',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Что-то пошло не так');
            }
        })
        .then(response => {
            alert('Вы успешно отправили письмо!');
            togglePopup(popupFormSend);
            closePreloader(preloaderSendMessage);
        })
        .catch(err => {
            alert(err);
            e.target.reset();
            closePreloader(preloaderSendMessage);
        });
    }

    sendMessageForm.addEventListener('submit', (e) => {
        sendMessage(e);
    });
})();


//получение данных формы
function getValueForm(form) {
    const formData = new FormData(form);
    let formValues = {};
    
    formData.forEach((value, name) => {
        formValues[name] = value;
    });
    console.log(formValues)
    return formValues
}

// разблокировщик кнопки в форме
function disableButton(button, checkbox) {
    button.disabled = true;
    checkbox.addEventListener('change', () => {

    if (checkbox.checked) {
        button.disabled = false;
        } else {
            button.disabled = true;
        }
    });
}

// fetch запрос
function sendRequestFetch({ url, method, body, headers }) {
    let settings = {
        headers,
        method,
        body
    }
    return fetch(server + url, settings);
}

//  Открытие прелоадера
function openPreloader(preloader) {
    preloader.style.display = "flex";
}

// Закрытие прелоадера
function closePreloader(preloader) {
    if(preloader.style.display = "flex") {
        preloader.style.display = "none";
    }

}

// Инициализация ссылок header при авторизации
function updateHeaderLinks() {
    const token = localStorage.getItem('token');
    
    const buttonSignIn = document.querySelector('.signIn-js');
    const buttonRegister = document.querySelector('.register-js');
    const buttonToProfile = document.querySelector('.toProfile-js');
    if (token) {
        buttonSignIn.classList.add('common-hidden');
        buttonRegister.classList.add('common-hidden');
        buttonToProfile.classList.remove('common-hidden');
    } else {
        buttonSignIn.classList.remove('common-hidden');
        buttonRegister.classList.remove('common-hidden');
        buttonToProfile.classList.add('common-hidden');
    }
}

// Тоггл модалок
function togglePopup(popup) {
    popup.classList.toggle('popup_open');
    popupOverlay.classList.toggle('overlay_open');
}

// // функция закрытия модалок по Esc

window.addEventListener('keydown', e => {
    popups.forEach(popup => {
        if (e.key === "Escape" && popup.classList.contains('popup_open')){
                    popup.classList.remove('popup_open');        
        }
    })
    if (e.key === "Escape" && popupOverlay.classList.contains('overlay_open')){
                popupOverlay.classList.remove('overlay_open');       
        }  
});
