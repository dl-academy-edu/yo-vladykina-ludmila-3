// module

let buttonMobileHeader = document.querySelector(".menu__button_js");
let buttonCloseMobileHeader = document.querySelector(".mobile-header__close_js");
let mobileHeader = document.querySelector(".mobile-header");

//open
buttonMobileHeader.addEventListener("click",function(){
  mobileHeader.classList.add("mobile-header__open");
});

//close
buttonCloseMobileHeader.addEventListener("click", function(){
  mobileHeader.classList.remove("mobile-header__open");
});
