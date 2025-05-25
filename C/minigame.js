import { Message } from '../message-box.js';

const minigame_btn1 = document.querySelector("#minigame-btn-1");
const minigame_btn2 = document.querySelector("#minigame-btn-2");

minigame_btn1.addEventListener('click', () => {
    window.location.reload(true);
});

minigame_btn2.addEventListener('click', () => {
    if (!document.querySelector(".message-box")) {
        Message(1, "info", "Aby wygrać grę zatrzymaj wszystkie czerwone kreski w zielonym polu. Aby zatrzymać kreskę wciśnij spację.");
    }
});
