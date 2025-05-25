import { Message } from '../message-box.js';
import { startAnimation } from "../speaker/speaker-box.js";

let wasGame1SpeakerPlayed = localStorage.getItem("wasGame1SpeakerPlayed");

if (wasGame1SpeakerPlayed != 'true') {
    startAnimation("W pierwszym poziomie staniesz przed dosyć ciężkim zadaniem. Będziesz musiał pokonać wiele przeszkód, symbolizujących zagrożenia w przestrzeni internetowej. Jeśli w internecie zauważysz coś, co wygląda jak link lub podejrzany plik, nie klikaj w to! Może to być pułapka – po kliknięciu możesz zostać narażony na wirusy, które mogą zainfekować Twoje urządzenie. Nie daj się zwieść!", "../speaker/voice/Gra1.wav");
    localStorage.setItem("wasGame1SpeakerPlayed", "true");
}

const rows = 10;
const cols = 10;
const minesCount = 20;

let gameBoard = [];
let cellsRevealed = 0; // Zmienna do śledzenia liczby odkrytych komórek
let firstClick = true; // Flaga, która sprawdza, czy to jest pierwsze kliknięcie

function createBoard() {
    const gameContainer = document.getElementById('game');
    gameContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    gameContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    for (let r = 0; r < rows; r++) {
        gameBoard[r] = [];
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('click', revealCell);
            cell.addEventListener('contextmenu', toggleFlag);
            gameBoard[r][c] = { mine: false, revealed: false, flagged: false, element: cell };
            gameContainer.appendChild(cell);
        }
    }

    placeMines();
}

function placeMines() {
    let placedMines = 0;
    while (placedMines < minesCount) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);
        if (!gameBoard[r][c].mine) {
            gameBoard[r][c].mine = true;
            placedMines++;
        }
    }
}

function revealCell(event) {
    const cell = event.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    const boardCell = gameBoard[row][col];

    // Jeśli komórka jest już odkryta lub jest oznaczona flagą, nie rób nic
    if (boardCell.revealed || boardCell.flagged) return;

    // Sprawdź, czy to pierwsze kliknięcie
    if (firstClick) {
        firstClick = false;
        // Jeśli kliknięto na bombę, zmień ją na pustą komórkę i umieść bombę w innym miejscu
        if (boardCell.mine) {
            boardCell.mine = false;
            placeSingleMine(row, col); // Przypisuje bombę w innym losowym miejscu
        }
    }

    // Odkrywamy komórkę
    boardCell.revealed = true;
    cell.classList.add('revealed');
    cellsRevealed++; // Zwiększ licznik odkrytych komórek

    if (boardCell.mine) {
        cell.classList.add('mine');
        gameOver(false);
        return;
    }

    const minesAround = countMinesAround(row, col);
    if (minesAround > 0) {
        cell.textContent = minesAround;
    } else {
        revealAdjacentCells(row, col);
    }

    // Jeśli odkryto mniej niż 5 komórek, odkrywaj więcej
    if (cellsRevealed < 5) {
        revealRandomCells();
    }

    checkWin();
}

function placeSingleMine(excludedRow, excludedCol) {
    // Funkcja do umieszczania pojedynczej bomby w losowym miejscu, z wyjątkiem komórki, którą kliknął gracz
    let r, c;
    do {
        r = Math.floor(Math.random() * rows);
        c = Math.floor(Math.random() * cols);
    } while (r === excludedRow && c === excludedCol && gameBoard[r][c].mine); // Upewnij się, że bomba nie trafi w klikniętą komórkę

    gameBoard[r][c].mine = true;
}

function countMinesAround(row, col) {
    let count = 0;
    for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
            const newRow = row + r;
            const newCol = col + c;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                if (gameBoard[newRow][newCol].mine) {
                    count++;
                }
            }
        }
    }
    return count;
}

function revealAdjacentCells(row, col) {
    for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
            const newRow = row + r;
            const newCol = col + c;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                const neighbor = gameBoard[newRow][newCol];
                if (!neighbor.revealed && !neighbor.mine) {
                    neighbor.element.click();
                }
            }
        }
    }
}

function revealRandomCells() {
    // Funkcja odkrywa losowe komórki
    let revealed = 0;
    while (revealed < 5 - cellsRevealed) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);
        const cell = gameBoard[r][c];
        if (!cell.revealed && !cell.mine) {
            cell.revealed = true;
            cell.element.classList.add('revealed');
            const minesAround = countMinesAround(r, c);
            if (minesAround > 0) {
                cell.element.textContent = minesAround;
            } else {
                revealAdjacentCells(r, c);
            }
            revealed++;
        }
    }
}

function toggleFlag(event) {
    event.preventDefault();
    const cell = event.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    const boardCell = gameBoard[row][col];

    if (boardCell.revealed) return;

    boardCell.flagged = !boardCell.flagged;
    cell.classList.toggle('flag');
    cell.textContent = boardCell.flagged ? '🚩' : '';
}

function checkWin() {
    let revealedCount = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (gameBoard[r][c].revealed) revealedCount++;
        }
    }
    if (revealedCount === rows * cols - minesCount) {
        gameOver(true);
    }
}

function gameOver(won) {
    if (won) {
        if (localStorage.getItem("IsLevelOneFinished") != "true") {
            Message(1, "info", "Gratulacje wygrania gry! Level 2 odblokowany.");
            localStorage.setItem("IsLevelOneFinished", "true");
        } else {
            Message(1, "info", "Gratulacje wygrania gry!");
        }
    } else {
        revealAllMines();
    }

    document.querySelectorAll('.cell').forEach(cell => {
        cell.removeEventListener('click', revealCell);
        cell.removeEventListener('contextmenu', toggleFlag);
    });
}

function revealAllMines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = gameBoard[r][c];
            if (cell.mine) {
                cell.element.classList.add('mine');
            }
        }
    }
}

createBoard();
