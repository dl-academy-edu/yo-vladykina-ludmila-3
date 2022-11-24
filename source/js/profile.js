
// модалки
const popup = document.querySelector('.popup');
const popups = document.querySelectorAll('.popup');
const popupOverlay = document.querySelector('.overlay');

const server = 'https://academy.directlinedev.com';
const preloader = document.querySelector('.preloader');

const registerForm = document.forms.registerForm;
const signInForm = document.forms.signInForm;
const requiredRegister = registerForm.elements.required;


const buttonRegister = registerForm.querySelector('.button-reg-js');
const buttonSignIn = signInForm.querySelector('.button-signIn-js');
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
                location.pathname = 'profile.html';
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
    return fetch(server + url + '?v=1.0.0.', settings);
}

function errorCreate(errors, form) {
    if(Object.keys(errors).length) {
        Object.keys(errors).forEach(key => {
            const messageError = errors[key];
            const input = form.elements[key];
            setError(input, messageError);
            console.log(messageError, input)
        })
        return;
    }
}

function setError(input, errorMessage) {
    const error = errorTextCreator(errorMessage);
    input.classList.add('form__input_inValid');
    input.insertAdjacentElement('afterend', error);
    input.addEventListener('input', function() {
        error.remove();
        input.classList.remove('form__input_inValid');
    }, {once: true});
}
  
function errorTextCreator(message) {
    let messageError = document.createElement('div');
    messageError.classList.add('form__alert-warning');
    messageError.innerText = message;
    return messageError;
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

// функция закрытия модалок по Esc

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

// Выход из аккаунта
const buttonSignOut = document.querySelector('.button-signOut-js');

function signOut() {
    if(confirm('выйти из аккаунта?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        location.pathname = '/';
    }
}

buttonSignOut.addEventListener('click', () => {
    signOut()
});

// Профиль
const changePasswordForm = document.forms.changePasswordForm;
const changeDataForm = document.forms.changeDataForm;

const profileImg = document.querySelector('.user-img-js');
const profileName = document.querySelector('.user-name-js');
const profileSurname = document.querySelector('.user-surname-js');
const profileEmail = document.querySelector('.user-email-js');
const profilePassword = document.querySelector('.user-password-js');
const profileLocation = document.querySelector('.user-location-js');
const profileAge = document.querySelector('.user-age-js');
let profile = {};

// Выставление данных аккаунта пользователя в профайл при загрузке страницы
getProfile();

// смена ссылок при авторизации по токену
updateHeaderLinks();

// получение профиля на странице
function renderProfile() {
    profileImg.style.backgroundImage = `url(${server + profile.photoUrl})`;
    profileName.innerText = profile.name;
    profileSurname.innerText = profile.surname;
    profileEmail.innerText = profile.email; 
    profilePassword.innerText = '***************'   
    profileLocation.innerText = profile.location;
    profileAge.innerText = profile.age;
}

// подставление актуальных данных аккаунта в форму смены данных
function setDateToFormChangeData() {
    changeDataForm.name.value = profile.name;
    changeDataForm.surname.value = profile.surname;
    changeDataForm.email.value = profile.email;    
    changeDataForm.location.value = profile.location;
    changeDataForm.age.value = profile.age;
}

function getProfile() {
    openPreloader(preloader);
    sendRequestFetch({
        method: 'GET',
        url: `/api/users/${localStorage.getItem('userId')}`,
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Что-то пошло не так!')
        }
    })
    .then(response => {
        profile = response.data
        renderProfile();
        closePreloader(preloader);
        
    })
    .catch(err => {
        alert(err);
        closePreloader(preloader);
        location.pathname = '/'
    })
}

// Форма пароля
const popupOpenChangePassword = document.querySelector('.button_change-pass-js');
const popupChangePassword = document.querySelector('.popup_change-pass');
const popupCloseChangePassword = document.querySelector('.popup_close-change-pass-js');
const inputChangePassword = popupChangePassword.querySelector('input');
const preloaderChangePassword =popupChangePassword.querySelector('.change-password-preloader-js');

popupOpenChangePassword.addEventListener('click', function () {
    closePreloader(preloaderChangePassword);
    togglePopup(popupChangePassword);
    inputChangePassword.focus();
    
});

popupCloseChangePassword.addEventListener('click', function () {
    togglePopup(popupChangePassword);
});

// Смена пароля
function changePassword(e) {
    e.preventDefault();
    openPreloader(preloaderChangePassword);
    const changePassword = getValueForm(changePasswordForm);
    sendRequestFetch({
        method: 'PUT',
        url: '/api/users',
        body: JSON.stringify(changePassword),
        headers: {
            'x-access-token': localStorage.getItem('token'),
            'Content-Type': 'application/json; charset=utf-8'
        },
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            location.pathname = '/';
            return;
        } else {
            throw new Error('Что-то пошло не так!');
        }
    })
    .then(response => {
        alert('Вы успешно поменяли пароль!');
        profile = response.data;
        renderProfile();
        togglePopup(popupChangePassword);
        closePreloader(preloaderChangePassword);
    })
    .catch(err => {
        alert(err);
        togglePopup(popupChangePassword);
        closePreloader(preloaderChangePassword);
    })
}

