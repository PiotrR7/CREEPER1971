import {Message} from '../message-box.js';
import { startAnimation } from "../speaker/speaker-box.js";

let wasGame5SpeakerPlayed = localStorage.getItem("wasGame5SpeakerPlayed");
        
if (wasGame5SpeakerPlayed != 'true') {
    startAnimation("W tej grze musisz wykazać się doskonałym refleksem i wyczuciem rytmu. Podobnie jak w cyberprzestrzeni, gdzie ważne jest szybkie reagowanie na zagrożenia, tutaj liczy się precyzja i odpowiedni czas reakcji. W świecie internetu możemy natrafić na różnego rodzaju ataki, takie jak Adware (oprogramowanie wyświetlające niechciane reklamy, mogące przekierowywać na niebezpieczne strony), czy Malware (złośliwe oprogramowanie, które może przybierać różne formy, np. wirusy, trojany) – kluczowe jest rozpoznanie niebezpieczeństwa i odpowiednie działanie. Im lepiej dostosujesz swoje reakcje, tym większa szansa na sukces.", "../speaker/voice/Gra5.wav");
    localStorage.setItem("wasGame5SpeakerPlayed", "true");
}

const lanes = document.querySelectorAll('.lane');
const scoreDisplay = document.getElementById('score');

let score = 0;
let notes = []; // Tablica przechowująca aktywne nuty: { lane, y, element }

const spawnInterval = 1000;  // Interwał pojawiania się nut (ms)
const noteHeight = 30;       // Wysokość nuty (musi pasować do .note w CSS)
const activeZoneHeight = 100; // Zwiększony obszar trafienia (100px)
const baseSpeed = 2;         // Bazowa prędkość opadania nut

let gameOver = false;
let noteSpawner = setInterval(spawnNote, spawnInterval);

// Funkcja tworząca nową nutę w losowej ścieżce
function spawnNote() {
  if (gameOver) return;
  const laneIndex = Math.floor(Math.random() * 3); // 0, 1 lub 2
  const note = document.createElement('div');
  note.classList.add('note');
  note.style.top = `-${noteHeight}px`; // Zaczynamy nad obszarem gry

  // Dodaj nutę do odpowiedniej ścieżki
  const laneElement = document.querySelector(`.lane[data-lane="${laneIndex}"]`);
  laneElement.appendChild(note);
  
  notes.push({ lane: laneIndex, y: -noteHeight, element: note });
}

// Funkcja aktualizująca pozycję nut przy każdej klatce animacji
function updateNotes() {
  if (gameOver) return;
  
  // Dynamicznie zwiększamy prędkość opadania nut w zależności od wyniku
  let currentSpeed = baseSpeed + Math.floor(score / 7);
  
  for (let i = 0; i < notes.length; i++) {
    let noteObj = notes[i];
    noteObj.y += currentSpeed;
    noteObj.element.style.top = noteObj.y + 'px';
    
    const laneElement = document.querySelector(`.lane[data-lane="${noteObj.lane}"]`);
    
    // Jeśli nuta przekroczy obszar trafienia (czyli została nietrafiona), kończymy grę przegraną
    if (noteObj.y > laneElement.offsetHeight - noteHeight) {
      endGame(false);
      return;
    }
  }
  requestAnimationFrame(updateNotes);
}

// Funkcja kończąca grę (win = true -> wygrana, false -> przegrana)
function endGame(win) {
  gameOver = true;
  clearInterval(noteSpawner);
  document.removeEventListener('keydown', handleKeyPress);
  if (win) {
    if (localStorage.getItem("IsLevelFiveFinished") != "true") {
      Message(1, "info", "Gratulacje! Wygrałeś! Level 6 odblokowany.");
      localStorage.setItem("IsLevelFiveFinished", "true");
    } else {
      Message(1, "info", "Gratulacje! Wygrałeś!");
    }
  };
}

// Obsługa naciśnięć klawiszy
function handleKeyPress(e) {
  if (gameOver) return;
  let lane;
  if (e.key === "ArrowLeft") {
    lane = 0;
  } else if (e.key === "ArrowDown") {
    lane = 1;
  } else if (e.key === "ArrowRight") {
    lane = 2;
  } else {
    return; // Ignorujemy inne klawisze
  }
  
  // Sprawdzamy, czy w danej ścieżce istnieje nuta w strefie trafienia
  for (let i = 0; i < notes.length; i++) {
    let noteObj = notes[i];
    if (noteObj.lane === lane) {
      const laneElement = document.querySelector(`.lane[data-lane="${lane}"]`);
      // Nuta trafia, gdy jej pozycja mieści się w obrębie strefy trafienia
      if (noteObj.y >= laneElement.offsetHeight - activeZoneHeight - noteHeight &&
          noteObj.y <= laneElement.offsetHeight - noteHeight) {
        // Trafienie – zwiększamy wynik i usuwamy nutę
        score += 1;
        scoreDisplay.innerText = "Score: " + score;
        noteObj.element.remove();
        notes.splice(i, 1);
        
        // Jeśli osiągnięto 50 punktów, gra kończy się wygraną
        if (score >= 50) {
          endGame(true);
        }
        return; // Trafiono jedną nutę na naciśnięcie
      }
    }
  }
}

document.addEventListener('keydown', handleKeyPress);
requestAnimationFrame(updateNotes);
