/* -------------------------------ANIMACJA DESZCZU--------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
    const matrixContainer = document.getElementById('matrix');
    const symbols = "01";
    const symbolArray = symbols.split('');

    function createSymbol() {
        const symbol = document.createElement('div');
        symbol.classList.add('matrix-symbol');
        symbol.textContent = symbolArray[Math.floor(Math.random() * symbolArray.length)];
        symbol.style.left = Math.random() * 98 + 'vw';
        symbol.style.animationDuration = Math.random() * 1 + 3 + 's'; // Animacja trwa 5–8 sekund
        symbol.style.top = `${Math.random() * document.documentElement.scrollHeight - 100}px`; // Start od losowego miejsca
        symbol.style.fontSize = Math.random() * 10 + 15 + 'px';

        matrixContainer.appendChild(symbol);

        // Usuń symbol po zakończeniu animacji
        symbol.addEventListener('animationend', () => {
            // Usuwamy symbol tylko jeśli nadal istnieje w DOM
            if (symbol.parentNode) {
                matrixContainer.removeChild(symbol); 
            }
        });
    }

    // Generowanie nowych symboli co 200 ms
    setInterval(createSymbol, 100);
});