changePasswordForm.addEventListener('submit', (e) => {
    changePassword(e)
})

// Форма данных
const popupOpenChangeData = document.querySelector('.button_change-data-js');
const popupFormChangeData = document.querySelector('.popup_change-data');
const popupCloseChangeData = document.querySelector('.popup_close-change-data-js');
const inputChangeData = popupFormChangeData.querySelector('input');
const preloaderChangeData = popupFormChangeData.querySelector('.change-data-preloader-js');

popupOpenChangeData.addEventListener('click', function () {
    setDateToFormChangeData();
    closePreloader(preloaderChangeData);
    togglePopup(popupFormChangeData);
    inputChangeData.focus();
    
});

popupCloseChangeData.addEventListener('click', function () {    
    togglePopup(popupFormChangeData);    
});

// смена данных

function changeData(e) {
    e.preventDefault();
    openPreloader(preloaderChangeData);
    const changeData = new FormData(changeDataForm);
    sendRequestFetch({
        method: 'PUT',
        url: '/api/users',
        body: changeData,
        headers: {
            'x-access-token': localStorage.getItem('token'),
        },
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');           
            location.pathname = '/';
            return;
        } else {
            throw new Error('Что-то пошло не так!');
        }
    })
    .then(response => {
        alert('Данные успешно изменены!');         
        profile = response.data;
        renderProfile();
        togglePopup(popupFormChangeData);
        closePreloader(preloaderChangeData);
        
    })
    .catch(err => {       
        alert(err);
        closePreloader(preloaderChangeData);
    })
}

changeDataForm.addEventListener('submit', (e) => {
    changeData(e);
   
});


// Удаление аккаунта
const buttonDeleteAccount = document.querySelector('.button-delete-js');

function deleteAccount() {
    if (confirm ('Удалить аккаунт?')) {
        sendRequestFetch({
            method: 'DELETE',
            url: `/api/users/${localStorage.getItem('userId')}`,
            headers: {
                'x-access-token': localStorage.getItem('token'),
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                location.pathname = '/';
                return;
            } else {
                throw new Error('Что-то пошло не так!');
            }
        })
        .then(response => {
            alert('Ваш аккаунт был успешно удален');
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            location.pathname = '/';
        })
        .catch(err => {
            alert(err);
        })
    }
}

buttonDeleteAccount.addEventListener('click', () => {
    deleteAccount()
})


//Функция теста email
function emailValid(email) {
	return email.match(/^[0-9a-z-\.]+\@[0-9a-z-]{2,}\.[a-z]{2,}$/i);
};

//Функция проверки пароля
function passwordValid(password) {
    return password.length > 6;
};

