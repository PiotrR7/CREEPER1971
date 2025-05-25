import { Message } from '../message-box.js';

const minigame_btn1 = document.querySelector("#minigame-btn-1");
const minigame_btn2 = document.querySelector("#minigame-btn-2");

minigame_btn1.addEventListener('click', () => {
    window.location.reload(true);
});

minigame_btn2.addEventListener('click', () => {
    if (!document.querySelector(".message-box")) {
        Message(1, "info", "Aby wygrać musisz odblokować wszystkie pola, tak aby zakryte pozostały te, pod którymi są bomby.");
    }
});
