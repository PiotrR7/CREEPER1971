import {Message} from '../message-box.js';
import { startAnimation } from "../speaker/speaker-box.js";

let wasGame4SpeakerPlayed = localStorage.getItem("wasGame4SpeakerPlayed");
        
if (wasGame4SpeakerPlayed != 'true') {
    startAnimation("Na tym poziomie musisz znaleźć drogę do celu, ale pamiętaj, że labirynt jest pełen pułapek. W tej wirtualnej rzeczywistości czai się niebezpieczeństwo. Możę występować tak zwany Phishing. Te zagrożenie jest powiązane z podszywaniem się pod wiarygodne instytucję, bądź firmy. Wysyłając fałszywe e-maile, które mają na celu wyłudzenie danych logowania, numerów kart kredytowych lub innych wrażliwych informacji. Wędruj ostrożnie i nie daj się złapać w pułapkę!", "../speaker/voice/Gra4.wav");
    localStorage.setItem("wasGame4SpeakerPlayed", "true");
}

const cols = 15;
const rows = 15;
const cellSize = 30;
let grid = [];
let current;
let stack = [];

// Funkcja pomocnicza – zwraca indeks komórki w jednowymiarowej tablicy
function index(i, j) {
  if (i < 0 || j < 0 || i >= cols || j >= rows) return -1;
  return i + j * cols;
}

// Definicja komórki labiryntu
class Cell {
  constructor(i, j) {
    this.i = i;
    this.j = j;
    // Ściany: [góra, prawo, dół, lewo]
    this.walls = [true, true, true, true];
    this.visited = false;
  }
  
  // Wybiera losowego nieodwiedzonego sąsiada
  checkNeighbors(grid) {
    let neighbors = [];
    let top    = (this.j > 0)          ? grid[index(this.i, this.j - 1)] : undefined;
    let right  = (this.i < cols - 1)   ? grid[index(this.i + 1, this.j)] : undefined;
    let bottom = (this.j < rows - 1)   ? grid[index(this.i, this.j + 1)] : undefined;
    let left   = (this.i > 0)          ? grid[index(this.i - 1, this.j)] : undefined;
    
    if (top && !top.visited) neighbors.push(top);
    if (right && !right.visited) neighbors.push(right);
    if (bottom && !bottom.visited) neighbors.push(bottom);
    if (left && !left.visited) neighbors.push(left);
    
    if (neighbors.length > 0) {
      let r = Math.floor(Math.random() * neighbors.length);
      return neighbors[r];
    } else {
      return undefined;
    }
  }
}

// Usuwa ściany między dwiema komórkami
function removeWalls(a, b) {
  let x = a.i - b.i;
  if (x === 1) {
    a.walls[3] = false; // usunięcie lewej ściany komórki a
    b.walls[1] = false; // usunięcie prawej ściany komórki b
  } else if (x === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }
  
  let y = a.j - b.j;
  if (y === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}

// Generowanie labiryntu metodą DFS (rekurencyjny backtracking)
function generateMaze() {
  // Inicjalizacja siatki
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let cell = new Cell(i, j);
      grid.push(cell);
    }
  }
  current = grid[0];
  current.visited = true;
  
  while (true) {
    let next = current.checkNeighbors(grid);
    if (next) {
      next.visited = true;
      stack.push(current);
      removeWalls(current, next);
      current = next;
    } else if (stack.length > 0) {
      current = stack.pop();
    } else {
      break;
    }
  }
}

// Rysowanie labiryntu w elemencie DOM
function drawMaze() {
  const mazeContainer = document.getElementById("maze");
  mazeContainer.style.width = `${cols * cellSize}px`;
  mazeContainer.style.height = `${rows * cellSize}px`;
  mazeContainer.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
  mazeContainer.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;
  mazeContainer.innerHTML = "";
  
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let cellDiv = document.createElement("div");
      cellDiv.classList.add("cell");
      let cell = grid[index(i, j)];
      if (cell.walls[0]) cellDiv.classList.add("wall-top");
      if (cell.walls[1]) cellDiv.classList.add("wall-right");
      if (cell.walls[2]) cellDiv.classList.add("wall-bottom");
      if (cell.walls[3]) cellDiv.classList.add("wall-left");
      cellDiv.setAttribute("data-i", i);
      cellDiv.setAttribute("data-j", j);
      mazeContainer.appendChild(cellDiv);
    }
  }
}

let playerPos = { i: 0, j: 0 };

// Inicjalizacja gry – umieszczenie gracza oraz wyznaczenie komórki wyjścia
function initGame() {
  // Dodaj gracza (niebieski div) do komórki startowej (0,0)
  let startCell = document.querySelector(`.cell[data-i="0"][data-j="0"]`);
  let playerDiv = document.createElement("div");
  playerDiv.classList.add("player");
  playerDiv.id = "player";
  startCell.appendChild(playerDiv);
  
  // Oznacz wyjście (zielony div) w komórce (cols-1, rows-1)
  let exitCell = document.querySelector(`.cell[data-i="${cols - 1}"][data-j="${rows - 1}"]`);
  let exitDiv = document.createElement("div");
  exitDiv.classList.add("exit");
  exitDiv.id = "exit";
  exitCell.appendChild(exitDiv);
}

// Obsługa ruchu gracza za pomocą strzałek
function movePlayer(e) {
  let currentCell = grid[index(playerPos.i, playerPos.j)];
  let newI = playerPos.i;
  let newJ = playerPos.j;
  
  if (e.key === "ArrowUp") {
    if (!currentCell.walls[0]) newJ--;
  } else if (e.key === "ArrowRight") {
    if (!currentCell.walls[1]) newI++;
  } else if (e.key === "ArrowDown") {
    if (!currentCell.walls[2]) newJ++;
  } else if (e.key === "ArrowLeft") {
    if (!currentCell.walls[3]) newI--;
  }
  
  // Sprawdzenie, czy nowa pozycja mieści się w labiryncie
  if (newI >= 0 && newI < cols && newJ >= 0 && newJ < rows) {
    // Przeniesienie gracza wizualnie
    let oldCell = document.querySelector(`.cell[data-i="${playerPos.i}"][data-j="${playerPos.j}"]`);
    let playerEl = document.getElementById("player");
    if (playerEl && oldCell.contains(playerEl)) {
      oldCell.removeChild(playerEl);
    }
    let newCell = document.querySelector(`.cell[data-i="${newI}"][data-j="${newJ}"]`);
    newCell.appendChild(playerEl);
    playerPos.i = newI;
    playerPos.j = newJ;
    checkWin();
  }
}

// Sprawdzenie, czy gracz dotarł do komórki wyjścia
function checkWin() {
  if (playerPos.i === cols - 1 && playerPos.j === rows - 1) {
    setTimeout(() => {
      if (localStorage.getItem("IsLevelFourFinished") != "true") {
        Message(1, "info", "Gratulacje wygrania gry! Level 5 odblokowany.");
        localStorage.setItem("IsLevelFourFinished", "true");
      } else {
        Message(1, "info", "Gratulacje wygrania gry!");
      }
    }, 100);
    document.removeEventListener("keydown", movePlayer);
  }
}

// Nasłuchiwanie zdarzeń klawiatury
document.addEventListener("keydown", movePlayer);

// Po załadowaniu dokumentu generujemy labirynt, rysujemy go i inicjujemy grę
document.addEventListener("DOMContentLoaded", () => {
  generateMaze();
  drawMaze();
  initGame();
});
