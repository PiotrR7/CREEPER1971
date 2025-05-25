export function startAnimation(text, audioSrc) {

    // Tworzymy przycisk startowy (dla odtwarzania dźwięku)
    const startButton = document.createElement('button');
    startButton.innerText = 'START';
    startButton.style.position = 'absolute';
    startButton.style.top = '50%';
    startButton.style.left = '50%';
    startButton.style.transform = 'translate(-50%, -50%)';
    startButton.style.fontSize = '20px';
    startButton.style.zIndex = 5;
    startButton.style.background = "none";
    startButton.style.color = "lime"
    startButton.style.fontWeight = "bold";
    startButton.style.fontFamily = "Rubik";
    startButton.style.border = "3px solid lime";
    startButton.style.height = "50px";
    startButton.style.width = "100px";
    startButton.style.borderRadius = "13px";
    startButton.style.position = "fixed";
    
  
    
    // Tworzymy pełnoekranowe tło
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
      container.style.left = '0';
      container.style.width = '100vw';
      container.style.height = '100vh';
      container.style.zIndex = '4';
      container.style.backgroundImage = "url('../images/main_bg.jpg')"; // Ścieżka do obrazu
      container.style.backgroundSize = 'cover';
      container.style.backgroundPosition = 'center';

      document.body.appendChild(container);
      document.body.appendChild(startButton);
      
    startButton.addEventListener('click', function () {
      document.body.removeChild(startButton); // Usuwamy przycisk po kliknięciu
      // Tworzymy kontener na tekst
      const textContainer = document.createElement('div');
      textContainer.style.position = 'absolute';
      textContainer.style.top = '50%';
      textContainer.style.left = '50%';
      textContainer.style.transform = 'translate(-50%, -50%)';
      textContainer.style.color = 'white';
      textContainer.style.fontSize = '2em';
      textContainer.style.fontFamily = 'Jersey 15';
      textContainer.style.textAlign = 'center';
      container.appendChild(textContainer);
  
      // Tworzymy przycisk "kontynuuj"
      const button = document.createElement('button');
      button.innerText = 'Dalej';
      button.style.display = 'none';
      button.style.position = 'absolute';
      button.style.bottom = '20px';
      button.style.left = '50%';
      button.style.transform = 'translateX(-50%)';
      button.style.zIndex = 5;
      button.style.background = "none";
      button.style.color = "lime"
      button.style.fontWeight = "bold";
      button.style.fontFamily = "Rubik";
      button.style.border = "3px solid lime";
      button.style.height = "50px";
      button.style.width = "100px";
      button.style.borderRadius = "13px";
      container.appendChild(button);
  
      let index = 0;
      let textComplete = false;
      let audioComplete = false;
  
      // Funkcja sprawdzająca, czy można wyświetlić przycisk
      function checkCompletion() {
        if (textComplete && audioComplete) {
          button.style.display = 'block';
        }
      }
  
      // Funkcja wyświetlająca tekst litera po literce
      function typeLetter() {
        if (index < text.length) {
          textContainer.textContent += text[index]; // Zachowuje spacje
          index++;
          setTimeout(typeLetter, 75);
        } else {
          textComplete = true;
          checkCompletion();
        }
      }
      typeLetter();
  
      // Odtwarzanie dźwięku
      const audio = new Audio(audioSrc);
      audio.play().then(() => {
        audioComplete = true;
        checkCompletion();
      }).catch(error => console.log("Błąd odtwarzania dźwięku:", error));
  
      // Obsługa przycisku "kontynuuj" - zatrzymuje dźwięk i usuwa okno
      button.addEventListener('click', function () {
        audio.pause(); // Zatrzymuje dźwięk
        audio.currentTime = 0; // Resetuje czas odtwarzania
        document.body.removeChild(container); // Usuwa okno
      });
    });
  }
  
  // ✅ Uruchomienie animacji z własnym tekstem i dźwiękiem:
  // startAnimation("Witaj w grze, rozpocznij swoją przygodę!", "voice/Gra1.wav");
  