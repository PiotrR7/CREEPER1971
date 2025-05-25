// const btn1 = document.querySelector(".mbtn1");
const btn2 = document.querySelector(".mbtn2");
const btn3 = document.querySelector(".mbtn3");
const btn4 = document.querySelector(".mbtn4");

let scrollbarHidden = false; // Flaga do śledzenia stanu scrollbara

// btn1.addEventListener('click', () => {
//     alert('Przycisk został kliknięty');
// });

btn2.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
});

btn3.addEventListener('click', () => {
    if (scrollbarHidden) {
        // Przywrócenie scrollbara
        document.body.style.overflowY = 'auto';
      } else {
        // Ukrycie scrollbara
        document.body.style.overflowY = 'hidden';
      }

      // Odwrócenie flagi
      scrollbarHidden = !scrollbarHidden;
});

btn4.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    document.body.classList.toggle('dark-mode');
    const icon = btn4.querySelector('span');
    if (document.body.classList.contains('light-mode')) {
        icon.textContent = 'light_mode';
    } else {
        icon.textContent = 'dark_mode';
    }
});

// LEVELS
let IsLevelOneFinished = localStorage.getItem("IsLevelOneFinished");
let IsLevelTwoFinished = localStorage.getItem("IsLevelTwoFinished");
let IsLevelThreeFinished = localStorage.getItem("IsLevelThreeFinished");
let IsLevelFourFinished = localStorage.getItem("IsLevelFourFinished");
let IsLevelFiveFinished = localStorage.getItem("IsLevelFiveFinished");
let IsLevelSixFinished = localStorage.getItem("IsLevelSixFinished");
    
if (IsLevelOneFinished == "true") {
    let btn = document.querySelector("#level-btn-2");
    btn.style.visibility = "visible";

    let image = document.querySelector(".game-box-2-image");
    image.style.filter = "none";
}
if (IsLevelTwoFinished == "true") {
    let btn = document.querySelector("#level-btn-3");
    btn.style.visibility = "visible";

    let image = document.querySelector(".game-box-3-image");
    image.style.filter = "none";
}
if (IsLevelThreeFinished == "true") {
    let btn = document.querySelector("#level-btn-4");
    btn.style.visibility = "visible";

    let image = document.querySelector(".game-box-4-image");
    image.style.filter = "none";
}
if (IsLevelFourFinished == "true") {
    let btn = document.querySelector("#level-btn-5");
    btn.style.visibility = "visible";

    let image = document.querySelector(".game-box-5-image");
    image.style.filter = "none";
}
if (IsLevelFiveFinished == "true") {
    let btn = document.querySelector("#level-btn-6");
    btn.style.visibility = "visible";

    let image = document.querySelector(".game-box-6-image");
    image.style.filter = "none";
}