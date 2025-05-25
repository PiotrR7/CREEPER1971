import {Message} from '../message-box.js';
import { startAnimation } from "../speaker/speaker-box.js";

let wasGame3SpeakerPlayed = localStorage.getItem("wasGame3SpeakerPlayed");
        
if (wasGame3SpeakerPlayed != 'true') {
    startAnimation("W tej grze będziesz musiał przejść przez wirtualny system zabezpieczeń. Musisz pamiętać, że podobnie jak w prawdziwym świecie, w sieci mogą pojawić się pułapki. Pobierając aplikacje z niezaufanej strony internetowej. Musisz zachować ostrożność, ponieważ możesz przypadkowo pobrać wirusa lub złośliwe oprogramowanie na swój komputer! Wirusy mają zdolność do utraty wszystkich twoich danych, uszkadzania plików oraz ich szyfrowania. Warto wspomnieć, że złośliwe oprogramowania mogą się rozprzestrzeniać na inne urządzenia w sieci. Jednym z pierwszych wiusów był Creeper jego działanie polegało na tym by wyświetlać na kolejno infekowanych przez sieć komputerów krótkiego komunikatu: ?Jestem Creeper, złap mnie, jeśli potrafisz?  Bądź czujny i nie daj się oszukać!", "../speaker/voice/Gra3.wav");
    localStorage.setItem("wasGame3SpeakerPlayed", "true");
}

const locksContainer = document.getElementById("locks-container");
const startButton = document.getElementById("start-button");
const retryButton = document.getElementById("retry-button");

const lockCount = 5;
const locks = [];
let isPlaying = false;
let activeLockIndex = 0;

function createLocks() {
    locksContainer.innerHTML = "";
    locks.length = 0;

    for (let i = 0; i < lockCount; i++) {
        const lock = document.createElement("div");
        lock.classList.add("lock");

        const target = document.createElement("div");
        target.classList.add("target");
        const targetWidth = Math.random() * 50 + 30;
        target.style.width = `${targetWidth}px`;
        target.style.left = `${Math.random() * (300 - targetWidth)}px`;

        const pin = document.createElement("div");
        pin.classList.add("pin");
        lock.appendChild(target);
        lock.appendChild(pin);

        locks.push({
            lockElement: lock,
            targetElement: target,
            pinElement: pin,
            pinPosition: 0,
            pinSpeed: Math.random() * 5 + 3,
            pinDirection: 1,
            resolved: false,
        });

        locksContainer.appendChild(lock);
    }
}

function startGame() {
    isPlaying = true;
    activeLockIndex = 0;
    startButton.style.display = "none";
    retryButton.style.display = "none";

    createLocks();

    movePin(locks[activeLockIndex]);

    document.addEventListener("keydown", stopPin);
}

function retryGame() {
    isPlaying = true;
    retryButton.style.display = "none";
    activeLockIndex = 0;

    createLocks();
    movePin(locks[activeLockIndex]);

    document.addEventListener("keydown", stopPin);
}

function movePin(lock) {
    if (!isPlaying || lock.resolved) return;

    lock.pinPosition += lock.pinDirection * lock.pinSpeed;

    if (lock.pinPosition <= 0 || lock.pinPosition >= 300 - lock.pinElement.offsetWidth) {
        lock.pinDirection *= -1;
    }

    lock.pinElement.style.left = `${lock.pinPosition}px`;

    requestAnimationFrame(() => movePin(lock));
}

function stopPin(event) {
    if (event.code === "Space" && isPlaying) {
        const lock = locks[activeLockIndex];

        if (!lock.resolved) {
            const pinLeft = lock.pinElement.offsetLeft;
            const pinRight = pinLeft + lock.pinElement.offsetWidth;
            const targetLeft = lock.targetElement.offsetLeft;
            const targetRight = targetLeft + lock.targetElement.offsetWidth;

            if (pinLeft >= targetLeft && pinRight <= targetRight) {
                lock.resolved = true;
                activeLockIndex++;
                
                if (activeLockIndex < locks.length) {
                    movePin(locks[activeLockIndex]);
                } else {
                    isPlaying = false;
                    startButton.style.display = "block";
                    document.removeEventListener("keydown", stopPin);            
                    
                    if (localStorage.getItem("IsLevelThreeFinished") != "true") {
                        Message(1, "info", "Gratulacje wygrania gry! Level 4 odblokowany.");
                        localStorage.setItem("IsLevelThreeFinished", "true");
                      } else {
                        Message(1, "info", "Gratulacje wygrania gry!");
                      }
                }
            } else {
                lock.resolved = false;
                isPlaying = false;
                document.removeEventListener("keydown", stopPin);
                retryButton.style.display = "block";
            }
        }
    }
}

startButton.addEventListener("click", startGame);
retryButton.addEventListener("click", retryGame); 