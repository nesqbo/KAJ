//class with game logic
class Game{
    // define winning combinations
    winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    constructor(sanitizedUser1, sanitizedUser2) {
        this.player1 = sanitizedUser1;
        this.player2 = sanitizedUser2;

        this.winner = null;
        this.gameOver = false;
        this.currentPlayerIndex = 1;
    }


    occupyIndex(event) {

        const cell = event.target;
        // check whether cell has been occupied yet
        if (cell.tagName === 'rect' && !cell.classList.contains('X') && !cell.classList.contains('O')) {
            const index = cell.getAttribute('data-index');
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");

            // Position the text element in the center of the rect
            const cellX = parseFloat(cell.getAttribute('x')) + 50;
            const cellY = parseFloat(cell.getAttribute('y')) + 60;

            text.setAttribute('x', cellX);
            text.setAttribute('y', cellY);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('font-size', '48');
            text.setAttribute('font-family', 'Arial');
            text.setAttribute('fill', 'black');

            // set the text content to the current player's character whose turn it is
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 2;
            if (this.currentPlayerIndex === 0) {
                text.textContent = 'X';
            } else {
                text.textContent = 'O';
            }

            const gameBoard = document.querySelector("#gameBoard");
            gameBoard.appendChild(text);

            cell.classList.add(text.textContent);
            this.checkForWinner(text.textContent);
        } else {
            // cell is already occupied, create an svg blink animation
            // console.log('Cell already occupied');
            cell.classList.add('blink');

            // Remove the blink class after the animation completes
            setTimeout(() => {
                cell.classList.remove('blink');
            }, 1500);
        }
    }

    checkForWinner(playerCharacter){
        // after every click of a user, check whether any winning conditions have been met
        const cells = document.querySelectorAll('.cell');
        for (const combination of this.winningCombinations){
            const [a, b, c] = combination;
            // winning if all three cells contain the same character
            if (cells[a].classList.contains(playerCharacter) &&
                cells[b].classList.contains(playerCharacter) &&
                cells[c].classList.contains(playerCharacter)){

                //find out who is the winner
                this.winner = (playerCharacter === 'X' ? this.player1 : this.player2);
                //end the game
                this.gameOver = true;
                this.processResult();
                this.playAgainOption();
            }
        }
    }

    processResult() {
        // Save the winner to local storage
        let wins = parseInt(localStorage.getItem(this.winner), 10) || 0;
        wins += 1;
        localStorage.setItem(this.winner, wins);

        console.log(localStorage);

        // Display the winner banner
        if (this.gameOver) {
            // alert(`The winner is ${this.winner}`);
            const winnerContainer = document.getElementById('winner-container');
            winnerContainer.style.display = 'block';

            const svgContent = `
                        <svg id="winner-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="gold" stroke="black" stroke-width="2"/>
                            <text x="50%" y="40%" text-anchor="middle" font-size="12" fill="black">Congratulations</text>
                            <text x="50%" y="60%" text-anchor="middle" font-size="16" font-weight="bold" fill="black">${this.winner}</text>
                            <text x="50%" y="70%" text-anchor="middle" font-size="12" fill="black">You Win!</text>
                        </svg>
                    `;

            winnerContainer.innerHTML = svgContent;

            // stop global game state
            gameStarted = false;
        }
    }



    playAgainOption(){
        // Display the play again button after the end of the game
        const playAgainButton = document.getElementById('play-again-button');
        playAgainButton.style.display = 'block';
        playAgainButton.addEventListener('click', () => {
            this.resetGame();
        });
    }

    resetGame() {
        // Reset game state relevant variables
        gameStarted = true;

        this.gameOver = false;
        this.winner = null;
        this.currentPlayerIndex = 1;


        // Clear the game board of any user inputs
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.classList.remove('occupied', 'X', 'O');
            const textElement = document.querySelector(`#gameBoard text[x="${parseFloat(cell.getAttribute('x')) + 50}"][y="${parseFloat(cell.getAttribute('y')) + 60}"]`);
            if (textElement) {
                textElement.remove();
            }
        });

        // Hide winner container and play again button
        document.getElementById('winner-container').style.display = 'none';
        document.getElementById('play-again-button').style.display = 'none';
    }

}