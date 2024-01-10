class AudioController {
    constructor() {
        this.onHover = new Audio('assets/audio/hover.mp3');
        this.onClick = new Audio('assets/audio/onClick.mp3');
        this.bgMusic = new Audio('assets/audio/background.mp3');
        this.bgMusic.loop = true;
        this.bgMusic.volume = 0.05;
        this.onHover.volume = 1;
    }
    startMusic() {
        this.bgMusic.play(); 
    }
    stopMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }
    click() {
        this.onClick.currentTime = 0;
        this.onClick.play(); 
        console.log('play-clck');
    }
    hover() {
        this.onHover.currentTime = 0;
        console.log('play-hover');
        this.onHover.play(); 
    }
    
}

class MemoryGame {
    constructor(totalTime, cards, images) {
        this.cardsArray = cards;
        this.imagesArray = images;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time-remaining');
        this.flips = document.getElementById('flips');
        this.audioController = new AudioController;
        this.symbols = [
            'jett', 'jett', 'kj', 'kj', 'phoenix', 'phoenix',
            'raze', 'raze', 'sage', 'sage', 'skye', 'skye',
            'sova', 'sova', 'viper', 'viper'
        ]
    }
    
    startGame() {
        this.cardToCheck = null;
        this.totalClicks = 0;
        this.timeRemaining = this.timeRemaining;
        this.matchedCards = [];
        this.busy = true;

        this.cardsArray.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.onHover();
            });
        })

        setTimeout(() => {
            this.audioController.stopMusic();
            this.audioController.startMusic();
            this.shuffleCards();
            this.countDown = this.startCoundDown();
            this.busy = false;
        }, 500);
        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.flips.innerText = this.totalClicks;
    }

    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            // card.classList.remove('matched');
        })
    }

    startCoundDown() {
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if(this.timeRemaining === 0) {
                this.gameOver();
            }
            
        }, 1000)
    }
    onHover() {
        this.audioController.hover();
    }

    gameOver() {
        clearInterval(this.countDown);
        this.busy = true;
        console.log('gameover');
        this.hideCards();
    }
    victory() {
        clearInterval(this.countDown);
        console.log('victory');
    }

    flipCard(card) {
        if(this.canFlipCard(card)) {
            
            this.audioController.click();
            this.totalClicks++;
            this.flips.innerText = this.totalClicks;
            card.classList.add('visible');

            if (this.cardToCheck) {
                this.checkForCardMatch(card)
            } else {
                this.cardToCheck = card;
            }

        }
    }
    checkForCardMatch(card) {
        if (this.getCardType(card) === this.getCardType(this.cardToCheck)) {
            console.log('match');
            this.cardMatch(card, this.cardToCheck);
        } else {
            console.log('not a match');
            this.cardMisMatch(card, this.cardToCheck);
           
        }
        this.cardToCheck = null;
    }
    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        
        if (this.matchedCards.length === this.cardsArray.length) {
            this.victory();
        }
    }
    cardMisMatch(card1, card2) {
        this.busy = true;

        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000);
    }

    getCardType(card) {
        return card.getElementsByClassName('card-value')[0].src;
    }

    shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
      }

    shuffleCards() {
        this.shuffle(this.imagesArray);

        let usedSymbols = [];
        let randSymbol;

        for (let i = 0; i < this.imagesArray.length; i++) {
            randSymbol = Math.floor(Math.random() * this.symbols.length);
            while (usedSymbols[this.symbols[randSymbol]] >= 2) {
              this.symbols.splice(randSymbol, 1);
              randSymbol = Math.floor(Math.random() * this.symbols.length);
            }
            usedSymbols[this.symbols[randSymbol]] = (usedSymbols[this.symbols[randSymbol]] || 0) + 1;
            this.imagesArray[i].src = 'assets/images/' + this.symbols[randSymbol] + '.png';
          }
      
    }
    canFlipCard(card) {
        return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    let cards = Array.from(this.getElementsByClassName('card'));
    let images = Array.from(document.getElementsByClassName('card-value'));
    let startBtn = document.getElementById('start');
    
    let game = new MemoryGame(100, cards, images);

    //For Each Card
    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        })
        
    })

    //Start Btn
    startBtn.addEventListener('click', function() {
        if (startBtn.innerText === 'START') {
            startBtn.style.display = 'none';
            startBtn.classList.add('hide');
            // startBtn.textContent = 'New Game';
            game.startGame();
            
        } 
        console.log('starting')
    })

})
    