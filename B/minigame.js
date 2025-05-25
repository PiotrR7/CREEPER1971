import { Message } from '../message-box.js';

const minigame_btn1 = document.querySelector("#minigame-btn-1");
const minigame_btn2 = document.querySelector("#minigame-btn-2");

minigame_btn1.addEventListener('click', () => {
    window.location.reload(true);
});

minigame_btn2.addEventListener('click', () => {
    if (!document.querySelector(".message-box")) {
        Message(1, "info", "Aby wygrać grę osiągnij wynik 20. Aby skoczyć wciśnij spacje lub ppm.");
    }
});
